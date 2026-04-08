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
  <a class="menu-hover" id="contacts" onclick="openContactsPage(), toggleIsActive('contacts', 'contacts_img')"><img id="contacts_img" src="./assets/icons/contacts_grey.png" alt="Contacts">Contacts</a>
    `;
}

function helpAndLogout() {
  return `
        <img class="help-img display-none" onclick="loadHtmlPage('content','./footerpages/help.html'), removeActiveState()" src='./assets/icons/help.png' alt='Helppage'>
        <button id="initials-menu" class="initials-menu" onclick="openCloseHeaderMenu()"> </button> 
    `;
}
  
function smallTask(element, closedSubtasksLenght, id) {
  return `
    <div onclick="openTaskDetails(${id})" draggable="true" ondragstart="startDragging(event, ${element['id']})" ondragend="stopDragging(event)" id="board-small-task-${id}" class="board-small-task">
        <p id="small-task-category-${id}" class="small-task-category-${element.categoryColor}">${element.category}</p>
        <h3  id="small-task-title-${id}" class="small-task-title">${element.title}</h3>
        <p id="small-task-description-${id}" class="small-task-description">${element.description}</p>
        <div id="subtasks-with-subtasks-bar-container-${id}" class="subtasks-with-subtasks-bar-container">
            <div id="subtasks-bar-container-${id}" class="subtasks-bar-container">
                <div id="subtasks-bar-${id}" class="subtasks-bar">
                </div>
            </div>
            <p>${closedSubtasksLenght}/${element.subtasks.length} Subtasks</p>
        </div>
        <div id="small-task-user-badge-and-priority-container-${id}" class="small-task-user-badge-and-priority-container">
            <div id="small-task-user-badges-container-${id}" class="small-task-user-badges-container">
                <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: #6E52FF">MS</div>
                <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: #d07513">MS</div>
                <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: #1fc22a">MS</div>
            </div>
            <img id="task-prio-image-${id}" class="task-prio-img" src="../assets/icons/${element.priority}_prio_color.png" alt="">
        </div>
    </div>
    `;
}

function renderNameBadges(initials, badgeColor) {
  return`
  <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: ${badgeColor}">${initials}</div>
  `;
}

function renderDialogTask(task) {
  return `
  <div id="dialog-board-task" class="dialog-board-task">
    <div id="dialog-task-category-and-close-x-container" class="dialog-task-category-and-close-x-container">
      <p id="dialog-task-category" class="dialog-task-category">${task.category}</p>
      <div onclick="closeAddTaskOverlay()" id="close-dialog-x-wrapper" class="close-dialog-x-wrapper">
        <img src="./assets/icons/close.png" alt="Close Dialog" class="close-dialog-x-default">
        <img src="./assets/icons/close_hover_light.png" alt="Close Dialog" class="close-dialog-x-hover">
        <img src="./assets/icons/close_hover_blue.png" alt="Close Dialog" class="close-dialog-x-active">
      </div>
    </div>
    <h3  id="dialog-task-title" class="dialog-task-title">${task.title}</h3>
    <p id="dialog-task-description" class="dialog-task-description">${task.description}</p>
    <div id="dialog-due-date" class="dialog-due-date">
      <p class="fix-width-120px">Due date:</p>
      <p>${task.dueDate}</p>
    </div>
    <div id="dialog-task-priority" class="dialog-task-priority">
      <p class="fix-width-120px">Priority:</p>
      <div id="dialog-priority-container" class="dialog-priority-container">
        <p>${task.priority}</p>
        <img id="task-prio" class="dialog-task-prio-img" src="./assets/icons/${task.priority}_prio_color.png" alt="${task.priority} priority Image">
      </div>
    </div>
    <p class="fix-width-120px dialog-assigned-to-heading">Assigned To:</p>
    <div id="dialog-task-user-badges" class="dialog-task-user-badges">
    </div>
    <div id="dialog-task-subtasks" class="dialog-task-subtasks">
      <p id="dialog-task-subtasks-header" class="dialog-task-subtasks-header">Subtasks:</p>
      <div id="dialog-task-subtask-container" class="dialog-task-subtask-container">
      </div>
    </div>
  </div>
  `;
}

function renderNameBadgesAndNames(name, initials, badgeColor) {
  return `
  <div id="dialog-dropdown-user-badge-with-name-container" class="dialog-dropdown-user-badge-with-name-container">
    <div class="dropdown-user-badge dialog-task-dropdown-user-badge" style="background-color: ${badgeColor}">${initials}</div>
    <p class="assigned-to-name">${name}</p>
  </div>
  `;
}

function renderPlaceholderTemplate(emptyTaskBar) {
  return `
  <div class="placeholder-task">
    <p>No Tasks ${emptyTaskBar}</p>
  </div>
  `;
}

function renderContactTemplate(index, initails, name, email, color) {
  return `
        <div onclick="openContactDetailview('contact-${index}', ${index})" id="contact-${index}" class="contact">
          <div class="contact-initials" style="background-color:${color}">
            <p>${initails}</p>
          </div>
          <div class="contact-name-email">
            <p>${name}</p>
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>
        `;
}

function renderDetailedContactsTemplate(initials, name, email, phoneNumber, color) {
  return `
  <div>
        <div class="contact-edit">
          <div class="contact-detail-initials" ">
            <p style="background-color:${color}" class="inital-style">${initials}</p>
          </div>
          <div>
            <p class="contact-detail-name">${name}</p>
            <div class="contact-btn">
              <p onclick="openDialog(editDialog), editUser()" class="contact-btn contact-btn-edit">
                <img src="./assets/icons/edit.png" alt="" />Edit
              </p>
              <p onclick="deleteUser()" class="contact-btn contact-btn-delete">
                <img src="./assets/icons/delete.png" alt="" />Delete
              </p>
            </div>
          </div>
        </div>

        <div>
          <p class="contact-detail-inforamtion">Contact Information</p>
          <p class="contact-detail-haeder">Email</p>
          <a href="mailto:${email}">${email}</a>
          <p class="contact-detail-haeder">Phone</p>
          <p>${phoneNumber}</p>
        </div>
      </div>
  `;
}

function contactBrakerTemplate(letter) {
  return `
        <div class="contact-breaker">
            <p>${letter}</p>
            <hr />
        </div>
  `;
}
