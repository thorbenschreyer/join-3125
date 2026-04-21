/**
 * Opens the task details dialog for the specified task.
 * @param {string} id - The task ID.
 */
function openTaskDetails(id) {
  const currentTask = tasks.find((task) => task.id == id);
  if (currentTask) {
    showDialogOverlay("task");
    renderTaskDialog(currentTask);
    getAssignedToNames(currentTask);
    getSubtasks(currentTask);
  }
}

/**
 * Renders the task dialog with the task details.
 * @param {Object} task - The task object.
 */
function renderTaskDialog(task) {
  const dialogContainer = document.getElementById("task-dialog");
  dialogContainer.innerHTML = renderDialogTask(task);
}

/**
 * Hides the assigned to section if no users are assigned.
 * @param {Array} assignedTo - The list of assigned users.
 */
function checkAssignedTo(assignedTo) {
  if (!assignedTo) {
    let container = document.getElementById("dialog-assigned-to");
    container.classList.add("d-none");
  }
}

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
