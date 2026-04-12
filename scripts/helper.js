// HELPER FUNCTIONS
// DOM ELEMENTS INITIALIZATION
function initInputElements(params) {
    titleInput = document.getElementById("task-title");
    titleInputError = document.getElementById("title-input-error");
    descInput = document.getElementById("task-description");
    dueDateInput = document.getElementById("task-due-date");
    dueDateInputError = document.getElementById("due-date-input-error");
    calendarIcon = document.getElementById("calendar-icon");
}

function initPriorityElements() {
    urgentBtn = document.getElementById("task-prio-urgent-btn");
    mediumBtn = document.getElementById("task-prio-medium-btn");
    lowBtn = document.getElementById("task-prio-low-btn");
    priorityButtons = [urgentBtn, mediumBtn, lowBtn];
    urgentColorImg = document.getElementById("task-prio-urgent-color");
    urgentWhiteImg = document.getElementById("task-prio-urgent-white");
    mediumColorImg = document.getElementById("task-prio-medium-color");
    mediumWhiteImg = document.getElementById("task-prio-medium-white");
    lowColorImg = document.getElementById("task-prio-low-color");
    lowWhiteImg = document.getElementById("task-prio-low-white");
    priorityColorImages = [urgentColorImg, mediumColorImg, lowColorImg];
    priorityWhiteImages = [urgentWhiteImg, mediumWhiteImg, lowWhiteImg];
}

function initAssignedToElements() {
    assignedToForm = document.getElementById("assigned-to-form");
    assignedToWrapper = document.getElementById("task-assigned-to-wrapper");
    assignedToInputWrapper = document.querySelector(".custom-dropdown-toggle");
    assignedToInput = document.getElementById("task-assigned-to-input");
    assignedToUsers = document.getElementById("task-assigned-to-users");
}

function initCategoryElements() {
    categoryWrapper = document.getElementById("task-category-wrapper");
    categoryInput = document.getElementById("task-category-input");
    categoryTasks = document.getElementById("task-category-tasks");
    technicalTask = document.getElementById("technical-task");
    userStory = document.getElementById("user-story");
}

function initSubtasksElements() {
    subtasksInput = document.getElementById("subtasks-input");
    clearSubtasksBtn = document.getElementById("clear-input-btn");
    subtaskVerticalDivider = document.getElementById("subtasks-vertical-divider");
    addSubtaskBtn = document.getElementById("add-subtask-btn");
    subtasksList = document.getElementById("subtasks-list");
    subtaskItem = Array.from(document.getElementsByClassName("subtask-item"));
}

function initFormBtnElements() {
    clearFormBtn = document.getElementById("clear-task-btn");
    addTaskBtn = document.getElementById("add-task-btn");
    dialogAddTaskBtn = document.getElementById("dialog-add-task-btn");
}

function initToastElements() {
    addTaskSuccessToast = document.getElementById("add-task-success-toast");
    addTaskSuccessOverlay = document.getElementById("add-task-success-overlay");
}

function initDOMElements() {
    initInputElements();
    initPriorityElements();
    initAssignedToElements();
    initCategoryElements();
    initSubtasksElements();
    initFormBtnElements();
    initToastElements();
}
confirmEditSubtask

// TITLE
function showTitleError() {
    titleInput.classList.add("red-border");
    titleInputError.classList.remove("dNone");
    titleInputError.textContent = "This field is required";
}

// DUE DATE
function setMinDate() {
    const TODAY = new Date().toISOString().split("T")[0];
    dueDateInput.min = TODAY;
}

function showDueDateError() {
    dueDateInput.classList.add("red-border");
    dueDateInputError.classList.remove("dNone");
}

function hideDueDateError() {
    dueDateInput.classList.remove("red-border");
    dueDateInputError.classList.add("dNone");
}

// PRIORITY
function resetPriorityImages() {
    priorityColorImages.forEach(img => img.classList.remove("dNone"));
    priorityWhiteImages.forEach(img => img.classList.add("dNone"));
    urgentBtn.classList.remove("prio-urgent");
    mediumBtn.classList.remove("prio-medium");
    lowBtn.classList.remove("prio-low");
}

function highlightLowPriority() {
    lowBtn.classList.add("prio-low");
    lowColorImg.classList.add("dNone");
    lowWhiteImg.classList.remove("dNone");
}

function highlightMediumPriority() {
    mediumBtn.classList.add("prio-medium");
    mediumColorImg.classList.add("dNone");
    mediumWhiteImg.classList.remove("dNone");
}

function highlightUrgentPriority() {
    urgentBtn.classList.add("prio-urgent");
    urgentColorImg.classList.add("dNone");
    urgentWhiteImg.classList.remove("dNone");

}

// ASSIGNED TO
function checkDropdownState() {
    if (assignedToInput === document.activeElement) {
        assignedToInputWrapper.classList.add("blue-border");
    } else {
        assignedToInputWrapper.classList.remove("blue-border");
    }
}

function getInitials(name) {
    return name.split(" ").map(part => part.charAt(0).toUpperCase()).join("");
}

function renderAssignedBadges() {
    let badgeContainer = document.getElementById("assigned-badges");
    badgeContainer.innerHTML = "";
    for (let i = 0; i < selectedUsers.length; i++) {
        let u = selectedUsers[i];
        badgeContainer.insertAdjacentHTML("beforeend",
            `<div class="assigned-badge" style="background-color: ${u.color}">${u.initials}</div>`
        );
    }
}

function filterAssignedUsers() {
    let searchText = document.getElementById("task-assigned-to-input").value.toLowerCase();
    let users = assignedToUsers.querySelectorAll("#dropdown-user");
    for (let i = 0; i < users.length; i++) {
        let name = users[i].querySelector(".dropdown-user-name").textContent.toLowerCase();
        users[i].style.display = name.startsWith(searchText) ? "flex" : "none";
    }
}

function resetUserSelection() {
    let badgeContainer = document.getElementById("assigned-badges");
    document.querySelectorAll(".dropdown-user").forEach(el => {
        el.classList.remove("selected");
        let imgs = el.querySelectorAll(".dropdown-user-checkbox");
        imgs[0].classList.remove("dNone");
        imgs[1].classList.add("dNone");
        imgs[2].classList.add("dNone");
    });
    badgeContainer.innerHTML = "";
    selectedUsers = [];
}

// SUBTASK
function showSubtaskButtons(item) {
    item.querySelector(".subtask-item-btns").style.display = "flex";
    item.querySelector(".subtask-item-btns").classList.remove("dNone");
    item.parentElement.style.backgroundColor = "#eeeeee";
}

function hideSubtaskButtons(item) {
    item.querySelector(".subtask-item-btns").style.display = "none";
    item.querySelector(".subtask-item-btns").classList.add("dNone");
    item.parentElement.style.backgroundColor = "transparent";
}

function showSubtaskInputButtons() {
    clearSubtasksBtn.classList.remove("dNone");
    subtaskVerticalDivider.classList.remove("dNone");
    addSubtaskBtn.classList.remove("dNone");
}

function hideSubtaskInputButtons() {
    clearSubtasksBtn.classList.add("dNone");
    subtaskVerticalDivider.classList.add("dNone");
    addSubtaskBtn.classList.add("dNone");
}

// BUILD TASK OBJECT
function getSelectedPriority() {
    if (urgentBtn.classList.contains('prio-urgent')) return 'urgent';
    if (mediumBtn.classList.contains('prio-medium')) return 'medium';
    if (lowBtn.classList.contains('prio-low')) return 'low';
    return '';
}

function getFormattedSubtasks() {
    const subtaskNodes = Array.from(document.querySelectorAll('.subtask-text'));
    return subtaskNodes.map((node, index) => ({
        id: index,
        subtask: node.textContent,
        'current_state': 'open'
    }));
}

function generateUniqueId() {
    if (tasks.length === 0) {
        return 0;
    }
    const highestId = Math.max(...tasks.map(task => task.id));
    return highestId + 1;
}