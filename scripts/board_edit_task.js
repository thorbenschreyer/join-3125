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
  isValid
    ? input.classList.remove("invalid-border")
    : input.classList.add("invalid-border");
  isValid ? error.classList.add("d-none") : error.classList.remove("d-none");
  return isValid;
}

/**
 * Checks all required fields in the edit form before submission.
 *
 * @returns {boolean} True if all required fields are filled, false otherwise.
 */
function validateEditForm() {
  let isTitleValid = validateField("edit-task-title", "edit-title-input-error");
  let isDescValid = validateField(
    "edit-task-description",
    "edit-description-input-error",
  );
  let isDateValid = validateField(
    "edit-task-due-date",
    "edit-due-date-input-error",
  );
  return isTitleValid && isDescValid && isDateValid;
}

/**
 * Collects the priority button elements and their icon states from the add-task form.
 * @returns {Object} An object containing arrays of color images, white images, and buttons.
 */
function getEditTaskPrioElements() {
  return {
    colorImgs: [
      document.getElementById("edit-task-prio-urgent-color"),
      document.getElementById("edit-task-prio-medium-color"),
      document.getElementById("edit-task-prio-low-color"),
    ],
    whiteImgs: [
      document.getElementById("edit-task-prio-urgent-white"),
      document.getElementById("edit-task-prio-medium-white"),
      document.getElementById("edit-task-prio-low-white"),
    ],
    buttons: [
      document.getElementById("edit-task-prio-urgent-btn"),
      document.getElementById("edit-task-prio-medium-btn"),
      document.getElementById("edit-task-prio-low-btn"),
    ],
  };
}

/**
 * Applies the selected priority style after clearing the previous visual state.
 * @param {string} priority The priority level to apply ("urgent", "medium", or "low").
 */
function editHighlightSelectedPriority(priority) {
  const prio = getEditTaskPrioElements();
  resetPriorityButtons(prio.colorImgs, prio.whiteImgs, prio.buttons);
  if (priority === "urgent") {
    editHighlightPriority(
      prio.buttons[0],
      prio.colorImgs[0],
      prio.whiteImgs[0],
      "prio-urgent",
    );
  } else if (priority === "medium") {
    editHighlightPriority(
      prio.buttons[1],
      prio.colorImgs[1],
      prio.whiteImgs[1],
      "prio-medium",
    );
  } else if (priority === "low") {
    editHighlightPriority(
      prio.buttons[2],
      prio.colorImgs[2],
      prio.whiteImgs[2],
      "prio-low",
    );
  }
}

/**
 * Restores the neutral priority state before a new selection is highlighted.
 */
function resetPriorityButtons(colorImgs, whiteImgs, buttons) {
  colorImgs.forEach((img) => img.classList.remove("dNone"));
  whiteImgs.forEach((img) => img.classList.add("dNone"));
  buttons.forEach((btn) => {
    btn.classList.remove("prio-urgent", "prio-medium", "prio-low");
    btn.ariaPressed = "false";
  });
}

/**
 * Applies the active visual state to a single priority button.
 * @param {HTMLElement} btn The priority button to highlight.
 * @param {HTMLElement} colorImg The colored icon to hide.
 * @param {HTMLElement} whiteImg The white icon to show.
 * @param {string} prioClass The CSS class to apply ("prio-urgent", "prio-medium", or "prio-low").
 */
function editHighlightPriority(btn, colorImg, whiteImg, prioClass) {
  btn.classList.add(prioClass);
  colorImg.classList.add("dNone");
  whiteImg.classList.remove("dNone");
  btn.ariaPressed = "true";
}

/**
 * Checks the value of the subtask input and toggles the visibility of the action buttons.
 */
function checkEditSubtaskInput() {
  let input = document.getElementById("edit-subtasks-input");
  if (input.value.length > 0) {
    showEditSubtaskInputButtons();
  } else {
    hideEditSubtaskInputButtons();
  }
}

/**
 * Switches a subtask into edit mode and places the cursor at the end.
 * Adds a bottom margin to the wrapper for better visibility.
 * @param {HTMLElement} button The button element that triggered the edit action.
 */
function editEditSubtask(button) {
    let wrapper = button.closest(".edit-subtask-item-wrapper");
    let editDiv = wrapper.querySelector(".edit-subtask-edit");
    let input = editDiv.querySelector(".edit-subtask-edit-input");
    editDiv.classList.remove("dNone");
    editDiv.style.display = "flex";
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    wrapper.querySelector(".edit-subtask-item").classList.add("dNone");
    wrapper.style.marginBottom = "-1px";
    // wrapper.style.padding = "0 10px 0 18px";
}

/**
 * Applies edited text or shows an error if the input is empty.
 * @param {HTMLElement} button The button element that triggered the confirm action.
 */
function confirmEditEditSubtask(button) {
    let wrapper = button.closest(".edit-subtask-item-wrapper");
    let editDiv = wrapper.querySelector(".edit-subtask-edit");
    let editInput = editDiv.querySelector(".edit-subtask-edit-input");
    if (editInput.value.trim() === "") {
        document.getElementById("edit-subtask-error").classList.remove("dNone");
        return editDiv.style.borderBottom = "1px solid red";
    }
    wrapper.querySelector(".edit-subtask-text").textContent = editInput.value;
    wrapper.querySelector(".edit-subtask-item").classList.remove("dNone");
    editDiv.classList.add("dNone");
    editDiv.style.display = "none";
    wrapper.style.marginBottom = "";
    wrapper.style.padding = "4px 10px 4px 18px";
}

/**
 * Removes the selected subtask from the current form state.
 * @param {HTMLElement} button The button element that triggered the delete action.
 */
function deleteEditSubtask(button) {
    button.closest(".edit-subtask-item-wrapper").remove();
}

/**
 * Clears the value of the subtask input field and hides the related control buttons.
 */
function deleteEditSubtaskInput() {
  editSubtasksInput.value = "";
  hideEditSubtaskInputButtons();
}

/**
 * Hides the empty subtask error message and clears the input field.
 * Removes the red error border from the input.
 */
function clearEditSubtaskInput() {
    let input = document.getElementById("edit-subtasks-input");
    document.getElementById("edit-subtask-error").classList.add("dNone");
    input.classList.remove("input-error-border");
    input.value = "";
}

/**
 * Checks input while typing to remove error states dynamically.
 * Triggered by the oninput event in the HTML.
 */
function checkEditSubtaskInput() {
    let input = document.getElementById("edit-subtasks-input");
    let errorMsg = document.getElementById("edit-subtask-error");
    if (input.value.trim() !== "") {
        errorMsg.classList.add("dNone");
        input.classList.remove("input-error-border");
    }
}

/**
 * Removes the error styling and hides the error message when typing.
 * @param {HTMLElement} input The inline edit input field.
 */
function resetEditSubtaskError(input) {
    input.closest(".edit-subtask-edit").style.borderBottom = "1px solid var(--logo-light-blue)";
    document.getElementById("edit-subtask-error").classList.add("dNone");
}

/**
 * Validates the subtask input field on button click.
 * Returns false if empty to block further execution, otherwise true.
 */
function validateAndAddEditSubtask() {
    let input = document.getElementById("edit-subtasks-input");
    input.value = input.value.trim();
    let errorMsg = document.getElementById("edit-subtask-error");
    if (input.value === "") {
        errorMsg.classList.remove("dNone");
        input.classList.add("input-error-border");
        return false;
    }
    errorMsg.classList.add("dNone");
    input.classList.remove("input-error-border");
    return true;
}

/**
 * Orchestrates form validation and blocks saving if inputs are unsaved.
 * @param {string} taskId The ID of the task to save.
 */
function submitEditTask(taskId) {
    let mainText = document.getElementById("edit-subtasks-input").value.trim();
    let openEdits = document.querySelector(".edit-subtask-edit:not(.dNone)");
    if (mainText !== "" || openEdits) {
        document.getElementById("not-saved-error").classList.remove("dNone");
        document.getElementById("edit-subtasks-input").classList.add("input-error-border");
        if (openEdits) openEdits.style.borderBottom = "1px solid red";
        return;
    }
    let formValid = validateEditForm();
    let subValid = validateAllSubtasks();
    if (formValid && subValid) saveEditedTask(taskId);
}

/**
 * Checks if any active inline edited subtasks are left empty.
 * @returns {boolean} True if all valid, false otherwise.
 */
function validateAllSubtasks() {
    let valid = true;
    let edits = document.querySelectorAll(".edit-subtask-edit:not(.dNone) input");
    edits.forEach(input => {
        if (input.value.trim() === "") {
            valid = false;
            input.parentNode.style.borderBottom = "1px solid red";
        }
    });
    if (!valid) document.getElementById("edit-subtask-error").classList.remove("dNone");
    return valid;
}

/**
 * Hides the error message for unsaved subtask inputs.
 */
function hideNotSavedError() {
  let openEdits = document.querySelector(".edit-subtask-edit:not(.dNone)");
    if (openEdits) openEdits.style.borderBottom = "1px solid var(--logo-light-blue)";
    document.getElementById("not-saved-error").classList.add("dNone");
    document.getElementById("edit-subtasks-input").classList.remove("input-error-border");
}