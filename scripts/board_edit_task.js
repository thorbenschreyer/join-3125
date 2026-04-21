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
