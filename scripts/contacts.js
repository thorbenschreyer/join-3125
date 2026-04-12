let contactUsers = [];
let currentBrakpointLetter = "";
let lastActiveDetailViewContact;
let currentID;
let addDialog;
let editDialog;
let mobileEdtMenu;

/**
 * Initializes the contact set
 * Retrieves the users
 * Sorts the users
 * Renders the list
 */
async function initContacts() {
  await getUserData();
  contactUsers = users;

  renderContactList();

  addDialog = registerDialog("add-contact-dialog", 1000, "closing");
  editDialog = registerDialog("edit-contact-dialog", 0);
  mobileEdtMenu = registerDialog("mobile-edit-delete-menu", 1000, "closing");
}

/**
 * Opens the contact's detail view
 * @param {Identifies the user} contactID 
 * @param {Index of the for loop} index 
 */
function openContactDetailview(contactID, index) {
  currentID = index;
  setDetailViewActiveColor(contactID);
  renderDetailContactInformation(index);
  let detailesContactView = document.getElementById("contact-detail-area");
  detailesContactView.classList.remove("back-to-contacts-unset");
}

/**
 * This function removes the normal class and replaces it with the active class.
 * It also saves the ID of the user who was previously clicked, then removes the active class and adds the normal class.
 * @param {The ID of the user who was clicked} contactID
 */
function setDetailViewActiveColor(contactID) {
  detailedUser = document.getElementById(contactID);
  detailedUser.classList.remove("contact");
  detailedUser.classList.add("contact-is-active");

  if (lastActiveDetailViewContact) {
    lastActiveUser = document.getElementById(lastActiveDetailViewContact);
    lastActiveUser.classList.remove("contact-is-active");
    lastActiveUser.classList.add("contact");
  }
  lastActiveDetailViewContact = contactID;
}

/**
 * Renders the user
 * @param {the user to be rendered} index 
 */
function renderDetailContactInformation(index) {
  detailContact = document.getElementById("contact-details");
  const initials = contactUsers[index].initials;
  const name = contactUsers[index].name;
  const email = contactUsers[index].email;
  const phoneNumber = contactUsers[index].phone;
  const color = contactUsers[index].userColor;
  detailContact.innerHTML = renderDetailedContactsTemplate(
    initials,
    name,
    email,
    phoneNumber,
    color
  );

  detailContact.classList.remove("animate-in");
  void detailContact.offsetWidth;
  detailContact.classList.add("animate-in");
}

/**
 * Iterates through the UserArray and checks whether the first letter of the current name matches the current one
 * If NO, it creates a hyphen with that letter and saves it
 * If YES, it renders only the contact until a new first letter appears
 */
function renderContactList() {
  let contacts = document.getElementById("displayed-contacts");
  contacts.innerHTML = "";
  currentBrakpointLetter = "";

  for (let index = 0; index < contactUsers.length; index++) {
    let firstLetter = contactUsers[index].name.split(" ")[0][0];

    if (firstLetter != currentBrakpointLetter) {
      contactBraker(firstLetter);
      currentBrakpointLetter = firstLetter;
      renderContact(index);
    } else {
      renderContact(index);
    }
  }
}

/**
 * Calls the separator template function
 * @param {The current letter for the hyphen} firstLetter
 */
function contactBraker(firstLetter) {
  let contacts = document.getElementById("displayed-contacts");
  contacts.innerHTML += contactBrakerTemplate(firstLetter);
}

/**
 * Calls the separator template function
 * @param {The current letter for the hyphen} firstLetter
 */
function renderContact(index) {
  let contacts = document.getElementById("displayed-contacts");

  const initials = contactUsers[index].initials;
  const name = contactUsers[index].name;
  const email = contactUsers[index].email;
  const color = contactUsers[index].userColor;
  contacts.innerHTML += renderContactTemplate(index, initials, name, email, color);
}

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
 * Takes us back to the contacts. The "isActiv" status is also removed
 */
function backToContacts() {
  let detailesContactView = document.getElementById("contact-detail-area");
  detailesContactView.classList.add("back-to-contacts-unset");
  document.getElementById("mobile-edit-delete-menu").close();

  lastActiveUser = document.getElementById(lastActiveDetailViewContact);
  lastActiveUser.classList.remove("contact-is-active");
  lastActiveUser.classList.add("contact");
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

/**
 * Creates a new user
 */
async function addNewContact() {
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
}

/**
 * Opens edit mode and sets the values
 */
function editUser() {
  let userInitials = document.getElementById("edit-contact-initials")
  let editName = document.getElementById("edit-name")
  let editMail = document.getElementById("edit-email")
  let editPhone = document.getElementById("edit-phone")

  userInitials.innerText = contactUsers[currentID].initials
  userInitials.style.backgroundColor = contactUsers[currentID].userColor
  editName.value = contactUsers[currentID].name
  editMail.value = contactUsers[currentID].email
  editPhone.value = contactUsers[currentID].phone
}

/**
 * Saves the edited values
 */
async function saveEditValues() {
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