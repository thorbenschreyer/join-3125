// DOM ELEMENT VARIABLES
let TITLE_INPUT;
let DESC_INPUT;
let DUE_DATE_INPUT;
let CALENDAR_ICON;
let URGENT_BTN;
let MEDIUM_BTN;
let LOW_BTN;
let PRIORITY_BUTTONS;
let URGENT_COLOR_IMG;
let URGENT_WHITE_IMG;
let MEDIUM_COLOR_IMG;
let MEDIUM_WHITE_IMG;
let LOW_COLOR_IMG;
let LOW_WHITE_IMG;
let TITLE_INPUT_ERROR;
let DUE_DATE_INPUT_ERROR;
let PRIORITY_COLOR_IMAGES;
let PRIORITY_WHITE_IMAGES;
let ASSIGNED_TO_FORM;
let ASSIGNED_TO_WRAPPER;
let ASSIGNED_TO_INPUT_WRAPPER;
let ASSIGNED_TO_INPUT;
let ASSIGNED_TO_USERS;
let CATEGORY_WRAPPER;
let CATEGORY_INPUT;
let CATEGORY_TASKS;
let TECHNICAL_TASK;
let USER_STORY;
let SUBTASKS_INPUT;
let CLEAR_SUBTASKS_BTN;
let SUBTASK_VERTICAL_DIVIDER;
let ADD_SUBTASK_BTN;
let SUBTASKS_LIST;
let SUBTASK_ITEM;
let SUBTASKS;
let CLEAR_FORM_BTN;
let ADDTASK_BTN;
let ADD_TASK_SUCCESS_TOAST;
let ADD_TASK_SUCCESS_OVERLAY;

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
    TITLE_INPUT = document.getElementById("task-title");
    DESC_INPUT = document.getElementById("task-description");
    DUE_DATE_INPUT = document.getElementById("task-due-date");
    URGENT_BTN = document.getElementById("task-prio-urgent-btn");
    MEDIUM_BTN = document.getElementById("task-prio-medium-btn");
    LOW_BTN = document.getElementById("task-prio-low-btn");
    PRIORITY_BUTTONS = [URGENT_BTN, MEDIUM_BTN, LOW_BTN];
    URGENT_COLOR_IMG = document.getElementById("task-prio-urgent-color");
    URGENT_WHITE_IMG = document.getElementById("task-prio-urgent-white");
    MEDIUM_COLOR_IMG = document.getElementById("task-prio-medium-color");
    MEDIUM_WHITE_IMG = document.getElementById("task-prio-medium-white");
    LOW_COLOR_IMG = document.getElementById("task-prio-low-color");
    LOW_WHITE_IMG = document.getElementById("task-prio-low-white");
    TITLE_INPUT_ERROR = document.getElementById("title-input-error");
    DUE_DATE_INPUT_ERROR = document.getElementById("due-date-input-error");
    PRIORITY_COLOR_IMAGES = [URGENT_COLOR_IMG, MEDIUM_COLOR_IMG, LOW_COLOR_IMG];
    PRIORITY_WHITE_IMAGES = [URGENT_WHITE_IMG, MEDIUM_WHITE_IMG, LOW_WHITE_IMG];
    ASSIGNED_TO_FORM = document.getElementById("assigned-to-form");
    ASSIGNED_TO_WRAPPER = document.getElementById("task-assigned-to-wrapper");
    ASSIGNED_TO_INPUT_WRAPPER = document.querySelector(".custom-dropdown-toggle");
    ASSIGNED_TO_INPUT = document.getElementById("task-assigned-to-input");
    ASSIGNED_TO_USERS = document.getElementById("task-assigned-to-users");
    CATEGORY_WRAPPER = document.getElementById("task-category-wrapper");
    CATEGORY_INPUT = document.getElementById("task-category-input");
    CATEGORY_TASKS = document.getElementById("task-category-tasks");
    TECHNICAL_TASK = document.getElementById("technical-task");
    USER_STORY = document.getElementById("user-story");
    SUBTASKS_INPUT = document.getElementById("subtasks-input");
    CLEAR_SUBTASKS_BTN = document.getElementById("clear-input-btn");
    SUBTASK_VERTICAL_DIVIDER = document.getElementById("subtasks-vertical-divider");
    ADD_SUBTASK_BTN = document.getElementById("add-subtask-btn");
    SUBTASKS_LIST = document.getElementById("subtasks-list");
    SUBTASK_ITEM = Array.from(document.getElementsByClassName("subtask-item"));
    CLEAR_FORM_BTN = document.getElementById("clear-task-btn");
    ADDTASK_BTN = document.getElementById("add-task-btn");
    ADD_TASK_SUCCESS_TOAST = document.getElementById("add-task-success-toast");
    ADD_TASK_SUCCESS_OVERLAY = document.getElementById("add-task-success-overlay");

    CALENDAR_ICON = document.getElementById("calendar-icon");
    document.addEventListener("click", function(event) {
    if (ASSIGNED_TO_WRAPPER && !ASSIGNED_TO_WRAPPER.contains(event.target)) {
        closeAssignedDropdown();
    }  
    if (CATEGORY_WRAPPER && !CATEGORY_WRAPPER.contains(event.target)) {
        closeCategoryDropdown()
    }
    if (SUBTASKS_INPUT && !SUBTASKS_INPUT.contains(event.target)) {
        hideSubtaskInputButtons();
    }
    });
    setMinDate();
    feedbackOnRequiredInput();
    await loadUsers();
    await loadTasks();
    renderUsersDropdown();
    resetUserSelection();
} 

function feedbackOnRequiredInput() {
    TITLE_INPUT.addEventListener("focus", function() {
        let titleInput = TITLE_INPUT.value;
        if (titleInput.length == 0) {
            TITLE_INPUT.classList.add("red-border")
            TITLE_INPUT_ERROR.classList.remove("dNone")
            TITLE_INPUT_ERROR.textContent = "This field is required";
        }
    }); 
    TITLE_INPUT.addEventListener("input", function() {
        let titleInput = TITLE_INPUT.value;
        if (titleInput.length == 0) {
            TITLE_INPUT.classList.add("red-border");
            TITLE_INPUT_ERROR.classList.remove("dNone");
            TITLE_INPUT_ERROR.textContent = "This field is required";
        } else if (titleInput.length > 0) {
            TITLE_INPUT.classList.remove("red-border");
            TITLE_INPUT_ERROR.classList.add("dNone");
        }
    });
    DUE_DATE_INPUT.addEventListener("focus", function() {
        let dueDateInput = DUE_DATE_INPUT.value;
        if (dueDateInput.length != 10) {
            DUE_DATE_INPUT_ERROR.textContent = "This field is required";
            DUE_DATE_INPUT.classList.add("red-border");
            DUE_DATE_INPUT_ERROR.classList.remove("dNone");
        }
    }); 
    //* DUE DATE type[text] variant
    // DUE_DATE_INPUT.addEventListener("input", function() {
    //     let dueDateInput = DUE_DATE_INPUT.value;
    //     const parts = dueDateInput.split("/");

    //     const day = parseInt(parts[0], 10);
    //     const month = parseInt(parts[1], 10) - 1;
    //     const year = parseInt(parts[2], 10);

    //     const date = new Date(year, month, day);
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day &&
    //         dueDateInput.length === 10 &&
    //         date >= today) {
    //         DUE_DATE_INPUT.classList.remove("red-border");
    //         DUE_DATE_INPUT_ERROR.classList.add("dNone");
    //     } else {
    //         DUE_DATE_INPUT.classList.add("red-border");
    //         DUE_DATE_INPUT_ERROR.classList.remove("dNone");
    //     }            
    // });
    DUE_DATE_INPUT.addEventListener("input", function() {
        let dueDateInput = DUE_DATE_INPUT.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDateInput.length == 10 && new Date(dueDateInput) >= today) {
            DUE_DATE_INPUT.classList.remove("red-border");
            DUE_DATE_INPUT_ERROR.classList.add("dNone");
        } else if (dueDateInput.length == 10 && new Date(dueDateInput) < today) {
            DUE_DATE_INPUT_ERROR.textContent = "Due date cannot be in the past";
            DUE_DATE_INPUT.classList.add("red-border");
            DUE_DATE_INPUT_ERROR.classList.remove("dNone");
        } else {
            DUE_DATE_INPUT_ERROR.textContent = "This field is required";
            DUE_DATE_INPUT.classList.add("red-border");
            DUE_DATE_INPUT_ERROR.classList.remove("dNone");
        }
    });
    CALENDAR_ICON.addEventListener("click", function() {
        DUE_DATE_INPUT.showPicker();
    });
    
    ASSIGNED_TO_INPUT.addEventListener("focus", function() {
        ASSIGNED_TO_INPUT_WRAPPER.classList.add("blue-border");
    });
    TECHNICAL_TASK.addEventListener("click", function() {
        CATEGORY_INPUT.value = "Technical Task";
        CATEGORY_INPUT.dispatchEvent(new Event("change"));
        closeCategoryDropdown();
    })
    USER_STORY.addEventListener("click", function() {
        CATEGORY_INPUT.value = "User Story";
        CATEGORY_INPUT.dispatchEvent(new Event("change"));
        closeCategoryDropdown();
    })
    CLEAR_SUBTASKS_BTN.addEventListener("click", function() {
        SUBTASKS_INPUT.value = "";
        hideSubtaskInputButtons();
    });
    ADD_SUBTASK_BTN.addEventListener("click", function() {
        if (SUBTASKS_INPUT.value.length > 0) {
        SUBTASKS_LIST.insertAdjacentHTML(
             "beforeend",
             `<div class="subtask-item-wrapper" ondblclick="editSubtask(this.querySelector('.edit-subtask-btn'))">   
                <li id="subtask-item" onmouseenter="showSubtaskButtons(this)" onmouseleave="hideSubtaskButtons(this)">
                    <div class="subtask-item-content">
                        <span class="subtask-text">${SUBTASKS_INPUT.value}</span>
                        <div id="subtask-item-btns" class="subtask-item-btns dNone">
                            <img class="edit-subtask-btn" src="../assets/icons/subtask_edit.svg" alt="" onclick="editSubtask(this)">
                            <span class="subtask-edit-divider">|</span>
                            <img class="delete-subtask-btn" src="../assets/icons/subtask_delete.svg" alt="" onclick="deleteSubtask(this)">
                        </div>
                    </div>
                </li>
                <div id="subtask-edit" class="subtask-item-edit dNone">
                    <input class="subtask-edit-input" type="text" name="subtasks" value="${SUBTASKS_INPUT.value}" onkeypress="if(event.key === 'Enter') confirmEditSubtask(this)"></input>
                    <div class="subtask-edit-btns">
                        <img class="edit-input-delete-btn" src="../assets/icons/subtask_delete.svg" alt="" onclick="deleteSubtask(this)">
                        <span class="subtask-edit-input-divider">|</span>
                        <img class="edit-input-check-btn" src="../assets/icons/subtask_check.svg" alt="" onclick="confirmEditSubtask(this)">
                    </div>
                </div>
              </div>
             `
            );
        SUBTASKS_INPUT.value = "";
        hideSubtaskInputButtons();
        }
    })
    SUBTASKS_INPUT.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            ADD_SUBTASK_BTN.click();
            showSubtaskInputButtons();
        }
    });
    SUBTASKS_INPUT.addEventListener("focus", function() {
        showSubtaskInputButtons();
    });
    TITLE_INPUT.addEventListener("change", function() {
        TITLE_INPUT.value.length > 0 ? isTitleValid = true : isTitleValid = false
        checkFormValidity()
    });
    DUE_DATE_INPUT.addEventListener("change", function() {
        let dueDateInput = DUE_DATE_INPUT.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDateInput.length == 10 && new Date(dueDateInput) >= today) {
            isDueDateValid = true;
        } else {
            isDueDateValid = false;
        }
        checkFormValidity()
    });
    CATEGORY_INPUT.addEventListener("change", function() {
        if (CATEGORY_INPUT.value == "Technical Task" || CATEGORY_INPUT.value == "User Story") {
            isCategoryValid = true;
        } else {
            isCategoryValid = false;
        }
        checkFormValidity()
    })
    CLEAR_FORM_BTN.addEventListener("click", function () {
        clearFormular();
    })
}

function showSubtaskInputButtons() {
    CLEAR_SUBTASKS_BTN.classList.remove("dNone");
    SUBTASK_VERTICAL_DIVIDER.classList.remove("dNone");
    ADD_SUBTASK_BTN.classList.remove("dNone");
}

function hideSubtaskInputButtons() {
    CLEAR_SUBTASKS_BTN.classList.add("dNone");
    SUBTASK_VERTICAL_DIVIDER.classList.add("dNone");
    ADD_SUBTASK_BTN.classList.add("dNone");
}

function checkFormValidity() {
    if (isTitleValid && isDueDateValid && isCategoryValid) {
        ADDTASK_BTN.disabled = false;
        ADDTASK_BTN.classList.remove("disabled-btn");
    } else {
        ADDTASK_BTN.disabled = true;
        ADDTASK_BTN.classList.add("disabled-btn");
    }
}

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


//* DUE DATE type[text] variant
// function isValidDate() {
//   const parts = DUE_DATE_INPUT.value.split("/");
//   if (parts.length !== 3) return false;

//   const day = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1; // JS Monate 0–11
//   const year = parseInt(parts[2], 10);

//   const date = new Date(year, month, day);

//   return (
//     date.getFullYear() === year &&
//     date.getMonth() === month &&
//     date.getDate() === day
//   );
// }

function setMinDate() {
    const TODAY = new Date().toISOString().split("T")[0];
    DUE_DATE_INPUT.min = TODAY;
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

function resetPriorityImages() {
    PRIORITY_COLOR_IMAGES.forEach(img => img.classList.remove("dNone"));
    PRIORITY_WHITE_IMAGES.forEach(img => img.classList.add("dNone"));
    URGENT_BTN.classList.remove("prio-urgent");
    MEDIUM_BTN.classList.remove("prio-medium");
    LOW_BTN.classList.remove("prio-low");
}

function highlightUrgentPriority() {
    URGENT_BTN.classList.add("prio-urgent");
    URGENT_COLOR_IMG.classList.add("dNone");
    URGENT_WHITE_IMG.classList.remove("dNone");

}

function highlightMediumPriority() {
    MEDIUM_BTN.classList.add("prio-medium");
    MEDIUM_COLOR_IMG.classList.add("dNone");
    MEDIUM_WHITE_IMG.classList.remove("dNone");
}

function highlightLowPriority() {
    LOW_BTN.classList.add("prio-low");
    LOW_COLOR_IMG.classList.add("dNone");
    LOW_WHITE_IMG.classList.remove("dNone");
}

function addTask() {
    let Subtasks = Array.from(document.querySelectorAll(".subtask-text"));
    let taskTitle = TITLE_INPUT.value;
    let taskDescription = DESC_INPUT.value;
    let taskDueDate = DUE_DATE_INPUT.value;
    let taskPriority;
    if (URGENT_BTN.classList.contains("prio-urgent")) {
        taskPriority = "urgent";
    } else if (MEDIUM_BTN.classList.contains("prio-medium")) {
        taskPriority = "medium";
    } else if (LOW_BTN.classList.contains("prio-low")) {
        taskPriority = "low";
    }
    let taskAssignedTo = selectedUsers.map(u => u.name)
    let taskCategory = CATEGORY_INPUT.value;
    let taskSubtasks = Subtasks.map(s => s.textContent);

    tasks.push({
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        assignedTo: taskAssignedTo,
        category: taskCategory,
        subtasks: taskSubtasks,
        currentTask: "to-do"
    });
    saveTaskData();
    addTaskSuccess();
}

function addTaskSuccess() {
    ADDTASK_BTN.disabled = true;
    ADD_TASK_SUCCESS_TOAST.classList.add("show");
    ADD_TASK_SUCCESS_OVERLAY.classList.add("show");
    setTimeout(() => {
        loadBoardPage();
    }, 1500);
}

async function saveTaskData() {
    let lastTask = tasks.length - 1;
    await fetch(`${BASE_URL}tasks.json`, {
        method: "POST",
        header: {
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
    ASSIGNED_TO_INPUT_WRAPPER.classList.add("blue-border");
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
        ASSIGNED_TO_INPUT_WRAPPER.classList.add("blue-border");
    }
}

function closeAssignedDropdown() {
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    users.classList.add("dNone");
    users.classList.remove("dFlex");
    arrowdown.classList.remove("dNone");
    arrowup.classList.add("dNone");
    document.getElementById("task-assigned-to-input").value = "";
    filterAssignedUsers();
    checkDropdownState();
}

function checkDropdownState() {
    if (ASSIGNED_TO_INPUT === document.activeElement) {
        ASSIGNED_TO_INPUT_WRAPPER.classList.add("blue-border");
    } else {
        ASSIGNED_TO_INPUT_WRAPPER.classList.remove("blue-border");
    }
}



let selectedUsers = [];

function renderUsersDropdown() {
    ASSIGNED_TO_USERS.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        let initials = getInitials(users[i].name);
        let color = users[i].avatarColor;
        ASSIGNED_TO_USERS.insertAdjacentHTML("beforeend", renderUsersDropdownTemplate(users[i].name, initials, color));
    }
}

function renderUsersDropdownTemplate(user, initials, color) {
    return `
        <div id="dropdown-user" class="dropdown-user" onclick="toggleUserSelection(event, '${user}', '${initials}', '${color}')">
            <div class="dropdown-user-badge" style="background-color: ${color}">${initials}</div>
            <span class="dropdown-user-name">${user}</span>
            <img class="dropdown-user-checkbox" src="../assets/icons/checkbox_default.svg" alt="">
            <img class="dropdown-user-checkbox dNone" src="../assets/icons/checkbox_checked.svg" alt="">
            <img class="dropdown-user-checkbox dNone" src="../assets/icons/checkbox_checked_sign.svg" alt="">
        </div>
    `;
}

function getInitials(name) {
    return name.split(" ").map(part => part.charAt(0).toUpperCase()).join("");
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
    let users = ASSIGNED_TO_USERS.querySelectorAll("#dropdown-user");
    for (let i = 0; i < users.length; i++) {
        let name = users[i].querySelector(".dropdown-user-name").textContent.toLowerCase();
        users[i].style.display = name.startsWith(searchText) ? "flex" : "none";
    }
}

function openCategoryDropdown() {
    CATEGORY_TASKS.classList.toggle("dNone");
    CATEGORY_TASKS.classList.toggle("dFlex");
    document.getElementById("task-category-input").focus();
}

function closeCategoryDropdown() {
    CATEGORY_TASKS.classList.add("dNone");
    CATEGORY_TASKS.classList.remove("dFlex");
}

function toggleCategoryDropdown(event) {
    event.stopPropagation();
    CATEGORY_TASKS.classList.toggle("dNone");
    CATEGORY_TASKS.classList.toggle("dFlex");
    document.getElementById("task-category-input").focus();
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

function clearFormular() {
    ADDTASK_BTN.classList.add("disabled-btn"); 
    TITLE_INPUT.value = "";
    TITLE_INPUT.classList.remove("red-border")
    TITLE_INPUT_ERROR.textContent = "";
    DESC_INPUT.value = "";
    DUE_DATE_INPUT.value = "";
    DUE_DATE_INPUT.classList.remove("red-border")
    DUE_DATE_INPUT_ERROR.textContent = "";
    higlightSelectedPriority("medium");
    resetUserSelection();
    CATEGORY_INPUT.value = "";
    SUBTASKS_LIST.innerHTML = "";
}

/**
 * Retrieves all tasks from the backend and maps them into the local `tasks` array.
 *
 * The backend returns tasks as an object keyed by IDs, which is transformed into
 * an array to match the structure used throughout the application.
 */
   async function loadTasks() { 
    tasks = [] 
    let allTasksData = await fetch(`${BASE_URL}tasks.json`);
    let allTasksDataToJson = await allTasksData.json(); 
    let TaskKeysArray = Object.keys(allTasksDataToJson);
    for (let taskIndex = 0; taskIndex < TaskKeysArray.length; taskIndex++) {
        tasks.push(
            {
                title: allTasksDataToJson[TaskKeysArray[taskIndex]].title,
                description: allTasksDataToJson[TaskKeysArray[taskIndex]].description,
                dueDate: allTasksDataToJson[TaskKeysArray[taskIndex]].dueDate,
                priority: allTasksDataToJson[TaskKeysArray[taskIndex]].priority,
                assignedTo: allTasksDataToJson[TaskKeysArray[taskIndex]].assignedTo,
                category: allTasksDataToJson[TaskKeysArray[taskIndex]].category,
                subtasks: allTasksDataToJson[TaskKeysArray[taskIndex]].subtasks,
                currentTask: allTasksDataToJson[TaskKeysArray[taskIndex]].currentTask,
            }
        )
    }    
}