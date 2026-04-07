let currentTaskBar = "todo-tasks";
let currentDraggedElement;
let allTasks = [
    {
        'id' : 0,
        'category' : 'User Story',
        'category_color' : 'user', 
        'title' :  'Kochwelt Page & Recipe Recommander',
        'description' : 'Build start page with recipe recommendation.',
        'subtasks' : [
            {
                'id' : 0,
                'subtask' : 'Implement Recipe Recommendation',
                'current-state' : 'closed',
            },
            {
                'id' : 1,
                'subtask' : 'Start Page Layout',
                'current-state' : 'open',
            }
        ],
        'due_date' : '10/05/2023',
        'assigned_to' : [
            'Emmanuel Mauer',
            'Marcel Bauer',
            'Anton Mayer'
        ],
        'priority' : 'Medium',
        'current_task' : 'todo'
    }, {
        'id' : 1,
        'category' : 'Technical Task',
        'category_color' : 'technical', 
        'title' :  'CSS Architecture Planning',
        'description' : 'Define CSS naming conventions and stucture.',
        'subtasks' : [
            {
                'id' : 0,
                'subtask' : 'Establish CSS Methodology',
                'current-state' : 'closed',
            },
            {
                'id' : 1,
                'subtask' : 'Setup Base Styles',
                'current-state' : 'closed',
            }
        ],
        'due_date' : '02/09/2023',
        'assigned_to' : [
            'Sofia Müller',
            'Benedikt Ziegler'
        ],
        'priority' : 'urgent',
        'current_task' : 'in-progress'
    }


];


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
    let todo = allTasks.filter(t => t['current_task'] == 'todo');
    const todoTaskBar = document.getElementById('todo-tasks');
    todoTaskBar.innerHTML = "";
    if (todo.length == 0) {
        todoTaskBar.innerHTML = renderPlaceholderTemplate('to do');
        return;
    };
    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        todoTaskBar.innerHTML += smallTask(element);
    }; 
}


function renderInProgressTasks() {
    let inProgress = allTasks.filter(t => t['current_task'] == 'in-progress');
    const inProgressTaskBar = document.getElementById('in-progress-tasks');
    inProgressTaskBar.innerHTML = "";
    if (inProgress.length == 0) {
        inProgressTaskBar.innerHTML = renderPlaceholderTemplate('In Progress');
        return;
    };
    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        inProgressTaskBar.innerHTML += smallTask(element);
    }; 
}


function renderAwaitFeedbackTasks() {
    let awaitFeedback = allTasks.filter(t => t['current_task'] == 'await-feedback');
    const awaitFeedbackTaskBar = document.getElementById('await-feedback-tasks');
    awaitFeedbackTaskBar.innerHTML = "";
    if (awaitFeedback.length == 0) {
        awaitFeedbackTaskBar.innerHTML = renderPlaceholderTemplate('Awaiting Feedback'); 
        return;
    };
    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        awaitFeedbackTaskBar.innerHTML += smallTask(element);
    }; 
}


function renderDoneTasks() {
    let done = allTasks.filter(t => t['current_task'] == 'done');
    const doneTaskBar = document.getElementById('done-tasks');
    doneTaskBar.innerHTML = "";
    if (done.length == 0) {
        doneTaskBar.innerHTML = renderPlaceholderTemplate('Done');
        return;
    };
    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        doneTaskBar.innerHTML += smallTask(element);
    }; 
}


function startDragging(event, id) {
    currentDraggedElement = id;
    event.dataTransfer.setData('text/plain', id.toString());
}

function allowDrop(event) {
    event.preventDefault();
}

function movingTo(event, category) {
    event.preventDefault();
    allTasks[currentDraggedElement].current_task = category;
    boardInit();
}
