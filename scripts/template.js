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
  <a class="menu-hover" id="contacts" onclick="loadHtmlPage('content', './templates/contacts.html'), toggleIsActive('contacts', 'contacts_img')"><img id="contacts_img" src="./assets/icons/contacts_grey.png" alt="Contacts">Contacts</a>
    `;
}

function helpAndLogout() {
  return `
        <img class="help-img display-none" onclick="loadHtmlPage('content','./footerpages/help.html'), removeActiveState()" src='./assets/icons/help.png' alt='Helppage'>
        <button id="initials-menu" class="initials-menu" onclick="openCloseHeaderMenu()"> </button> 
    `;
}
  
function smallTask() {
  return `
    <div id="board-small-task" class="board-small-task">
        <p id="small-task-category" class="small-task-category">User Story</p>
        <h3  id="small-task-title" class="small-task-title">Kochwelt Page & Recipe Recommender</h3>
        <p id="small-task-description" class="small-task-description">Build start page with recipe recommendation...</p>
        <div id="subtasks-with-subtasks-bar-container" class="subtasks-with-subtasks-bar-container">
            <div id="subtasks-bar-container" class="subtasks-bar-container">
                <div id="subtasks-bar" class="subtasks-bar">
                </div>
            </div>
            <p>1/2 Subtasks</p>
        </div>
        <div id="small-task-user-badge-and-priority-container" class="small-task-user-badge-and-priority-container">
            <div id="small-task-user-badges-container" class="small-task-user-badges-container">
                <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: #6E52FF">MS</div>
                <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: #d07513">MS</div>
                <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: #1fc22a">MS</div>
            </div>
            <img id="task-prio-medium-color" class="task-prio-img" src="../assets/icons/medium_prio_color.svg" alt="">
        </div>
    </div>
  `
}