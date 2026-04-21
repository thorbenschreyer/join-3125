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

  return targetIndex < currentIndex ? 'rotate-180' : '';
}