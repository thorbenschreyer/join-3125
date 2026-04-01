const BASEURL =
  "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/users.json";
let users1 = [];
let currentBrakpointLetter = ""

async function initContacts() {
  await getUserData();
  console.log(users1[0].name);
  sortContachts();
  renderContactList();
}


async function getUserData() {
    let allUserData = await fetch(`${BASE_URL}users.json`);
    let allUserDataToJson = await allUserData.json(); 
    let UserKeysArray = Object.keys(allUserDataToJson);

    for (let userIndex = 0; userIndex < UserKeysArray.length; userIndex++) {
        users1.push(
            {
                id : UserKeysArray[userIndex],
                name : allUserDataToJson[UserKeysArray[userIndex]].name,
                email : allUserDataToJson[UserKeysArray[userIndex]].email,
                password : allUserDataToJson[UserKeysArray[userIndex]].password
            }
        )
    }
}

function sortContachts () {
  users1.sort((a, b) => a.name.localeCompare(b.name));
}

function renderContactList() {
  for (let index = 0; index < users1.length; index++) {
    let firstLetter = users1[index].name.split(" ")[0][0]
  if ( firstLetter != currentBrakpointLetter) {
    contactBraker(firstLetter)
    currentBrakpointLetter = firstLetter
    renderContact(index)
    
  } else {
    renderContact(index)
  }
   }
}

function contactBraker(firstLetter) {
  let contacts = document.getElementById("displayed-contacts");
  contacts.innerHTML += contactBrakerTemplate(firstLetter)
}


function renderContact(index) {
  let contacts = document.getElementById("displayed-contacts");

    const initails = users1[index].name.split(" ").map((word) => word[0]).join("");
    const name = users1[index].name;
    const email = users1[index].email;

    contacts.innerHTML += renderContactTemplate(index, initails, name, email);
}

/**
 * Allows you to edit a user
 * @param {The ID to be edited} id 
 * @param {The object to be uploaded} updatedData 
 */
async function updateContact(id, updatedData) {
  await fetch(
    `https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    },
  );

  await initContacts(); // Kontakte neu laden
}

/**
 * Allows you to upload a contact 
 * @param {object containing the contact data} contactData 
 */
async function addContact(contactData) {
  await fetch(
    "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/users.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    },
  );

  await initContacts(); // Kontakte neu laden
}
