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
    initUserNameFormFilledListeners();
    initUserEmailFormFilledListeners();
    initUserPasswordFormFilledListeners();
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
function initresetEmailInputStyleListener() {
    for (let inputIndex = 0; inputIndex < FORM_INPUT_FIELDS.length; inputIndex++) {
        FORM_INPUT_FIELDS[inputIndex].addEventListener("focus", function() {
            getUserData();
            USER_EMAIL.classList.remove("red-border");
            USER_CONFIRM_PASSWORD.classList.remove("red-border");
            INPUT_ERROR.classList.remove("input-error-visible");
            SIGNUP_BUTTON_HINT.classList.remove("input-error-visible");
        })
    }
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

/**
 * Tracks whether the name field is filled and updates the signup button state accordingly.
 *
 * Keeping this check separate allows the form completion state to react immediately
 * when the user starts typing or clears the field again.
 */
function initUserNameFormFilledListeners() {
    USER_NAME.addEventListener("input", function() {
        if (USER_NAME.value.trim().length > 0) {
            isNameFilled = true;
        } else if (USER_NAME.value.length == 0) {
            isNameFilled = false;
        }
        checkFormRequiredFields();
    })
}

/**
 * Tracks whether the email field is filled and keeps the signup button state in sync.
 *
 * This separates basic completion tracking from later format validation
 * so the form can respond immediately without mixing different concerns.
 */
function initUserEmailFormFilledListeners() {
    USER_EMAIL.addEventListener("input", function() {
        if (USER_EMAIL.value.length > 0) {
            isEmailFilled = true;
        } else if (USER_EMAIL.value.length == 0) {
            isEmailFilled = false;
        }
        checkFormRequiredFields();
    })
}

/**
 * Tracks whether both password fields are filled and updates the signup button state.
 *
 * The listeners only monitor completion so users can receive immediate form feedback
 * before password matching is validated during submission.
 */
function initUserPasswordFormFilledListeners() {
    USER_PASSWORD.addEventListener("input", function() {
        if (USER_PASSWORD.value.length > 0) {
            isPasswordFilled = true;
        } else if (USER_PASSWORD.value.length == 0) {
            isPasswordFilled = false;
        }
        checkFormRequiredFields();
    })
    USER_CONFIRM_PASSWORD.addEventListener("input", function() {
        if (USER_CONFIRM_PASSWORD.value.length > 0) {
            isConfirmPasswordFilled = true;
        } else if (USER_CONFIRM_PASSWORD.value.length == 0) {
            isConfirmPasswordFilled = false;
        }
        checkFormRequiredFields();
    })
}

/**
 * Tracks whether the privacy policy has been accepted and updates the signup button state.
 *
 * The checkbox is part of the required signup criteria, so its state must be
 * reflected immediately before submission becomes available.
 */
function initPrivacyPolicyCheckboxListener() {
    PRIVACY_POLICY_CHECKBOX.addEventListener("change", function() {
        if (PRIVACY_POLICY_CHECKBOX.checked === true) {
            isPrivatePolicyChecked = true;
        } else if (PRIVACY_POLICY_CHECKBOX.checked === false) {
            isPrivatePolicyChecked = false;
        }
        checkFormRequiredFields();
    });
}

/**
 * Displays a hint when hovering over the disabled signup button, informing users that they need to fill all fields and accept the privacy policy to enable it.
 * The hint is hidden when the mouse leaves the button area.
 */
function initSignupButtonListeners() {
    SIGNUP_BUTTON_WRAPPER.addEventListener("click", function() {
        if (SIGNUP_BUTTON.disabled) {
            SIGNUP_BUTTON_HINT.textContent = "Fill all fields and accept the privacy policy";
            SIGNUP_BUTTON_HINT.classList.add("input-error-visible");
        }
    });
}