const fireBaseUrl =
  "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/";
const emailData = document.getElementById("email-input-login");
const passwordData = document.getElementById("password-input-login");
const inputImg = document.getElementById("input-password-img");
let initialViewportHeight = window.visualViewport.height;

let wasEmpty = true;
let userColor = [];

/**
 * Initialization of event listeners after the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  const passInput = document.getElementById("password-input-login");
  if (passInput) {
    passInput.addEventListener("input", checkFirstInput);
  }
  window.addEventListener("load", removeMobileLogo);
}

/**
 * Handles the login form submission, checks user credentials, and manages UI feedback.
 * Redirects to the main page on successful login, or shows an error message on failure.
 * @param {Event} event - The form submit event.
 */
function loginSubmit(event) {
  event.preventDefault();
  let user = users.find((u) => u.email === emailData.value);
  const errorContainer = document.getElementById("container-error-message");
  const buttonsContainer = document.getElementById("container-login-buttons");
  if (user && user.password == passwordData.value) {
    buttonsContainer.classList.remove("button-margin-top-if-error");
    errorContainer.classList.add("d-none");
    emailData.value = "";
    passwordData.value = "";
    isloggedIn = true;
    localStorage.setItem("loginState", JSON.stringify(isloggedIn));
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
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
function guestLogin() {
  isloggedIn = true;
  isGuestLogin = true;
  localStorage.setItem("loginState", JSON.stringify(isloggedIn));
  localStorage.setItem("isGuestLogin", JSON.stringify(isGuestLogin));
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      email: "guestUser",
      id: "guestUserID",
      initials: "G",
      name: "Guest",
      password: "123",
    }),
  );
  window.location.href = "index.html";
}

/**
 * Logs out the current user, updates the login state, and redirects to the login page.
 */
function logOut() {
  isloggedIn = false;
  isGuestLogin = false;
  localStorage.setItem("loginState", JSON.stringify(isloggedIn));
  localStorage.setItem("isGuestLogin", JSON.stringify(isGuestLogin));
  window.location.href = "login.html";
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
    inputImg.src = "assets/icons/visibility_off.png";
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
    inputImg.src = "assets/icons/visibility_on.png";
    inputImg.alt = "Visibility On Icon";
  } else {
    passwordData.type = "password";
    inputImg.src = "./assets/icons/visibility_off.png";
    inputImg.alt = "Visibility Off Icon";
  }
}

/**
 * Resets the password input to type 'password', restores the lock icon,
 * and removes the visibility toggle event and pointer cursor.
 */
function removePasswordVisibility() {
  passwordData.type = "password";
  inputImg.src = "assets/icons/lock.png";
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
    const mobileLogo = document.querySelector(".main-logo-mobile");
    if (mobileLogo) {
      mobileLogo.remove();
    }
  }, 1200);
}

/**
 * Retrieves all persisted users from the backend and maps them into the local `users` array.
 *
 * The backend returns an object keyed by user IDs, which is transformed into
 * an array to match the structure used throughout the application.
 */
async function getUserData() {
  users = [];
  let allUserData = await fetch(`${fireBaseUrl}users.json`);
  let allUserDataToJson = await allUserData.json();
  let UserKeysArray = Object.keys(allUserDataToJson);

  for (let userIndex = 0; userIndex < UserKeysArray.length; userIndex++) {
    users.push({
      id: UserKeysArray[userIndex],
      name: allUserDataToJson[UserKeysArray[userIndex]].name,
      initials: allUserDataToJson[UserKeysArray[userIndex]].name
        .split(" ")
        .map((word) => word[0])
        .join(""),
      email: allUserDataToJson[UserKeysArray[userIndex]].email,
      password: allUserDataToJson[UserKeysArray[userIndex]].password,
      userColor: allUserDataToJson[UserKeysArray[userIndex]].avatarColor,
      phone: allUserDataToJson[UserKeysArray[userIndex]].phone,
    });
  }
  sortContacts(users);
}

/**
 * Sorts the user array by first name
 */
function sortContacts(contacts) {
  contacts.sort((a, b) => a.name.localeCompare(b.name));
}

userColor = [
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
