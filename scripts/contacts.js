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
    color,
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
  contacts.innerHTML += renderContactTemplate(
    index,
    initials,
    name,
    email,
    color,
  );
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
