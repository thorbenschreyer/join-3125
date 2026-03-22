let emailData = document.getElementById("email-input-login");
let passwordData = document.getElementById("password-input-login");
let contacts = [
    {
        name: "Heinzi",
        email: "test.email@example.com",
        password: "123",
        telephone: "+1234567890"
    }
];

/**
 * Handles the login form submission, checks user credentials, and manages UI feedback.
 * @param {Event} event - The form submit event.
 */
function loginSubmit(event) {
    event.preventDefault();
    const user = contacts.find(u => u.email === emailData.value);
    const errorContainer = document.getElementById("container-error-message");
    const buttonsContainer = document.getElementById("container-login-buttons");

    if (user && user.password === passwordData.value) {
        console.log("Login erfolgreich!!");
            buttonsContainer.classList.remove("button-margin-top-if-error");    
            errorContainer.classList.add("d-none");
            emailData.value = "";
            passwordData.value = "";
            isloggedIn = true
            localStorage.setItem('loginState', JSON.stringify(isloggedIn))
            window.location.href = "../index.html"
    } else {
        buttonsContainer.classList.add("button-margin-top-if-error");
        errorContainer.classList.remove("d-none");
    }
}

/**
 * Hides the error message and resets the login button margin when user starts typing.
 */
function hideErrorOnInput() {
    const errorContainer = document.getElementById("container-error-message");
    const buttonsContainer = document.getElementById("container-login-buttons");

    errorContainer.classList.add("d-none");
    buttonsContainer.classList.remove("button-margin-top-if-error");
}

/**
 * Logs in as a guest user and redirects to the main page.
 */
function guestLogin () {
    isloggedIn = true
    localStorage.setItem('loginState', JSON.stringify(isloggedIn))
    window.location.href = "../index.html"
}

/**
 * Logs out the current user and redirects to the login page.
 */
function logOut() {
    isloggedIn = false
    localStorage.setItem('loginState', JSON.stringify(isloggedIn))
    window.location.href = "../login.html"
}