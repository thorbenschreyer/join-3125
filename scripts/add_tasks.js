// DOM ELEMENT VARIABLES
let titleInput;
let descInput;
let dueDateInput;
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

// Track the validation state of the required fields so the submit button only becomes available when the form is complete.
let isTitleValid = false;
let isDueDateValid = false;
let isCategoryValid = false;

/**
 * Restores the required-field validation flags to their default state.
 */
function resetFormValidationState() {
    isTitleValid = false;
    isDueDateValid = false;
    isCategoryValid = false;
}

// Firebase backend endpoint.
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

// Stores all loaded tasks.
let tasks = [];

// Stores the users available for assignment.
let users = [];

// Stores the users currently selected in the assignment dropdown.
let selectedUsers = [];

/**
 * Prepares the add-task view by wiring DOM references, listeners, and initial form data.
 *
 * Loads users and tasks before rendering the assignment dropdown so the form starts in a consistent state.
 */
async function initAddTaskElements() {
    initDOMElements();
    resetFormValidationState();
    initAddTaskListeners();
    setMinDate();
    await loadUsers();
    await loadTasks();
    renderUsersDropdown();
    resetUserSelection();
}

/**
 * Loads all users from Firebase and stores only the fields needed for assignment display.
 */
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

/**
 * Retrieves all tasks from the backend and stores them in the local `tasks` array.
 *
 * Firebase returns tasks as an object keyed by database IDs, so each entry is
 * converted into an array item and keeps its key for later updates.
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

/**
 * Enables the add-task button only when all required fields are valid.
 */
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

// PRIORITY
/**
 * Applies the selected priority style after clearing the previous visual state.
 */
function highlightSelectedPriority(priority) {
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
};  
// ASSIGNED TO
/**
 * Renders the assignment dropdown from the loaded user list.
 */
function renderUsersDropdown() {
    assignedToUsers.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        let initials = getInitials(users[i].name);
        let color = users[i].avatarColor;
        assignedToUsers.insertAdjacentHTML("beforeend", renderUsersDropdownTemplate(users[i].name, initials, color));
    }
}

/**
 * Opens the assignment dropdown and moves focus to the input for immediate filtering.
 */
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

/**
 * Toggles the assignment dropdown without triggering the outside-click handler.
 */
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

/**
 * Closes the assignment dropdown and resets the filter input for the next interaction.
 */
function closeAssignedDropdown() {
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    if (!users || !arrowdown || !arrowup) return;
    users.classList.add("dNone");
    users.classList.remove("dFlex");
    arrowdown.classList.remove("dNone");
    arrowup.classList.add("dNone");
    document.getElementById("task-assigned-to-input").value = "";
    filterAssignedUsers();
    checkDropdownState();
}

/**
 * Toggles a user in the current assignment selection and refreshes the badge preview.
 */
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

// CATEGORY
/**
 * Opens the category dropdown and moves focus to the input.
 */
function openCategoryDropdown() {
    categoryTasks.classList.remove("dNone");
    categoryTasks.classList.add("dFlex");
    document.getElementById("task-category-input").focus();
}

/**
 * Toggles the category dropdown without triggering the outside-click handler.
 */
function toggleCategoryDropdown(event) {
    event.stopPropagation();
    categoryTasks.classList.toggle("dNone");
    categoryTasks.classList.toggle("dFlex");
    document.getElementById("task-category-input").focus();
}

/**
 * Closes the category dropdown.
 */
function closeCategoryDropdown() {
    categoryTasks.classList.add("dNone");
    categoryTasks.classList.remove("dFlex");
}

// SUBTASKS
/**
 * Switches a subtask into edit mode and places the cursor at the end of the current text.
 */
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

/**
 * Applies the edited subtask text and restores the default display state.
 */
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

/**
 * Removes the selected subtask from the current form state.
 */
function deleteSubtask(button) {
    button.closest(".subtask-item-wrapper").remove();
}

// FORM ACTIONS
/**
 * Resets the form inputs and restores the default add-task state.
 */
function clearFormular() {
    dialogAddTaskBtn.classList.add("disabled-btn");
    resetFormValidationState();
    addTaskBtn.classList.add("disabled-btn"); 
    titleInput.value = "";
    titleInput.classList.remove("red-border")
    titleInputError.textContent = "";
    descInput.value = "";
    dueDateInput.value = "";
    dueDateInput.classList.remove("red-border")
    dueDateInputError.textContent = "";
    highlightSelectedPriority("medium");
    resetUserSelection();
    categoryInput.value = "";
    subtasksList.innerHTML = "";
}

/**
 * Creates a task object from the current form state before it is saved.
 */
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
        currentTask: 'to-do'
    };
}

/**
 * Adds the current form data as a new task and starts the save flow.
 */
function addTask() {
    const newTask = buildTaskObject();
    tasks.push(newTask);
    saveTaskData();
    addTaskSuccess();
}

/**
 * Persists the newly added task to Firebase after it has been appended to the local tasks list.
 */
async function saveTaskData() {
    let lastTaskIndex = tasks.length - 1;
    await fetch(`${BASE_URL}tasks.json`, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks[lastTaskIndex])
    });
}

/**
 * Shows the success feedback and redirects to the board after a 1.5 second delay.
 */
function addTaskSuccess() {
    addTaskBtn.disabled = true;
    addTaskSuccessToast.classList.add("show");
    addTaskSuccessOverlay.classList.add("show");
    setTimeout(() => {
        loadBoardPage();
    }, 1500);
}