// DOM ELEMENT CONSTANTS
const USER_NAME = document.getElementById("name-register");
const USER_EMAIL = document.getElementById("email-register");
const USER_PASSWORD = document.getElementById("password-register");
const USER_CONFIRM_PASSWORD = document.getElementById("confirm-password-register");
const SIGNUP_BACK_BUTTON = document.getElementById("signup-back-button");
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
    handleConfirmPasswordInput();
    setupPasswordVisibilityControls();
    resetEmailInputStyles();
    initAccessibilityListeners();
}

// INPUT AND ACCESSIBILITY LISTENERS
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
 * Registers the keyboard interaction handlers needed to keep navigation
 * and consent controls accessible across the signup page.
 */
function initAccessibilityListeners() {
    initBackButtonKeyboardListener();
    initPrivacyCheckboxKeyboardListener();
    initSignupButtonState();
    initPrivacyLinkKeyboardListener();
    initPrivacyFooterKeyboardListener();
    initLegalFooterKeyboardListener();
}

/**
 * Enables keyboard-based navigation for the back button by treating Enter and Space
 * like an activation event and returning the user to the login page.
 * @param {KeyboardEvent} event The keyboard event triggered on the back button.
 */
function initBackButtonKeyboardListener() {
    SIGNUP_BACK_BUTTON.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            window.location.href = "login.html";
        }
    });
}

/**
 * Allows the privacy checkbox to be toggled with Enter so keyboard users can
 * interact with it consistently across browsers.
 * @param {KeyboardEvent} event The keyboard event triggered on the privacy checkbox.
 */
function initPrivacyCheckboxKeyboardListener() {
    PRIVACY_POLICY_CHECKBOX.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            PRIVACY_POLICY_CHECKBOX.checked = !PRIVACY_POLICY_CHECKBOX.checked;
            PRIVACY_POLICY_CHECKBOX.dispatchEvent(new Event("change"));
        }
    });
}

/**
 * Enables or disables the signup button based on the state of the privacy policy checkbox,
 * ensuring that users can only proceed after giving consent.
 */
function initSignupButtonState() {
    PRIVACY_POLICY_CHECKBOX.addEventListener("change", function() {
        if (PRIVACY_POLICY_CHECKBOX.checked === true) {
            SIGNUP_BUTTON.disabled = false;
        } else if (PRIVACY_POLICY_CHECKBOX.checked === false) {
            SIGNUP_BUTTON.disabled = true;
        }
    });
}

/**
 * Adds keyboard support for opening the privacy policy link with Space,
 * matching the expected behavior of other interactive elements.
 * @param {KeyboardEvent} event The keyboard event triggered on the privacy policy link.
 */
function initPrivacyLinkKeyboardListener() {
    PRIVACY_POLICY_CHECKBOX_LINK.addEventListener("focus", function() {
        PRIVACY_POLICY_CHECKBOX_LINK.addEventListener("keydown", function(event) {
            if (event.key === " ") {
                event.preventDefault();
                window.location.href = "index.html?page=privacy";
            }
        });
    });
}

/**
 * Lets keyboard users open the footer privacy link with Space,
 * aligning its behavior with other keyboard-accessible controls.
 * @param {KeyboardEvent} event The keyboard event triggered on the footer privacy link.
 */
function initPrivacyFooterKeyboardListener() {
    PRIVACY_POLICY_FOOTER.addEventListener("focus", function() {
        PRIVACY_POLICY_FOOTER.addEventListener("keydown", function(event) {
            if (event.key === " ") {
                event.preventDefault();
                window.location.href = "index.html?page=privacy";
            }
        });
    });
}

/**
 * Lets keyboard users open the footer legal notice link with Space,
 * keeping footer navigation consistent for non-pointer interaction.
 * @param {KeyboardEvent} event The keyboard event triggered on the footer legal notice link.
 */
function initLegalFooterKeyboardListener() {
    LEGAL_NOTICE_FOOTER.addEventListener("focus", function() {
        LEGAL_NOTICE_FOOTER.addEventListener("keydown", function(event) {
            if (event.key === " ") {
                event.preventDefault();
                window.location.href = "index.html?page=legal";
            }
        });
    });
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

// SIGNUP LOGIC
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
    assignUserColor();
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
    users.push({ name: userName, email: userEmail, password: userPassword, avatarColor: userColor });
    saveUserData();
    signUpsuccess();
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