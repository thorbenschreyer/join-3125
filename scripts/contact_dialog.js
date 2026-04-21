
/**
 * This function registers a dialog so that it can be closed by clicking outside of it.
 * @param {The ID of the desired dialog window} dialogID
 * @returns The dialog, which can then be manipulated (e.g., opened and closed)
 */
function registerDialog(dialogID, delay, classforSlide) {
  const dialog = document.getElementById(dialogID);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      if (classforSlide) {
        dialog.classList.add(classforSlide);
      }

      setTimeout(() => {
        dialog.close();
        if (classforSlide) {
          dialog.classList.remove(classforSlide);
        }
      }, delay);
    }
  });
  return dialog;
}

/**
 * Opens the dialog
 * @param {enter the name here if there are multiple dialogs} dialogName
 */
function openDialog(dialogName) {
  dialogName.showModal();
}

/**
 * Closes the dialog with a delay to allow for an animation
 * @param {the dialog to be closed} dialog
 * @param {delay duration} delay
 */
function closeDialog(dialog, delay = 300) {
  dialog.classList.add("closing");

  setTimeout(() => {
    dialog.close();
    dialog.classList.remove("closing");
  }, delay);
}

/**
 * Creates a new user
 */
async function addNewContact(errorText) {
  let name = document.getElementById("contact-name").value;
  let email = document.getElementById("contact-email").value;
  let phone = document.getElementById("contact-phone").value;

  let newUser = {
    name: name,
    email: email,
    phone: phone,
    password: "password",
    avatarColor: userColor[Math.floor(Math.random() * userColor.length)],
  };

  await fetch(`${fireBaseUrl}users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  await getUserData();
  contactUsers = users;
  closeDialog(addDialog, 400);
  initContacts();
  showSuccessMessage();
  errorText.innerText = "";
}

/**
 * Opens edit mode and sets the values
 */
function editUser() {
  let userInitials = document.getElementById("edit-contact-initials");
  let editName = document.getElementById("edit-name");
  let editMail = document.getElementById("edit-email");
  let editPhone = document.getElementById("edit-phone");

  userInitials.innerText = contactUsers[currentID].initials;
  userInitials.style.backgroundColor = contactUsers[currentID].userColor;
  editName.value = contactUsers[currentID].name;
  editMail.value = contactUsers[currentID].email;
  editPhone.value = contactUsers[currentID].phone;
}

/**
 * Saves the edited values
 */
async function saveEditValues(errorEditText) {
  let name = document.getElementById("edit-name").value;
  let email = document.getElementById("edit-email").value;
  let phone = document.getElementById("edit-phone").value;

  let userId = contactUsers[currentID].id;

  let updatedUser = {
    name: name,
    email: email,
    phone: phone,
  };

  await fetch(`${fireBaseUrl}users/${userId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  });

  await getUserData();
  contactUsers = users;

  closeDialog(editDialog, 400);
  initContacts();
  renderDetailContactInformation(currentID);
  errorEditText.innerText = "";
}

/**
 * Displays the "Created successfully" dialog
 */
function showSuccessMessage() {
  const toast = document.getElementById("success-toast");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/**
 * 
 * This function monitors the submission of the form for AddUser() and ensures that all data is correct. 
 * If this is not the case, a corresponding error message is displayed. 
 * @param {form submit} event 
 * @returns the error description
 */
async function handleSubmit(event) {
  event.preventDefault();

  const errorText = document.getElementById("add-error-text");
  const form = event.target;

  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();

  const error = validateContact(name, email, phone);

  if (error) {
    errorText.innerText = error;
    return;
  }

  errorText.innerText = "";

  await addNewContact(errorText);
  form.reset();

  document.getElementById("add-contact-button").disabled = true;
}



/**
 * This function monitors the submission of the form for saveEditUser() and ensures that all data is correct. 
 * If this is not the case, a corresponding error message is displayed. 
 * @param {form submit} event 
 * @returns the error description
 */
async function handleEditSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("edit-name").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  const errorEditText = document.getElementById("edit-error-text");

  const editError = validateContact(name, email, phone);
  if (editError) {
    errorEditText.innerText = editError;
    return;
  }

  await saveEditValues(errorEditText);
}

/**
 * This function checks whether 
 * @param {document.getElementById of handleSubmit or handleEditSubmit} name 
 * @param {document.getElementById of handleSubmit or handleEditSubmit} email 
 * @param {document.getElementById of handleSubmit or handleEditSubmit} phone 
 * have been entered correctly. If not 
 * @returns the error message 
 */
function validateContact(name, email, phone) {
  const nameRegex = /^[A-Za-zÄÖÜäöüß\s'\-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.(de|com|org|net)$/;
  const phoneRegex = /^[0-9+\s()\-]{6,20}$/;

  if (!nameRegex.test(name)) return "Invalid name. Only letters and hyphens allowed.";
  if (!emailRegex.test(email)) return "Invalid email. “@” and valid domain required.";
  if (!phoneRegex.test(phone)) return "Invalid phone number. Digits only.";

  return null;
}

function checkContactFormValidity() {
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const button = document.getElementById("add-contact-button");

  if (!name || !email || !phone) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}

function removeText() {
  const name = document.getElementById("contact-name").value = "";
  const email = document.getElementById("contact-email").value = "";
  const phone = document.getElementById("contact-phone").value = "";
}


/**
 * Deletes the user
 */
async function deleteUser() {
  let userId = contactUsers[currentID].id;

  await fetch(`${fireBaseUrl}users/${userId}.json`, {
    method: "DELETE",
  });

  await getUserData();
  contactUsers = users;

  document.getElementById("contact-details").innerHTML = "";
  initContacts();
}

/**
 * Deletes the user and returns to the contacts
 */
async function deleteUserMobile() {
  let userId = contactUsers[currentID].id;

  await fetch(`${fireBaseUrl}users/${userId}.json`, {
    method: "DELETE",
  });

  await getUserData();
  contactUsers = users;

  backToContacts();
  initContacts();
}

/**
 * Deletes the user in the edit dialog
 */
async function deleteUserInEditDialog() {
  let userId = contactUsers[currentID].id;

  await fetch(`${fireBaseUrl}users/${userId}.json`, {
    method: "DELETE",
  });

  await getUserData();
  contactUsers = users;

  document.getElementById("contact-details").innerHTML = "";

  closeDialog(editDialog, 400);
  initContacts();
}

