// Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("login-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the values of the username and password fields
        const username = (document.getElementById("username").value).toLowerCase();
        const password = document.getElementById("password").value;

        if(username.length == 0){
            document.querySelector("#notification-login").innerHTML = `<span style="color: red;">Username or Email Cannot Be Empty</span>`;
        }
        else if(password.length == 0){
            document.querySelector("#notification-login").innerHTML = `<span style="color: red;">Password Cannot Be Empty</span>`;
        }
        else {

             // Create a JavaScript object to hold the data
            const formData = {
                username: username,
                password: password
            };

            verify_user(formData, function(response) {

                const errorMessages = [
                    "EMAIL DOES NOT EXIST",
                    "USERNAME DOES NOT EXIST",
                    "KEY DOES NOT EXIST",
                    "CIPHER PASSWORD DOES NOT EXIST",
                    "WRONG PASSWORD",
                    "DATABASE ERROR"
                ];
                
                if (!errorMessages.includes(response)) {

                    sessionStorage.setItem("CURRENT_USER_ID", response)
        
                    openOTPLoginrPage();

                }
                else{
                    document.querySelector("#notification-login").innerHTML = `<span style="color: red;">${response}</span>`;
                }
                    
            });
            
        }
       
    });


    // Add a click event listener for the REGISTER button
    document.getElementById("registeration-request").addEventListener("click", function (event) {
        event.preventDefault();
        openRegisterPage();
    });


});

function verify_user(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('username', value.username);
    formData.append('password', value.password);

    $.ajax({
        url: '/login_process',
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

    // Replace this with your login logic (e.g., authentication) in the future
    // For now, simply redirect to the profile page
    window.location.href = "/profile";

    // Specify the URL of the profile page
    // const profilePageURL = "/profile";

    // Open a new window or tab with the profile page
    // const newWindow = window.open(profilePageURL, "_blank");

    // Optionally, you can focus on the new window/tab
    // if (newWindow) {
    //     newWindow.focus();
    // }
}


function openRegisterPage() {
    window.location.href = "/register";
}

function openOTPLoginrPage() {
    window.location.href = "/otp_login";
}