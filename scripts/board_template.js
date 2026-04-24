/**
 * Generates the HTML for a compact task card displayed on the board.
 *
 * @param {Object} element The task object containing details.
 * @param {number} closedSubtasksLength The number of completed subtasks.
 * @param {string} id The unique identifier of the task.
 * @returns {string} The HTML string for the small task card.
 */
function smallTask(element, closedSubtasksLength, id) {
  return `
    <div onclick="openTaskDetails('${id}')" draggable="true" ondragstart="startDragging(event, '${id}')" ondragend="stopDragging(event)" id="board-small-task-${id}" class="board-small-task" ondrop="dropOnTask(event, '${id}')" ondragover="allowDrop(event)">
        <div class="small-task-category-and-move-to-container">
          <p id="small-task-category-${id}" class="small-task-category-${element.categoryColor}">${element.category}</p>
          <button id="move-to-btn-${id}" class="move-to-btn" onclick="openMoveToDropdown(event, '${id}', '${element.currentTask}')">
            <img class="move-to-img" src="./assets/icons/move_to_arrows.png" alt="Move to Button">
          </button>
          <div id="move-to-dropdown-${id}" class="move-to-dropdown d-none" onclick="event.stopPropagation()">
            <h4 class="move-to-heading">Move to</h4>
            <p class="move-to-text" onclick="moveTaskToCategory('${id}', 'to-do')">
                <img src="./assets/icons/move_to_arrow_down.png" class="move-to-arrow ${getArrowDirectionClass(element.currentTask, 'todo')}"> to do
            </p>
            <p class="move-to-text" onclick="moveTaskToCategory('${id}', 'in-progress')">
                <img src="./assets/icons/move_to_arrow_down.png" class="move-to-arrow ${getArrowDirectionClass(element.currentTask, 'in-progress')}"> in progress
            </p>
            <p class="move-to-text" onclick="moveTaskToCategory('${id}', 'await-feedback')">
                <img src="./assets/icons/move_to_arrow_down.png" class="move-to-arrow ${getArrowDirectionClass(element.currentTask, 'await-feedback')}"> await feedback
            </p>
            <p class="move-to-text" onclick="moveTaskToCategory('${id}', 'done')">
                <img src="./assets/icons/move_to_arrow_down.png" class="move-to-arrow ${getArrowDirectionClass(element.currentTask, 'done')}"> done
            </p>
        </div>
        </div>  
        <h3 id="small-task-title-${id}" class="small-task-title">${truncateText(element.title)}</h3>
        <p id="small-task-description-${id}" class="small-task-description">${truncateText(element.description)}</p>
        ${getSmallSubtasksHtml(element, closedSubtasksLength, id)}
        <div id="small-task-user-badge-and-priority-container-${id}" class="small-task-user-badge-and-priority-container">
            <div id="small-task-user-badges-container-${id}" class="small-task-user-badges-container"></div>
            <img id="task-prio-image-${id}" class="task-prio-img" src="./assets/icons/${element.priority.toLowerCase()}_prio_color.png" alt="">
        </div>
    </div>`;
}

/**
 * Generates the HTML for the subtask progress indicator on a small task card.
 *
 * @param {Object} element The task object containing subtasks.
 * @param {number} closedLength The number of completed subtasks.
 * @param {string} id The unique identifier of the task.
 * @returns {string} The HTML string for the subtask progress bar.
 */
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

/**
 * Generates the HTML for a user initials badge.
 *
 * @param {string} initials The user's initials.
 * @param {string} badgeColor The background color for the badge.
 * @returns {string} The HTML string for the badge.
 */
function renderNameBadges(initials, badgeColor) {
  return `
  <div class="dropdown-user-badge small-task-dropdown-user-badge" style="background-color: ${badgeColor}">${initials}</div>
  `;
}

/**
 * Generates the HTML for the detailed view dialog of a specific task.
 *
 * @param {Object} task The task object containing all details.
 * @returns {string} The HTML string for the detailed task dialog.
 */
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

/**
 * Generates the HTML for a user badge alongside their full name.
 *
 * @param {string} name The user's full name.
 * @param {string} initials The user's initials.
 * @param {string} badgeColor The background color for the badge.
 * @returns {string} The HTML string for the badge and name layout.
 */
function renderNameBadgesAndNames(name, initials, badgeColor) {
  return `
  <div id="dialog-dropdown-user-badge-with-name-container" class="dialog-dropdown-user-badge-with-name-container">
    <div class="dropdown-user-badge dialog-task-dropdown-user-badge" style="background-color: ${badgeColor}">${initials}</div>
    <p class="assigned-to-name">${name}</p>
  </div>
  `;
}

/**
 * Generates a placeholder HTML for an empty task category column.
 *
 * @param {string} emptyTaskBar The name of the empty task category.
 * @returns {string} The HTML string for the placeholder element.
 */
function renderPlaceholderTemplate(emptyTaskBar) {
  return `
  <div class="placeholder-task">
    <p>No Tasks ${emptyTaskBar}</p>
  </div>
  `;
}

/**
 * Generates the HTML for a single subtask item with a toggleable checkbox.
 *
 * @param {string} subtask The description of the subtask.
 * @param {string} currentState The current status (e.g., "closed").
 * @param {number} index The index of the subtask in the list.
 * @param {string} taskId The unique identifier of the parent task.
 * @returns {string} The HTML string for the subtask item.
 */
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

/**
 * Generates the full HTML for the task editing form.
 *
 * @param {Object} task The task object to be edited.
 * @returns {string} The HTML string containing the edit form.
 */
function buildEditForm(task) {
  return `
    <div class="close-edit-x-container">
      <div id="close-edit-x-wrapper" class="close-dialog-x-wrapper" onclick="closeOverlay('edit')">
          <img src="./assets/icons/close.png" alt="Close Dialog" class="close-dialog-x-default">
          <img src="./assets/icons/close_hover_light.png" alt="Close Dialog" class="close-dialog-x-hover">
          <img src="./assets/icons/close_hover_blue.png" alt="Close Dialog" class="close-dialog-x-active">
      </div>
    </div>
    <form id="edit-add-task-form" class="edit-add-task-form" onsubmit="return false;" novalidate onclick="hideEditSubtaskInputButtons()">
      <div class="task-column left-column">
          <div class="form-group">
              <label for="edit-task-title">
                  Title
              </label>
              <input id="edit-task-title" class="task-title form-input" type="text" placeholder="Enter a title" value="${task.title}" oninput="validateField('edit-task-title', 'edit-title-input-error')">
              <span id="edit-title-input-error" class="edit-input-error d-none">Please add title</span>
          </div>
          <div class="form-group">
              <label for="edit-task-description">
                  Description
              </label>
              <textarea id="edit-task-description" class="edit-task-description form-input" rows="5" placeholder="Enter a Description" oninput="validateField('edit-task-description', 'edit-description-input-error')">${task.description}</textarea>
              <span id="edit-description-input-error" class="edit-input-error d-none">Please add description</span>
          </div>  
          <div class="form-group">
              <label for="edit-task-due-date">
                  Due date
              </label>
              <input id="edit-task-due-date" class="task-due-date form-input" type="date" placeholder="dd/mm/yyyy" maxlength="10" value="${task.dueDate}" oninput="validateField('edit-task-due-date', 'edit-due-date-input-error')">
              <img id="edit-calendar-icon" src="./assets/icons/calendar.png" class="task-input-icon" alt="calendar image">
              <span id="edit-due-date-input-error" class="edit-input-error d-none">Please add Date</span>
          </div>
      </div>
    
      <div class="task-column">

          <div class="form-group">
              <p class="edit-dialog-headings">Priority</p>
              <div class="priority-buttons">

                  <button id="edit-task-prio-urgent-btn" class="priority-btn" type="button" onclick="editHighlightSelectedPriority('urgent')">
                      <span class="prio-text">Urgent</span>
                      <img id="edit-task-prio-urgent-color" class="task-prio-img" src="./assets/icons/high_prio_color.svg" alt="">
                      <img id="edit-task-prio-urgent-white" class="task-prio-img dNone" src="./assets/icons/high_prio_white.svg" alt="">
                  </button>

                  <button id="edit-task-prio-medium-btn" class="priority-btn" type="button" onclick="editHighlightSelectedPriority('medium')">
                      <span class="prio-text">Medium</span> 
                      <img id="edit-task-prio-medium-color" class="task-prio-img dNone" src="./assets/icons/medium_prio_color.svg" alt="">
                      <img id="edit-task-prio-medium-white" class="task-prio-img" src="./assets/icons/medium_prio_white.svg" alt="">
                  </button>

                  <button id="edit-task-prio-low-btn" class="priority-btn" type="button" onclick="editHighlightSelectedPriority('low')">
                      <span class="prio-text">Low</span>
                      <img id="edit-task-prio-low-color" class="task-prio-img" src="./assets/icons/low_prio_color.svg" alt="">
                      <img id="edit-task-prio-low-white" class="task-prio-img dNone" src="./assets/icons/low_prio_white.svg" alt="">
                  </button>
              </div>
          </div>
          <div id="edit-assigned-to-form" class="form-group edit-assigned-to-container">
              <p class="edit-dialog-headings">Assigned to</p>
              <div id="edit-task-assigned-to-wrapper" class="edit-custom-dropdown"  onclick="stopEventBubbling(event)">
                  <div class="edit-custom-dropdown-toggle form-input" onclick="openEditAssignedDropdown()">
                      <input id="edit-task-assigned-to-input" class="edit-dropdown-search-input" type="text" placeholder="Select contacts to assign" oninput="filterAssignedUsers()">
                      <img id="edit-dropdown-arrow" class="edit-dropdown-arrow" src="./assets/icons/arrow_drop_down.svg" onclick="toggleEditAssignedDropdown(event)" alt="">
                      <img id="edit-dropup-arrow" src="./assets/icons/arrow_drop_up.svg" class="edit-dropdown-arrow dNone" onclick="toggleEditAssignedDropdown(event)" alt="">
                  </div>
                  <div id="edit-task-assigned-to-users" class="edit-custom-dropdown-users dNone">
                  </div>
                  <div id="edit-assigned-badges" class="assigned-badges">
                  </div>
              </div>
          </div>
          <div class="form-group">
              <label for="edit-subtasks-input">Subtasks</label>   
              <div id="edit-subtasks-input-container" class="subtasks-input-container  cursor-text" onclick="stopEventBubbling(event)">    
                    <input id="edit-subtasks-input" class="form-input task-input edit-subtask-input" type="text" placeholder="Add new subtask" oninput="checkEditSubtaskInput(); hideNotSavedError()">
                    <div class="subtasks-input-icons">
                        <button id="edit-clear-input-btn" class="clear-input-icon dNone" type="button" aria-label="Clear subtask input" onclick="hideEditSubtaskInputButtons(); hideNotSavedError()">
                            <img src="./assets/icons/subtask_close.svg" alt="Cross icon">
                        </button>
                        <span id="edit-subtasks-vertical-divider" class="subtasks-vertical-divider dNone" aria-hidden="true">|</span>
                        <button id="edit-add-subtask-btn" class="add-subtask-icon dNone" type="button" aria-label="Add subtask" onclick="if(validateAndAddEditSubtask()) { hideNotSavedError(); hideEditSubtaskInputButtons(); }">
                            <img src="./assets/icons/subtask_check.svg" alt="Checkmark icon">
                        </button>
                    </div>
              </div>
              <div id="edit-subtask-error" class="edit-input-error dNone">Subtasks can not be empty</div>
              <div id="not-saved-error" class="edit-input-error dNone">Subtask is not saved</div>
              <ul id="edit-subtasks-list" class="edit-subtasks-list">

              </ul>
          </div>
      </div>
      <div class="edit-succcess-btn-container">
        <button type="button" class="edit-success-button dark-button" id="success-edit-btn" onclick="event.stopPropagation(); submitEditTask('${task.firebaseId}')">
          OK 
          <img id="edit-success-btn-icon" class="add-task-btn-icon" src="./assets/icons/check_light.png" alt="Checkmark icon">
        </button>
      </div>
    </form>
  `;
}

/**
 * Generates the HTML for the due date and priority edit fields.
 *
 * @param {Object} task The task object being edited.
 * @returns {string} The HTML string for the date and priority inputs.
 */
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

/**
 * Generates the HTML for the priority selection dropdown.
 *
 * @param {string} currentPrio The currently selected priority level.
 * @returns {string} The HTML string for the priority select element.
 */
function buildPrioritySelect(currentPrio) {
  return `
        <select id="edit-prio">
            <option value="Urgent" ${currentPrio === "Urgent" ? "selected" : ""}>Urgent</option>
            <option value="Medium" ${currentPrio === "Medium" ? "selected" : ""}>Medium</option>
            <option value="Low" ${currentPrio === "Low" ? "selected" : ""}>Low</option>
        </select>
    `;
}

/**
 * Generates the HTML for a single contact list item.
 *
 * @param {number} index The index of the contact.
 * @param {string} initails The user's initials.
 * @param {string} name The user's full name.
 * @param {string} email The user's email address.
 * @param {string} color The background color for the user's badge.
 * @returns {string} The HTML string for the contact item.
 */
function renderContactTemplate(index, initails, name, email, color) {
  return `
        <div onclick="openContactDetailview('contact-${index}', ${index})" id="contact-${index}" class="contact">
          <div class="contact-initials" style="background-color:${color}">
            <p>${initails}</p>
          </div>
          <div class="contact-name-email">
            <p>${name}</p>
            <a>${email}</a>
          </div>
        </div>
        `;
}

/**
 * Generates the HTML for the detailed view of a selected contact.
 *
 * @param {string} initials The user's initials.
 * @param {string} name The user's full name.
 * @param {string} email The user's email address.
 * @param {string} phoneNumber The user's phone number.
 * @param {string} color The background color for the user's badge.
 * @returns {string} The HTML string for the detailed contact layout.
 */
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
          <div class="contact-detail-initials">
            <p style="background-color:${color}" class="inital-style">${initials}</p>
          </div>
          <div>
            <p class="contact-detail-name">${name}</p>
            <div class="contact-btn">
              <p onclick="openDialog(editDialog), editUser()" class="contact-btn contact-btn-edit"> <img src="./assets/icons/edit.png" alt="" />Edit </p>
              <p onclick="deleteUser()" class="contact-btn contact-btn-delete"> <img src="./assets/icons/delete.png" alt="" />Delete </p>
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

/**
 * Generates the HTML for an alphabetical grouping separator in the contact list.
 *
 * @param {string} letter The alphabetical letter for the breaker.
 * @returns {string} The HTML string for the separator.
 */
function contactBrakerTemplate(letter) {
  return `
        <div class="contact-breaker">
            <p>${letter}</p>
            <hr />
        </div>
  `;
}