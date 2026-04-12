let currentTaskBar = "to-do";
let currentDraggedElement;
let subtaskPercent = 0;
let currentSearchTerm = '';

// for debugging 
// const currentTime = new Date().toLocaleTimeString();
//     console.log(`boardInit called at: ${currentTime}`);
//     console.trace();

/**
 * Initializes the board by rendering all tasks and setting up touch polyfills for mobile devices.
 */
function boardInit() {
    renderAllTasks();
    initTouchPolyfill();
    setupPolyfillTouchmove();    
}


/**
 * Initializes the drag-and-drop polyfill for touch devices.
 */
function initTouchPolyfill() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
        MobileDragDrop.polyfill({
            forceApply: true,
            holdToDrag: 250,
            dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride
        });
        setupPolyfillTouchmove();
    }
}

/**
 * Sets up a listener for touchmove to keep the drag-and-drop polyfill active.
 */
function setupPolyfillTouchmove() {
    window.addEventListener('touchmove', () => {
        // Keeps the polyfill active during movement
    }, { passive: false });
}

/**
 * Filters tasks on the board based on the desktop search input value.
 */
function filterTasksBySearch() {
    const searchInput = document.getElementById('find-task');
    currentSearchTerm = searchInput.value.toLowerCase();
    renderAllTasks();
}

/**
 * Filters tasks on the board based on the mobile search input value.
 */
function filterTasksBySearchMobile() {
    const searchInput = document.getElementById('find-task-mobile');
    currentSearchTerm = searchInput.value.toLowerCase();
    renderAllTasks();
}

/**
 * Checks if a given task matches the current search term in its title or description.
 * 
 * @param {Object} t - The task object to check.
 * @returns {boolean} True if the task matches the search term, false otherwise.
 */
function checkTaskMatch(t) {
    if (!currentSearchTerm) return true;
    const title = (t.title || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    return title.includes(currentSearchTerm) || desc.includes(currentSearchTerm);
}

/**
 * Opens the "Add Task" overlay and presets the selected task category column.
 * 
 * @param {string} selectedTaskBar - The column/category identifier (e.g., 'to-do').
 */
async function openAddTaskOverlay(selectedTaskBar) {
    await loadHtmlPage('add-task-dialog', './templates/add_tasks.html');
    const overlay = document.getElementById('add-task-overlay');
    const addTaskFooter = document.getElementById('add-task-footer');
    const dialogTaskFooter = document.getElementById('add-task-dialog-footer');
    const dialogContainer = document.getElementById('add-tasks-page');
    dialogContainer.classList.add('dialog-add-task-page');
    addTaskFooter.classList.add('d-none');
    dialogTaskFooter.classList.remove('d-none');
    currentTaskBar = selectedTaskBar;
    overlay.classList.remove('d-none');
    initAddTaskElements();
}


/**
 * Closes a specified dialog overlay with a slide-out animation.
 * 
 * @param {string} currentDialog - The base ID name of the dialog to close.
 */
function closeOverlay(currentDialog) {
    const overlay = document.getElementById(`${currentDialog}-overlay`);
    const dialog = document.getElementById(`${currentDialog}-dialog`);
    if (!overlay) return;
    dialog.classList.add('slide-out');
    setTimeout(() => {
        overlay.classList.add('d-none');
        overlay.classList.remove('d-flex');
        dialog.classList.remove('slide-out');
        dialog.innerHTML = '';
    }, 200);
    renderAllTasks();
}

/**
 * Closes the "Add Task" overlay with a delayed slide-out animation.
 */
function closeAddTaskOverlay() {
    const overlay = document.getElementById('add-task-overlay');
    const dialog = document.getElementById('add-task-dialog');
    if (!overlay) return;
    setTimeout(() => {
        dialog.classList.add('slide-out');
        setTimeout(() => {
            overlay.classList.add('d-none');
            overlay.classList.remove('d-flex');
            dialog.classList.remove('slide-out');
            dialog.innerHTML = '';
        }, 200);
    }, 1000);    
}


/**
 * Prevents the event from bubbling up the DOM tree.
 * 
 * @param {Event} event - The DOM event.
 */
function stopEventBubbling(event) {
    event.stopPropagation();
}


/**
 * Renders all task columns (To Do, In Progress, Await Feedback, Done).
 */
function renderAllTasks() {
    renderTodoTasks();
    renderInProgressTasks();
    renderAwaitFeedbackTasks();
    renderDoneTasks(); 
}

/**
 * Renders tasks in the "To Do" column.
 */
function renderTodoTasks() {
    const todo = tasks.filter(t => t.currentTask === 'to-do' && checkTaskMatch(t)).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    const todoTaskBar = document.getElementById('to-do-tasks');
    if (!todo.length) return todoTaskBar.innerHTML = renderPlaceholderTemplate('to do');
    todoTaskBar.innerHTML = "";
    todo.forEach((element, index) => {
        const closedLength = closedSubtaskLength('to-do', index);
        todoTaskBar.innerHTML += smallTask(element, closedLength, element.id);
        fillDoneSubtaskBar(element, closedLength, element.id);
        getAssignedToNamesInitials(element, element.id);
    });
}

/**
 * Renders tasks in the "In Progress" column.
 */
function renderInProgressTasks() {
    const inProgress = tasks.filter(t => t.currentTask === 'in-progress' && checkTaskMatch(t)).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    const inProgressTaskBar = document.getElementById('in-progress-tasks');
    if (!inProgress.length) return inProgressTaskBar.innerHTML = renderPlaceholderTemplate('In Progress');
    inProgressTaskBar.innerHTML = "";
    inProgress.forEach((element, index) => {
        const closedLength = closedSubtaskLength('in-progress', index);
        inProgressTaskBar.innerHTML += smallTask(element, closedLength, element.id);
        fillDoneSubtaskBar(element, closedLength, element.id);
        getAssignedToNamesInitials(element, element.id);
    });
}

/**
 * Renders tasks in the "Await Feedback" column.
 */
function renderAwaitFeedbackTasks() {
    const awaitFeedback = tasks.filter(t => t.currentTask === 'await-feedback' && checkTaskMatch(t)).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    const awaitBar = document.getElementById('await-feedback-tasks');
    if (!awaitFeedback.length) return awaitBar.innerHTML = renderPlaceholderTemplate('Awaiting Feedback');
    awaitBar.innerHTML = "";
    awaitFeedback.forEach((element, index) => {
        const closedLength = closedSubtaskLength('await-feedback', index);
        awaitBar.innerHTML += smallTask(element, closedLength, element.id);
        fillDoneSubtaskBar(element, closedLength, element.id);
        getAssignedToNamesInitials(element, element.id);
    });
}

/**
 * Renders tasks in the "Done" column.
 */
function renderDoneTasks() {
    const done = tasks.filter(t => t.currentTask === 'done' && checkTaskMatch(t)).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    const doneTaskBar = document.getElementById('done-tasks');
    if (!done.length) return doneTaskBar.innerHTML = renderPlaceholderTemplate('Done');
    doneTaskBar.innerHTML = "";
    done.forEach((element, index) => {
        const closedLength = closedSubtaskLength('done', index);
        doneTaskBar.innerHTML += smallTask(element, closedLength, element.id);
        fillDoneSubtaskBar(element, closedLength, element.id);
        getAssignedToNamesInitials(element, element.id);
    });
}

/**
 * Truncates text to a maximum of 5 words and appends an ellipsis.
 * 
 * @param {string} text - The text to truncate.
 * @returns {string} The truncated text.
 */
function truncateText(text) {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(' ') + '...';
}

/**
 * Calculates the number of closed subtasks for a specific task.
 * 
 * @param {string} currentTaskCat - The category of the task (e.g., 'to-do').
 * @param {number} index - The index of the task within its category array.
 * @returns {number} The count of closed subtasks.
 */
function closedSubtaskLength(currentTaskCat, index) {
    const taskBar = tasks.filter(t => t.currentTask === currentTaskCat);
    const subtasks = taskBar[index].subtasks;
    if (!subtasks) return 0;
    return subtasks.filter(d => d.current_state === 'closed').length;
}

/**
 * Initiates the drag operation for a task element.
 * 
 * @param {DragEvent} event - The drag start event.
 * @param {number|string} id - The ID of the task being dragged.
 */
function startDragging(event, id) {
    currentDraggedElement = id;
    const columns = ['to-do-tasks', 'in-progress-tasks', 'await-feedback-tasks', 'done-tasks'];
    event.dataTransfer.setData('text/plain', id.toString());
    applyDragStyles(event.target);
    for (let i = 0; i < columns.length; i++) {
        const col = document.getElementById(columns[i]);
        if (col) col.classList.add('drag-area-highlight');
    }
}

/**
 * Allows an element to be dropped by preventing the default handling of the event.
 * 
 * @param {DragEvent} event - The drag over event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Moves a dragged task to a new category when dropped directly on a column.
 * 
 * @param {DragEvent} event - The drop event.
 * @param {string} category - The target category to move the task to.
 */
async function movingTo(event, category) {
    event.preventDefault();
    const task = tasks.find(t => t.id == currentDraggedElement);
    if (!task || task.currentTask === category) return;
    task.currentTask = category;
    const col = tasks.filter(t => t.currentTask === category).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    col.splice(col.indexOf(task), 1);
    col.unshift(task);
    col.forEach((t, i) => t.sortIndex = i);
    boardInit();
    await updateFirebaseCategory(task.firebaseId, category);
    await updateCategoryOrder(col);
}

/**
 * Handles dropping a task onto another task to reorder within or across columns.
 * 
 * @param {DragEvent} event - The drop event.
 * @param {number|string} targetId - The ID of the target task being dropped on.
 */
async function dropOnTask(event, targetId) {
    event.preventDefault();
    event.stopPropagation();
    const drag = tasks.find(t => t.id == currentDraggedElement);
    const target = tasks.find(t => t.id == targetId);
    if (!drag || !target || drag === target) return;
    drag.currentTask = target.currentTask;
    const col = tasks.filter(t => t.currentTask === target.currentTask).sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    col.splice(col.indexOf(drag), 1);
    col.splice(col.indexOf(target), 0, drag);
    col.forEach((t, i) => t.sortIndex = i);
    boardInit();
    await updateCategoryOrder(col);
}

/**
 * Updates the sorting index for all tasks in a specific column in Firebase.
 * 
 * @param {Array<Object>} col - The array of tasks in the specific column.
 */
async function updateCategoryOrder(col) {
    for (let i = 0; i < col.length; i++) {
        await fetch(`${BASE_URL}tasks/${col[i].firebaseId}/sortIndex.json`, {
            method: "PUT",
            body: JSON.stringify(i)
        });
    }
}

/**
 * Updates the sorting index for all tasks globally in Firebase.
 */
async function updateTasksOrder() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].sortIndex = i;
        const url = `${BASE_URL}tasks/${tasks[i].firebaseId}/sortIndex.json`;
        await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(i)
        });
    }
}


/**
 * Ends the drag operation and removes styling from drag areas and the dragged element.
 * 
 * @param {DragEvent} event - The drag end event.
 */
function stopDragging(event) {
    const columns = ['to-do-tasks', 'in-progress-tasks', 'await-feedback-tasks', 'done-tasks'];
    event.target.classList.remove('rotate-on-drag');
    for (let i = 0; i < columns.length; i++) {
        const col = document.getElementById(columns[i]);
        if (col) col.classList.remove('drag-area-highlight');
    }
}

/**
 * Applies rotation styles to an element while it is being dragged.
 * 
 * @param {HTMLElement} element - The DOM element being dragged.
 */
function applyDragStyles(element) {
    setTimeout(() => {
        element.classList.add('rotate-on-drag');
    }, 0);
}

/**
 * Fills the progress bar of a task based on the ratio of closed subtasks.
 * 
 * @param {Object} element - The task object.
 * @param {number} closedSubtasksLength - The number of subtasks that are closed.
 * @param {number|string} id - The ID of the task.
 */
function fillDoneSubtaskBar(element, closedSubtasksLength, id) {
    if (!element.subtasks || element.subtasks.length === 0) return;
    percent = Math.round(closedSubtasksLength / element.subtasks.length * 100);
    document.getElementById(`subtasks-bar-${id}`).style = `width: ${percent}%`;
}

/**
 * Displays the task detail dialog overlay.
 */
function showDialogOverlay() {
    const overlay = document.getElementById('task-overlay');
    overlay.classList.remove('d-none');
}

/**
 * Opens the detailed view of a specific task by its ID.
 * 
 * @param {number|string} id - The ID of the task.
 */
function openTaskDetails(id) {
    const currentTask = tasks.find(task => task.id == id);
    if (currentTask) {
        showDialogOverlay();
        renderTaskDialog(currentTask);
        getAssignedToNames(currentTask);
        getSubtasks(currentTask);
    };
};

/**
 * Renders the detailed content of a task into the dialog container.
 * 
 * @param {Object} task - The task object to render.
 */
function renderTaskDialog(task) {
    const dialogContainer = document.getElementById('task-dialog');
    dialogContainer.innerHTML = renderDialogTask(task);
}

/**
 * Renders the initials badges of assigned users for a small task card.
 * 
 * @param {Object} currentTask - The task object.
 * @param {number|string} id - The ID of the task.
 */
function getAssignedToNamesInitials(currentTask, id) {
    const container = document.getElementById(`small-task-user-badges-container-${id}`);
    const assigned = currentTask.assignedTo;
    if (!container || !assigned) return;
    let html = "";
    for (let i = 0; i < Math.min(assigned.length, 3); i++) {
        html += renderNameBadges(getInitials(assigned[i]), getUserColor(assigned[i]));
    }
    if (assigned.length > 3) {
        html += renderNameBadges(`+${assigned.length - 3}`, '#2A3647');
    }
    container.innerHTML = html;
}

/**
 * Hides the assigned-to section in the dialog if no users are assigned.
 * 
 * @param {Array<string>} assignedTo - The array of assigned user names.
 */
function checkAssignedTo(assignedTo) {
    if (!assignedTo) {
        let container = document.getElementById('dialog-assigned-to');
        container.classList.add('d-none');
    }
}

/**
 * Renders the names and initials of assigned users inside the task detail dialog.
 * 
 * @param {Object} currentTask - The task object containing assigned users.
 */
function getAssignedToNames(currentTask) {
    const taskNamesContainer = document.getElementById('dialog-task-user-badges');
    const assignedToContainer = document.getElementById('dialog-assigned-to-heading')
    const assignedToNames = currentTask.assignedTo;
    taskNamesContainer.innerHTML = "";
    if (!assignedToNames) {
        assignedToContainer.classList.add('d-none');
        return;
    };
    for(let i = 0; i < assignedToNames.length; i++) {
        const name = assignedToNames[i];
        const initials = getInitials(name);
        const badgeColor = getUserColor(name);
        taskNamesContainer.innerHTML += renderNameBadgesAndNames(name, initials, badgeColor);
    };    
}

/**
 * Updates the category (currentTask) of a specific task in Firebase.
 * 
 * @param {string} firebaseId - The Firebase-specific ID of the task.
 * @param {string} newCategory - The new category to assign to the task.
 */
async function updateFirebaseCategory(firebaseId, newCategory) {
    const url = `${BASE_URL}tasks/${firebaseId}.json`;
    const payload = JSON.stringify({ currentTask: newCategory });
    
    await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-HTTP-Method-Override': 'PATCH'
        },
        body: payload
    });
}

/**
 * Extracts and returns the initials from a full name.
 * 
 * @param {string} fullName - The full name of the user.
 * @returns {string} The formatted initials.
 */
function getInitials(fullName) {
    const nameArray = fullName.trim().split(' ');
    if (nameArray.length === 1) {
        return nameArray[0][0].toUpperCase();
    }
    const firstLetter = nameArray[0][0];
    const lastLetter = nameArray[nameArray.length - 1][0];
    return (firstLetter + lastLetter).toUpperCase();
}

/**
 * Retrieves the background color associated with a specific user.
 * 
 * @param {string} userName - The name of the user.
 * @returns {string} The color string (e.g., rgba, hex).
 */
function getUserColor(userName) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.name === userName);
    return user && user.userColor ? user.userColor : 'rgba(110, 82, 255, 1)';
}

/**
 * Renders the list of subtasks for a given task inside the task detail dialog.
 * 
 * @param {Object} currentTask - The task object containing subtasks.
 */
function getSubtasks(currentTask) {
    const subtaskContainer = document.getElementById('dialog-task-subtask-container');
    const subtaskHeading = document.getElementById('dialog-task-subtasks-header');
    const subtasks = currentTask.subtasks;
    subtaskContainer.innerHTML = "";
    if (!subtasks) {
        subtaskHeading.classList.add('d-none');
        return;
    }
    for(let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i].subtask;
        const currentState = subtasks[i].current_state;
        subtaskContainer.innerHTML += renderSubtaskDiv(subtask, currentState, i, currentTask.id);
    }
}

/**
 * Toggles the visibility of checked/unchecked checkbox icons for a subtask.
 * 
 * @param {string} currentState - The current state of the subtask ('open' or 'closed').
 * @param {number} index - The index of the subtask.
 * @param {number|string} taskId - The ID of the parent task.
 */
function renderCheckboxSubtask(currentState, index, taskId) {
    const defaultCheckBox = document.getElementById(`checkbox-default-${taskId}-${index}`);
    const checkedCheckBox = document.getElementById(`checkbox-checked-${taskId}-${index}`);
    if (currentState === 'closed') {
        defaultCheckBox.classList.add('d-none');
        checkedCheckBox.classList.remove('d-none');
    } else {
        defaultCheckBox.classList.remove('d-none');
        checkedCheckBox.classList.add('d-none');
    }
}

/**
 * Toggles the state of a subtask between 'open' and 'closed' and updates it in Firebase.
 * 
 * @param {number} index - The index of the subtask.
 * @param {number|string} taskId - The ID of the parent task.
 */
async function toggleCheckbox(index, taskId) {
    const task = tasks.find(t => t.id == taskId);
    const subtask = task.subtasks[index];
    const newState = subtask.current_state === 'closed' ? 'open' : 'closed';
    subtask.current_state = newState;
    renderCheckboxSubtask(newState, index, taskId);
    await updateSubtaskInFirebase(task.firebaseId, index, newState);
    renderAllTasks();
}

/**
 * Updates the state of a specific subtask in Firebase.
 * 
 * @param {string} firebaseId - The Firebase-specific ID of the task.
 * @param {number} index - The index of the subtask.
 * @param {string} state - The new state of the subtask ('open' or 'closed').
 */
async function updateSubtaskInFirebase(firebaseId, index, state) {
    const url = `${BASE_URL}tasks/${firebaseId}/subtasks/${index}.json`;
    const payload = JSON.stringify({ current_state: state });
    await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-HTTP-Method-Override': 'PATCH'
        },
        body: payload
    });
}

/**
 * Deletes a specific task from Firebase and re-renders the board.
 * 
 * @param {number|string} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const url = `${BASE_URL}tasks/${task.firebaseId}.json`;
    await fetch(url, {
        method: 'DELETE'
    });
    await loadTasks();
    renderAllTasks();
    closeOverlay('task');
}