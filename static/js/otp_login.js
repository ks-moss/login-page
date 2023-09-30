let OTP_EMAIL_VERIFICATION = false;
let HIDDEN_EMAIL = "";
let HASH_OTP_CODE = "";
let IS_SENT = false;


// Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {

    const CURRENT_USER_ID = sessionStorage.getItem("CURRENT_USER_ID")

    const formData = {
        user_id: CURRENT_USER_ID
    };

    email_display(formData, function(response) {
        HIDDEN_EMAIL = response
        document.querySelector("#notification-otp-email").textContent = `Sending OTP to ${HIDDEN_EMAIL}`;
    });

    send_OTP_login(formData, function(response) {

        IS_SENT = true

        HASH_OTP_CODE = response

        document.querySelector("#notification-otp-email").textContent = `OTP sent to ${HIDDEN_EMAIL}`;
    });

    // Add a click event listener for the REGISTER button
    document.getElementById("otp-resend-submit").addEventListener("click", function (event) {
        event.preventDefault();

        IS_SENT = false

        document.querySelector("#notification-otp-login").textContent = ``;
        document.querySelector("#notification-otp-email").textContent = `Sending OTP to ${HIDDEN_EMAIL}`;

        send_OTP_login(formData, function(response) {

            IS_SENT = true

            HASH_OTP_CODE = response

            document.querySelector("#notification-otp-email").textContent = `OTP sent to ${HIDDEN_EMAIL}`;
        });

    });


    // Add a click event listener for the REGISTER button
    document.getElementById("otp-login-submit").addEventListener("click", function (event) {
        event.preventDefault();

        if(IS_SENT == true){
            const USER_OTP = document.getElementById("otpcode").value;

            if(USER_OTP == ""){
                document.querySelector("#notification-otp-login").innerHTML = `<span style="color: red;">OTP code cannot be empty</span>`;
            } else{

                const OTPs = {
                    otp_user: USER_OTP,
                    hash_otp_code: HASH_OTP_CODE
                };
    
                verifyLoginOTP(OTPs, function(response) {
                    
                    if(response == "True"){
                        openProfilePage()
                    } else{
                        document.querySelector("#notification-otp-login").innerHTML = `<span style="color: red;">Incorrect OTP code, please try again</span>`;
                    }
    
    
                });

            }

        }
        else{
            document.querySelector("#notification-otp-login").textContent = `Sending OTP code, please wait`;
        }

    });
    

    // Add a click event listener for the REGISTER button
    document.getElementById("back-login-page").addEventListener("click", function (event) {
        event.preventDefault();
        openLoginPage();
    });


});


function email_display(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('user_id', value.user_id);

    $.ajax({
        url: '/email_otp',
        type: 'POST',
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Prevent jQuery from setting the content type
        data: formData,
        success: function(response) {
            // Call the callback function with the response
            callback(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function send_OTP_login(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('user_id', value.user_id);

    $.ajax({
        url: '/loginOTP',
        type: 'POST',
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Prevent jQuery from setting the content type
        data: formData,
        success: function(response) {
            // Call the callback function with the response
            callback(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function verifyLoginOTP(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('otp_user', value.otp_user);
    formData.append('hash_otp_code', value.hash_otp_code);

    $.ajax({
        url: '/verify_login_OTP',
        type: 'POST',
        processData: false, // Prevent jQuery from processing the data
        contentType: false, // Prevent jQuery from setting the content type
        data: formData,
        success: function(response) {
            // Call the callback function with the response
            callback(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}



function openProfilePage() {
    window.location.href = "/profile";
}


function openRegisterPage() {
    window.location.href = "/register";
}


function openLoginPage() {
    window.location.href = "/";
}