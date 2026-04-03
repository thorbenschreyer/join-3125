let ContactUsers = [];
let currentBrakpointLetter = "";
let lastActiveDetailViewContact;
let addDialog;
let editDialog;

/**
 * Initializes the contact set
 * Retrieves the users
 * Sorts the users
 * Renders the list
 */
async function initContacts() {
  ContactUsers = JSON.parse(localStorage.getItem("users"));
  renderContactList();
  addDialog = registerDialog("add-contact-dialog");
  editDialog = registerDialog("edit-contact-dialog");
}

function openContactDetailview(contactID, index) {
  setDetailViewActiveColor(contactID)
  renderDetailContactInformation(index)
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

function renderDetailContactInformation(index) {
  detailContact = document.getElementById("contact-details")
  const initials = ContactUsers[index].initials
  const name = ContactUsers[index].name;
  const email = ContactUsers[index].email;
  const phoneNumber = +49123456789
  detailContact.innerHTML = renderDetailedContactsTemplate(initials, name, email, phoneNumber)

  detailContact.classList.remove("animate-in"); // reset
  void detailContact.offsetWidth; // force reflow
  detailContact.classList.add("animate-in"); // animation starten
}

/**
 * Sorts the user array by first name
 */
function sortContacts(contacts) {
  contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Iterates through the UserArray and checks whether the first letter of the current name matches the current one
 * If NO, it creates a hyphen with that letter and saves it
 * If YES, it renders only the contact until a new first letter appears
 */
function renderContactList() {
  for (let index = 0; index < ContactUsers.length; index++) {
    let firstLetter = ContactUsers[index].name.split(" ")[0][0];

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

  const initials = ContactUsers[index].initials
  const name = ContactUsers[index].name;
  const email = ContactUsers[index].email;

  contacts.innerHTML += renderContactTemplate(index, initials, name, email);
}

/**
 * This function registers a dialog so that it can be closed by clicking outside of it.
 * @param {The ID of the desired dialog window} dialogID
 * @returns The dialog, which can then be manipulated (e.g., opened and closed)
 */
function registerDialog(dialogID) {
  const dialog = document.getElementById(dialogID);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  return dialog;
}

function openDialog(dialogName) {
  dialogName.showModal();
}

function closeDialog(dialogName) {
  dialogName.close();
}
