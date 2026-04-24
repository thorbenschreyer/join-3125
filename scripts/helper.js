
/**
 * Shows the required-field error state for the title input.
 */
function showTitleError() {
    document.getElementById("task-title-input").classList.add("red-border");
    document.getElementById("title-input-error").classList.add("input-error-visible");
    document.getElementById("title-input-error").textContent = "This field is required";
}

/**
 * Clears the error state for the title input.
 */
function hideTitleError() {
    document.getElementById("task-title-input").classList.remove("red-border");
    document.getElementById("title-input-error").classList.remove("input-error-visible");
}

/**
 * Prevents selecting a due date earlier than today.
 */
function setMinDate() {
    const TODAY = new Date().toISOString().split("T")[0];
    document.getElementById("task-due-date-input").min = TODAY;
}

/**
 * Shows the current error state for the due date input.
 */
function showDueDateError() {
    document.getElementById("task-due-date-input").classList.add("red-border");
    document.getElementById("due-date-input-error").classList.add("input-error-visible");
}

/**
 * Clears the visible error state for the due date input.
 */
function hideDueDateError() {
    document.getElementById("task-due-date-input").classList.remove("red-border");
    document.getElementById("due-date-input-error").classList.remove("input-error-visible");
}

/**
 * Restores the neutral priority state before a new selection is highlighted.
 */
function resetPriorityButtons(colorImgs, whiteImgs, buttons) {
    colorImgs.forEach(img => img.classList.remove("dNone"));
    whiteImgs.forEach(img => img.classList.add("dNone"));
    buttons.forEach(btn => {
        btn.classList.remove("prio-urgent", "prio-medium", "prio-low");
        btn.ariaPressed = "false";
    });
}

/**
 * Collects the priority button elements and their icon states from the add-task form.
 * @returns {Object} An object containing arrays of color images, white images, and buttons.
 */
function getAddTaskPrioElements() {
    return {
        colorImgs: [
            document.getElementById("task-prio-urgent-color"),
            document.getElementById("task-prio-medium-color"),
            document.getElementById("task-prio-low-color")
        ],
        whiteImgs: [
            document.getElementById("task-prio-urgent-white"),
            document.getElementById("task-prio-medium-white"),
            document.getElementById("task-prio-low-white")
        ],
        buttons: [
            document.getElementById("task-prio-urgent-btn"),
            document.getElementById("task-prio-medium-btn"),
            document.getElementById("task-prio-low-btn")
        ]
    };
}

/**
 * Applies the active visual state to a single priority button.
 * @param {HTMLElement} btn The priority button to highlight.
 * @param {HTMLElement} colorImg The colored icon to hide.
 * @param {HTMLElement} whiteImg The white icon to show.
 * @param {string} prioClass The CSS class to apply ("prio-urgent", "prio-medium", or "prio-low").
 */
function highlightPriority(btn, colorImg, whiteImg, prioClass) {
    btn.classList.add(prioClass);
    colorImg.classList.add("dNone");
    whiteImg.classList.remove("dNone");
    btn.ariaPressed = "true";
}

/**
 * Keeps the assignment input highlight in sync with its current focus state.
 */
function checkDropdownState() {
    if (document.getElementById("task-assigned-to-input") === document.activeElement) {
        document.querySelector(".custom-dropdown-toggle").classList.add("blue-border");
    } else {
        document.querySelector(".custom-dropdown-toggle").classList.remove("blue-border");
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
    let maxBadges = 3;
    let visibleCount = Math.min(selectedUsers.length, maxBadges);
    for (let i = 0; i < visibleCount; i++) {
        let u = selectedUsers[i];
        badgeContainer.insertAdjacentHTML("beforeend",
            `<div class="assigned-badge" style="background-color: ${u.color}">${u.initials}</div>`
        );
    }
    if (selectedUsers.length > maxBadges) {
        let remaining = selectedUsers.length - maxBadges;
        badgeContainer.insertAdjacentHTML("beforeend",
            `<div class="assigned-badge assigned-badge-counter">+${remaining}</div>`
        );
    }
}

/**
 * Filters the assignment dropdown to users whose names match the current input prefix.
 */
function filterAssignedUsers() {
    let searchText = document.getElementById("task-assigned-to-input").value.toLowerCase();
    let users = document.getElementById("task-assigned-to-users").querySelectorAll(".dropdown-user");
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

/**
 * Shows the required-field error state for the category input.
 */
function showCategoryError() {
    document.getElementById("category-input-wrapper").classList.add("red-border");
    document.getElementById("category-input-error").classList.add("input-error-visible");
    document.getElementById("category-input-error").textContent = "This field is required";
}

/** 
 * Clears the error state for the category input.
 */
function hideCategoryError() {
    document.getElementById("category-input-wrapper").classList.remove("red-border");
    document.getElementById("category-input-error").classList.remove("input-error-visible");
}

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
    document.getElementById("clear-input-btn").classList.remove("dNone");
    document.getElementById("subtasks-vertical-divider").classList.remove("dNone");
    document.getElementById("add-subtask-btn").classList.remove("dNone");
}

/**
 * Hides the controls for the current subtask input.
 */
function hideSubtaskInputButtons() {
    document.getElementById("clear-input-btn").classList.add("dNone");
    document.getElementById("subtasks-vertical-divider").classList.add("dNone");
    document.getElementById("add-subtask-btn").classList.add("dNone");
}

/**
 * Shows the error state for the subtask input when attempting to add an empty subtask.
 */
function showSubtaskError() {
    hideUnsavedInputError();
    document.getElementById("subtask-input-error").classList.add("subtask-input-error-visible");
}

/**
 * Clears the error state for the subtask input.
 */
function hideSubtaskError() {
    document.getElementById("subtask-input-error").classList.remove("subtask-input-error-visible");
}

/**
 * Resets the subtask input area to its default visual state.
 */
function resetSubtaskInputState() {
    hideSubtaskError();
    document.getElementById("subtasks-input").classList.remove("red-border");
    document.getElementById("subtasks-input").classList.remove("blue-border");
    hideSubtaskInputButtons();
    closeAllSubtaskEdits();
}

/**
 * Closes all open subtask edits and reverts their inputs to the original text.
 */
function closeAllSubtaskEdits() {
    let wrappers = document.querySelectorAll(".subtask-item-wrapper");
    wrappers.forEach(wrapper => {
        let editDiv = wrapper.querySelector("#subtask-edit");
        let itemDiv = wrapper.querySelector("#subtask-item");
        if (editDiv && !editDiv.classList.contains("dNone")) {
            let originalText = wrapper.querySelector(".subtask-text").textContent;
            editDiv.querySelector(".subtask-edit-input").value = originalText;
            editDiv.classList.add("dNone");
            editDiv.style.display = "none";
            wrapper.querySelector(".subtask-item-edit").classList.remove("subtask-edit-red-border");
            wrapper.style.marginBottom = "";
            wrapper.style.padding = "4px 10px 4px 18px";
            if (itemDiv) {
                itemDiv.classList.remove("dNone");
            }
        }
    });
    hideSubtaskError();
}

/**
 * Derives the currently selected priority from the active button state.
 * @return {string} The priority level corresponding to the active selection, or an empty string if none is selected.
 */
function getSelectedPriority() {
    if (document.getElementById("task-prio-urgent-btn").classList.contains('prio-urgent')) return 'urgent';
    if (document.getElementById("task-prio-medium-btn").classList.contains('prio-medium')) return 'medium';
    if (document.getElementById("task-prio-low-btn").classList.contains('prio-low')) return 'low';
    return '';
}

/**
 * Derives the currently selected priority from the active button state with capitalized labels.
 * @returns {string} The priority level with a leading capital letter, or an empty string if none is selected.
 */
function getEditSelectedPriority() {
    if (document.getElementById("edit-task-prio-urgent-btn").classList.contains('prio-urgent')) return 'Urgent';
    if (document.getElementById("edit-task-prio-medium-btn").classList.contains('prio-medium')) return 'Medium';
    if (document.getElementById("edit-task-prio-low-btn").classList.contains('prio-low')) return 'Low';
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