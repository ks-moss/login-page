from flask import Flask, render_template, request, jsonify
from login import *
from register import *
from otp_login import *
from verified_profile import *

app = Flask(__name__)

@app.route('/')
def new_user():
    return render_template("login.html")

@app.route('/otp_login')
def otp_login():
    return render_template("otp_login.html")

@app.route('/profile')
def profile():
    return render_template("profile.html")

@app.route('/register')
def register():
    return render_template("register.html")


@app.route('/account_created')
def account_created():
    return render_template("account_created.html")


@app.route('/login_process', methods=['POST'])
def login_verification():
    username = request.form.get('username')
    password = request.form.get('password')
    return verify_password(username, password)

@app.route('/emailOTP', methods=['POST'])
def send_OTP():
    email = request.form.get('email')
    return send_OTP_email(email)


@app.route('/verify_OTP', methods=['POST'])
def hash_registeration_OTP():
    OTP_USER = request.form.get('otp_user')
    HASH_OTP_CODE = request.form.get('hash_otp_code')
    return OTP_registeration_verification(OTP_USER, HASH_OTP_CODE)



@app.route('/registerationCredential', methods=['POST'])
def store_registeration():
    username = request.form.get('username')
    password = request.form.get('password')
    name = request.form.get('name')
    address = request.form.get('address')
    phone = request.form.get('phone')
    email = request.form.get('email')
    return store_registeration_credential(username, password, name, address, phone, email)


@app.route('/email_otp', methods=['POST'])
def find_email_OTP():
    user_id = request.form.get('user_id')
    return get_email_OTP(user_id)


@app.route('/loginOTP', methods=['POST'])
def OTP_login():
    user_id = request.form.get('user_id')
    return get_OTP_login(user_id)


@app.route('/verify_login_OTP', methods=['POST'])
def hash_login_OTP():
    OTP_USER = request.form.get('otp_user')
    HASH_OTP_CODE = request.form.get('hash_otp_code')
    return OTP_login_verification(OTP_USER, HASH_OTP_CODE)


@app.route('/fullnameProfile', methods=['POST'])
def fullname_profile():
    user_id = request.form.get('user_id')
    return get_user_fullname_profile(user_id)






if __name__ == '__main__':
    app.run(debug=True)



# To execute the file
# gunicorn -c gunicorn_config.py main:app
# lsof -i :5000
# kill <pid>
