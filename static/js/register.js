let OTP_EMAIL_VERIFIED = false;
let IS_SENDING_OTP = false;
let IS_SENT = false;
let HASH_OTP_CODE = "";

// Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("send-otp-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission


        const EMAIL = (document.getElementById("email").value).toLowerCase();

        if(EMAIL != ""){
            if(OTP_EMAIL_VERIFIED == false){

                IS_SENT = true;
                IS_SENDING_OTP = true;

                document.querySelector("#notification-email").textContent = `OTP is being sent to ${EMAIL}, please wait`;
    
                const email_OTP = {
                    email: EMAIL
                };
    
                sendEmailOTP(email_OTP, function(response) {
    
                    if(response != "EXISTING EMAIL"){

                        HASH_OTP_CODE = response;
                        
                        IS_SENDING_OTP = false;

                        document.querySelector("#notification-email").textContent = `OTP sent successfully to ${EMAIL}`;
                    } else{
                        document.querySelector("#notification-email").innerHTML = `<span style="color: red;">This Email is already exist</span>`;
                    }
                });
    
            } else{
                document.querySelector("#notification-email").innerHTML = `<span style="color: green;">Email Has Been Verified</span>`;
            }
        } else {
            document.querySelector("#notification-email").innerHTML = `<span style="color: red;">Email Cannot Be Empty</span>`
        }
        
        
    });



    document.getElementById("verify-otp-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission

        if(IS_SENT == true){

            if(IS_SENDING_OTP == false){

                if(OTP_EMAIL_VERIFIED == false){
                
                    const OTP_USER = document.getElementById("otpcode").value;
        
                    if(OTP_USER != ""){
        
                        const OTPs = {
                            otp_user: OTP_USER,
                            hash_otp_code: HASH_OTP_CODE
                        };
            
                        verifyOTP(OTPs, function(response) {
                            
                            if(response == "True"){
                                OTP_EMAIL_VERIFIED = true;
                                document.querySelector("#notification-otp").innerHTML = `<span style="color: green;">Email Has Been Verified</span>`;
                            } else{
                                document.querySelector("#notification-otp").innerHTML = `<span style="color: red;">Incorrect OTP, Please Try Again</span>`;
                            }
        
        
                        });
        
            
                    } else{
                        document.querySelector("#notification-otp").innerHTML = `<span style="color: red;">OTP Cannot Be Empty</span>`;
                    }
        
                } else{
                    document.querySelector("#notification-otp").innerHTML = `<span style="color: green;">Email Has Been Verified</span>`;
                }
    
            } else{
                document.querySelector("#notification-otp").innerHTML = `<span style="color: red;">OTP is being sent, pleasde wait</span>`;
            }
        } else{
            document.querySelector("#notification-otp").innerHTML = `<span style="color: red;">Please Click Send OTP</span>`;
        }

        
                
        
    });




    document.getElementById("registration-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the values of the username and password fields
        const FIRSTNAME = document.getElementById("firstname").value;
        const MIDDLENAME = document.getElementById("middlename").value;
        const LASTNAME = document.getElementById("lastname").value;

        const USERNAME = (document.getElementById("username").value).toLowerCase();
        const PASSWORD = document.getElementById("password").value;
        const RE_PASSWORD = document.getElementById("verify-password").value;

        const ADDRESS = document.getElementById("address").value;
        const APARTMENT = document.getElementById("apartment").value;
        const CITY = document.getElementById("city").value;
        const STATE_PROVINCE = document.getElementById("state_province").value;
        const ZIP_CODE = document.getElementById("zip_code").value;
        const COUNTRY = document.getElementById("country").value;

        const PHONE = document.getElementById("phone").value;
        const EMAIL = (document.getElementById("email").value).toLowerCase();

        const OTP_CODE = document.getElementById("otpcode").value;


        const namePart = MIDDLENAME ? MIDDLENAME + " " : "";
        const NAME = `${FIRSTNAME} ${namePart} ${LASTNAME}`;


        const apartmentPart = APARTMENT ? APARTMENT + "," : "";
        const FULL_ADDRESS = `${ADDRESS},${apartmentPart}${CITY},${STATE_PROVINCE},${ZIP_CODE},${COUNTRY}`;


        let notification_message = "";
        let found_empty = false;

        if(FIRSTNAME.length == 0){
            found_empty = true;
            notification_message = notification_message + "First Name Cannot Be Empty." + "<br>"
        }
        if(LASTNAME.length == 0){
            found_empty = true;
            notification_message = notification_message + "Last Name Cannot Be Empty." + "<br>"
        }
        if(USERNAME.length == 0){
            found_empty = true;
            notification_message = notification_message + "Username Cannot Be Empty." + "<br>"
        }
        if(PASSWORD.length == 0){
            found_empty = true;
            notification_message = notification_message + "Password Cannot Be Empty." + "<br>"
        }
        if(RE_PASSWORD.length == 0){
            found_empty = true;
            notification_message = notification_message + "Verify Password Cannot Be Empty." + "<br>"
        }
        if(ADDRESS.length == 0){
            found_empty = true;
            notification_message = notification_message + "Address Cannot Be Empty." + "<br>"
        }
        if(CITY.length == 0){
            found_empty = true;
            notification_message = notification_message + "City Cannot Be Empty." + "<br>"
        }
        if(STATE_PROVINCE.length == 0){
            found_empty = true;
            notification_message = notification_message + "State Cannot Be Empty." + "<br>"
        }
        if(ZIP_CODE.length == 0){
            found_empty = true;
            notification_message = notification_message + "Zip Code Cannot Be Empty." + "<br>"
        }
        if(COUNTRY.length == 0){
            found_empty = true;
            notification_message = notification_message + "Country Cannot Be Empty." + "<br>"
        }
        if(PHONE.length == 0){
            found_empty = true;
            notification_message = notification_message + "Phone Number Cannot Be Empty." + "<br>"
        }
        if(EMAIL.length == 0){
            found_empty = true;
            notification_message = notification_message + "Email Cannot Be Empty." + "<br>"
        }
        if(OTP_CODE.length == 0){
            found_empty = true;
            notification_message = notification_message + "OTP Passcode Cannot Be Empty." + "<br>"
        }

        if(found_empty == true){
            document.querySelector("#notification-create-account").innerHTML = `${notification_message}`;
        }
        else {

            if(PASSWORD == RE_PASSWORD){

                if(OTP_EMAIL_VERIFIED == true){
            
                    const credential = {
                        username: USERNAME,
                        password: PASSWORD,
                        name: NAME,
                        address: FULL_ADDRESS,
                        phone: PHONE,
                        email: EMAIL
                    };
        
                    storeRegisterationCredentials(credential, function(response) {
        
                        if(response == "PASS"){
                            openCreatedAccountPage();
                        } else{
                            document.querySelector("#notification-create-account").textContent = `${response}, please try again`;
                        }
                        
                    });
        
                } else{
                    document.querySelector("#notification-create-account").textContent = `Please Verify OTP`;
                }
            }
            else{
                document.querySelector("#notification-create-account").innerHTML = `Passwords Are Not the Same.`;
            }

        }
        
    });

});


function storeRegisterationCredentials(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('username', value.username);
    formData.append('password', value.password);
    formData.append('name', value.name);
    formData.append('address', value.address);
    formData.append('phone', value.phone);
    formData.append('email', value.email);

    $.ajax({
        url: '/registerationCredential',
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


function sendEmailOTP(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('email', value.email);

    $.ajax({
        url: '/emailOTP',
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


function verifyOTP(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('otp_user', value.otp_user);
    formData.append('hash_otp_code', value.hash_otp_code);

    $.ajax({
        url: '/verify_OTP',
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



function openCreatedAccountPage() {

    // Replace this with your login logic (e.g., authentication) in the future
    // For now, simply redirect to the profile page
    window.location.href = "/account_created";


    // Specify the URL of the profile page
    // const profilePageURL = "/";

    // Open a new window or tab with the profile page
    // const newWindow = window.open(profilePageURL, "_blank");

    // Optionally, you can focus on the new window/tab
    // if (newWindow) {
    //     newWindow.focus();
    // }

   
}