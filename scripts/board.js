let currentTaskBar = "todo-tasks";
let currentDraggedElement;
let subtaskPercent = 0;


function boardInit() {
    renderAllTasks();
    initTouchPolyfill();
    setupPolyfillTouchmove();    
}

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

function setupPolyfillTouchmove() {
    window.addEventListener('touchmove', () => {
        // Keeps the polyfill active during movement
    }, { passive: false });
}

async function openAddTaskOverlay(selectedTaskBar) {
    await loadHtmlPage('add-task-dialog', './templates/add_tasks.html');
    const overlay = document.getElementById('add-task-overlay');
    const addTaskFooter = document.getElementById('add-task-footer');
    const dialogTaskFooter = document.getElementById('add-task-dialog-footer');
    addTaskFooter.classList.add('d-none');
    dialogTaskFooter.classList.remove('d-none');
    currentTaskBar = selectedTaskBar + '-tasks';
    overlay.classList.remove('d-none');
}


function closeAddTaskOverlay() {
    const overlay = document.getElementById('add-task-overlay');
    const dialog = document.getElementById('add-task-dialog');
    dialog.classList.add('slide-out');
    setTimeout(() => {
        overlay.classList.add('d-none');
        overlay.classList.remove('d-flex');
        dialog.classList.remove('slide-out');
        dialog.innerHTML = '';
    }, 200);
    renderAllTasks();
}


function stopEventBubbling(event) {
    event.stopPropagation();
}


function renderAllTasks() {
    renderTodoTasks();
    renderInProgressTasks();
    renderAwaitFeedbackTasks();
    renderDoneTasks(); 
}


function renderTodoTasks() {
    let todo = tasks.filter(t => t['currentTask'] == 'to-do');
    const todoTaskBar = document.getElementById('to-do-tasks');
    todoTaskBar.innerHTML = "";
    if (todo.length == 0) {
        todoTaskBar.innerHTML = renderPlaceholderTemplate('to do');
        return;
    };
    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        const id = element.id;
        const closedSubtasksLength = closedSubtaskLength('to-do', index);
        todoTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
        getAssignedToNamesInitials(element, id);
    }; 
}

function renderInProgressTasks() {
    let inProgress = tasks.filter(t => t['currentTask'] == 'in-progress');
    const inProgressTaskBar = document.getElementById('in-progress-tasks');
    inProgressTaskBar.innerHTML = "";
    if (inProgress.length == 0) {
        inProgressTaskBar.innerHTML = renderPlaceholderTemplate('In Progress');
        return;
    };
    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        const id = element.id;
        const closedSubtasksLength = closedSubtaskLength('in-progress', index);
        inProgressTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
        getAssignedToNamesInitials(element, id);
    }; 
}


function renderAwaitFeedbackTasks() {
    let awaitFeedback = tasks.filter(t => t['currentTask'] == 'await-feedback');
    const awaitFeedbackTaskBar = document.getElementById('await-feedback-tasks');
    awaitFeedbackTaskBar.innerHTML = "";
    if (awaitFeedback.length == 0) {
        awaitFeedbackTaskBar.innerHTML = renderPlaceholderTemplate('Awaiting Feedback'); 
        return;
    };
    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        const id = element.id;
        const closedSubtasksLength = closedSubtaskLength('await-feedback', index);
        awaitFeedbackTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
        getAssignedToNamesInitials(element, id);
    }; 
}


function renderDoneTasks() {
    let done = tasks.filter(t => t['currentTask'] == 'done');
    const doneTaskBar = document.getElementById('done-tasks');
    doneTaskBar.innerHTML = "";
    if (done.length == 0) {
        doneTaskBar.innerHTML = renderPlaceholderTemplate('Done');
        return;
    };
    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        const id = element.id;
        const closedSubtasksLength = closedSubtaskLength('done', index);
        doneTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
        getAssignedToNamesInitials(element, id);
    }; 
}

function truncateDescription(text) {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(' ') + '...';
}

function closedSubtaskLength(currentTaskCat, index) {
    const taskBar = tasks.filter(t => t.currentTask === currentTaskCat);
    const subtasks = taskBar[index].subtasks;
    if (!subtasks) return 0;
    return subtasks.filter(d => d.current_state === 'closed').length;
}

function startDragging(event, id) {
    currentDraggedElement = id;
    event.dataTransfer.setData('text/plain', id.toString());
    applyDragStyles(event.target);
}

function allowDrop(event) {
    event.preventDefault();
}

async function movingTo(event, category) {
    event.preventDefault();
    const taskIndex = tasks.findIndex(t => t.id === currentDraggedElement);
    if (taskIndex === -1) return;
    
    const movedTask = tasks.splice(taskIndex, 1)[0];
    movedTask.currentTask = category;
    tasks.unshift(movedTask);
    
    boardInit();
    await updateFirebaseCategory(movedTask.firebaseId, category);
}

function stopDragging(event) {
    event.target.classList.remove('rotate-on-drag');
}

function applyDragStyles(element) {
    setTimeout(() => {
        element.classList.add('rotate-on-drag');
    }, 0);
}

function fillDoneSubtaskBar(element, closedSubtasksLength, id) {
    if (!element.subtasks) return;
    percent = Math.round(closedSubtasksLength / element.subtasks.length * 100);
    document.getElementById(`subtasks-bar-${id}`).style = `width: ${percent}%`;
}

function showDialogOverlay() {
    const overlay = document.getElementById('add-task-overlay');
    overlay.classList.remove('d-none');
}

function openTaskDetails(id) {
    const currentTask = tasks.find(task => task.id === id);
    if (currentTask) {
        showDialogOverlay();
        renderTaskDialog(currentTask);
        getAssignedToNames(currentTask);
        getSubtasks(currentTask);
    };
};

function renderTaskDialog(task) {
    const dialogContainer = document.getElementById('add-task-dialog');
    dialogContainer.innerHTML = renderDialogTask(task);
}

// function getAssignedToNamesInitials(currentTask, id) {
//     const smallTaskNamesContainer = document.getElementById(`small-task-user-badges-container-${id}`);
//     const assignedToNames = currentTask.assignedTo;
//     smallTaskNamesContainer.innerHTML = "";
//     if (!assignedToNames) return
//     for(let i = 0; i < assignedToNames.length; i++) {
//         const name = assignedToNames[i];
//         const initials = getInitials(name);
//         const badgeColor = getUserColor(name);
//         smallTaskNamesContainer.innerHTML += renderNameBadges(initials, badgeColor);
//     }
// }

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

function checkAssignedTo(assignedTo) {
    if (!assignedTo) {
        let container = document.getElementById('dialog-assigned-to');
        container.classList.add('d-none');
    }
}

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

function getInitials(fullName) {
    const nameArray = fullName.trim().split(' ');
    if (nameArray.length === 1) {
        return nameArray[0][0].toUpperCase();
    }
    const firstLetter = nameArray[0][0];
    const lastLetter = nameArray[nameArray.length - 1][0];
    return (firstLetter + lastLetter).toUpperCase();
}

function getUserColor(userName) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.name === userName);
    return user && user.userColor ? user.userColor : 'rgba(110, 82, 255, 1)';
}

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

async function toggleCheckbox(index, taskId) {
    const task = tasks.find(t => t.id == taskId);
    const subtask = task.subtasks[index];
    const newState = subtask.current_state === 'closed' ? 'open' : 'closed';
    subtask.current_state = newState;
    renderCheckboxSubtask(newState, index, taskId);
    await updateSubtaskInFirebase(task.firebaseId, index, newState);
    renderAllTasks();
}

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

async function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const url = `${BASE_URL}tasks/${task.firebaseId}.json`;
    
    await fetch(url, {
        method: 'DELETE'
    });
    
    await loadTasks();
    renderAllTasks();
    closeAddTaskOverlay();
}