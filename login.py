from cryptography.fernet import Fernet
import sqlite3
import re

USER_CREDENTIALS = 'database/user_credentials.db'
USER_DATA = 'database/user_data.db'
PASSWORD_KEY = 'database/password_key.db'

def is_valid_email(email):
    # Define a regular expression pattern for a basic email validation
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    
    # Use the re.match() function to check if the email matches the pattern
    if re.match(pattern, email):
        return True
    else:
        return False
    

def get_user_id(username_email):
    
    if is_valid_email(username_email):
        try:
            # Connect to the SQLite database (create it if it doesn't exist)
            db_connection_user_data = sqlite3.connect(USER_DATA)
            cursor_user_data = db_connection_user_data.cursor()

            cursor_user_data.execute("SELECT user_id FROM user_data WHERE email = ?", (username_email,))
            user_id = cursor_user_data.fetchone()

            if user_id is None:
                return "EMAIL DOES NOT EXIST"
            else:
                return user_id[0]

        except Exception as e:
            print("Error:", str(e))
            return "DATABASE ERROR"

    else:
        try:
            # Connect to the SQLite database (create it if it doesn't exist)
            db_connection_user_data = sqlite3.connect(USER_CREDENTIALS)
            cursor_user_data = db_connection_user_data.cursor()

            cursor_user_data.execute("SELECT user_id FROM credentials WHERE username = ?", (username_email,))
            user_id = cursor_user_data.fetchone()

            if user_id is None:
                return "USERNAME DOES NOT EXIST"
            else:
                return user_id[0]

        except Exception as e:
            print("Error:", str(e))
            return "DATABASE ERROR"






def get_key(user_id):

    try:
            # Connect to the SQLite database (create it if it doesn't exist)
            db_connection_key = sqlite3.connect(PASSWORD_KEY)
            cursor_key = db_connection_key.cursor()

            cursor_key.execute("SELECT passkey FROM passkeys WHERE user_id = ?", (user_id,))
            key = cursor_key.fetchone()

            if key is None:
                return "KEY DOES NOT EXIST"
            else:
                return key[0]

    except Exception as e:
        print("Error:", str(e))
        return "DATABASE ERROR"




def get_cipher_password(user_id):
    try:
            # Connect to the SQLite database (create it if it doesn't exist)
            db_connection_user_data = sqlite3.connect(USER_CREDENTIALS)
            cursor_user_data = db_connection_user_data.cursor()

            cursor_user_data.execute("SELECT cipher_password FROM credentials WHERE user_id = ?", (user_id,))
            cipher_password = cursor_user_data.fetchone()

            if cipher_password is None:
                return "CIPHER PASSWORD DOES NOT EXIST"
            else:
                return cipher_password[0]

    except Exception as e:
        print("Error:", str(e))
        return "DATABASE ERROR"




def verify_password(username, password):

    user_id = get_user_id(username)    
    key = get_key(user_id)
    cipher_password = get_cipher_password(user_id)

    if user_id == "EMAIL DOES NOT EXIST" or user_id == "USERNAME DOES NOT EXIST":
        return user_id
    elif key == "KEY DOES NOT EXIST":
        return key
    elif cipher_password == "CIPHER PASSWORD DOES NOT EXIST":
        return cipher_password
    else:

        try:
            # Create a cipher suite with the retrieved key
            cipher_suite = Fernet(key)
            decrypted_password = cipher_suite.decrypt(cipher_password).decode()

            if password == decrypted_password:
                return user_id
            else:
                return "WRONG PASSWORD"

        except Exception as e:
            print("Error:", str(e))
            return "DATABASE ERROR"
