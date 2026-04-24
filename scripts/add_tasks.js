/**
 * Firebase backend endpoint.
 */
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

/**
 * Stores all loaded tasks.
 */
let tasks = [];

/**
 * Stores the users available for assignment.
 */
let users = [];

/**
 * Stores the users currently selected in the assignment dropdown.
 */
let selectedUsers = [];

/**
 * Prepares the add-task view by wiring DOM references, listeners, and initial form data.
 *
 * Loads users and tasks before rendering the assignment dropdown so the form starts in a consistent state.
 */
async function initAddTaskElements() {
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
    let allUserData = await fetch(`${BASE_URL}users.json`, {
        cache: "no-store"
    });
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
            if (singleTask) {
                singleTask.firebaseId = key;
                tasks.push(singleTask);
            }
        }
    }
}

/**
 * Enables the add-task button only when all required fields are valid.
 */
function checkFormValidity() {
    const title = document.getElementById("task-title-input");
    const dueDate = document.getElementById("task-due-date-input");
    const category = document.getElementById("task-category-input");
    const addBtn = document.getElementById("add-task-btn");
    const dialogBtn = document.getElementById("dialog-add-task-btn");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isValid =
        title.value.trim().length > 0 &&
        dueDate.value.length === 10 && new Date(dueDate.value) >= today &&
        (category.value === "Technical Task" || category.value === "User Story");

    addBtn.disabled = !isValid;
    addBtn.classList.toggle("disabled-btn", !isValid);
    dialogBtn.disabled = !isValid;
    dialogBtn.classList.toggle("disabled-btn", !isValid);
}

/**
 * Applies the selected priority style after clearing the previous visual state.
 * @param {string} priority The priority level to apply ("urgent", "medium", or "low").
 */
function highlightSelectedPriority(priority) {
    const prio = getAddTaskPrioElements();
    resetPriorityButtons(prio.colorImgs, prio.whiteImgs, prio.buttons);

    if (priority === "urgent") {
        highlightPriority(prio.buttons[0], prio.colorImgs[0], prio.whiteImgs[0], "prio-urgent");
    } else if (priority === "medium") {
        highlightPriority(prio.buttons[1], prio.colorImgs[1], prio.whiteImgs[1], "prio-medium");
    } else if (priority === "low") {
        highlightPriority(prio.buttons[2], prio.colorImgs[2], prio.whiteImgs[2], "prio-low");
    }
}

/**
 * Renders the assignment dropdown from the loaded user list.
 */
function renderUsersDropdown() {
    document.getElementById("task-assigned-to-users").innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        let initials = getInitials(users[i].name);
        let color = users[i].avatarColor;
        document.getElementById("task-assigned-to-users").insertAdjacentHTML("beforeend", renderUsersDropdownTemplate(users[i].name, initials, color));
    }
}

/**
 * Opens the assignment dropdown and moves focus to the input for immediate filtering.
 */
function openAssignedDropdown() {
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    users.classList.remove("dNone");
    users.classList.add("dFlex");
    arrowdown.classList.add("dNone");
    arrowup.classList.remove("dNone");
    document.getElementById("task-assigned-to-input").focus();
    document.querySelector(".custom-dropdown-toggle").classList.add("blue-border");
    closeCategoryDropdown();
    filterAssignedUsers();
}

/**
 * Toggles the assignment dropdown without triggering the outside-click handler.
 * @param {Event} event The click event triggered by the user interaction.
 */
function toggleAssignedDropdown(event) {
    event.stopPropagation();
    resetSubtaskInputState();
    let users = document.getElementById("task-assigned-to-users");
    let arrowdown = document.getElementById("dropdown-arrow");
    let arrowup = document.getElementById("dropup-arrow");
    users.classList.toggle("dNone");
    users.classList.toggle("dFlex");
    arrowdown.classList.toggle("dNone");
    arrowup.classList.toggle("dNone");
    document.getElementById("task-assigned-to-input").focus();
    checkDropdownState();
    if (users.classList.contains("dFlex")) {
        document.querySelector(".custom-dropdown-toggle").classList.add("blue-border");
    }
    closeCategoryDropdown();
    filterAssignedUsers();
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
    checkDropdownState();
}

/**
 * Toggles a user in the current assignment selection and refreshes the badge preview.
 * @param {Event} event The click event triggered by the user interaction.
 * @param {string} user The name of the user to toggle in the selection.
 * @param {string} initials The initials of the user for badge display.
 * @param {string} color The avatar color of the user for badge display.
 */
function toggleUserSelection(event, user, initials, color) {
    let element = event.currentTarget;
    element.classList.toggle("selected");
    element.ariaChecked = element.classList.contains("selected") ? "true" : "false";
    element.querySelectorAll(".dropdown-user-checkbox").forEach(img => img.classList.toggle("dNone"));
    let index = selectedUsers.findIndex(u => u.name === user);
    if (index > -1) {
        selectedUsers.splice(index, 1);
    } else {
        selectedUsers.push({ name: user, initials: initials, color: color });
    }
    renderAssignedBadges();
    document.querySelector(".custom-dropdown-toggle").classList.add("blue-border");
}

/**
 * Toggles the category dropdown without triggering the outside-click handler.
 * @param {Event} event The click event triggered by the user interaction.
 */
function toggleCategoryDropdown(event) {
    event.stopPropagation();
    resetSubtaskInputState();
    let arrowdown = document.getElementById("category-dropdown-arrow");
    let arrowup = document.getElementById("category-dropup-arrow");
    document.getElementById("task-category-tasks").classList.toggle("dNone");
    document.getElementById("task-category-tasks").classList.toggle("dFlex");
    arrowdown.classList.toggle("dNone");
    arrowup.classList.toggle("dNone");
    document.getElementById("task-category-input").focus();
    closeAssignedDropdown();
}

/**
 * Closes the category dropdown.
 */
function closeCategoryDropdown() {
    let arrowdown = document.getElementById("category-dropdown-arrow");
    let arrowup = document.getElementById("category-dropup-arrow");
    document.getElementById("task-category-tasks").classList.add("dNone");
    document.getElementById("task-category-tasks").classList.remove("dFlex");
    if (arrowdown && arrowup) {
        arrowdown.classList.remove("dNone");
        arrowup.classList.add("dNone");
    }
}

/**
 * Switches a subtask into edit mode and places the cursor at the end.
 * Adds a bottom margin to the wrapper for better visibility.
 * * @param {HTMLElement} button The button element that triggered the edit action.
 */
function editSubtask(button) {
    closeAllSubtaskEdits();
    hideSubtaskError();
    document.getElementById("subtasks-input").classList.remove("red-border");
    let wrapper = button.closest(".subtask-item-wrapper");
    let editDiv = wrapper.querySelector("#subtask-edit");
    let input = editDiv.querySelector(".subtask-edit-input");
    editDiv.classList.remove("dNone");
    editDiv.style.display = "flex";
    input.focus();  
    input.setSelectionRange(input.value.length, input.value.length);
    wrapper.querySelector("#subtask-item").classList.add("dNone");
    wrapper.style.marginBottom = "-1px";
    wrapper.style.padding = "0 10px 0 18px";
}

/**
 * Applies the edited subtask text and restores the default display state.
 * Removes the previously added bottom margin from the wrapper.
 * * @param {HTMLElement} button The button element that triggered the confirm action.
 */
function confirmEditSubtask(button) {
    let wrapper = button.closest(".subtask-item-wrapper");
    let editInput = wrapper.querySelector(".subtask-edit-input");
    if (editInput.value.trim() === "") {
        showSubtaskError();
        wrapper.querySelector(".subtask-item-edit").classList.add("subtask-edit-red-border");
        editInput.addEventListener("focus", function() {
            wrapper.querySelector(".subtask-item-edit").classList.remove("subtask-edit-red-border");
            hideSubtaskError();
        }, { once: true });
        return;
    }
    wrapper.querySelector(".subtask-text").textContent = editInput.value;
    wrapper.querySelector("#subtask-item").classList.remove("dNone");
    let editDiv = wrapper.querySelector("#subtask-edit");
    editDiv.classList.add("dNone");
    editDiv.style.display = "none";
    wrapper.style.marginBottom = "";
    wrapper.style.padding = "4px 10px 4px 18px";
    hideSubtaskError();
}

/**
 * Removes the selected subtask from the current form state.
 * The margin is automatically removed since the element is destroyed.
 * * @param {HTMLElement} button The button element that triggered the delete action.
 */
function deleteSubtask(button) {
    button.closest(".subtask-item-wrapper").remove();
}
/**
 * Resets the form inputs and restores the default add-task state.
 */
function clearFormular() {
    document.getElementById("dialog-add-task-btn").classList.add("disabled-btn");
    document.getElementById("add-task-btn").classList.add("disabled-btn");
    document.getElementById("add-task-btn").disabled = true; 
    document.getElementById("task-title-input").value = "";
    document.getElementById("task-description-input").value = "";
    document.getElementById("task-due-date-input").value = "";
    hideTitleError();
    hideDueDateError();
    hideCategoryError();
    highlightSelectedPriority("medium");
    resetUserSelection();
    document.getElementById("task-category-input").value = "";
    document.getElementById("subtasks-input").value = "";
    document.getElementById("subtasks-list").innerHTML = "";
    hideSubtaskError();
    document.getElementById("subtasks-input").classList.remove("red-border");
    hideUnsavedInputError();
}

/**
 * Creates a task object from the current form state before it is saved.
 * @return {Object} The task object containing all relevant fields for storage and display.
 */
function buildTaskObject() {
    return {
        id: generateUniqueId(),
        title: document.getElementById("task-title-input").value,
        description: document.getElementById("task-description-input").value,
        dueDate: document.getElementById("task-due-date-input").value,
        priority: getSelectedPriority(),
        assignedTo: selectedUsers.map(user => user.name),
        category: document.getElementById("task-category-input").value,
        categoryColor: document.getElementById("task-category-input").value.trim().toLowerCase().split(' ').join('-'),
        subtasks: getFormattedSubtasks(),
        currentTask: `${currentTaskBar}`
    };
}

/**
 * Adds the current form data as a new task and starts the save flow.
 */
function addTask() {
    if (!validateUnsavedSubtasks()) return;
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
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks[lastTaskIndex])
    });
}

/**
 * Shows the success feedback and redirects to the board after a 1.5 second delay.
 */
function addTaskSuccess() {
    document.getElementById("add-task-btn").disabled = true;
    document.getElementById("add-task-success-toast").classList.add("show");
    document.getElementById("add-task-success-overlay").classList.add("show");
    setTimeout(() => {
        loadBoardPage();
    }, 1500);
}

/**
 * Checks for unsaved subtask inputs and shows an error if found.
 * @returns {boolean} True if inputs are clear/saved, false if blocked.
 */
function validateUnsavedSubtasks() {
    let mainText = document.getElementById("subtasks-input").value.trim();
    if (mainText !== "") {
        hideSubtaskError();
        document.getElementById("unsaved-input-error").classList.add("subtask-input-error-visible");
        document.getElementById("subtasks-input").classList.add("red-border");
        return false;
    }
    return true;
}

/**
 * Hides the error message for unsaved subtasks.
 */
function hideUnsavedInputError() {
    document.getElementById("unsaved-input-error").classList.remove("subtask-input-error-visible");
    document.getElementById("subtasks-input").classList.remove("red-border");
}