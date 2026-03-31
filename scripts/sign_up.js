// DOM ELEMENT CONSTANTS
const USER_NAME = document.getElementById("name-register");
const USER_EMAIL = document.getElementById("email-register");
const USER_PASSWORD = document.getElementById("password-register");
const USER_CONFIRM_PASSWORD = document.getElementById("confirm-password-register");
const SIGNUP_BUTTON = document.getElementById("signup-button");
const INPUT_ERROR = document.getElementById("input-error");
const PASSWORD_LOCK = document.getElementById("password-lock");
const PASSWORD_VISIBILITY_ON = document.getElementById("password-visibility-on");
const PASSWORD_VISIBILITY_OFF = document.getElementById("password-visibility-off");
const CONFIRM_PASSWORD_LOCK = document.getElementById("confirm-password-lock");
const CONFIRM_PASSWORD_VISIBILITY_ON = document.getElementById("confirm-password-visibility-on");
const CONFIRM_PASSWORD_VISIBILITY_OFF = document.getElementById("confirm-password-visibility-off");
const SIGNUP_SUCCESS_TOAST = document.getElementById("signup-success-toast");
const SIGNUP_SUCCESS_OVERLAY = document.getElementById("signup-success-overlay");

// BASE URL
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

// FORM INPUT FIELDS
const FORM_INPUT_FIELDS = [
    USER_NAME,
    USER_EMAIL,
    USER_PASSWORD,
    USER_CONFIRM_PASSWORD
];

// USER DATA
let users = [];

/**
 * Adds a new user to the in-memory collection and persists it.
 *
 * Validation failures are intentionally ignored here because the UI layer
 * performs real-time validation and already communicates errors to the user.
 * This avoids duplicated validation logic and inconsistent feedback states.
 */
function addUser() {
    let userName = USER_NAME.value;
    let userEmail = USER_EMAIL.value;
    let userPassword = USER_PASSWORD.value;
    let userConfirmPassword = USER_CONFIRM_PASSWORD.value;
    if (userPassword != userConfirmPassword) {
        showPasswordMismatchError();
        return;
    }
    const isDuplicateUser = users.some(user =>
        user.email === userEmail
    );
    if (isDuplicateUser) {
        duplicateUserFeedback();
        return;
    }
    users.push({
        name: userName,
        email: userEmail,
        password: userPassword
    });
    saveUserData();
    signUpsuccess();
}

/**
 * Displays a validation error after form submission if the passwords do not match.
 *
 * This acts as a fallback validation in case the mismatch was not already caught
 * by real-time input validation, ensuring the user cannot proceed with inconsistent data.
 */
function showPasswordMismatchError() {
    USER_CONFIRM_PASSWORD.classList.add("red-border");
    INPUT_ERROR.textContent = "Your passwords don't match. Please try again."
    INPUT_ERROR.classList.remove("dNone");
    INPUT_ERROR.classList.add("input-error");
}

/**
 * Displays a validation error after form submission if the email is already in use.
 *
 * This prevents duplicate account creation and ensures data integrity
 * by enforcing unique email addresses at the final validation step.
 */
function duplicateUserFeedback() {
    USER_EMAIL.classList.add("red-border");
    INPUT_ERROR.textContent = "This email address is already registered."
    INPUT_ERROR.classList.remove("dNone");
    INPUT_ERROR.classList.add("input-error");
}

/**
 * Finalizes the signup flow by preventing further interaction,
 * showing a success state, and redirecting to the login page.
 *
 * The delay ensures the user can perceive the success feedback
 * before being navigated away.
 */
function signUpsuccess() {
    SIGNUP_BUTTON.disabled = true;
    SIGNUP_SUCCESS_TOAST.classList.add("show");
    SIGNUP_SUCCESS_OVERLAY.classList.add("show");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}


/**
 * Clears email-related error styling when the user focuses any input field.
 *
 * This ensures that server-side validation feedback (e.g. duplicate email)
 * is reset as soon as the user starts correcting their input, preventing
 * stale error states from persisting in the UI.
 *
 * Note: The error class is only removed if the message corresponds to the
 * duplicate email case to avoid interfering with unrelated validation errors.
 */
function resetEmailInputStyles() {
    for (let inputIndex = 0; inputIndex < FORM_INPUT_FIELDS.length; inputIndex++) {
        FORM_INPUT_FIELDS[inputIndex].addEventListener("focus", function() {
            getUserData();
            USER_EMAIL.classList.remove("red-border");
            INPUT_ERROR.classList.add("dNone");
        if (INPUT_ERROR.textContent === "This email address is already registered.") {
            INPUT_ERROR.classList.remove("input-error");
        }
        })
    }
}

/**
 * Only shows the mismatch error once both fields have equal length AND at least
 * 8 characters – avoids distracting the user with errors while still typing.
 */
function handleConfirmPasswordInput() {
    USER_CONFIRM_PASSWORD.addEventListener("input", function() {
        let userPassword = USER_PASSWORD.value;
        let userConfirmPassword = USER_CONFIRM_PASSWORD.value;
        SIGNUP_BUTTON
        if (userConfirmPassword.length >= 8 && userPassword !== userConfirmPassword && userPassword.length == userConfirmPassword.length) {
            USER_CONFIRM_PASSWORD.classList.add("red-border");
            INPUT_ERROR.textContent = "Your passwords don't match. Please try again."
            INPUT_ERROR.classList.remove("dNone");
            INPUT_ERROR.classList.add("input-error");
        } else {
            USER_CONFIRM_PASSWORD.classList.remove("red-border");
            INPUT_ERROR.textContent = "Your passwords don't match. Please try again."
            INPUT_ERROR.classList.add("dNone");
            INPUT_ERROR.classList.remove("input-error");
        }
    });
}

// Persists the most recently added user by sending it to the backend API.
async function saveUserData() {
    let lastUser = users.length - 1;
    await fetch(`${BASE_URL}users.json`, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users[lastUser])
    });
}

/**
 * Retrieves all persisted users from the backend and maps them into the local `users` array.
 *
 * The backend returns an object keyed by user IDs, which is transformed into
 * an array to match the structure used throughout the application.
 */
async function getUserData() {
    let allUserData = await fetch(`${BASE_URL}users.json`);
    let allUserDataToJson = await allUserData.json(); 
    let UserKeysArray = Object.keys(allUserDataToJson);

    for (let userIndex = 0; userIndex < UserKeysArray.length; userIndex++) {
        users.push(
            {
                id : UserKeysArray[userIndex],
                name : allUserDataToJson[UserKeysArray[userIndex]].name,
                email : allUserDataToJson[UserKeysArray[userIndex]].email,
                password : allUserDataToJson[UserKeysArray[userIndex]].password
            }
        )
    }
}

/**
 * Reveals password interaction controls on first focus.
 *
 * The visibility toggle is only initialized if it has not been set before,
 * preventing unintended state overrides when the user refocuses the field.
 */
function setupPasswordVisibilityControls() {
    USER_PASSWORD.addEventListener("focus", function() {
        PASSWORD_LOCK.classList.add("dNone");
        if (PASSWORD_VISIBILITY_ON.classList.contains("dNone") && PASSWORD_VISIBILITY_OFF.classList.contains("dNone")) {
            PASSWORD_VISIBILITY_OFF.classList.remove("dNone");
            updatePasswordInputType();
        }
    })
USER_CONFIRM_PASSWORD.addEventListener("focus", function() {
    CONFIRM_PASSWORD_LOCK.classList.add("dNone");
        if (CONFIRM_PASSWORD_VISIBILITY_ON.classList.contains("dNone") && CONFIRM_PASSWORD_VISIBILITY_OFF.classList.contains("dNone")) {
            CONFIRM_PASSWORD_VISIBILITY_OFF.classList.remove("dNone");
            updateConfirmPasswordInputType();
        } 
    }) 
}

/**
 * Toggles password visibility by switching UI icons and updating the input type.
 *
 * The visibility state is derived from the icon state instead of being stored
 * separately, ensuring UI and behavior stay in sync.
 */
function togglePasswordVisibility() {
    PASSWORD_VISIBILITY_ON.classList.toggle("dNone");
    PASSWORD_VISIBILITY_OFF.classList.toggle("dNone");
    updatePasswordInputType();
}

function toggleConfirmPasswordVisibility() {
    CONFIRM_PASSWORD_VISIBILITY_ON.classList.toggle("dNone");
    CONFIRM_PASSWORD_VISIBILITY_OFF.classList.toggle("dNone");
    updateConfirmPasswordInputType();
}

/**
 * Updates the password input type based on the current visibility icon state.
 *
 * Uses the "visibility off" icon as the source of truth to determine
 * whether the password should be masked or visible.
 */
function updatePasswordInputType() {
    if (PASSWORD_VISIBILITY_OFF.classList.contains("dNone")) {
        USER_PASSWORD.type = "text";
    } else {
        USER_PASSWORD.type = "password";
    }
}

function updateConfirmPasswordInputType() {
    if (CONFIRM_PASSWORD_VISIBILITY_OFF.classList.contains("dNone")) {
        USER_CONFIRM_PASSWORD.type = "text";
    } else {
        USER_CONFIRM_PASSWORD.type = "password";
    }
}

/**
 * Bootstraps the application by restoring persisted user data
 * and registering all input-related event handlers.
 *
 * This ensures that both the data state and UI behavior (validation,
 * password controls, and error handling) are fully initialized on load.
 */
function init() {
    getUserData();
    handleConfirmPasswordInput();
    setupPasswordVisibilityControls();
    resetEmailInputStyles();
}

// Initialize the application init() when the window loads
window.onload = init;