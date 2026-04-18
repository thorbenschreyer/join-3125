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

function smallTask(element, closedSubtasksLength, id) {
  return `
    <div onclick="openTaskDetails('${id}')" draggable="true" ondragstart="startDragging(event, '${id}')" ondragend="stopDragging(event)" id="board-small-task-${id}" class="board-small-task" ondrop="dropOnTask(event, '${id}')" ondragover="allowDrop(event)">
        <p id="small-task-category-${id}" class="small-task-category-${element.categoryColor}">${element.category}</p>
        <h3 id="small-task-title-${id}" class="small-task-title">${truncateText(element.title)}</h3>
        <p id="small-task-description-${id}" class="small-task-description">${truncateText(element.description)}</p>
        ${getSmallSubtasksHtml(element, closedSubtasksLength, id)}
        <div id="small-task-user-badge-and-priority-container-${id}" class="small-task-user-badge-and-priority-container">
            <div id="small-task-user-badges-container-${id}" class="small-task-user-badges-container"></div>
            <img id="task-prio-image-${id}" class="task-prio-img" src="./assets/icons/${element.priority}_prio_color.png" alt="">
        </div>
    </div>`;
}

function getSmallSubtasksHtml(element, closedLength, id) {
  if (!element.subtasks || element.subtasks.length === 0) return "";
  return `
    <div id="subtasks-with-subtasks-bar-container-${id}" class="subtasks-with-subtasks-bar-container">
        <div id="subtasks-bar-container-${id}" class="subtasks-bar-container">
            <div id="subtasks-bar-${id}" class="subtasks-bar"></div>
        </div>
        <p>${closedLength}/${element.subtasks.length} Subtasks</p>
    </div>`;
}

function renderNameBadges(initials, badgeColor) {
  return `
  <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: ${badgeColor}">${initials}</div>
  `;
}

function renderDialogTask(task) {
  return `
  <div id="dialog-board-task" class="dialog-board-task">
    <div id="dialog-task-category-and-close-x-container" class="dialog-task-category-and-close-x-container">
      <p id="dialog-task-category" class="dialog-task-category-${task.categoryColor}">${task.category}</p>
      <div onclick="closeOverlay('task')" id="close-dialog-x-wrapper" class="close-dialog-x-wrapper">
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
        <img id="task-prio" class="dialog-task-prio-img" src="./assets/icons/${task.priority.toLowerCase()}_prio_color.png" alt="${task.priority} priority Image">
      </div>
    </div id="dialog-assigned-to">
      <p class="fix-width-120px dialog-assigned-to-heading" id="dialog-assigned-to-heading">Assigned To:</p>
      <div id="dialog-task-user-badges" class="dialog-task-user-badges">
    </div>
    <div id="dialog-task-subtasks" class="dialog-task-subtasks">
      <p id="dialog-task-subtasks-header" class="dialog-task-subtasks-header">Subtasks:</p>
      <div id="dialog-task-subtask-container" class="dialog-task-subtask-container">
      </div>
    </div>
    <div class="dialog-delete-edit-container"> 
      <div class="dialog-delete-container" onclick="deleteTask(${task.id})">
        <div class="dialog-delete-img-wrapper">
          <img src="./assets/icons/delete.png" alt="delete Task" class="dialog-delete-img img-size-24px">
          <img src="./assets/icons/delete_blue.png" alt="delete Task" class="dialog-delete-hover-img img-size-24px">
        </div>
        <p class="dialog-delete-edit">Delete</p>
      </div>
      <div class="dialog-edit-container" onclick="openEditMode(${task.id})">
        <div class="dialog-edit-img-wrapper">
          <img src="./assets/icons/edit.png" alt="delete Task" class="dialog-edit-img img-size-24px">
          <img src="./assets/icons/edit_blue.png" alt="delete Task" class="dialog-edit-hover-img img-size-24px">
        </div>
        <p class="dialog-delete-edit">Edit</p>
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

function renderSubtaskDiv(subtask, currentState, index, taskId) {
  const hideDefault = currentState === "closed" ? "d-none" : "";
  const hideChecked = currentState === "closed" ? "" : "d-none";
  return `
    <div class="subtask-and-checkbox-container">
        <img onclick="toggleCheckbox(${index}, '${taskId}')" id="checkbox-default-${taskId}-${index}" class="checkbox-img ${hideDefault}" src="./assets/icons/checkbox_default.svg" alt="Unchecked">
        <img onclick="toggleCheckbox(${index}, '${taskId}')" id="checkbox-checked-${taskId}-${index}" class="checkbox-img ${hideChecked}" src="./assets/icons/checked.png" alt="Checked">
        <p>${subtask}</p>
    </div>
    `;
}

function buildEditForm(task) {
  return `
    <div class="close-edit-x-container">
      <div id="close-edit-x-wrapper" class="close-dialog-x-wrapper" onclick="closeOverlay('edit')">
          <img src="./assets/icons/close.png" alt="Close Dialog" class="close-dialog-x-default">
          <img src="./assets/icons/close_hover_light.png" alt="Close Dialog" class="close-dialog-x-hover">
          <img src="./assets/icons/close_hover_blue.png" alt="Close Dialog" class="close-dialog-x-active">
      </div>
    </div>
    

    <!-- FORMULAR -->
    <form id="edit-add-task-form" class="edit-add-task-form" return false;">
      <div class="task-column left-column">
          <div class="form-group">
              <label for="edit-task-title">
                  Title
              </label>
              <input id="edit-task-title" class="task-title form-input" type="text" placeholder="Enter a title" value="${task.title}">
              <span id="edit-title-input-error" class="input-error dNone"></span>
          </div>
          <div class="form-group">
              <label for="edit-task-description">
                  Description
              </label>
              <textarea id="edit-task-description" class="task-description form-input" rows="5" placeholder="Enter a Description">${task.description}</textarea>
          </div>  
          <div class="form-group">
              <label for="edit-task-due-date">
                  Due date
              </label>
              <input id="edit-task-due-date" class="task-due-date form-input" type="date" placeholder="dd/mm/yyyy" maxlength="10" value="${task.dueDate}">
              <img id="edit-calendar-icon" src="./assets/icons/calendar.png" class="task-input-icon" alt="calendar image">
              <span id="edit-due-date-input-error" class="input-error dNone"></span>
          </div>
      </div>
      <div class="task-column right-column">

          <!-- PRIORITY-BUTTONS -->
          <div class="form-group">
              <p class="edit-dialog-headings">Priority</p>
              <div class="priority-buttons">

                  <!-- PRIORITY-URGENT -->
                  <button id="edit-task-prio-urgent-btn" class="priority-btn" type="button" onclick="highlightSelectedPriority('urgent')">
                      <span class="prio-text">Urgent</span>
                      <img id="edit-task-prio-urgent-color" class="task-prio-img" src="./assets/icons/high_prio_color.svg" alt="">
                      <img id="edit-task-prio-urgent-white" class="task-prio-img dNone" src="./assets/icons/high_prio_white.svg" alt="">
                  </button>

                  <!-- PRIORITY-MEDIUM -->
                  <button id="edit-task-prio-medium-btn" class="priority-btn prio-medium" type="button" onclick="highlightSelectedPriority('medium')">
                      <span class="prio-text">Medium</span> 
                      <img id="edit-task-prio-medium-color" class="task-prio-img dNone" src="./assets/icons/medium_prio_color.svg" alt="">
                      <img id="edit-task-prio-medium-white" class="task-prio-img" src="./assets/icons/medium_prio_white.svg" alt="">
                  </button>

                  <!-- PRIORITY-LOW -->
                  <button id="edit-task-prio-low-btn" class="priority-btn" type="button" onclick="highlightSelectedPriority('low')">
                      <span class="prio-text">Low</span>
                      <img id="edit-task-prio-low-color" class="task-prio-img" src="./assets/icons/low_prio_color.svg" alt="">
                      <img id="edit-task-prio-low-white" class="task-prio-img dNone" src="./assets/icons/low_prio_white.svg" alt="">
                  </button>
              </div>
          </div>
          <div id="edit-assigned-to-form" class="form-group">
              <p class="edit-dialog-headings">Assigned to</p>
              <div id="edit-task-assigned-to-wrapper" class="edit-custom-dropdown"  onclick="stopEventBubbling(event)">
                  <div class="edit-custom-dropdown-toggle form-input" onclick="openEditAssignedDropdown()">
                      <input id="edit-task-assigned-to-input" class="edit-dropdown-search-input" type="text" placeholder="Select contacts to assign" oninput="filterAssignedUsers()">
                      <img id="edit-dropdown-arrow" class="edit-dropdown-arrow" src="./assets/icons/arrow_drop_down.svg" onclick="toggleEditAssignedDropdown(event)" alt="">
                      <img id="edit-dropup-arrow" src="./assets/icons/arrow_drop_up.svg" class="edit-dropdown-arrow dNone" onclick="toggleEditAssignedDropdown(event)" alt="">
                  </div>
                  <div id="edit-task-assigned-to-users" class="edit-custom-dropdown-users dNone">
                  </div>
                  <div id="edit-assigned-badges" class="edit-assigned-badges">
                  </div>
              </div>
          </div>
          <div class="form-group">
              <label for="edit-subtasks-input">Subtasks</label> 
              <input id="edit-subtasks-input" class="form-input task-input edit-subtask-input" type="text" placeholder="Add new subtask" oninput="checkEditSubtaskInput()">
              <img id="edit-clear-input-btn" class="edit-clear-input-icon dNone" src="./assets/icons/subtask_close.svg" alt="">
              <span id="edit-subtasks-vertical-divider" class="edit-subtasks-vertical-divider dNone">|</span>
              <img id="edit-add-subtask-btn" class="edit-add-subtask-icon dNone" src="./assets/icons/subtask_check.svg" alt="">
              <ul id="edit-subtasks-list" class="edit-subtasks-list">

              </ul>
          </div>
      </div>
      <div class="edit-succcess-btn-container">
        <button type="button" class="edit-success-button dark-button" id="success-edit-btn" onclick="saveEditedTask('${task.firebaseId}')">
          OK 
          <img id="edit-success-btn-icon" class="add-task-btn-icon" src="./assets/icons/check_light.png" alt="Checkmark icon">
        </button>
      </div>
    </form>
  `;
}

function buildEditDetails(task) {
  return `
        <div class="edit-field-group">
            <label>Due Date</label>
            <input id="edit-date" type="date" value="${task.dueDate}">
            <label>Priority</label>
            ${buildPrioritySelect(task.priority)}
        </div>
    `;
}

function buildPrioritySelect(currentPrio) {
  return `
        <select id="edit-prio">
            <option value="Urgent" ${currentPrio === "Urgent" ? "selected" : ""}>Urgent</option>
            <option value="Medium" ${currentPrio === "Medium" ? "selected" : ""}>Medium</option>
            <option value="Low" ${currentPrio === "Low" ? "selected" : ""}>Low</option>
        </select>
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

function renderDetailedContactsTemplate(
  initials,
  name,
  email,
  phoneNumber,
  color,
) {
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

/**
 * Returns the HTML string for a selectable user entry in the assignment dropdown.
 *
 * @param {string} user The user's display name.
 * @param {string} initials The initials shown in the badge.
 * @param {string} color The badge background color.
 * @returns {string} The HTML string for the dropdown entry.
 */
function renderUsersDropdownTemplate(user, initials, color) {
  return `
        <div id="dropdown-user" class="dropdown-user" onclick="toggleUserSelection(event, '${user}', '${initials}', '${color}')">
            <div class="dropdown-user-badge" style="background-color: ${color}">${initials}</div>
            <span class="dropdown-user-name">${user}</span>
            <img class="dropdown-user-checkbox" src="./assets/icons/checkbox_default.svg" alt="Blank black checkbox icon">
            <img class="dropdown-user-checkbox dNone" src="./assets/icons/checkbox_checked.svg" alt="Blank white checkbox icon">
            <img class="dropdown-user-checkbox dNone" src="./assets/icons/checkbox_checked_sign.svg" alt="Checkmark icon">
        </div>
    `;
}

/**
 * Returns the HTML string for a selectable user entry in the assignment dropdown.
 *
 * @param {string} user The user's display name.
 * @param {string} initials The initials shown in the badge.
 * @param {string} color The badge background color.
 * @returns {string} The HTML string for the dropdown entry.
 */
function renderEditUsersDropdownTemplate(
  userName,
  initials,
  color,
  isSelected,
) {
  let mainClass = isSelected ? "selected" : "";
  let hideDef = isSelected ? "dNone" : "";
  let showChk = isSelected ? "" : "dNone";
  return `<div class="edit-dropdown-user ${mainClass}" onclick="toggleEditUserSelection(event, '${userName}', '${initials}', '${color}')">
        <div class="edit-dropdown-user-badge" style="background-color: ${color}">${initials}</div>
        <span class="edit-dropdown-user-name">${userName}</span>
        <img class="edit-dropdown-user-checkbox ${hideDef}" src="./assets/icons/checkbox_default.svg" alt="">
        <img class="edit-dropdown-user-checkbox ${showChk}" src="./assets/icons/checkbox_checked.svg" alt="">
        <img class="edit-dropdown-user-checkbox ${showChk}" src="./assets/icons/checkbox_checked_sign.svg" alt="">
    </div>`;
}

/**
 * Returns the HTML string for a subtask item with both display and inline edit states.
 *
 * @param {HTMLInputElement} subtasksInput The input element containing the subtask text.
 * @returns {string} The HTML string for the subtask item.
 */
function renderSubtaskItemsTemplate(subtasksInput) {
    return `
            <div class="subtask-item-wrapper" ondblclick="editSubtask(this.querySelector('.edit-subtask-btn'))">   
                <li id="subtask-item" onmouseenter="showSubtaskButtons(this)" onmouseleave="hideSubtaskButtons(this)">
                    <div class="subtask-item-content">
                        <span class="subtask-text">${subtasksInput.value}</span>
                        <div id="subtask-item-btns" class="subtask-item-btns dNone">
                            <button class="edit-subtask-btn" type="button" aria-label="Edit subtask" onclick="editSubtask(this)">
                                <img src="./assets/icons/subtask_edit.svg" alt="Pencil icon">
                            </button>
                            <span class="subtask-edit-divider" aria-hidden="true">|</span>
                            <button class="delete-subtask-btn" type="button" aria-label="Delete subtask" onclick="deleteSubtask(this)">
                                <img src="./assets/icons/subtask_delete.svg" alt="Trash bin icon">
                            </button>
                        </div>
                    </div>
                </li>
                <div id="subtask-edit" class="subtask-item-edit dNone">
                    <input class="subtask-edit-input" type="text" name="subtasks" value="${subtasksInput.value}" onkeydown="if(event.key === 'Enter') confirmEditSubtask(this)"></input>
                    <div class="subtask-edit-btns">
                        <button class="edit-input-delete-btn" type="button" aria-label="Delete subtask" onclick="deleteSubtask(this)">
                            <img src="./assets/icons/subtask_delete.svg" alt="Trash bin icon">
                        </button>
                        <span class="subtask-edit-input-divider" aria-hidden="true">|</span>
                        <button class="edit-input-check-btn" type="button" aria-label="Confirm edit" onclick="confirmEditSubtask(this)">
                            <img src="./assets/icons/subtask_check.svg" alt="Checkmark icon">
                        </button>
                    </div>
                </div>
            </div>
        </li>
        <div id="subtask-edit" class="subtask-item-edit dNone">
            <input class="subtask-edit-input" type="text" name="subtasks" value="${subtasksInput.value}" onkeypress="if(event.key === 'Enter') confirmEditSubtask(this)"></input>
            <div class="subtask-edit-btns">
                <img class="edit-input-delete-btn" src="./assets/icons/subtask_delete.svg" alt="" onclick="deleteSubtask(this)">
                <span class="subtask-edit-input-divider">|</span>
                <img class="edit-input-check-btn" src="./assets/icons/subtask_check.svg" alt="" onclick="confirmEditSubtask(this)">
            </div>
        </div>
    </div>
  `;
}

/**
 * Returns the HTML string for a subtask item with both display and inline edit states.
 *
 * @param {HTMLInputElement} subtasksInput The input element containing the subtask text.
 * @returns {string} The HTML string for the subtask item.
 */
function renderEditSubtaskItemsTemplate(text) {
  return `
    <div class="edit-subtask-item-wrapper" ondblclick="editEditSubtask(this.querySelector('.edit-subtask-btn'))">   
        <li class="edit-subtask-item" onmouseenter="showEditSubtaskButtons(this)" onmouseleave="hideEditSubtaskButtons(this)">
            <div class="edit-subtask-item-content">
                <span class="edit-subtask-text">${text}</span>
                <div class="edit-subtask-item-btns dNone">
                    <img class="edit-edit-subtask-btn" src="./assets/icons/subtask_edit.svg" onclick="editEditSubtask(this)">
                    <span class="edit-subtask-edit-divider">|</span>
                    <img class="edit-delete-subtask-btn" src="./assets/icons/subtask_delete.svg" onclick="deleteEditSubtask(this)">
                </div>
            </div>
        </li>
        <div class="edit-subtask-edit dNone">
            <input class="edit-subtask-edit-input" type="text" name="subtasks" value="${text}" onkeypress="if(event.key === 'Enter') confirmEditEditSubtask(this)">
            <div class="edit-subtask-edit-btns">
                <img class="edit-input-delete-btn" src="./assets/icons/subtask_delete.svg" onclick="deleteEditSubtask(this)">
                <span class="edit-subtask-edit-input-divider">|</span>
                <img class="edit-input-check-btn" src="./assets/icons/subtask_check.svg" onclick="confirmEditEditSubtask(this)">
            </div>
        </div>
    </div>
  `;
}
