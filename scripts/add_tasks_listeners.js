/**
 * Registers all event listeners required for the add-task form.
 */
function initAddTaskListeners() {
    initClickOutsideElementsListener();
    initTitleInputListeners();
    initDueDateInputListeners();
    initCalendarIconListener();
    initAssignedToListener();
    initClickCategoryListeners();
    initKeyboardCategoryListeners();
    initClickSubtaskListeners();
    initKeyboardSubtaskListeners();
    initFormValidationListeners();
    initClearFormListener();
    initAddTaskListener();
}

/**
 * Closes open dropdowns and subtask controls when the user clicks outside their active area.
 * @param {MouseEvent} event The click event triggered on the document.
 */
function initClickOutsideElementsListener() {
    document.addEventListener("click", function(event) {
        if (document.getElementById("task-assigned-to-wrapper") && !document.getElementById("task-assigned-to-wrapper").contains(event.target)) {
            closeAssignedDropdown();
            hideSubtaskInputButtons();
            document.getElementById("subtasks-input").classList.remove("red-border");
            document.getElementById("subtasks-input").classList.remove("blue-border");
            hideSubtaskError();
        }  
        if (document.getElementById("task-category-wrapper") && !document.getElementById("task-category-wrapper").contains(event.target)) {
            closeCategoryDropdown();
            hideSubtaskInputButtons();
            document.getElementById("subtasks-input").classList.remove("red-border");
            document.getElementById("subtasks-input").classList.remove("blue-border");
            hideSubtaskError();
        }
        if (document.getElementById("subtasks-input-container") && !document.getElementById("subtasks-input-container").contains(event.target)) {
            hideSubtaskInputButtons();
            document.getElementById("subtasks-input").classList.remove("red-border");
            document.getElementById("subtasks-input").classList.remove("blue-border");
            hideSubtaskError();
        }
        let subtaskContainer = document.getElementById("subtasks-input-container");
        let subtasksList = document.getElementById("subtasks-list");
        let clickedInSubtasks = (subtaskContainer && subtaskContainer.contains(event.target)) ||
                                (subtasksList && subtasksList.contains(event.target));
        if (subtasksList && !subtasksList.contains(event.target)) {
            closeAllSubtaskEdits();
            document.getElementById("subtasks-input").classList.remove("red-border");
            document.getElementById("subtasks-input").classList.remove("blue-border");
            hideSubtaskError();
        }
    });
}

/**
 * Keeps the title field error state in sync while the user interacts with the required input.
 */
function initTitleInputListeners() {
    const titleInput = document.getElementById("task-title-input");
    titleInput.addEventListener("focus", function() {
        let titleInputValue = titleInput.value;
        if (titleInputValue.trim().length == 0) {
            showTitleError();
        }
    }); 
    titleInput.addEventListener("input", function() {
        let titleInputValue = titleInput.value;
        if (titleInputValue.trim().length == 0) {
            showTitleError();
        } else if (titleInputValue.trim().length > 0) {
            hideTitleError();
        }
    });
}

/**
 * Updates the due date error state based on whether the field is filled and not set in the past.
 */
function initDueDateInputListeners() {
    const dueDateInput = document.getElementById("task-due-date-input");
    dueDateInput.addEventListener("focus", function() {
        if (dueDateInput.value.length != 10) {
            document.getElementById("due-date-input-error").textContent = "This field is required";
            showDueDateError();
        }
    }); 
    dueDateInput.addEventListener("input", function() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDateInput.value.length == 10 && new Date(dueDateInput.value) >= today) {
            hideDueDateError();
        } else if (dueDateInput.value.length == 10 && new Date(dueDateInput.value) < today) {
            document.getElementById("due-date-input-error").textContent = "Due date cannot be in the past";
            showDueDateError();
        } else {
            document.getElementById("due-date-input-error").textContent = "This field is required";
            showDueDateError();
        }
    });
}
    
/**
 * Opens the native date picker when the calendar icon is clicked.
 */
function initCalendarIconListener() {
    document.getElementById("calendar-icon").addEventListener("click", function() {
       document.getElementById("task-due-date-input").showPicker();
    });
}           

/**
 * Highlights the assignment input while it is active.
 */
function initAssignedToListener() {
    const assignedToInput = document.getElementById("task-assigned-to-input");
    assignedToInput.addEventListener("focus", function() {
        document.querySelector(".custom-dropdown-toggle").classList.add("blue-border");
    });
    assignedToInput.addEventListener("blur", function() {
        document.querySelector(".custom-dropdown-toggle").classList.remove("blue-border");
    });
    assignedToInput.addEventListener("keydown", function(event) {
        if (event.key === 'Escape') {
            closeAssignedDropdown();
        }
    });
    assignedToInput.addEventListener("input", function() {
        if (assignedToInput.value.length > 0) {
            openAssignedDropdown();
            filterAssignedUsers();
        }
    });
}

/**
 * Applies the selected category option on click and triggers the shared change-based validation flow.
 */
function initClickCategoryListeners() {
    const categoryInput = document.getElementById("task-category-input");
    document.getElementById("technical-task").addEventListener("click", function() {
        categoryInput.value = "Technical Task";
        categoryInput.dispatchEvent(new Event("change"));
        closeCategoryDropdown();
        hideCategoryError();
    })
    document.getElementById("user-story").addEventListener("click", function() {
        categoryInput.value = "User Story";
        categoryInput.dispatchEvent(new Event("change"));
        closeCategoryDropdown();
        hideCategoryError();
    })
}

/**
 * Applies the selected category option on Enter or Space and triggers the shared change-based validation flow.
 * @param {KeyboardEvent} event The keydown event triggered on the category option.
 */
function initKeyboardCategoryListeners()  {
    const categoryInput = document.getElementById("task-category-input");
    document.getElementById("technical-task").parentElement.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            categoryInput.value = "Technical Task";
            categoryInput.dispatchEvent(new Event("change"));
            closeCategoryDropdown();
            hideCategoryError();
        }
    });
    document.getElementById("user-story").parentElement.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            categoryInput.value = "User Story";
            categoryInput.dispatchEvent(new Event("change"));
            closeCategoryDropdown();
            hideCategoryError();
        }
    });
}

/**
 * Wires the subtask input to show its controls and handle click-based clear and add actions.
 */
function initClickSubtaskListeners() {
    const subtasksInput = document.getElementById("subtasks-input");
    subtasksInput.addEventListener("focus", function() {
        showSubtaskInputButtons();
        hideSubtaskError();
        subtasksInput.classList.remove("red-border");
        subtasksInput.classList.add("blue-border");
        closeAllSubtaskEdits();
    });
    subtasksInput.addEventListener("input", function() {
    if (subtasksInput.value.length > 0) {
        subtasksInput.classList.remove("red-border");
        subtasksInput.classList.add("blue-border");
        hideSubtaskError();
    }
    });
    document.getElementById("clear-input-btn").addEventListener("click", function() {
        subtasksInput.value = "";
        hideSubtaskInputButtons();
        hideSubtaskError();
        subtasksInput.classList.remove("red-border");
        subtasksInput.classList.remove("blue-border");
});
    document.getElementById("add-subtask-btn").addEventListener("click", function() {
        if (subtasksInput.value.trim().length > 0) {
            document.getElementById("subtasks-list").insertAdjacentHTML("beforeend", renderSubtaskItemsTemplate(subtasksInput));
            subtasksInput.value = "";
            hideSubtaskInputButtons();
            hideSubtaskError();
            subtasksInput.classList.remove("blue-border");
        } else {
        showSubtaskError();
        subtasksInput.classList.add("red-border");
        subtasksInput.classList.remove("blue-border");
        }
        subtasksInput.value = "";
    });
}

/**
 * Enables keyboard access for adding and clearing subtasks with Enter or Space.
 * @param {KeyboardEvent} event The keydown event triggered on the subtask input or buttons.
 */
function initKeyboardSubtaskListeners() {
    const subtasksInput = document.getElementById("subtasks-input");
    subtasksInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (subtasksInput.value.trim().length > 0) {
            document.getElementById("add-subtask-btn").click();
        } else {
            showSubtaskError();
            subtasksInput.classList.add("red-border");
            subtasksInput.classList.remove("blue-border");
        }
        showSubtaskInputButtons();
    }
    });
    document.getElementById("clear-input-btn").addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            subtasksInput.value = "";
            hideSubtaskInputButtons();
            subtasksInput.classList.remove("red-border");
            subtasksInput.classList.remove("blue-border");
        }
    });
    document.getElementById("add-subtask-btn").addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (subtasksInput.value.trim().length > 0) {
            document.getElementById("subtasks-list").insertAdjacentHTML("beforeend", renderSubtaskItemsTemplate(subtasksInput));
            subtasksInput.value = "";
            hideSubtaskInputButtons();
            hideSubtaskError();
        } else {
            showSubtaskError();
            subtasksInput.classList.add("red-border");
            subtasksInput.classList.remove("blue-border");
        }
    }
});
}

/**
 * Keeps the required-field validation flags in sync so the submit state can be recalculated after each change.
 */
function initFormValidationListeners() {
    const titleInput = document.getElementById("task-title-input");
    const dueDateInput = document.getElementById("task-due-date-input")
    const categoryInput = document.getElementById("task-category-input");
    titleInput.addEventListener("input", function() {
        checkFormValidity()
    });
    dueDateInput.addEventListener("change", function() {
        checkFormValidity()
    });
    categoryInput.addEventListener("change", function() {
        checkFormValidity()
    })
}

/**
 * Resets the form when the clear button is clicked.
 */
function initClearFormListener() {
    document.getElementById("clear-task-btn").addEventListener("click", function () {
        clearFormular();
    });
}

/**
 * Validates the form and shows error states for invalid fields when the user tries to submit an incomplete form.
 */
function initAddTaskListener() {
    const categoryInput = document.getElementById("task-category-input");
    document.getElementById("disabled-btn-wrapper").addEventListener("click", function() {
        if (document.getElementById("add-task-btn").classList.contains("disabled-btn")) {
            document.getElementById("task-title-input").value.trim().length == 0 ? showTitleError() : "";  
            if (document.getElementById("task-due-date-input").value.length == 0) {
                document.getElementById("due-date-input-error").textContent = "This field is required";
                showDueDateError();
            }
            if (categoryInput.value !== "Technical Task" && categoryInput.value !== "User Story") {
                showCategoryError()
            }       
        }
    })
}