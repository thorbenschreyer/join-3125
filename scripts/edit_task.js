/**
 * Sets up the edit mode state for the given task.
 * @param {Object} task - The task object.
 */
function setupEditModeState(task) {
  editHighlightSelectedPriority(task.priority.toLowerCase());
  initEditAssignedToElements();
  initEditSubtasksElements();
  setEditMinDate();
  initEditDueDateInputListeners();
  initSelectedUsersFromTask(task);
  renderEditUsersDropdown();
  renderEditAssignedBadges();
}

/**
 * Renders the assignment dropdown at edit dialog from the loaded user list.
 */
function renderEditUsersDropdown() {
  editAssignedToUsers.innerHTML = "";
  users.forEach((user) => {
    let initials = getInitials(user.name);
    let isSelected = selectedUsers.some((u) => u.name == user.name);
    let html = renderEditUsersDropdownTemplate(
      user.name,
      initials,
      user.avatarColor,
      isSelected,
    );
    editAssignedToUsers.insertAdjacentHTML("beforeend", html);
  });
}

/**
 * Opens the assignment dropdown at Edit dialog and moves focus to the input for immediate filtering.
 */
function openEditAssignedDropdown() {
  let users = document.getElementById("edit-task-assigned-to-users");
  let arrowdown = document.getElementById("edit-dropdown-arrow");
  let arrowup = document.getElementById("edit-dropup-arrow");
  users.classList.toggle("dNone");
  users.classList.toggle("dFlex");
  arrowdown.classList.toggle("dNone");
  arrowup.classList.toggle("dNone");
  document.getElementById("edit-task-assigned-to-input").focus();
  editAssignedToInputWrapper.classList.add("blue-border");
}

/**
 * Initializes the DOM references for the assignment dropdown and its input state.
 */
function initEditAssignedToElements() {
  editAssignedToForm = document.getElementById("edit-assigned-to-form");
  editAssignedToWrapper = document.getElementById(
    "edit-task-assigned-to-wrapper",
  );
  editAssignedToInputWrapper = document.querySelector(
    ".edit-custom-dropdown-toggle",
  );
  editAssignedToInput = document.getElementById("edit-task-assigned-to-input");
  editAssignedToUsers = document.getElementById("edit-task-assigned-to-users");
}

/**
 * Initializes the DOM references for the subtasks elements.
 */
function initEditSubtasksElements() {
  editSubtasksInput = document.getElementById("edit-subtasks-input");
  editClearSubtasksBtn = document.getElementById("edit-clear-input-btn");
  editSubtaskVerticalDivider = document.getElementById(
    "edit-subtasks-vertical-divider",
  );
  editAddSubtaskBtn = document.getElementById("edit-add-subtask-btn");
  editSubtasksList = document.getElementById("edit-subtasks-list");
  editSubtaskItem = Array.from(
    document.getElementsByClassName("edit-subtask-item"),
  );
}

/**
 * Toggles the assignment dropdown at Edit dialog without triggering the outside-click handler.
 * @param {Event} event - The click event.
 */
function toggleEditAssignedDropdown(event) {
  event.stopPropagation();
  let users = document.getElementById("edit-task-assigned-to-users");
  let arrowdown = document.getElementById("edit-dropdown-arrow");
  let arrowup = document.getElementById("edit-dropup-arrow");
  users.classList.toggle("dNone");
  users.classList.toggle("dFlex");
  arrowdown.classList.toggle("dNone");
  arrowup.classList.toggle("dNone");
  checkEditDropdownState();
  if (users.classList.contains("dFlex")) {
    editAssignedToInputWrapper.classList.add("blue-border");
  }
}

/**
 * Keeps the assignment input highlight in sync with its current focus state.
 */
function checkEditDropdownState() {
  if (editAssignedToInput === document.activeElement) {
    editAssignedToInputWrapper.classList.add("blue-border");
  } else {
    editAssignedToInputWrapper.classList.remove("blue-border");
  }
}

/**
 * Toggles a user in the current assignment selection and refreshes the badge preview.
 * @param {Event} event The click event triggered by the user interaction.
 * @param {string} user The name of the user to toggle in the selection.
 * @param {string} initials The initials of the user for badge display.
 * @param {string} color The avatar color of the user for badge display.
 */
function toggleEditUserSelection(event, user, initials, color) {
  let element = event.currentTarget;
  element.classList.toggle("selected");
  element.ariaChecked = element.classList.contains("selected")
    ? "true"
    : "false";
  element
    .querySelectorAll(".edit-dropdown-user-checkbox")
    .forEach((img) => img.classList.toggle("dNone"));
  let index = selectedUsers.findIndex((u) => u.name === user);
  if (index > -1) {
    selectedUsers.splice(index, 1);
  } else {
    selectedUsers.push({ name: user, initials: initials, color: color });
  }
  renderEditAssignedBadges();
}

/**
 * Renders the badges for selected assigned users.
 */
function renderEditAssignedBadges() {
  let badgeContainer = document.getElementById("edit-assigned-badges");
  badgeContainer.innerHTML = "";
  selectedUsers.forEach((u) => {
    let bgColor = getUserColor(u.name);
    let badgeHTML = `<div class="assigned-badge" style="background-color: ${bgColor}">${u.initials}</div>`;
    badgeContainer.insertAdjacentHTML("beforeend", badgeHTML);
  });
}

/**
 * Initializes the selected users from the task's assignedTo array.
 * @param {Object} task - The task object.
 */
function initSelectedUsersFromTask(task) {
  selectedUsers = [];
  if (!task || !task.assignedTo) return;
  task.assignedTo.forEach(addUserToSelection);
}

/**
 * Processes a single assigned item and adds it to the selected users array.
 * @param {Object|string} item - The user item or name string.
 */
function addUserToSelection(item) {
  let userName = typeof item === "string" ? item : item.name;
  let foundUser = users.find((u) => u.name === userName);
  if (foundUser) {
    selectedUsers.push({
      name: foundUser.name,
      initials: getInitials(foundUser.name),
      color: foundUser.avatarColor,
    });
  }
}

/**
 * Prevents selecting a due date earlier than today.
 */
function setEditMinDate() {
  const editDueDateInput = document.getElementById("edit-task-due-date");
  const TODAY = new Date().toISOString().split("T")[0];
  editDueDateInput.min = TODAY;
}

/**
 * Shows the current error state for the due date input.
 */
function showEditDueDateError(editDueDateInput, editDueDateInputError) {
  editDueDateInput.classList.add("red-border");
  editDueDateInputError.classList.remove("dNone");
}

/**
 * Clears the visible error state for the due date input.
 */
function hideEditDueDateError(editDueDateInput, editDueDateInputError) {
  editDueDateInput.classList.remove("red-border");
  editDueDateInputError.classList.add("dNone");
}

/**
 * Updates the due date error state based on whether the field is filled and not set in the past.
 */
function initEditDueDateInputListeners() {
  const editDueDateInput = document.getElementById("edit-task-due-date");
  const editCalendarIcon = document.getElementById("edit-calendar-icon");
  editDueDateInput.addEventListener("focus", handleEditDueDateFocus);
  editDueDateInput.addEventListener("input", handleEditDueDateInput);
  editCalendarIcon.addEventListener("click", openEditDatePicker);
}

/**
 * Handles the focus event to validate input length.
 */
function handleEditDueDateFocus() {
  const editDueDateInput = document.getElementById("edit-task-due-date");
  const editDueDateInputError = document.getElementById(
    "edit-due-date-input-error",
  );
  if (editDueDateInput.value.length != 10) {
    editDueDateInputError.textContent = "This field is required";
    showEditDueDateError(editDueDateInput, editDueDateInputError);
  }
}

/**
 * Handles the input event to check against today's date.
 */
function handleEditDueDateInput() {
  const editDueDateInput = document.getElementById("edit-task-due-date");
  const editDueDateInputError = document.getElementById(
    "edit-due-date-input-error",
  );
  let val = editDueDateInput.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (val.length == 10 && new Date(val) >= today) {
    hideEditDueDateError(editDueDateInput, editDueDateInputError);
  } else {
    validateEditDueDatePastOrEmpty(val, today);
  }
}

/**
 * Validates the due date for past dates or empty values and shows errors.
 * @param {string} val - The date input value.
 * @param {Date} today - Today's date object.
 */
function validateEditDueDatePastOrEmpty(val, today) {
  const editDueDateInputError = document.getElementById(
    "edit-due-date-input-error",
  );
  if (val.length == 10 && new Date(val) < today) {
    editDueDateInputError.textContent = "Due date cannot be in the past";
  } else {
    editDueDateInputError.textContent = "This field is required";
  }
  showEditDueDateError();
}

/**
 * Opens the native date picker when the calendar icon is clicked.
 */
function openEditDatePicker() {
  const editDueDateInput = document.getElementById("edit-task-due-date");
  editDueDateInput.showPicker();
}

/**
 * Initializes event listeners for the subtasks input and buttons.
 */
function initEditSubtaskListeners() {
  editSubtasksInput.addEventListener("focus", showEditSubtaskInputButtons);
  editClearSubtasksBtn.addEventListener("click", clearEditSubtaskInput);
  editAddSubtaskBtn.addEventListener("click", addEditSubtask);
  editSubtasksInput.addEventListener("keypress", handleEditSubtaskKeypress);
}

/**
 * Adds a new subtask to the list if the input is not empty.
 */
function addEditSubtask() {
  let val = editSubtasksInput.value;
  if (val.length > 0) {
    let html = renderEditSubtaskItemsTemplate(val);
    editSubtasksList.insertAdjacentHTML("beforeend", html);
    clearEditSubtaskInput();
  }
}

/**
 * Triggers the add subtask action when the Enter key is pressed.
 * @param {Event} event - The keypress event.
 */
function handleEditSubtaskKeypress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    editAddSubtaskBtn.click();
    showEditSubtaskInputButtons();
  }
}

/**
 * Renders the existing subtasks for the task in edit mode.
 * @param {Object} task - The task object.
 */
function renderEditSubtasks(task) {
  const container = document.getElementById("edit-subtasks-list");
  container.innerHTML = "";
  if (!task || !task.subtasks) return;
  task.subtasks.forEach((item) => {
    const html = renderEditSubtaskItemsTemplate(item.subtask);
    container.insertAdjacentHTML("beforeend", html);
  });
}

/**
 * Reveals the subtask action buttons and highlights the active item.
 */
function showEditSubtaskButtons(item) {
  item.querySelector(".edit-subtask-item-btns").style.display = "flex";
  item.querySelector(".edit-subtask-item-btns").classList.remove("dNone");
  item.parentElement.style.backgroundColor = "#eeeeee";
}

/**
 * Hides the subtask action buttons and removes the active item highlight.
 */
function hideEditSubtaskButtons(item) {
  item.querySelector(".edit-subtask-item-btns").style.display = "none";
  item.querySelector(".edit-subtask-item-btns").classList.add("dNone");
  item.parentElement.style.backgroundColor = "transparent";
}

/**
 * Shows the controls for clearing or adding the current subtask input.
 */
function showEditSubtaskInputButtons() {
  editClearSubtasksBtn.classList.remove("dNone");
  editSubtaskVerticalDivider.classList.remove("dNone");
  editAddSubtaskBtn.classList.remove("dNone");
}

/**
 * Hides the controls for the main subtask input without deleting text.
 */
function hideEditSubtaskInputButtons() {
    document.getElementById("edit-clear-input-btn").classList.add("dNone");
    document.getElementById("edit-subtasks-vertical-divider").classList.add("dNone");
    document.getElementById("edit-add-subtask-btn").classList.add("dNone");
}

/**
 * Clears the subtask input field, removes errors, and hides controls.
 */
function clearEditSubtaskInput() {
    let input = document.getElementById("edit-subtasks-input");
    input.value = "";
    input.classList.remove("input-error-border");
    document.getElementById("edit-subtask-error").classList.add("dNone");
    hideEditSubtaskInputButtons();
}
