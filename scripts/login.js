let contacts = [
    {
        name: "Heinzi",
        email: "heinzi.bicek@gmx.at",
        password: "123",
        telephone: "+1234567890"
    },
    {
        name: "Laura",
        email: "laura.karnberger@gmail.com",
        password: "Lotta2000",
    }
];

let emailData = document.getElementById("email-input-login");
let passwordData = document.getElementById("password-input-login");


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
    } else {
        buttonsContainer.classList.add("button-margin-top-if-error");
        errorContainer.classList.remove("d-none");
    }
}

function hideErrorOnInput() {
    const errorContainer = document.getElementById("container-error-message");
    const buttonsContainer = document.getElementById("container-login-buttons");

    errorContainer.classList.add("d-none");
    buttonsContainer.classList.remove("button-margin-top-if-error");
}


