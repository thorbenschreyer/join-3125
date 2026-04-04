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
  contactUsers = JSON.parse(localStorage.getItem("users"));
  renderContactList();
  addDialog = registerDialog("add-contact-dialog", 1000, "closing");
  editDialog = registerDialog("edit-contact-dialog", 0);
  mobileEdtMenu = registerDialog("mobile-edit-delete-menu", 1000, "closing");
}

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

function openDialog(dialogName) {
  dialogName.showModal();
}

function closeDialog(dialog, delay = 300) {
  dialog.classList.add("closing");

  setTimeout(() => {
    dialog.close();
    dialog.classList.remove("closing");
  }, delay);
}

function backToContacts() {
  let detailesContactView = document.getElementById("contact-detail-area");
  detailesContactView.classList.add("back-to-contacts-unset");
  document.getElementById("mobile-edit-delete-menu").close();

  lastActiveUser = document.getElementById(lastActiveDetailViewContact);
  lastActiveUser.classList.remove("contact-is-active");
  lastActiveUser.classList.add("contact");
}

function deleteUser() {
  contactUsers.splice(currentID, 1);
  localStorage.setItem("users", JSON.stringify(contactUsers));
  detailContact = document.getElementById("contact-details");
  detailContact.innerHTML = "";
  initContacts();
}

function deleteUserMobile() {
  contactUsers.splice(currentID, 1);
  localStorage.setItem("users", JSON.stringify(contactUsers));
  backToContacts();
  initContacts();
}

function deleteUserInEditDialog() {
  contactUsers.splice(currentID, 1);
  localStorage.setItem("users", JSON.stringify(contactUsers));
  detailContact = document.getElementById("contact-details");
  detailContact.innerHTML = "";
  closeDialog(editDialog, 400)
  initContacts();
}

function addNewContact() {
  let name = document.getElementById("contact-name").value;
  let email = document.getElementById("contact-email").value;
  let phone = document.getElementById("contact-phone").value;
  contactUsers.push(
    {
      id: "Random ID",
      name: name,
      initials: name.split(" ").map((word) => word[0]).join(""),
      email: email,
      password: "password",
      userColor: userColor[Math.floor(Math.random() * userColor.length)],
      phone: phone
    }
  )
  sortContacts(contactUsers)
  localStorage.setItem("users", JSON.stringify(contactUsers));
  closeDialog(addDialog, 400)
  initContacts();
}