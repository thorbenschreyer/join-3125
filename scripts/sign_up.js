// DOM ELEMENT CONSTANTS
const USER_NAME = document.getElementById("name-register");
const USER_EMAIL = document.getElementById("email-register");
const USER_PASSWORD = document.getElementById("password-register");
const USER_CONFIRM_PASSWORD = document.getElementById("confirm-password-register");
const PASSWORD_ERROR = document.getElementById("password-error");

// USER DATA
let users = [];

/**
 * Attempts to add a new user to the local collection.
 *
 * Validation failures (e.g. password mismatch or duplicate user) are handled
 * silently because the UI already provides real-time feedback. This prevents
 * redundant error handling and avoids conflicting user messages.
 */
function addUser() {
    let userName = USER_NAME.value;
    let userEmail = USER_EMAIL.value;
    let userPassword = USER_PASSWORD.value;
    let userConfirmPassword = USER_CONFIRM_PASSWORD.value;
    if (userPassword != userConfirmPassword) {
        return;
    }
    const isDuplicateUser = users.some(user =>
        user.name === userName || user.email === userEmail
    );
    if (isDuplicateUser) {
        return;
    }
  users.push({
    name: userName,
    email: userEmail,
    password: userPassword
  });
  saveUserDataToLocalStorage();
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

// Persists the current in-memory user list to localStorage.
function saveUserDataToLocalStorage() {
    localStorage.setItem("User_Data", JSON.stringify(users));
}

// Loads persisted user data from localStorage into the in-memory user array.
function getUserDataFromLocalStorage() {
    let storagedUserData = JSON.parse(localStorage.getItem("User_Data"));
    if (storagedUserData != null) {
    let userDataLength = storagedUserData.length
        for (let userDataIndex = 0; userDataIndex < userDataLength; userDataIndex++) {
            users.push({
                name: storagedUserData[userDataIndex].name,
                email: storagedUserData[userDataIndex].email,
                password: storagedUserData[userDataIndex].password
            })
        }
    }
}

/** Initializes the application state by restoring persisted user data.
 */
function init() {
    getUserDataFromLocalStorage();
}

// Initialize the application init() when the window loads
window.onload = init;