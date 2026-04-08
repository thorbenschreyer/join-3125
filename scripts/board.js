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
        const closedSubtasksLength = todo[index].subtasks.filter(d => d['current-state'] == 'closed').length;
        todoTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
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
        const closedSubtasksLength = inProgress[index].subtasks.filter(d => d['current-state'] == 'closed').length;
        inProgressTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
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
        const closedSubtasksLength = awaitFeedback[index].subtasks.filter(d => d['current-state'] == 'closed').length;
        awaitFeedbackTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
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
        const closedSubtasksLength = done[index].subtasks.filter(d => d['current-state'] == 'closed').length;
        doneTaskBar.innerHTML += smallTask(element, closedSubtasksLength, id);
        fillDoneSubtaskBar(element, closedSubtasksLength, id);
    }; 
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
        renderTaskDialog(currentTask);
        showDialogOverlay();
        getAssignedToNames(id);
    }
}

function renderTaskDialog(task) {
    const dialogContainer = document.getElementById('add-task-dialog');
    dialogContainer.innerHTML = renderDialogTask(task);
}

function getAssignedToNames(id) {
    const smallTaskNamesContainer = document.getElementById(`small-task-user-badges-container-${id}`);
    const taskNamesContainer = document.getElementById('dialog-task-user-badges');
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