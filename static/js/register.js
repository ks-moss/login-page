let OTP_EMAIL_VERIFICATTION = false;
let HASH_OTP_CODE = "";

// Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("send-otp-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission


        const EMAIL = (document.getElementById("email").value).toLowerCase();

        if(EMAIL != ""){
            if(OTP_EMAIL_VERIFICATTION == false){

                document.querySelector("#notification-email").textContent = `OTP is being sent to ${EMAIL}, please wait`;
    
                const email_OTP = {
                    email: EMAIL
                };
    
                sendEmailOTP(email_OTP, function(response) {
    
                    if(response != "EXISTING EMAIL"){
                        HASH_OTP_CODE = response;
                        document.querySelector("#notification-email").textContent = `OTP sent successfully to ${EMAIL}`;
                    } else{
                        document.querySelector("#notification-email").textContent = `This Email is already exist`;
                    }
    
                });
    
            } else{
                document.querySelector("#notification-email").textContent = `Email Has Been Verified`;
            }
        } else {
            document.querySelector("#notification-email").textContent = `Email Cannot Be Empty`;
        }
        
        
    });



    document.getElementById("verify-otp-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission

        if(OTP_EMAIL_VERIFICATTION == false){
            
            const OTP_USER = document.getElementById("otpcode").value;

            if(OTP_USER != ""){

                const OTPs = {
                    otp_user: OTP_USER,
                    hash_otp_code: HASH_OTP_CODE
                };
    
                verifyOTP(OTPs, function(response) {
                    
                    if(response == "True"){
                        OTP_EMAIL_VERIFICATTION = true;
                        document.querySelector("#notification-otp").textContent = `Email Has Been Verified`;
                    } else{
                        document.querySelector("#notification-otp").textContent = `Incorrect OTP, Please Try Again`;
                    }


                });

    
            } else{
                document.querySelector("#notification-otp").textContent = `OTP Cannot Be Empty`;
            }

        } else{
            document.querySelector("#notification-otp").textContent = `Email Has Been Verified`;
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

        const ADDRESS = document.getElementById("address").value;
        const APARTMENT = document.getElementById("apartment").value;
        const CITY = document.getElementById("city").value;
        const STATE_PROVINCE = document.getElementById("state_province").value;
        const ZIP_CODE = document.getElementById("zip_code").value;
        const COUNTRY = document.getElementById("country").value;

        const PHONE = document.getElementById("phone").value;
        const EMAIL = (document.getElementById("email").value).toLowerCase();


        const namePart = MIDDLENAME ? MIDDLENAME + " " : "";
        const NAME = `${FIRSTNAME} ${namePart} ${LASTNAME}`;


        const apartmentPart = APARTMENT ? APARTMENT + "," : "";
        const FULL_ADDRESS = `${ADDRESS},${apartmentPart}${CITY},${STATE_PROVINCE},${ZIP_CODE},${COUNTRY}`;


        if(FIRSTNAME.length == 0){
            document.querySelector("#notification-create-account").textContent = `First Name Cannot Be Empty`;
        }
        else if(LASTNAME.length == 0){
            document.querySelector("#notification-create-account").textContent = `Last Name Cannot Be Empty`;
        }
        else if(USERNAME.length == 0){
            document.querySelector("#notification-create-account").textContent = `Username Cannot Be Empty`;
        }
        else if(PASSWORD.length == 0){
            document.querySelector("#notification-create-account").textContent = `Password Cannot Be Empty`;
        }
        else if(ADDRESS.length == 0){
            document.querySelector("#notification-create-account").textContent = `Address Cannot Be Empty`;
        }
        else if(CITY.length == 0){
            document.querySelector("#notification-create-account").textContent = `City Cannot Be Empty`;
        }
        else if(STATE_PROVINCE.length == 0){
            document.querySelector("#notification-create-account").textContent = `State or Province Cannot Be Empty`;
        }
        else if(ZIP_CODE.length == 0){
            document.querySelector("#notification-create-account").textContent = `Zip code Cannot Be Empty`;
        }
        else if(COUNTRY.length == 0){
            document.querySelector("#notification-create-account").textContent = `Country Cannot Be Empty`;
        }
        else if(PHONE.length == 0){
            document.querySelector("#notification-create-account").textContent = `Phone Number Cannot Be Empty`;
        }
        else if(EMAIL.length == 0){
            document.querySelector("#notification-create-account").textContent = `Email Cannot Be Empty`;
        }
        else {

            if(OTP_EMAIL_VERIFICATTION == true){
            
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