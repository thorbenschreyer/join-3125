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
 * @param {string} userName The user's display name.
 * @param {string} initials The initials shown in the badge.
 * @param {string} color The badge background color.
 * @param {boolean} isSelected Whether the user is currently selected.
 * @returns {string} The HTML string for the edit dropdown entry.
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
                    <input class="subtask-edit-input" type="text" name="subtasks" value="${subtasksInput.value}" oninput="this.closest('.subtask-item-edit').classList.remove('subtask-edit-red-border'); hideSubtaskError();" onkeydown="if(event.key === 'Enter')  { confirmEditSubtask(this); return false; }"></input>
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
  `;
}

/**
 * Returns the HTML string for a subtask item within the edit mode.
 *
 * @param {string} text The text content of the subtask.
 * @returns {string} The HTML string for the editable subtask item.
 */
function renderEditSubtaskItemsTemplate(text) {
  return `
    <div class="edit-subtask-item-wrapper" ondblclick="editEditSubtask(this.querySelector('.edit-edit-subtask-btn'))">   
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
            <input class="edit-subtask-edit-input" type="text" name="subtasks" value="${text}" onkeypress="if(event.key === 'Enter') confirmEditEditSubtask(this)" oninput="resetEditSubtaskError(this); hideNotSavedError()" onclick="event.stopPropagation()">
            <div class="edit-subtask-edit-btns">
                <button class="edit-input-delete-btn" type="button" aria-label="Delete subtask" onclick="deleteEditSubtask(this); hideNotSavedError()">
                    <img src="./assets/icons/subtask_delete.svg" alt="Trash bin icon">
                </button>
                <span class="subtask-edit-input-divider" aria-hidden="true">|</span>
                <button class="edit-input-check-btn" type="button" aria-label="Confirm edit" onclick="event.stopPropagation(); confirmEditEditSubtask(this); hideNotSavedError()">
                    <img src="./assets/icons/subtask_check.svg" alt="Checkmark icon">
                </button>
            </div>
        </div>
    </div>
  `;
}