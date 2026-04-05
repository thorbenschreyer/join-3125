let currentTaskBar = "todo-tasks";
let i = 0;
let allTasks = [
    {
        'id' : 0,
        'category' : 'User Story', 
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
    }
];

let taskCategory = allTasks[i].category;
let taskTitle = allTasks[i].title;
let taskDescription = allTasks[i].description;
let taskSubtasks = allTasks[i].subtasks;
let taskDueDate = allTasks[i].due_date;
let taskAssignedTo = allTasks[i].assigned_to;
let taskPriority = allTasks[i].priority;
let taskCurrentTask = allTasks[i].current_task;


function boardInit() {
    renderSmallTask();
}

async function openAddTaskOverlay(selectedTaskBar) {
    await loadHtmlPage('add-task-dialog', './templates/add_tasks.html');
    const overlay = document.getElementById('add-task-overlay');
    const addTaskFooter = document.getElementById('add-task-footer');
    const dialogTaskFooter = document.getElementById('add-task-dialog-footer');
    addTaskFooter.classList.add('d-none');
    dialogTaskFooter.classList.remove('d-none');
    currentTaskBar = selectedTaskBar + '-tasks';
    console.log('Dialog gerendert');
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

// function renderSmallTask() {
//     const taskContainer = document.getElementById(currentTaskBar);
//     removePlaceholder(taskContainer);
//     taskContainer.insertAdjacentHTML('beforeend', smallTask());
//     console.log(taskAssignedTo);
// }

function renderTodos(i) {
    let todo = allTasks.filter(t => t['current_task'] == 'todo');
    const todoTaskBar = document.getElementById();
    for (i = 0; i < allTasks.length; i++) {
        const element = array[i];
        
    }
}

function removePlaceholder(container) {
    const placeholder = container.querySelector('.placeholder-task');
    if (placeholder) {
        placeholder.classList.add('d-none');
    }
}