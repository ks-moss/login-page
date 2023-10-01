import sqlite3
import smtplib
import random
import string
import bcrypt

USER_DATA = 'database/user_data.db'


def get_email_OTP(user_id):

    try:
        # Connect to the SQLite database (create it if it doesn't exist)
        db_connection_user_data = sqlite3.connect(USER_DATA)
        cursor_user_data = db_connection_user_data.cursor()

        cursor_user_data.execute("SELECT email FROM user_data WHERE user_id = ?", (user_id,))
        user_email = cursor_user_data.fetchone()

        if user_email is None:
            return "EMAIL DOES NOT EXIST"
        else:
            found_email = user_email[0]
            username, domain = found_email.split("@")

            hidden_username = ""

            for i in range(len(username)):
                
                if(i==0):
                    hidden_username = hidden_username+username[i]
                elif(i==len(username)-1):
                    hidden_username = hidden_username+username[i]
                else:
                    hidden_username = hidden_username+"X"

            return hidden_username+"@"+domain

    except Exception as e:
        print("Error:", str(e))
        return "DATABASE ERROR"
    



# Function to generate a random OTP
def generate_otp(length=6):
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp


# Hash a password
def hash_OTP(password):
    # Generate a salt
    salt = bcrypt.gensalt()
    # Hash the password with the salt
    return bcrypt.hashpw(password.encode('utf-8'), salt)



def get_OTP_login(user_id):

    try:
        # Connect to the SQLite database (create it if it doesn't exist)
        db_connection_user_data = sqlite3.connect(USER_DATA)
        cursor_user_data = db_connection_user_data.cursor()

        cursor_user_data.execute("SELECT email FROM user_data WHERE user_id = ?", (user_id,))
        user_email = cursor_user_data.fetchone()

        if user_email is None:
            return "EMAIL DOES NOT EXIST"
        else:
            sender_email = 'k.sinamkam.usa@gmail.com'
            sender_password = 'rvuf brfj thcn vlta'

            OTP = generate_otp()

            # Create the email message
            subject = 'Verify Your Email'
            message = f'Subject: {subject}\n\nYour OTP is: {OTP}'

            try:
                server = smtplib.SMTP('smtp.gmail.com', 587)
                server.starttls()
                server.login(sender_email, sender_password)
                
                # Send the email
                server.sendmail(sender_email, user_email[0], message)

                return hash_OTP(OTP)

            except Exception as e:
                print("Error sending email:", str(e))
                return "ERROR SENDING OTP"

            finally:
                server.quit()

    except Exception as e:
        print("Error:", str(e))
        return "DATABASE ERROR"
    


def OTP_login_verification(OTP_USER, HASH_OTP_CODE):

    if bcrypt.checkpw(OTP_USER.encode('utf-8'), HASH_OTP_CODE.encode('utf-8')):
        return "True"
    else:
        return "False"