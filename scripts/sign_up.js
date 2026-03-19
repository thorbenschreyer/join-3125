// DOM ELEMENT CONSTANTS
const USER_NAME = document.getElementById("name-register");
const USER_EMAIL = document.getElementById("email-register");
const USER_PASSWORD = document.getElementById("password-register");
const USER_CONFIRM_PASSWORD = document.getElementById("confirm-password-register");

// USER DATA
let users = [];

/**
 * This function adds a new user to the users array with the input values from the form
 */
function addUser() {
    let userName = USER_NAME.value;
    let userEmail = USER_EMAIL.value;
    let userPassword = USER_PASSWORD.value;
    let userConfirmPassword = USER_CONFIRM_PASSWORD.value;
    users.push({ name: userName, email: userEmail, password: userPassword, confirmPassword: userConfirmPassword });
    console.log(users);
}