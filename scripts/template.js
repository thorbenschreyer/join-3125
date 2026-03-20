function notLoggedInNavigation() {
  return `
    <a class="menu-hover" href="login.html"><img class="menu-hover" src="./assets/icons/login.png" alt="Log In">Log In</a>`;
}

function LoggedInNavigation() {
  return `
      <a class="menu-hover" id="summary" onclick="loadHtmlPage('content', './templates/summary.html'), toggleIsActive('summary', 'summary_img')"><img id="summary_img" class="menu-hover" src="./assets/icons/summary_grey.png" alt="Summary">Summary</a>
  <a class="menu-hover" id="add_task" onclick="loadHtmlPage('content', './templates/add_tasks.html'), toggleIsActive('add_task', 'add_task_img')"><img id="add_task_img" class="menu-hover" src="./assets/icons/add_task_grey.png" alt="Add Task">Add Task</a>
  <a class="menu-hover" id="board" onclick="loadHtmlPage('content', './templates/board.html'), toggleIsActive('board', 'board_img')"><img id="board_img" class="menu-hover" src="./assets/icons/board_grey.png" alt="Board">Board</a>
  <a class="menu-hover" id="contacts" onclick="loadHtmlPage('content', './templates/contacts.html'), toggleIsActive('contacts', 'contacts_img')"><img id="contacts_img" class="menu-hover" src="./assets/icons/contacts_grey.png" alt="Contacts">Contacts</a>
    `;
}

/** <!-- TODO ${initials} anstelle TS --> */
function helpAndLogout() {
  return `
        <img class="help-img display-none" onclick="loadHtmlPage('content','./footerpages/help.html'), removeActiveState()" src='./assets/icons/help.png' alt='Helppage'>
        <button class="initials-menu" onclick="openCloseHeaderMenu()">TS</button> 
    `;
}
