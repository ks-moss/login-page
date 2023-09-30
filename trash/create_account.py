import bcrypt
import sqlite3
import smtplib
import random
import string

DATA_FILE = 'user_credentials.db'

# Hash a password
def hash_password(password):
    # Generate a salt
    salt = bcrypt.gensalt()
    
    # Hash the password with the salt
    return bcrypt.hashpw(password.encode('utf-8'), salt)


# Function to insert user data into the database
def insert_user_data(name, username, password, phone, address, email):
    # Connect to the SQLite database (create it if it doesn't exist)
    db_connection = sqlite3.connect(DATA_FILE)
    cursor = db_connection.cursor()

    # Insert user data into a table (you can create the table if needed)
    cursor.execute("INSERT INTO credentials (name, username, password, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)",
                   (name, username, password, phone, address, email))
    
    # Commit the changes and close the connection
    db_connection.commit()
    db_connection.close()



# Verify a password
def verify_password(hashed_password, input_password):
    # Check if the input password matches the hashed password
    if bcrypt.checkpw(input_password.encode('utf-8'), hashed_password):
        print("Password Found")
        return True
    else:
        print("Password Not Found")
        return False



# Function to search for a user in a SQLite database file
def check_user_existence(username):
    # Connect to the database
    db_connection = sqlite3.connect(DATA_FILE)
    # Create a cursor object to execute SQL queries
    cursor = db_connection.cursor()
    # Execute an SQL query to check if the user exists
    query = "SELECT * FROM credentials WHERE username = ?"
    cursor.execute(query, (username,))
    # Fetch the results. You can use the fetchone() method to get the result of the query
    user = cursor.fetchone()

    db_connection.close()

    if user is not None:
        print("User exists!")
        return True
    else:
        print("User does not exist.")
        return False
    


# Function to generate a random OTP
def generate_otp(length=6):
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp


# Function to connect to Gmail's SMTP server
def connect_gmail(receiver_email, message):

    sender_email = 'k.sinamkam.usa@gmail.com'
    sender_password = 'rvuf brfj thcn vlta'

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        
        # Send the email
        server.sendmail(sender_email, receiver_email, message)
        print("OTP sent successfully to", receiver_email)

    except Exception as e:
        print("Error sending email:", str(e))

    finally:
        server.quit()





if __name__ == "__main__":

    NAME = input("Enter your name: ")   
    USERNAME = input("Enter your username: ")
    PASSWORD = input("Enter your password: ")
    ADDRESS = input("Enter your address: ")
    PHONE = input("Enter your phone number: ")
    EMAIL = input("Enter your email: ")

    # Create the email message
    otp = generate_otp()
    subject = 'Verify Your Email'
    message = f'Subject: {subject}\n\nYour OTP is: {otp}'
    connect_gmail(EMAIL, message)

    while True:
        user_otp = input("Enter the OTP you received: ")
        
        if user_otp == otp:
            print("OTP is correct. Access granted!")
            break
        else:
            print("OTP is incorrect. Access denied!")

    hashed_password = hash_password(PASSWORD)

    insert_user_data(NAME, USERNAME, hashed_password, ADDRESS, PHONE, EMAIL)

    if check_user_existence(USERNAME) and verify_password(hashed_password, PASSWORD):
        print("Login Successful")
    else:
        print("Login Failed")
    

