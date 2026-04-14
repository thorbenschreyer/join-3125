/**
 * Initializes all DOM references required by the add-task view.
 */
function initDOMElements() {
    initInputElements();
    initPriorityElements();
    initAssignedToElements();
    initCategoryElements();
    initSubtasksElements();
    initFormBtnElements();
    initToastElements();
}

// INPUT ELEMENTS
/**
 * Initializes the DOM references for the main text and date inputs.
 */
function initInputElements() {
    titleInput = document.getElementById("task-title");
    titleInputError = document.getElementById("title-input-error");
    descInput = document.getElementById("task-description");
    dueDateInput = document.getElementById("task-due-date");
    dueDateInputError = document.getElementById("due-date-input-error");
    calendarIcon = document.getElementById("calendar-icon");
}

// PRIORITY ELEMENTS
/**
 * Initializes the DOM references used to control priority buttons and their icon states.
 */
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

// ASSIGNED TO ELEMENTS
/**
 * Initializes the DOM references for the assignment dropdown and its input state.
 */
function initAssignedToElements() {
    assignedToForm = document.getElementById("assigned-to-form");
    assignedToWrapper = document.getElementById("task-assigned-to-wrapper");
    assignedToInputWrapper = document.querySelector(".custom-dropdown-toggle");
    assignedToInput = document.getElementById("task-assigned-to-input");
    assignedToUsers = document.getElementById("task-assigned-to-users");
}

// CATEGORY ELEMENTS
/**
 * Initializes the DOM references for the category dropdown and its predefined options.
 */
function initCategoryElements() {
    categoryWrapper = document.getElementById("task-category-wrapper");
    categoryInput = document.getElementById("task-category-input");
    categoryTasks = document.getElementById("task-category-tasks");
    technicalTask = document.getElementById("technical-task");
    userStory = document.getElementById("user-story");
}

// SUBTASK ELEMENTS
/**
 * Initializes the DOM references for subtask input, controls, and rendered items.
 */
function initSubtasksElements() {
    subtasksInput = document.getElementById("subtasks-input");
    clearSubtasksBtn = document.getElementById("clear-input-btn");
    subtaskVerticalDivider = document.getElementById("subtasks-vertical-divider");
    addSubtaskBtn = document.getElementById("add-subtask-btn");
    subtasksList = document.getElementById("subtasks-list");
    subtaskItem = Array.from(document.getElementsByClassName("subtask-item"));
}

// FORM BUTTON ELEMENTS
/**
 * Initializes the DOM references for the form action buttons.
 */
function initFormBtnElements() {
    clearFormBtn = document.getElementById("clear-task-btn");
    addTaskBtn = document.getElementById("add-task-btn");
    dialogAddTaskBtn = document.getElementById("dialog-add-task-btn");
}

// TOAST ELEMENTS
/**
 * Initializes the DOM references for the success toast and its overlay.
 */
function initToastElements() {
    addTaskSuccessToast = document.getElementById("add-task-success-toast");
    addTaskSuccessOverlay = document.getElementById("add-task-success-overlay");
}

// TITLE
/**
 * Shows the required-field error state for the title input.
 */
function showTitleError() {
    titleInput.classList.add("red-border");
    titleInputError.classList.remove("dNone");
    titleInputError.textContent = "This field is required";
}

// DUE DATE
/**
 * Prevents selecting a due date earlier than today.
 */
function setMinDate() {
    const TODAY = new Date().toISOString().split("T")[0];
    dueDateInput.min = TODAY;
}

/**
 * Shows the current error state for the due date input.
 */
function showDueDateError() {
    dueDateInput.classList.add("red-border");
    dueDateInputError.classList.remove("dNone");
}

/**
 * Clears the visible error state for the due date input.
 */
function hideDueDateError() {
    dueDateInput.classList.remove("red-border");
    dueDateInputError.classList.add("dNone");
}

// PRIORITY
/**
 * Restores the neutral priority state before a new selection is highlighted.
 */
function resetPriorityButtons() {
    priorityColorImages.forEach(img => img.classList.remove("dNone"));
    priorityWhiteImages.forEach(img => img.classList.add("dNone"));
    urgentBtn.classList.remove("prio-urgent");
    mediumBtn.classList.remove("prio-medium");
    lowBtn.classList.remove("prio-low");
    urgentBtn.ariaPressed = "false";
    mediumBtn.ariaPressed = "false";
    lowBtn.ariaPressed = "false";
}

/**
 * Applies the visual active state for the low priority option.
 */
function highlightLowPriority() {
    lowBtn.classList.add("prio-low");
    lowColorImg.classList.add("dNone");
    lowWhiteImg.classList.remove("dNone");
    lowBtn.ariaPressed = "true";
}

/**
 * Applies the visual active state for the medium priority option.
 */
function highlightMediumPriority() {
    mediumBtn.classList.add("prio-medium");
    mediumColorImg.classList.add("dNone");
    mediumWhiteImg.classList.remove("dNone");
    mediumBtn.ariaPressed = "true";
}

/**
 * Applies the visual active state for the urgent priority option.
 */
function highlightUrgentPriority() {
    urgentBtn.classList.add("prio-urgent");
    urgentColorImg.classList.add("dNone");
    urgentWhiteImg.classList.remove("dNone");
    urgentBtn.ariaPressed = "true";
}

// ASSIGNED TO
/**
 * Keeps the assignment input highlight in sync with its current focus state.
 */
function checkDropdownState() {
    if (assignedToInput === document.activeElement) {
        assignedToInputWrapper.classList.add("blue-border");
    } else {
        assignedToInputWrapper.classList.remove("blue-border");
    }
}

/**
 * Builds initials for the assignment badges from a user's display name.
 * @param {string} name The full display name of the user to generate initials for.
 * @returns {string} The generated initials for the user.
 */
function getInitials(name) {
    return name.split(" ").map(part => part.charAt(0).toUpperCase()).join("");
}

/**
 * Renders badge previews for the users currently selected in the assignment dropdown.
 */
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

/**
 * Filters the assignment dropdown to users whose names match the current input prefix.
 */
function filterAssignedUsers() {
    let searchText = document.getElementById("task-assigned-to-input").value.toLowerCase();
    let users = assignedToUsers.querySelectorAll(".dropdown-user");
    for (let i = 0; i < users.length; i++) {
        let name = users[i].querySelector(".dropdown-user-name").textContent.toLowerCase();
        users[i].style.display = name.startsWith(searchText) ? "flex" : "none";
    }
}

/**
 * Clears the current assignment selection and restores the dropdown to its default visual state.
 */
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

// SUBTASKS
/**
 * Reveals the subtask action buttons and highlights the active item.
 * @param {HTMLElement} item The subtask item element to show the buttons for.
 */
function showSubtaskButtons(item) {
    item.querySelector(".subtask-item-btns").style.display = "flex";
    item.querySelector(".subtask-item-btns").classList.remove("dNone");
    item.parentElement.style.backgroundColor = "#eeeeee";
}

/**
 * Hides the subtask action buttons and removes the active item highlight.
 * @param {HTMLElement} item The subtask item element to hide the buttons for.
 */
function hideSubtaskButtons(item) {
    item.querySelector(".subtask-item-btns").style.display = "none";
    item.querySelector(".subtask-item-btns").classList.add("dNone");
    item.parentElement.style.backgroundColor = "transparent";
}

/**
 * Shows the controls for clearing or adding the current subtask input.
 */
function showSubtaskInputButtons() {
    clearSubtasksBtn.classList.remove("dNone");
    subtaskVerticalDivider.classList.remove("dNone");
    addSubtaskBtn.classList.remove("dNone");
}

/**
 * Hides the controls for the current subtask input.
 */
function hideSubtaskInputButtons() {
    clearSubtasksBtn.classList.add("dNone");
    subtaskVerticalDivider.classList.add("dNone");
    addSubtaskBtn.classList.add("dNone");
}

// BUILD TASK OBJECT
/**
 * Derives the currently selected priority from the active button state.
 * @return {string} The priority level corresponding to the active selection, or an empty string if none is selected.
 */
function getSelectedPriority() {
    if (urgentBtn.classList.contains('prio-urgent')) return 'urgent';
    if (mediumBtn.classList.contains('prio-medium')) return 'medium';
    if (lowBtn.classList.contains('prio-low')) return 'low';
    return '';
}

/**
 * Converts the rendered subtask items into the structure expected for task storage.
 * @return {Array} An array of subtask objects containing their text and default state.
 */
function getFormattedSubtasks() {
    const subtaskNodes = Array.from(document.querySelectorAll('.subtask-text'));
    return subtaskNodes.map((node, index) => ({
        id: index,
        subtask: node.textContent,
        'current_state': 'open'
    }));
}

/**
 * Generates the next local task ID based on the highest ID currently in memory.
 * @return {number} The next unique task ID.
 */
function generateUniqueId() {
    if (tasks.length === 0) {
        return 0;
    }
    const highestId = Math.max(...tasks.map(task => task.id));
    return highestId + 1;
}