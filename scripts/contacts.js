const BASEURL =
  "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/users.json";
let contacts = [];

async function initContacts() {
  contacts = await getContacts();
  console.log(contacts[0].name);
  renderContacts();
}

async function getContacts() {
  const response = await fetch(BASEURL);
  const responseJson = await response.json();

  if (!responseJson) return [];

  return Object.entries(responseJson).map(([id, contact]) => ({
    id,
    ...contact,
  }));
}

function renderContacts() {
  const contacts = document.getElementById("displayed-contacts");

  for (let index = 0; index < contacts.length; index++) {
    const initails = contacts[index].name
      .split(" ")
      .map((word) => word[0])
      .join("");
    const name = contacts[index].name;
    const email = contacts[index].email;

    renderContact(index, initails, name, email);
  }
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
