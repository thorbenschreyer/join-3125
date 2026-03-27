let emailData = document.getElementById("email-input-login");
let passwordData = document.getElementById("password-input-login");

let contacts = [
    {
        email: "test.email@example.com",
        name: "Heinzi",
        password: "123",
        phone: "+1234567890"
    },
    {
        email: "senel.tunc@gmail.com",
        name: "Tunc Senel",
        password: "senelsenel",
        phone: "+49 1776514789",
    },
    {
        email: "anna.mueller@gmail.com",
        name: "Anna Müller",
        password: "annamueller123",
        phone: "+49 17612345678",
    },
    {
        email: "max.schneider@gmail.com",
        name: "Max Schneider",
        password: "maxschneider123",
        phone: "+49 17598765432",
    },
    {
        email: "lisa.weber@gmail.com",
        name: "Lisa Weber",
        password: "lisaweber123",
        phone: "+49 17455667788",
    },
    {
        email: "tom.fischer@gmail.com",
        name: "Tom Fischer",
        password: "tomfischer123",
        phone: "+49 17333445566",
    }];

/**
 * Handles the login form submission, checks user credentials, and manages UI feedback.
 * @param {Event} event - The form submit event.
 */
function loginSubmit(event) {
    event.preventDefault();
    let user = contacts.find(u => u.email === emailData.value);
    console.log(user);
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
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "../index.html"
    } else {
        buttonsContainer.classList.add("button-margin-top-if-error");
        errorContainer.classList.remove("d-none");
    }
}

/**
 * Hides the error message and resets the login button margin when user starts typing.
 */
function hideErrorOnInput() {
    const errorContainer = document.getElementById("container-error-message");
    const buttonsContainer = document.getElementById("container-login-buttons");

    errorContainer.classList.add("d-none");
    buttonsContainer.classList.remove("button-margin-top-if-error");
}

/**
 * Logs in as a guest user and redirects to the main page.
 */
function guestLogin () {
    isloggedIn = true
    isGuestLogin = true
    localStorage.setItem('loginState', JSON.stringify(isloggedIn))
    localStorage.setItem('isGuestLogin', JSON.stringify(isGuestLogin));
    window.location.href = "../index.html"
  
}

/**
 * Logs out the current user and redirects to the login page.
 */
function logOut() {
    isloggedIn = false
    isGuestLogin = false
    localStorage.setItem('loginState', JSON.stringify(isloggedIn))
    localStorage.setItem('isGuestLogin', JSON.stringify(isGuestLogin));
    window.location.href = "../login.html"
}
