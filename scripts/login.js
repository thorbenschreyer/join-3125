const emailData = document.getElementById("email-input-login");
const passwordData = document.getElementById("password-input-login");
const inputImg = document.getElementById("input-password-img");
let initialViewportHeight = window.visualViewport.height;
let wasEmpty = true;
let contacts = [
    {
        name: "Heinzi",
        email: "test.email@example.com",
        password: "123",
        telephone: "+1234567890"
    }
];

window.visualViewport.addEventListener('resize', detectKeyboard);
passwordData.addEventListener('input', checkFirstInput);
window.addEventListener('load', removeMobileLogo);

/**
 * Detects if the virtual keyboard is open by comparing the current viewport height
 * to the initial height. Hides or shows elements based on keyboard state.
 */
function detectKeyboard() {
    const currentHeight = window.visualViewport.height;
    const heightDifference = initialViewportHeight - currentHeight;
    
    if (heightDifference > 100) {
        hideWhileKeyboardIsOpen();
    } else {
        showElementsWhenKeyboardIsClosed();
    }
}


/**
 * Hides specific elements (signup content and privacy policy) when the keyboard is open
 * to improve mobile usability.
 */
function hideWhileKeyboardIsOpen() {
    let signupContent = document.getElementById("signup-content")
    let privacyPolicy = document.getElementById("privacy-policy");
    signupContent.classList.add("d-none");
    privacyPolicy.classList.add("d-none");
}

/**
 * Shows the previously hidden elements (signup content and privacy policy) when the keyboard is closed.
 */
function showElementsWhenKeyboardIsClosed() {
    let signupContent = document.getElementById("signup-content")
    let privacyPolicy = document.getElementById("privacy-policy");
    signupContent.classList.remove("d-none");
    privacyPolicy.classList.remove("d-none");
}

/**
 * Handles the login form submission, checks user credentials, and manages UI feedback.
 * Redirects to the main page on successful login, or shows an error message on failure.
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
 * Hides the error message and resets the login button margin when the user starts typing in the input fields.
 */
function hideErrorOnInput() {
    const errorContainer = document.getElementById("container-error-message");
    const buttonsContainer = document.getElementById("container-login-buttons");

    errorContainer.classList.add("d-none");
    buttonsContainer.classList.remove("button-margin-top-if-error");
}

/**
 * Logs in as a guest user, sets the login state, and redirects to the main page.
 */
function guestLogin () {
    isloggedIn = true
    localStorage.setItem('loginState', JSON.stringify(isloggedIn))
    window.location.href = "../index.html"
}

/**
 * Logs out the current user, updates the login state, and redirects to the login page.
 */
function logOut() {
    isloggedIn = false
    localStorage.setItem('loginState', JSON.stringify(isloggedIn))
    window.location.href = "../login.html"
}

/**
 * Handles the input event for the password field. Shows or hides the password visibility icon
 * depending on whether the field is empty, and attaches the toggle event on first input.
 * @param {Event} event - The input event from the password field.
 */
function checkFirstInput(event) {
    const isEmptyNow = event.target.value.length === 0;
    if (isEmptyNow) {
        removePasswordVisibility();
    } else if (wasEmpty && !isEmptyNow) {
        inputImg.src = "../assets/icons/visibility_off.png";
        inputImg.alt = "Visibility Off Icon";
        inputImg.classList.add("cursor-pointer");
        inputImg.addEventListener("click", togglePasswordVisibility);
    }
    wasEmpty = isEmptyNow;
}

/**
 * Toggles the visibility of the password input between plain text and password.
 * Changes the icon accordingly.
 */
function togglePasswordVisibility() {
    const inputImg = document.getElementById("input-password-img");
    if (passwordData.type === "password") {
        passwordData.type = "text";
        inputImg.src = "../assets/icons/visibility_on.png";
        inputImg.alt = "Visibility On Icon";
    } else {
        passwordData.type = "password";
        inputImg.src = "../assets/icons/visibility_off.png";
        inputImg.alt = "Visibility Off Icon";
    }
}

/**
 * Resets the password input to type 'password', restores the lock icon,
 * and removes the visibility toggle event and pointer cursor.
 */
function removePasswordVisibility(){
    passwordData.type = "password";
    inputImg.src = "../assets/icons/lock.png";
    inputImg.alt = "Lock Icon";
    inputImg.classList.remove("cursor-pointer");
    inputImg.removeEventListener("click", togglePasswordVisibility);
}
/**
 * Removes the mobile logo element from the DOM after a short delay.
 * This is used to hide the logo on mobile devices after the page loads.
 */
function removeMobileLogo() {
    setTimeout(() => {
        const mobileLogo = document.querySelector('.main-logo-mobile');
        if (mobileLogo) {
            mobileLogo.remove();
        }
    }, 1200);
}

