// DOM ELEMENT CONSTANTS
const USER_NAME = document.getElementById("name-register");
const USER_EMAIL = document.getElementById("email-register");
const USER_PASSWORD = document.getElementById("password-register");
const USER_CONFIRM_PASSWORD = document.getElementById("confirm-password-register");
const SIGNUP_BACK_BUTTON = document.getElementById("signup-back-button");
const SIGNUP_BUTTON = document.getElementById("signup-button");
const INPUT_ERROR = document.getElementById("input-error");
const SIGNUP_BUTTON_HINT_TEXT = document.getElementById("signup-button-hint");
const PASSWORD_LOCK = document.getElementById("password-lock");
const PASSWORD_VISIBILITY_ON = document.getElementById("password-visibility-on");
const PASSWORD_VISIBILITY_OFF = document.getElementById("password-visibility-off");
const CONFIRM_PASSWORD_LOCK = document.getElementById("confirm-password-lock");
const CONFIRM_PASSWORD_VISIBILITY_ON = document.getElementById("confirm-password-visibility-on");
const CONFIRM_PASSWORD_VISIBILITY_OFF = document.getElementById("confirm-password-visibility-off");
const SIGNUP_SUCCESS_TOAST = document.getElementById("signup-success-toast");
const SIGNUP_SUCCESS_OVERLAY = document.getElementById("signup-success-overlay");
const PRIVACY_POLICY_CHECKBOX = document.getElementById("privacy-policy-checkbox");
const PRIVACY_POLICY_CHECKBOX_LINK = document.getElementById("privacy-policy-checkbox-link");
const PRIVACY_POLICY_FOOTER = document.getElementById("privacy-policy-footer");
const LEGAL_NOTICE_FOOTER = document.getElementById("legal-notice-footer");

// FIREBASE BACKEDND POINT
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

// FORM INPUT FIELDS
const FORM_INPUT_FIELDS = [
    USER_NAME,
    USER_EMAIL,     
    USER_PASSWORD,
    USER_CONFIRM_PASSWORD
];

// FORM STATE
let users = [];
let userNameSignup;
let userEmail;
let userPassword;
let userConfirmPassword;
let userColor;
const USER_COLOR = [
  "rgba(255, 122, 0, 1)",
  "rgba(147, 39, 255, 1)",
  "rgba(110, 82, 255, 1)",
  "rgba(252, 113, 255, 1)",
  "rgba(255, 187, 43, 1)",
  "rgba(31, 215, 193, 1)",
  "rgba(70, 47, 138, 1)",
  "rgba(255, 70, 70, 1)",
  "rgba(0, 190, 232, 1)",
];

// Track the validation state of the required fields so the signup button only becomes available when the form is filled.
let isNameFilled = false;
let isEmailFilled = false;
let isPasswordFilled = false;
let isConfirmPasswordFilled = false;
let isPrivatePolicyChecked = false;

/**
 * Restores the required-field validation flags to their default state.
 */
function resetFormFilledState() {
    isNameFilled = false;
    isEmailFilled = false;
    isPasswordFilled = false;
    isConfirmPasswordFilled = false;
}

// INITIALIZATION
/**
 * Bootstraps the application by restoring persisted user data
 * and registering all input-related event handlers.
 *
 * This ensures that both the data state and UI behavior (validation,
 * password controls, and error handling) are fully initialized on load.
 */
function init() {
    getUserData();
    initAccessibilityListeners();
}

// PASSWORD VISIBILITY
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

// VALIDATION FEEDBACK
/**
 * Enables the add-task button only when all required fields are valid.
 */
function checkFormRequiredFields() {
    if (isNameFilled && isEmailFilled && isPasswordFilled && isConfirmPasswordFilled && isPrivatePolicyChecked) {
        SIGNUP_BUTTON.disabled = false;
        SIGNUP_BUTTON.classList.remove("disabled-btn");
    } else {
        SIGNUP_BUTTON.disabled = true;
        SIGNUP_BUTTON.classList.add("disabled-btn");
    }
}
/**
 * Displays a validation error after form submission if the email format is invalid.
 * This serves as a final check in case the user bypassed real-time validation,
 * ensuring that only properly formatted email addresses are accepted by the system.
 */
function invalidEmailFeedback() {
    USER_EMAIL.classList.add("red-border");
    INPUT_ERROR.textContent = "Please enter a valid email address."
    INPUT_ERROR.classList.add("input-error-visible");
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
    INPUT_ERROR.classList.add("input-error-visible");
}

/**
 * Displays a validation error after form submission if the passwords do not match.
 *
 * This acts as a fallback validation in case the mismatch was not already caught
 * by real-time input validation, ensuring the user cannot proceed with inconsistent data.
 */
function passwordMismatchFeedback() {
    USER_CONFIRM_PASSWORD.classList.add("red-border");
    INPUT_ERROR.textContent = "Your passwords don't match. Please try again."
    INPUT_ERROR.classList.add("input-error-visible");
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

// SIGNUP LOGIC
/**
 * Adds a new user to the in-memory collection and persists it.
 *
 * Validation failures are intentionally ignored here because the UI layer
 * performs real-time validation and already communicates errors to the user.
 * This avoids duplicated validation logic and inconsistent feedback states.
 */
function addUser() {
    setUserInput();
    assignUserColor();
    if (!USER_EMAIL.checkValidity()) {
        invalidEmailFeedback();
        return;
    }
    const isDuplicateUser = users.some(user =>
        user.email === userEmail
    );
    if (isDuplicateUser) {
        duplicateUserFeedback();
        return;
    }
    if (userPassword != userConfirmPassword) {
        passwordMismatchFeedback();
        return;
    }
    users.push({ name: userNameSignup, email: userEmail, password: userPassword, avatarColor: userColor });
    saveUserData();
    signUpsuccess();
}

/**
 * Copies the current signup form values into shared state before validation and submission.
 *
 * Centralizing this step keeps the signup flow consistent and avoids reading
 * directly from the DOM in each validation branch.
 */
function setUserInput() {
    userNameSignup = USER_NAME.value;
    userEmail = USER_EMAIL.value;
    userPassword = USER_PASSWORD.value;
    userConfirmPassword = USER_CONFIRM_PASSWORD.value;
}

/**
 * Assigns the next avatar color in a repeating sequence so new users
 * receive a color even after the predefined palette has been exhausted.
 */
function assignUserColor() {
    newUserIndex = users.length
    userColor = USER_COLOR[newUserIndex % USER_COLOR.length]
}

// DATA ACCESS
/**
 * Retrieves all persisted users from the backend and maps them into the local `users` array.
 *
 * The backend returns an object keyed by user IDs, which is transformed into
 * an array to match the structure used throughout the application.
 */
async function getUserData() {
    users = [];
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

// APP START
// Initialize the application init() when the window loads
window.onload = init;