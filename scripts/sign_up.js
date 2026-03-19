// DOM ELEMENT CONSTANTS
const USER_NAME = document.getElementById("name-register");
const USER_EMAIL = document.getElementById("email-register");
const USER_PASSWORD = document.getElementById("password-register");
const USER_CONFIRM_PASSWORD = document.getElementById("confirm-password-register");
const PASSWORD_ERROR = document.getElementById("password-error");

// USER DATA
let users = [];

/**
 * Silently returns instead of showing an error when passwords don't match,
 * because the live validator below already highlights the mismatch in real time.
 */
function addUser() {
    let userName = USER_NAME.value;
    let userEmail = USER_EMAIL.value;
    let userPassword = USER_PASSWORD.value;
    let userConfirmPassword = USER_CONFIRM_PASSWORD.value;
    if (userPassword !== userConfirmPassword) {
        return;
    }
    users.push({ name: userName, email: userEmail, password: userPassword, confirmPassword: userConfirmPassword });
}

/**
 * Only shows the mismatch error once both fields have equal length AND at least
 * 8 characters – avoids distracting the user with errors while still typing.
 */
USER_CONFIRM_PASSWORD.addEventListener("input", function() {
    let userPassword = USER_PASSWORD.value;
    let userConfirmPassword = USER_CONFIRM_PASSWORD.value;
    if (userConfirmPassword.length >= 8 && userPassword !== userConfirmPassword && userPassword.length == userConfirmPassword.length) {
        USER_CONFIRM_PASSWORD.classList.add("red-border");
        PASSWORD_ERROR.classList.remove("dNone");
        PASSWORD_ERROR.classList.add("password-error");
    } else {
        USER_CONFIRM_PASSWORD.classList.remove("red-border");
        PASSWORD_ERROR.classList.add("dNone");
        PASSWORD_ERROR.classList.remove("password-error");
    }
});