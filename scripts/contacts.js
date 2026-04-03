let users1 = [];
let currentBrakpointLetter = "";
let lastActiveDetailViewContact;
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
  sortContachts();
  renderContactList();
  addDialog = registerDialog("add-contact-dialog");
  editDialog = registerDialog("edit-contact-dialog");
  mobileEdtMenu = registerDialog("mobile-edit-delete-menu");
}

function openContactDetailview(contactID, index) {
  setDetailViewActiveColor(contactID)
  renderDetailContactInformation(index)
  let detailesContactView = document.getElementById("contact-detail-area")
  detailesContactView.classList.remove("back-to-contacts-unset")
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
  const initials = users1[index].name
    .split(" ")
    .map((word) => word[0])
    .join("");
  const name = users1[index].name;
  const email = users1[index].email;
  const phoneNumber = +49123456789
  detailContact.innerHTML = renderDetailedContactsTemplate(initials, name, email, phoneNumber)

  detailContact.classList.remove("animate-in"); // reset
  void detailContact.offsetWidth; // force reflow
  detailContact.classList.add("animate-in"); // animation starten
}

/**
 * Sorts the user array by first name
 */
function sortContachts() {
  users1.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Iterates through the UserArray and checks whether the first letter of the current name matches the current one
 * If NO, it creates a hyphen with that letter and saves it
 * If YES, it renders only the contact until a new first letter appears
 */
function renderContactList() {
  for (let index = 0; index < users1.length; index++) {
    let firstLetter = users1[index].name.split(" ")[0][0];

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

  const initails = users1[index].name
    .split(" ")
    .map((word) => word[0])
    .join("");
  const name = users1[index].name;
  const email = users1[index].email;

  contacts.innerHTML += renderContactTemplate(index, initails, name, email);
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

async function getUserData() {
  users1 = [];
  let allUserData = await fetch(`${BASE_URL}users.json`);
  let allUserDataToJson = await allUserData.json();
  let UserKeysArray = Object.keys(allUserDataToJson);

  for (let userIndex = 0; userIndex < UserKeysArray.length; userIndex++) {
    users1.push({
      id: UserKeysArray[userIndex],
      name: allUserDataToJson[UserKeysArray[userIndex]].name,
      email: allUserDataToJson[UserKeysArray[userIndex]].email,
      password: allUserDataToJson[UserKeysArray[userIndex]].password,
    });
  }
}

function backToContacts() {
  let detailesContactView = document.getElementById("contact-detail-area")
  detailesContactView.classList.add("back-to-contacts-unset")

  lastActiveUser = document.getElementById(lastActiveDetailViewContact);
  lastActiveUser.classList.remove("contact-is-active");
  lastActiveUser.classList.add("contact");
}