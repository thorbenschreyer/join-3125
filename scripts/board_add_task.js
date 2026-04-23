/**
 * Opens the add task overlay for the specified task bar.
 * @param {string} selectedTaskBar - The target task category.
 */
async function openAddTaskOverlay(selectedTaskBar) {
  await loadHtmlPage("add-task-dialog", "./templates/add_tasks.html");
  currentTaskBar = selectedTaskBar;
  await prepareAddTaskDialogUI();
  initAddTaskElements();
}

/**
 * Updates the DOM elements to correctly display the add task overlay.
 */
function prepareAddTaskDialogUI() {
  document.getElementById("add-tasks-page").classList.add("dialog-add-task-page");
  document.getElementById("add-task-footer").classList.add("d-none");
  document.getElementById("add-task-dialog-footer").classList.remove("d-none");
  document.getElementById("close-add-task-dialog-x-wrapper").style.display = "flex";
  document.getElementById("add-task-overlay").classList.remove("d-none");
  document.getElementById("close-add-task-dialog-mobile-x-wrapper").style.display = "flex";
  document.getElementById("add-task-dialog-heading").classList.add("padding-none");
  document.getElementById("add-tasks-dialog-header").classList.remove("d-none");
  document.getElementById("add-task-mobile-heading").classList.add("d-none");
  document.getElementById("task-description-input").style.height = "34px";
}

/**
 * Closes the add task overlay.
 */
function closeAddTaskOverlay() {
  const overlay = document.getElementById("add-task-overlay");
  const dialog = document.getElementById("add-task-dialog");
  if (!overlay) return;
  setTimeout(() => {
    dialog.classList.add("slide-out");
    resetDialogAfterDelay(overlay, dialog, 200);
  }, 1000);
}

function closeAddTaskOverlayEmediatly() {
  const overlay = document.getElementById("add-task-overlay");
  const dialog = document.getElementById("add-task-dialog");
  if (!overlay) return;
    dialog.classList.add("slide-out");
    resetDialogAfterDelay(overlay, dialog, 200);
}
