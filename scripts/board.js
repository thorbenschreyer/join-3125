let currentTaskBar = "to-do";
let subtaskPercent = 0;
let currentSearchTerm = "";
let searchTimeout;

/**
 * Initializes the board by loading users and rendering all tasks.
 * Also sets up touch polyfill for mobile drag and drop.
 */
async function boardInit() {
  await loadUsers();
  renderAllTasks();
  initTouchPolyfill();
  setupPolyfillTouchmove();
}

/**
 * Executes the task filtering after a specified debounce delay.
 * @param {string} inputId - The ID of the search input element.
 */
function executeSearchDebounced(inputId) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const searchInput = document.getElementById(inputId);
    currentSearchTerm = searchInput.value.toLowerCase();
    renderAllTasks();
  }, 300);
}

/**
 * Filters tasks based on the search input and re-renders all tasks.
 */
function filterTasksBySearch() {
  executeSearchDebounced("find-task");
}

/**
 * Filters tasks based on the mobile search input and re-renders all tasks.
 */
function filterTasksBySearchMobile() {
  executeSearchDebounced("find-task-mobile");
}

/**
 * Checks if a task matches the current search term.
 * @param {Object} t - The task object.
 * @returns {boolean} True if the task matches, false otherwise.
 */
function checkTaskMatch(t) {
  if (!currentSearchTerm) return true;
  const title = (t.title || "").toLowerCase();
  const desc = (t.description || "").toLowerCase();
  return title.includes(currentSearchTerm) || desc.includes(currentSearchTerm);
}

/**
 * Opens the add task overlay for the specified task bar.
 * @param {string} selectedTaskBar - The target task category.
 */
async function openAddTaskOverlay(selectedTaskBar) {
  await loadHtmlPage("add-task-dialog", "./templates/add_tasks.html");
  currentTaskBar = selectedTaskBar;
  prepareAddTaskDialogUI();
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
  document.getElementById("task-description").style.height = "34px";
}

/**
 * Closes the specified overlay with a slide-out animation.
 * @param {string} currentDialog - The dialog type to close.
 */
function closeOverlay(currentDialog) {
  const overlay = document.getElementById(`${currentDialog}-overlay`);
  const dialog = document.getElementById(`${currentDialog}-dialog`);
  if (!overlay) return;
  dialog.classList.add("slide-out");
  resetDialogAfterDelay(overlay, dialog, 200);
  renderAllTasks();
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

/**
 * Resets the overlay and dialog state after a delay.
 * @param {Element} overlay - The overlay element.
 * @param {Element} dialog - The dialog element.
 * @param {number} delay - Delay in milliseconds.
 */
function resetDialogAfterDelay(overlay, dialog, delay) {
  setTimeout(() => {
    overlay.classList.add("d-none");
    overlay.classList.remove("d-flex");
    dialog.classList.remove("slide-out");
    dialog.innerHTML = "";
  }, delay);
}

/**
 * Stops event bubbling to prevent unwanted event propagation.
 * @param {Event} event - The event to stop.
 */
function stopEventBubbling(event) {
  event.stopPropagation();
}

/**
 * Renders all task bars: to-do, in-progress, await-feedback, and done.
 */
function renderAllTasks() {
  renderTodoTasks();
  renderInProgressTasks();
  renderAwaitFeedbackTasks();
  renderDoneTasks();
}

/**
 * Filters and sorts tasks for a specific category.
 * @param {string} category - The task category.
 * @returns {Array} Filtered and sorted tasks.
 */
function getFilteredAndSortedTasks(category) {
  return tasks
    .filter((t) => t.currentTask === category && checkTaskMatch(t))
    .sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
}

/**
 * Appends a single task to a specific category bar.
 * @param {Object} element - The task object.
 * @param {number} index - The task index.
 * @param {string} category - The category string.
 * @param {Element} taskBar - The DOM element.
 */
function appendTaskToBar(element, index, category, taskBar) {
  const closedLength = closedSubtaskLength(element);
  taskBar.innerHTML += smallTask(element, closedLength, element.id);
  fillDoneSubtaskBar(element, closedLength, element.id);
  getAssignedToNamesInitials(element, element.id);
}

/**
 * Renders the to-do tasks, filtering by search term and sorting by sortIndex.
 */
function renderTodoTasks() {
  const todo = getFilteredAndSortedTasks("to-do");
  const todoTaskBar = document.getElementById("to-do-tasks");
  if (!todo.length)
    return (todoTaskBar.innerHTML = renderPlaceholderTemplate("to do"));
  todoTaskBar.innerHTML = "";
  todo.forEach((el, index) => appendTaskToBar(el, index, "to-do", todoTaskBar));
}

/**
 * Renders the in-progress tasks, filtering by search term and sorting by sortIndex.
 */
function renderInProgressTasks() {
  const inProgress = getFilteredAndSortedTasks("in-progress");
  const inProgressTaskBar = document.getElementById("in-progress-tasks");
  if (!inProgress.length)
    return (inProgressTaskBar.innerHTML =
      renderPlaceholderTemplate("In Progress"));
  inProgressTaskBar.innerHTML = "";
  inProgress.forEach((el, idx) =>
    appendTaskToBar(el, idx, "in-progress", inProgressTaskBar),
  );
}

/**
 * Renders the await-feedback tasks, filtering by search term and sorting by sortIndex.
 */
function renderAwaitFeedbackTasks() {
  const awaitFeedback = getFilteredAndSortedTasks("await-feedback");
  const awaitBar = document.getElementById("await-feedback-tasks");
  if (!awaitFeedback.length)
    return (awaitBar.innerHTML =
      renderPlaceholderTemplate("Awaiting Feedback"));
  awaitBar.innerHTML = "";
  awaitFeedback.forEach((el, idx) =>
    appendTaskToBar(el, idx, "await-feedback", awaitBar),
  );
}

/**
 * Renders the done tasks, filtering by search term and sorting by sortIndex.
 */
function renderDoneTasks() {
  const done = getFilteredAndSortedTasks("done");
  const doneTaskBar = document.getElementById("done-tasks");
  if (!done.length)
    return (doneTaskBar.innerHTML = renderPlaceholderTemplate("Done"));
  doneTaskBar.innerHTML = "";
  done.forEach((el, index) => appendTaskToBar(el, index, "done", doneTaskBar));
}

/**
 * Truncates text to the first 5 words followed by '...' if longer.
 * @param {string} text - The text to truncate.
 * @returns {string} The truncated text.
 */
function truncateText(text) {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= 5) return text;
  return words.slice(0, 5).join(" ") + "...";
}

/**
 * Calculates the number of closed subtasks for a task.
 * @param {Object} task - The task object.
 * @returns {number} The number of closed subtasks.
 */
function closedSubtaskLength(task) {
  const subtasks = task.subtasks;
  if (!subtasks) return 0;
  return subtasks.filter((d) => d.current_state === "closed").length;
}

/**
 * Moves a task to a new category via the dropdown menu.
 * @param {string} id - The task ID.
 * @param {string} category - The target category.
 */
async function moveTaskToCategory(id, category) {
  const task = tasks.find((t) => t.id == id);
  if (!task || task.currentTask === category) return;
  task.currentTask = category;
  closeMoveToDropdown(id); 
  await reorderAndSaveCategory(task, category);
}

/**
 * Updates the progress bar for subtasks.
 * @param {Object} element - The task object.
 * @param {number} closedSubtasksLength - Number of closed subtasks.
 * @param {string} id - The task ID.
 */
function fillDoneSubtaskBar(element, closedSubtasksLength, id) {
  if (!element.subtasks || element.subtasks.length === 0) return;
  const percent = Math.round((closedSubtasksLength / element.subtasks.length) * 100);
  document.getElementById(`subtasks-bar-${id}`).style = `width: ${percent}%`;
}

/**
 * Shows the specified dialog overlay.
 * @param {string} overlayType - The type of overlay to show.
 */
function showDialogOverlay(overlayType) {
  const overlay = document.getElementById(`${overlayType}-overlay`);
  overlay.classList.remove("d-none");
}

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
 * Renders the initials badges for assigned users in the small task view.
 * @param {Object} currentTask - The task object.
 * @param {string} id - The task ID.
 */
function getAssignedToNamesInitials(currentTask, id) {
  const container = document.getElementById(
    `small-task-user-badges-container-${id}`,
  );
  if (!container || !currentTask.assignedTo) return;
  container.innerHTML = buildAssignedBadgesHtml(currentTask.assignedTo);
}

/**
 * Builds the HTML string for assigned user badges.
 * @param {Array} assigned - Array of assigned users.
 * @returns {string} The constructed HTML string.
 */
function buildAssignedBadgesHtml(assigned) {
  let html = "";
  for (let i = 0; i < Math.min(assigned.length, 3); i++) {
    html += renderNameBadges(
      getInitials(assigned[i]),
      getUserColor(assigned[i]),
    );
  }
  if (assigned.length > 3)
    html += renderNameBadges(`+${assigned.length - 3}`, "#2A3647");
  return html;
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