// DOM ELEMENT VARIABLES
let titleInput;
let descInput; let dueDateInput;
let calendarIcon;
let urgentBtn;
let mediumBtn;
let lowBtn;
let priorityButtons;
let urgentColorImg;
let urgentWhiteImg;
let mediumColorImg;
let mediumWhiteImg;
let lowColorImg;
let lowWhiteImg;
let titleInputError;
let dueDateInputError;
let priorityColorImages;
let priorityWhiteImages;
let assignedToForm;
let assignedToWrapper;
let assignedToInputWrapper;
let assignedToInput;
let assignedToUsers;
let categoryWrapper;
let categoryInput;
let categoryTasks;
let technicalTask;
let userStory;
let subtasksInput;
let clearSubtasksBtn;
let subtaskVerticalDivider;
let addSubtaskBtn;
let subtasksList;
let subtaskItem;
let subtasks;
let clearFormBtn;
let addTaskBtn;
let dialogAddTaskBtn;
let addTaskSuccessToast;
let addTaskSuccessOverlay;

// Requirements set for add task form validation
let isTitleValid = false;
let isDueDateValid = false;
let isCategoryValid = false;

// BASE URL
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

// TASK DATA
let tasks = [];

// USER NAMES
let users = [];

async function initAddTaskElements() {
    initDOMElements();
    initAddTaskListeners();
    setMinDate();
    await loadUsers();
    await loadTasks();
    renderUsersDropdown();
    resetUserSelection();
} 

function checkFormValidity() {
    if (isTitleValid && isDueDateValid && isCategoryValid) {
        addTaskBtn.disabled = false;
        addTaskBtn.classList.remove("disabled-btn");
        dialogAddTaskBtn.disabled = false;
        dialogAddTaskBtn.classList.remove("disabled-btn");
    } else {
        addTaskBtn.disabled = true;
        addTaskBtn.classList.add("disabled-btn");
        dialogAddTaskBtn.disabled = true;
        dialogAddTaskBtn.classList.add("disabled-btn");
    }
}

function editSubtask(button) {
    let wrapper = button.closest(".subtask-item-wrapper");
    let editDiv = wrapper.querySelector("#subtask-edit");
    let inputLength = editDiv.querySelector(".subtask-edit-input").value.length;
    editDiv.classList.remove("dNone");
    editDiv.style.display = "flex";
    editDiv.querySelector(".subtask-edit-input").focus();  
    editDiv.querySelector(".subtask-edit-input").setSelectionRange(inputLength, inputLength);
    wrapper.querySelector("#subtask-item").classList.add("dNone");
}

function deleteSubtask(button) {
    button.closest(".subtask-item-wrapper").remove();
}

function confirmEditSubtask(button) {
    let wrapper = button.closest(".subtask-item-wrapper");
    let editInput = wrapper.querySelector(".subtask-edit-input");
    let subtaskText = wrapper.querySelector(".subtask-text");
    let editDiv = wrapper.querySelector("#subtask-edit");
    subtaskText.textContent = editInput.value;
    wrapper.querySelector("#subtask-item").classList.remove("dNone");
    wrapper.querySelector("#subtask-edit").classList.add("dNone");
    editDiv.classList.add("dNone");
    editDiv.style.display = "none";
}

function higlightSelectedPriority(priority) {
    resetPriorityImages();
    if (priority === "urgent") {
        highlightUrgentPriority();
    } else if (priority === "medium") {
        highlightMediumPriority();
    } else if (priority === "low") {
        highlightLowPriority()
    }   
}

function addTask() {
    const newTask = buildTaskObject();
    tasks.push(newTask);
    saveTaskData();
    addTaskSuccess();
}

function buildTaskObject() {
    return {
        id: generateUniqueId(),
        title: titleInput.value,
        description: descInput.value,
        dueDate: dueDateInput.value,
        priority: getSelectedPriority(),
        assignedTo: selectedUsers.map(user => user.name),
        category: categoryInput.value,
        categoryColor: categoryInput.value.trim().toLowerCase().split(' ').join('-'),
        subtasks: getFormattedSubtasks(),
        currentTask: `${currentTaskBar}`
    };
}

function addTaskSuccess() {
    addTaskBtn.disabled = true;
    addTaskSuccessToast.classList.add("show");
    addTaskSuccessOverlay.classList.add("show");
    setTimeout(() => {
        loadBoardPage();
    }, 1500);
    
}

async function saveTaskData() {
    let lastTask = tasks.length - 1;
    await fetch(`${BASE_URL}tasks.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks[lastTask])
    });
}

async function loadUsers() {
    users = [];
    let allUserData = await fetch(`${BASE_URL}users.json`);
    let allUserDataToJson = await allUserData.json(); 
    let UserKeysArray = Object.keys(allUserDataToJson);

    for (let userIndex = 0; userIndex < UserKeysArray.length; userIndex++) {
        users.push(
            {
                name : allUserDataToJson[UserKeysArray[userIndex]].name,
                avatarColor : allUserDataToJson[UserKeysArray[userIndex]].avatarColor
            }
        )
    }    
}

function openAssignedDropdown() {
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    users.classList.toggle("dNone");
    users.classList.toggle("dFlex");
    arrowdown.classList.toggle("dNone");
    arrowup.classList.toggle("dNone");
    document.getElementById("task-assigned-to-input").focus();
    assignedToInputWrapper.classList.add("blue-border");
}

function toggleAssignedDropdown(event) {
    event.stopPropagation();
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    users.classList.toggle("dNone");
    users.classList.toggle("dFlex");
    arrowdown.classList.toggle("dNone");
    arrowup.classList.toggle("dNone");
    checkDropdownState();
    if (users.classList.contains("dFlex")) {
        assignedToInputWrapper.classList.add("blue-border");
    }
}

function closeAssignedDropdown() {
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    if (!users) return;
    users.classList.add("dNone");
    users.classList.remove("dFlex");
    arrowdown.classList.remove("dNone");
    arrowup.classList.add("dNone");
    document.getElementById("task-assigned-to-input").value = "";
    filterAssignedUsers();
    checkDropdownState();
}

let selectedUsers = [];

function renderUsersDropdown() {
    assignedToUsers.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        let initials = getInitials(users[i].name);
        let color = users[i].avatarColor;
        assignedToUsers.insertAdjacentHTML("beforeend", renderUsersDropdownTemplate(users[i].name, initials, color));
    }
}

function toggleUserSelection(event, user, initials, color) {
    let element = event.currentTarget;
    element.classList.toggle("selected");
    element.querySelectorAll(".dropdown-user-checkbox").forEach(img => img.classList.toggle("dNone"));
    let index = selectedUsers.findIndex(u => u.name === user);
    if (index > -1) {
        selectedUsers.splice(index, 1);
    } else {
        selectedUsers.push({ name: user, initials: initials, color: color });
    }
    renderAssignedBadges();
}

function openCategoryDropdown() {
    categoryTasks.classList.toggle("dNone");
    categoryTasks.classList.toggle("dFlex");
    document.getElementById("task-category-input").focus();
}

function closeCategoryDropdown() {
    categoryTasks.classList.add("dNone");
    categoryTasks.classList.remove("dFlex");
}

function toggleCategoryDropdown(event) {
    event.stopPropagation();
    categoryTasks.classList.toggle("dNone");
    categoryTasks.classList.toggle("dFlex");
    document.getElementById("task-category-input").focus();
}

function clearFormular() {
    addTaskBtn.classList.add("disabled-btn");
    dialogAddTaskBtn.classList.add("disabled-btn");
    titleInput.value = "";
    titleInput.classList.remove("red-border")
    titleInputError.textContent = "";
    descInput.value = "";
    dueDateInput.value = "";
    dueDateInput.classList.remove("red-border")
    dueDateInputError.textContent = "";
    higlightSelectedPriority("medium");
    resetUserSelection();
    categoryInput.value = "";
    subtasksList.innerHTML = "";
}

/**
 * Retrieves all tasks from the backend and maps them into the local `tasks` array.
 *
 * The backend returns tasks as an object keyed by IDs, which is transformed into
 * an array to match the structure used throughout the application.
 */
async function loadTasks() { 
    tasks = [];
    let response = await fetch(`${BASE_URL}tasks.json`);
    let data = await response.json(); 
    
    if (data) {
        for (let key in data) {
            let singleTask = data[key];
            singleTask.firebaseId = key;
            tasks.push(singleTask);
        }
    }
}