function openAddTaskOverlay() {
    const overlay = document.getElementById('add-task-overlay');
    overlay.classList.remove('d-none')    
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