/**
 * Registers the keyboard interaction handlers needed to keep navigation
 * and consent controls accessible across the signup page.
 */
function initAccessibilityListeners() {
    initPasswordVisibilityListeners();
    initresetEmailInputStyleListener();
    initBackButtonKeyboardListener();
    initPrivacyCheckboxKeyboardListener();
    initPrivacyLinkKeyboardListener();
    initPrivacyFooterKeyboardListener();
    initLegalFooterKeyboardListener();
    initFormFilledListeners();
    initPrivacyPolicyCheckboxListener();
    initSignupButtonListeners();
}

/**
 * Reveals password interaction controls on first focus.
 *
 * The visibility toggle is only initialized if it has not been set before,
 * preventing unintended state overrides when the user refocuses the field.
 */
function initPasswordVisibilityListeners() {
    document.getElementById("password-register").addEventListener("focus", function() {
        document.getElementById("password-lock").classList.add("dNone");
        if (document.getElementById("password-visibility-on").classList.contains("dNone") && document.getElementById("password-visibility-off").classList.contains("dNone")) {
            document.getElementById("password-visibility-off").classList.remove("dNone");
            updatePasswordInputType();
        }
    })
    document.getElementById("confirm-password-register").addEventListener("focus", function() {
        document.getElementById("confirm-password-lock").classList.add("dNone");
        if (document.getElementById("confirm-password-visibility-on").classList.contains("dNone") && document.getElementById("confirm-password-visibility-off").classList.contains("dNone")) {
            document.getElementById("confirm-password-visibility-off").classList.remove("dNone");
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
function initresetEmailInputStyleListener() {
    const formInputFields = getFormInputFields();
    for (let inputIndex = 0; inputIndex < formInputFields.length; inputIndex++) {
        formInputFields[inputIndex].addEventListener("focus", function() {
            getUserData();
            document.getElementById("email-register").classList.remove("red-border");
            document.getElementById("confirm-password-register").classList.remove("red-border");
            document.getElementById("input-error").classList.remove("input-error-visible");
            document.getElementById("signup-button-hint").classList.remove("input-error-visible");
        })
    }
}

/**
 * Enables keyboard-based navigation for the back button by treating Enter and Space
 * like an activation event and returning the user to the login page.
 * @param {KeyboardEvent} event The keyboard event triggered on the back button.
 */
function initBackButtonKeyboardListener() {
    document.getElementById("signup-back-button").addEventListener("keydown", function(event) {
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
    const privacyPolicyCheckbox = document.getElementById("privacy-policy-checkbox");
    privacyPolicyCheckbox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            privacyPolicyCheckbox.checked = !privacyPolicyCheckbox.checked;
            privacyPolicyCheckbox.dispatchEvent(new Event("change"));
        }
    });
}

/**
 * Adds keyboard support for opening the privacy policy link with Space,
 * matching the expected behavior of other interactive elements.
 * @param {KeyboardEvent} event The keyboard event triggered on the privacy policy link.
 */
function initPrivacyLinkKeyboardListener() {
    document.getElementById("privacy-policy-checkbox-link").addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.preventDefault();
            window.location.href = "index.html?page=privacy";
        }
    });
}

/**
 * Lets keyboard users open the footer privacy link with Space,
 * aligning its behavior with other keyboard-accessible controls.
 * @param {KeyboardEvent} event The keyboard event triggered on the footer privacy link.
 */
function initPrivacyFooterKeyboardListener() {
    document.getElementById("privacy-policy-footer").addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.preventDefault();
            window.location.href = "index.html?page=privacy";
        }
    });
}

/**
 * Lets keyboard users open the footer legal notice link with Space,
 * keeping footer navigation consistent for non-pointer interaction.
 * @param {KeyboardEvent} event The keyboard event triggered on the footer legal notice link.
 */
function initLegalFooterKeyboardListener() {
    document.getElementById("legal-notice-footer").addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.preventDefault();
            window.location.href = "index.html?page=legal";
        }
    });
}

/**
 * Tracks whether the form fields are filled and updates the signup button state on each keystroke.
 */
function initFormFilledListeners() {
    const fields = getFormInputFields();
    fields.forEach(field => {
        field.addEventListener("input", function () {
            checkFormRequiredFields();
        });
    });
}

/**
 * Tracks whether the privacy policy has been accepted and updates the signup button state.
 *
 * The checkbox is part of the required signup criteria, so its state must be
 * reflected immediately before submission becomes available.
 */
function initPrivacyPolicyCheckboxListener() {
    const privacyPolicyCheckbox = document.getElementById("privacy-policy-checkbox");
    privacyPolicyCheckbox.addEventListener("change", function() {
        document.getElementById("signup-button-hint").classList.remove("input-error-visible");
        checkFormRequiredFields();
    });
}

/**
 * Displays a hint when hovering over the disabled signup button, informing users that they need to fill all fields and accept the privacy policy to enable it.
 * The hint is hidden when the mouse leaves the button area.
 */
function initSignupButtonListeners() {
    document.getElementById("signup-button-wrapper").addEventListener("click", function() {
        if (document.getElementById("signup-button").disabled) {
            document.getElementById("signup-button-hint").querySelectorAll(".hint-line")[0].textContent = "All fields required.";
            document.getElementById("signup-button-hint").querySelectorAll(".hint-line")[1].textContent = "Accept privacy policy.";
            document.getElementById("signup-button-hint").classList.add("input-error-visible");
        }
    });
}