/**
 * FIREBASE BACKEND POINT
 */
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

/**
 * REGEX PATTERNS
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * Predefined avatar colors assigned to new users in a repeating sequence.
 */
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

/**
 * Stores all registered users loaded from the backend.
 */
let users = [];

/**
 * Collects the four signup form input fields for shared iteration.
 * @returns {Array<HTMLElement>} The name, email, password, and confirm password input elements.
 */
function getFormInputFields() {
    return [
        document.getElementById("name-register"),
        document.getElementById("email-register"),
        document.getElementById("password-register"),
        document.getElementById("confirm-password-register")
    ];
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
    initAccessibilityListeners();
}

/**
 * Toggles password visibility by switching UI icons and updating the input type.
 */
function togglePasswordVisibility() {
    document.getElementById("password-visibility-on").classList.toggle("dNone");
    document.getElementById("password-visibility-off").classList.toggle("dNone");
    updatePasswordInputType();
}

/**
 * Toggles confirm-password visibility by switching UI icons and updating the input type.
 */
function toggleConfirmPasswordVisibility() {
    document.getElementById("confirm-password-visibility-on").classList.toggle("dNone");
    document.getElementById("confirm-password-visibility-off").classList.toggle("dNone");
    updateConfirmPasswordInputType();
}

/**
 * Updates the password input type based on the current visibility icon state.
 */
function updatePasswordInputType() {
    if (document.getElementById("password-visibility-off").classList.contains("dNone")) {
        document.getElementById("password-register").type = "text";
    } else {
        document.getElementById("password-register").type = "password";
    }
}

/**
 * Updates the confirm-password input type based on the current visibility icon state.
 */
function updateConfirmPasswordInputType() {
    if (document.getElementById("confirm-password-visibility-off").classList.contains("dNone")) {
        document.getElementById("confirm-password-register").type = "text";
    } else {
        document.getElementById("confirm-password-register").type = "password";
    }
}

/**
 * Enables the signup button only when all required fields are filled and the privacy policy is accepted.
 */
function checkFormRequiredFields() {
    const isValid =
        document.getElementById("name-register").value.trim().length > 0 &&
        document.getElementById("email-register").value.length > 0 &&
        document.getElementById("password-register").value.length > 0 &&
        document.getElementById("confirm-password-register").value.length > 0 &&
        document.getElementById("privacy-policy-checkbox").checked;

    document.getElementById("signup-button").disabled = !isValid;
    document.getElementById("signup-button").classList.toggle("disabled-btn", !isValid);
}

/**
 * Displays a validation error after form submission if the email format is invalid.
 * This serves as a final check in case the user bypassed real-time validation,
 * ensuring that only properly formatted email addresses are accepted by the system.
 */
function invalidEmailFeedback() {
    document.getElementById("email-register").classList.add("red-border");
    document.getElementById("input-error").textContent = "Please enter a valid email address."
    document.getElementById("input-error").classList.add("input-error-visible");
}

/**
 * Displays a validation error after form submission if the email is already in use.
 *
 * This prevents duplicate account creation and ensures data integrity
 * by enforcing unique email addresses at the final validation step.
 */
function duplicateUserFeedback() {
    document.getElementById("email-register").classList.add("red-border");
    document.getElementById("input-error").textContent = "Email already registered."
    document.getElementById("input-error").classList.add("input-error-visible");
}

/**
 * Displays a validation error after form submission if the passwords do not match.
 *
 * This acts as a fallback validation in case the mismatch was not already caught
 * by real-time input validation, ensuring the user cannot proceed with inconsistent data.
 */
function passwordMismatchFeedback() {
    document.getElementById("confirm-password-register").classList.add("red-border");
    document.getElementById("input-error").textContent = "Your passwords don't match."
    document.getElementById("input-error").classList.add("input-error-visible");
}

/**
 * Finalizes the signup flow by preventing further interaction,
 * showing a success state, and redirecting to the login page.
 *
 * The delay ensures the user can perceive the success feedback
 * before being navigated away.
 */
function signUpsuccess() {
    document.getElementById("signup-button").disabled = true;
    document.getElementById("signup-success-toast").classList.add("show");
    document.getElementById("signup-success-overlay").classList.add("show");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

/**
 * Adds a new user to the in-memory collection and persists it.
 *
 * Validation failures are intentionally ignored here because the UI layer
 * performs real-time validation and already communicates errors to the user.
 * This avoids duplicated validation logic and inconsistent feedback states.
 */
function addUser() {
    const newUserIndex = users.length;

    const userName = document.getElementById("name-register").value.trim();
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;
    const confirmPassword = document.getElementById("confirm-password-register").value;
    const color = USER_COLOR[newUserIndex % USER_COLOR.length];

    if (!EMAIL_REGEX.test(email)) { invalidEmailFeedback(); return; }
    if (users.some(user => user.email === email)) { duplicateUserFeedback(); return; }
    if (password != confirmPassword) { passwordMismatchFeedback(); return; }

    users.push({ name: userName, email: email, password: password, avatarColor: color });
    saveUserData();
    signUpsuccess();
}

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

/**
 * Persists the most recently added user by sending it to the backend API.
 */
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
 * Initializes the application by setting up event listeners and fetching initial data.
 */
window.onload = init;