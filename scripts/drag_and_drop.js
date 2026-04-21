let currentDraggedElement;

/**
 * Initializes touch polyfill for drag and drop on touch devices.
 */
function initTouchPolyfill() {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    MobileDragDrop.polyfill({
      forceApply: true,
      holdToDrag: 250,
      dragImageTranslateOverride:
        MobileDragDrop.scrollBehaviourDragImageTranslateOverride,
    });
    setupPolyfillTouchmove();
  }
}

/**
 * Sets up touchmove event listener.
 * The empty callback keeps the polyfill active during movement.
 */
function setupPolyfillTouchmove() {
  window.addEventListener("touchmove", () => {}, { passive: false });
}

/**
 * Starts the drag operation for a task if window is wide enough.
 * @param {Event} event - The drag event.
 * @param {string} id - The task ID.
 */
function startDragging(event, id) {
  if (window.innerWidth < 1420) return event.preventDefault();
  currentDraggedElement = id;
  event.dataTransfer.setData("text/plain", id.toString());
  applyDragStyles(event.target);
  ["to-do-tasks", "in-progress-tasks", "await-feedback-tasks", "done-tasks"]
    .forEach(col => document.getElementById(col)?.classList.add("drag-area-highlight"));
}

/**
 * Allows dropping on the target element if window is wide enough.
 * @param {Event} event - The drop event.
 */
function allowDrop(event) {
  if (window.innerWidth >= 1420) {
    event.preventDefault();
  }
}

/**
 * Moves a dragged task to a new category and updates the order.
 * @param {Event} event - The drop event.
 * @param {string} category - The target category.
 */
async function movingTo(event, category) {
  event.preventDefault();
  const task = tasks.find((t) => t.id == currentDraggedElement);
  if (!task || task.currentTask === category) return;
  task.currentTask = category;
  await reorderAndSaveCategory(task, category);
}

/**
 * Reorders tasks locally, saves to Firebase, and then re-renders the board.
 * @param {Object} task - The task object that was moved.
 * @param {string} category - The new category of the task.
 */
async function reorderAndSaveCategory(task, category) {
  const col = tasks.filter(t => t.currentTask === category).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
  const idx = col.indexOf(task);
  if (idx > -1) col.splice(idx, 1);
  col.unshift(task);
  col.forEach((t, i) => (t.sortIndex = i));
  try {
    await updateFirebaseCategory(task.firebaseId, category);
    await updateCategoryOrder(col);
    await boardInit(); 
  } catch (e) {
    console.error("Error saving to Firebase:", e);
  }
}

/**
 * Drops a dragged task onto another task, reordering within the same category.
 * @param {Event} event - The drop event.
 * @param {string} targetId - The ID of the target task.
 */
async function dropOnTask(event, targetId) {
  event.preventDefault();
  event.stopPropagation();
  const drag = tasks.find((t) => t.id == currentDraggedElement);
  const target = tasks.find((t) => t.id == targetId);
  if (!drag || !target || drag === target) return;
  drag.currentTask = target.currentTask;
  await updateDroppedTaskOrder(drag, target);
}

/**
 * Updates the order of tasks after a task is dropped onto another task,
 * reordering them within the same category.
 * @param {Object} drag - The dragged task object.
 * @param {Object} target - The target task object onto which the drag task was dropped.
 */
async function updateDroppedTaskOrder(drag, target) {
  const col = tasks
    .filter((t) => t.currentTask === target.currentTask)
    .sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
  const dragIndex = col.indexOf(drag);
  if (dragIndex > -1) {
    col.splice(dragIndex, 1);
  }
  col.splice(col.indexOf(target), 0, drag);
  col.forEach((t, i) => (t.sortIndex = i));
  await boardInit();
  await updateCategoryOrder(col);
}

/**
 * Updates the sortIndex for all tasks in a category concurrently.
 *
 * @param {Array} col The array of tasks in the category.
 */
async function updateCategoryOrder(col) {
  const promises = col.map((t, i) =>
    fetch(`${BASE_URL}tasks/${t.firebaseId}/sortIndex.json`, {
      method: "PUT",
      body: JSON.stringify(i),
    })
  );
  await Promise.all(promises);
}

/**
 * Updates the sortIndex for all tasks in Firebase.
 */
async function updateTasksOrder() {
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].sortIndex = i;
    const url = `${BASE_URL}tasks/${tasks[i].firebaseId}/sortIndex.json`;
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
    });
  }
}

/**
 * Cleans up drag styles after dragging ends.
 * @param {Event} event - The drag end event.
 */
function stopDragging(event) {
  event.target.classList.remove("rotate-on-drag");
  ["to-do-tasks", "in-progress-tasks", "await-feedback-tasks", "done-tasks"]
    .forEach(col => document.getElementById(col)?.classList.remove("drag-area-highlight"));
}

/**
 * Applies rotation style to the dragged element.
 * @param {Element} element - The dragged element.
 */
function applyDragStyles(element) {
  setTimeout(() => {
    element.classList.add("rotate-on-drag");
  }, 0);
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
