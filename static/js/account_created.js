// Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("login-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission

        loginRequested();
                   
    });

});


function loginRequested() {
    // Replace this with your login logic (e.g., authentication) in the future
    // For now, simply redirect to the profile page
    window.location.href = "/";
}