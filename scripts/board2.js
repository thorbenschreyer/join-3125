/**
 * Renders the full names and badges for assigned users in the task dialog.
 * @param {Object} currentTask - The task object.
 */
function getAssignedToNames(currentTask) {
  const container = document.getElementById("dialog-task-user-badges");
  const heading = document.getElementById("dialog-assigned-to-heading");
  container.innerHTML = "";
  if (!currentTask.assignedTo) return heading.classList.add("d-none");
  currentTask.assignedTo.forEach((name) => {
    const initials = getInitials(name);
    const color = getUserColor(name);
    container.innerHTML += renderNameBadgesAndNames(name, initials, color);
  });
}

/**
 * Updates the task category in Firebase.
 * @param {string} firebaseId - The Firebase ID of the task.
 * @param {string} newCategory - The new category.
 */
async function updateFirebaseCategory(firebaseId, newCategory) {
  const url = `${BASE_URL}tasks/${firebaseId}.json`;
  const payload = JSON.stringify({ currentTask: newCategory });
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-HTTP-Method-Override": "PATCH",
    },
    body: payload,
  });
}

/**
 * Generates initials from a full name.
 * @param {string} fullName - The full name.
 * @returns {string} The initials.
 */
function getInitials(fullName) {
  const nameArray = fullName.trim().split(" ");
  if (nameArray.length === 1) {
    return nameArray[0][0].toUpperCase();
  }
  const firstLetter = nameArray[0][0];
  const lastLetter = nameArray[nameArray.length - 1][0];
  return (firstLetter + lastLetter).toUpperCase();
}

/**
 * Gets the color associated with a user.
 * @param {string} userName - The user name.
 * @returns {string} The user color.
 */
function getUserColor(userName) {
  const user = users.find((u) => u.name === userName);
  return user && user.avatarColor ? user.avatarColor : "rgba(110, 82, 255, 1)";
}

/**
 * Renders the subtasks in the task dialog.
 * @param {Object} currentTask - The task object.
 */
function getSubtasks(currentTask) {
  const container = document.getElementById("dialog-task-subtask-container");
  const heading = document.getElementById("dialog-task-subtasks-header");
  container.innerHTML = "";
  if (!currentTask.subtasks) return heading.classList.add("d-none");
  currentTask.subtasks.forEach((sub, i) => {
    container.innerHTML += renderSubtaskDiv(
      sub.subtask,
      sub.current_state,
      i,
      currentTask.id,
    );
  });
}

/**
 * Updates the checkbox state for a subtask.
 * @param {string} currentState - The current state of the subtask.
 * @param {number} index - The subtask index.
 * @param {string} taskId - The task ID.
 */
function renderCheckboxSubtask(currentState, index, taskId) {
  const defaultCheckBox = document.getElementById(
    `checkbox-default-${taskId}-${index}`,
  );
  const checkedCheckBox = document.getElementById(
    `checkbox-checked-${taskId}-${index}`,
  );
  if (currentState === "closed") {
    defaultCheckBox.classList.add("d-none");
    checkedCheckBox.classList.remove("d-none");
  } else {
    defaultCheckBox.classList.remove("d-none");
    checkedCheckBox.classList.add("d-none");
  }
}

/**
 * Toggles the state of a subtask checkbox.
 * @param {number} index - The subtask index.
 * @param {string} taskId - The task ID.
 */
async function toggleCheckbox(index, taskId) {
  const task = tasks.find((t) => t.id == taskId);
  const subtask = task.subtasks[index];
  const newState = subtask.current_state === "closed" ? "open" : "closed";
  subtask.current_state = newState;
  renderCheckboxSubtask(newState, index, taskId);
  await updateSubtaskInFirebase(task.firebaseId, index, newState);
  renderAllTasks();
}

/**
 * Updates the subtask state in Firebase.
 * @param {string} firebaseId - The Firebase ID of the task.
 * @param {number} index - The subtask index.
 * @param {string} state - The new state.
 */
async function updateSubtaskInFirebase(firebaseId, index, state) {
  const url = `${BASE_URL}tasks/${firebaseId}/subtasks/${index}.json`;
  const payload = JSON.stringify({ current_state: state });
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-HTTP-Method-Override": "PATCH",
    },
    body: payload,
  });
}

/**
 * Deletes a task from Firebase and updates the UI.
 * @param {string} taskId - The task ID.
 */
async function deleteTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  const url = `${BASE_URL}tasks/${task.firebaseId}.json`;
  await fetch(url, {
    method: "DELETE",
  });
  await loadTasks();
  renderAllTasks();
  closeOverlay("task");
}

/**
 * Opens the edit mode for a task.
 * @param {string} taskId - The task ID.
 */
async function openEditMode(taskId) {
  showDialogOverlay("edit");
  const task = getTaskFromGlobalArray(taskId);
  const container = document.getElementById("edit-dialog");
  container.innerHTML = buildEditForm(task);
  await loadUsers();
  await loadTasks();
  setupEditModeState(task);
  renderEditSubtasks(task);
  initEditSubtaskListeners();
}

/**
 * Finds a task by ID or firebaseId.
 * @param {string} taskId - The task ID or firebaseId.
 * @returns {Object} The task object.
 */
function getTaskFromGlobalArray(taskId) {
  return tasks.find((t) => t.id === taskId || t.firebaseId === taskId);
}

/**
 * Gets the formatted subtasks for editing.
 * @returns {Array} The subtasks array.
 */
function getEditSubtasks() {
  const subtaskNodes = Array.from(
    document.querySelectorAll("#edit-subtasks-list .edit-subtask-text"),
  );
  return subtaskNodes.map((node, index) => ({
    id: index,
    subtask: node.textContent,
    current_state: "open",
  }));
}

/**
 * Refreshes the task dialog with updated task data.
 * @param {Object} task - The updated task object.
 */
function refreshTaskDialog(task) {
  const container = document.getElementById("dialog-board-task");
  container.outerHTML = renderDialogTask(task);
  getAssignedToNames(task);
  getSubtasks(task);
  closeOverlay("edit");
}

/**
 * Saves the edited task to Firebase.
 * @param {string} taskId - The task ID.
 */
async function saveEditedTask(taskId) {
  const task = getTaskFromGlobalArray(taskId);
  updateTaskObjectWithNewValues(task);
  await updateTaskWithPost(task.firebaseId, task);
  refreshTaskDialog(task);
}

/**
 * Updates the task object with new values from the edit form.
 * @param {Object} task - The task object to update.
 */
function updateTaskObjectWithNewValues(task) {
  task.title = document.getElementById("edit-task-title").value;
  task.description = document.getElementById("edit-task-description").value;
  task.dueDate = document.getElementById("edit-task-due-date").value;
  task.priority = getEditSelectedPriority();
  task.assignedTo = selectedUsers.map((u) => u.name);
  task.subtasks = getEditSubtasks();
}

/**
 * Sends a PUT request to update the task in Firebase.
 * @param {string} taskId - The Firebase task ID.
 * @param {Object} taskData - The task data.
 * @returns {Promise<Object>} The fetch response json.
 */
async function updateTaskWithPost(taskId, taskData) {
  const response = await fetch(BASE_URL + `tasks/${taskId}.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-HTTP-Method-Override": "PUT",
    },
    body: JSON.stringify(taskData),
  });
  return await response.json();
}

// Move To Dropdown Functions

/**
 * Opens the move-to dropdown and intercepts the next click to close it securely.
 *
 * @param {Event} event The click event object.
 * @param {string} id The unique identifier of the task.
 * @param {string} currentTask The current status of the task.
 */
function openMoveToDropdown(event, id, currentTask) {
  event.stopPropagation();
  let drop = document.getElementById(`move-to-dropdown-${id}`);
  if (!drop.classList.contains('d-none')) return closeMoveToDropdown(id);
  drop.classList.remove('d-none');
  document.getElementById(`board-small-task-${id}`).classList.add('dropdown-open');
  drop.querySelectorAll('p').forEach(p => p.classList.toggle('d-none', p.getAttribute('onclick').includes(currentTask)));
  setTimeout(() => document.addEventListener('click', (e) => {
    if (!drop.contains(e.target)) e.stopPropagation();
    closeMoveToDropdown(id);
  }, { capture: true, once: true }), 0);
}

/**
 * Closes the move-to dropdown and resets the z-index.
 *
 * @param {string} id The unique identifier of the task.
 */
function closeMoveToDropdown(id) {
  document.getElementById(`move-to-dropdown-${id}`).classList.add('d-none');
  document.getElementById(`board-small-task-${id}`).classList.remove('dropdown-open');
}

/**
 * Determines the CSS class for arrow rotation based on task flow.
 * * @param {string} currentTask The current status of the task.
 * @param {string} targetTask The target status for the arrow.
 * @returns {string} The CSS class for rotation if moving upwards.
 */
function getArrowDirectionClass(currentTask, targetTask) {
  const order = ['todo', 'in-progress', 'await-feedback', 'done'];
  const currentIndex = order.indexOf(currentTask);
  const targetIndex = order.indexOf(targetTask);

  // If target is earlier in the list than current, arrow points UP
  return targetIndex < currentIndex ? 'rotate-180' : '';
}

/**
 * Validates a single input field and toggles the error visibility.
 *
 * @param {string} inputId The ID of the input element.
 * @param {string} errorId The ID of the error span element.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
function validateField(inputId, errorId) {
  let input = document.getElementById(inputId);
  let error = document.getElementById(errorId);
  let isValid = input.value.trim() !== "";
  isValid ? input.classList.remove('invalid-border') : input.classList.add('invalid-border');
  isValid ? error.classList.add('d-none') : error.classList.remove('d-none');
  return isValid;
}

/**
 * Checks all required fields in the edit form before submission.
 *
 * @returns {boolean} True if all required fields are filled, false otherwise.
 */
function validateEditForm() {
  let isTitleValid = validateField('edit-task-title', 'edit-title-input-error');
  let isDescValid = validateField('edit-task-description', 'edit-description-input-error');
  let isDateValid = validateField('edit-task-due-date', 'edit-due-date-input-error');
  return isTitleValid && isDescValid && isDateValid;
}