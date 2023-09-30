// Ensure the DOM is fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {

    const CURRENT_USER_ID = sessionStorage.getItem("CURRENT_USER_ID")

    const formData = {
        user_id: CURRENT_USER_ID
    };

    get_user_fullname(formData, function(response) {

        document.querySelector("#profile-name").textContent = `${response}`;

    });



    document.getElementById("logout-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission
        logoutRequested()
    });
});


function get_user_fullname(value, callback) {

    // Create a FormData object to send form data
    const formData = new FormData();
    formData.append('user_id', value.user_id);

    $.ajax({
        url: '/fullnameProfile',
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


function logoutRequested() {
    // Redirect to the profile page or another page as needed
    window.location.href = "/";
}