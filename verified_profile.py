import sqlite3

USER_DATA = 'database/user_data.db'

def get_user_fullname_profile(user_id):
    try:
        # Connect to the SQLite database (create it if it doesn't exist)
        db_connection_user_data = sqlite3.connect(USER_DATA)
        cursor_user_data = db_connection_user_data.cursor()

        cursor_user_data.execute("SELECT name FROM user_data WHERE user_id = ?", (user_id,))
        fullname = cursor_user_data.fetchone()

        if fullname is None:
            return "FULLNAME DOES NOT EXIST"
        else:
            return fullname[0]

    except Exception as e:
        print("Error:", str(e))
        return "DATABASE ERROR"