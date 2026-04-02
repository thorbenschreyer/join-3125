let users1 = [];
let currentBrakpointLetter = "";
let addDialog
let editDialog

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
  addDialog = registerDialog("add-contact-dialog")
  editDialog = registerDialog("edit-contact-dialog")
}

function registerDialog(dialogID) {
  const dialog = document.getElementById(dialogID);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  return dialog
}

async function getUserData() {
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


function openDialog(dialogName) {
  dialogName.showModal()
}

function closeContactDialog() {

}