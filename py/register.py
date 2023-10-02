from cryptography.fernet import Fernet
import sqlite3
import uuid
import smtplib
import random
import string
import bcrypt
import subprocess



USER_CREDENTIALS = 'database/user_credentials.db'
USER_DATA = 'database/user_data.db'
PASSWORD_KEY = 'database/password_key.db'

# Function to generate a unique user ID
def generate_unique_user_id(cursor_register):
    try:
        while True:
            user_id = str(uuid.uuid4())  # Generate a UUID as the user ID
            # Check if the generated user ID already exists in the database
            cursor_register.execute("SELECT user_id FROM credentials WHERE user_id = ?", (user_id,))
            existing_user = cursor_register.fetchone()
            if existing_user is None:
                return user_id
    except Exception as e:
        print("Error:", str(e))
        return "An error occurred while processing your request."



def encrypt_password_store_key(user_id, password):
    # Generate a secret key securely
    key = Fernet.generate_key() 

    # Connect to the SQLite database (create it if it doesn't exist)
    db_connection = sqlite3.connect(PASSWORD_KEY)
    cursor_key = db_connection.cursor()
    
    # Create a cipher suite with the loaded key for encryption/decryption
    cipher_suite = Fernet(key)
    # Encrypt the user ID
    cipher_text = cipher_suite.encrypt(password.encode())

    # Insert user data into a table (you can create the table if needed)
    cursor_key.execute("INSERT INTO passkeys (user_id, passkey) VALUES (?, ?)",
                   (user_id, key))
    
    # Commit the changes and close the connection
    db_connection.commit()
    db_connection.close()
    
    return cipher_text



# Function to generate a random OTP
def generate_otp(length=6):
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp



def check_existing_email(email, cursor_user_data):
    cursor_user_data.execute("SELECT email FROM user_data WHERE email = ?", (email,))
    existing_email = cursor_user_data.fetchone()

    if existing_email is None:
        return "PASS"
    else:
        return "EXISTING EMAIL"
    




# Hash a password
def hash_OTP(password):
    # Generate a salt
    salt = bcrypt.gensalt()
    # Hash the password with the salt
    return bcrypt.hashpw(password.encode('utf-8'), salt)




def send_OTP_email(receiver_email):

    # Connect to the SQLite database (create it if it doesn't exist)
    db_connection_user_data = sqlite3.connect(USER_DATA)
    cursor_user_data = db_connection_user_data.cursor()

    existing_or_not = check_existing_email(receiver_email, cursor_user_data)

    if existing_or_not == "PASS":

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
            server.sendmail(sender_email, receiver_email, message)

            return hash_OTP(OTP)

        except Exception as e:
            print("Error sending email:", str(e))
            return "ERROR SENDING OTP"

        finally:
            server.quit()
    else:
        return existing_or_not




def OTP_registeration_verification(OTP_USER, HASH_OTP_CODE):

    if bcrypt.checkpw(OTP_USER.encode('utf-8'), HASH_OTP_CODE.encode('utf-8')):
        return "True"
    else:
        return "False"





def check_existing_username(username, cursor_password):

    cursor_password.execute("SELECT username FROM credentials WHERE username = ?", (username,))
    existing_username = cursor_password.fetchone()

    if existing_username is None:
        return "PASS"
    else:
        return "EXISTING USERNAME"
    


# Function to insert user data into the database
def store_registeration_credential(username, password, name, address, phone, email):

    # Connect to the SQLite database (create it if it doesn't exist)
    db_connection_password = sqlite3.connect(USER_CREDENTIALS)
    cursor_password = db_connection_password.cursor()

    existing_or_not = check_existing_username(username, cursor_password)

    if existing_or_not == "PASS":

        # Connect to the SQLite database (create it if it doesn't exist)
        db_connection_user_data = sqlite3.connect(USER_DATA)
        cursor_user_data = db_connection_user_data.cursor()


        user_id = generate_unique_user_id(cursor_password)

        # Insert user data into a table (you can create the table if needed)
        cursor_password.execute("INSERT INTO credentials (username, cipher_password, user_id) VALUES (?, ?, ?)",
                    (username, encrypt_password_store_key(user_id, password), user_id))
        
        # Commit the changes and close the connection
        db_connection_password.commit()
        db_connection_password.close()

        # Insert user data into a table (you can create the table if needed)
        cursor_user_data.execute("INSERT INTO user_data (user_id, name, address, phone, email) VALUES (?, ?, ?, ?, ?)",
                    (user_id, name, address, phone, email))
        
        # Commit the changes and close the connection
        db_connection_user_data.commit()
        db_connection_user_data.close()

        # Define the command to run your script
        command = ["python", "push_data.py"]

        print("UPDATED????????????")

        # Execute the script
        try:
            subprocess.run(command, check=True)
            print("Script executed successfully.")
        except subprocess.CalledProcessError as e:
            print(f"Error executing script: {e}")

        return "PASS"
    
    else:
        return existing_or_not
    

    
    

