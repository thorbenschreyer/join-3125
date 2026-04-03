let currentTaskBar = "todo-tasks";

function boardInit() {
    renderSmallTask();
}

async function openAddTaskOverlay(selectedTaskBar) {
    await loadHtmlPage('add-task-dialog', './templates/add_tasks.html');
    const overlay = document.getElementById('add-task-overlay');
    const addTaskFooter = document.getElementById('add-task-footer');
    addTaskFooter.classList.add('d-none');
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

function renderSmallTask() {
    const taskContainer = document.getElementById(currentTaskBar);
    removePlaceholder(taskContainer);
    taskContainer.insertAdjacentHTML('beforeend', smallTask());
    console.log(currentTaskBar);
}

function removePlaceholder(container) {
    const placeholder = container.querySelector('.placeholder-task');
    if (placeholder) {
        placeholder.classList.add('d-none');
    }
}