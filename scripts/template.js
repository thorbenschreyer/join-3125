function notLoggedInNavigation() {
  return `
          <a class="menu-hover" href="login.html"
        ><img
          class="menu-hover"
          src="./assets/icons/login.png"
          alt="Log In"
        />Log In</a
      >`;
}

function LoggedInNavigation() {
  return `
      <a class="menu-hover" id="summary" onclick="loadSummaryPage(), toggleIsActive('summary', 'summary_img')"><img id="summary_img" src="./assets/icons/summary_grey.png" alt="Summary">Summary</a>
  <a class="menu-hover" id="add_task" onclick="loadAddTaskPage()"><img id="add_task_img" src="./assets/icons/add_task_grey.png" alt="Add Task">Add Task</a>
  <a class="menu-hover" id="board" onclick="loadHtmlPage('content', './templates/board.html'), toggleIsActive('board', 'board_img')"><img id="board_img" src="./assets/icons/board_grey.png" alt="Board">Board</a>
  <a class="menu-hover" id="contacts" onclick="loadHtmlPage('content', './templates/contacts.html'), initContacts(), toggleIsActive('contacts', 'contacts_img')"><img id="contacts_img" src="./assets/icons/contacts_grey.png" alt="Contacts">Contacts</a>
    `;
}

function helpAndLogout() {
  return `
        <img class="help-img display-none" onclick="loadHtmlPage('content','./footerpages/help.html'), removeActiveState()" src='./assets/icons/help.png' alt='Helppage'>
        <button id="initials-menu" class="initials-menu" onclick="openCloseHeaderMenu()"> </button> 
    `;
}

function renderContactTemplate(index, initails, name, email) {
  return `
        <div id="contact-${index}" class="contact">
          <div class="contact-initials">
            <p>${initails}</p>
          </div>
          <div class="contact-name-email">
            <p>${name}</p>
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>
        `;
}

function contactBrakerTemplate(letter) {
  return`
        <div class="contact-breaker">
            <p>${letter}</p>
            <hr />
        </div>
  `
}