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
}

/**
 * Closes open dropdowns and subtask controls when the user clicks outside their active area.
 */
function initClickOutsideElementsListener() {
    document.addEventListener("click", function(event) {
        if (assignedToWrapper && !assignedToWrapper.contains(event.target)) {
            closeAssignedDropdown();
        }  
        if (categoryWrapper && !categoryWrapper.contains(event.target)) {
            closeCategoryDropdown();
        }
        if (subtasksInput && !subtasksInput.contains(event.target)) {
            hideSubtaskInputButtons();
        }
    });
}

// INPUT FEEDBACK
/**
 * Keeps the title field error state in sync while the user interacts with the required input.
 */
function initTitleInputListeners() {
    titleInput.addEventListener("focus", function() {
        let titleInputValue = titleInput.value;
        if (titleInputValue.length == 0) {
            showTitleError();
        }
    }); 
    titleInput.addEventListener("input", function() {
        let titleInputValue = titleInput.value;
        if (titleInputValue.length == 0) {
            showTitleError();
        } else if (titleInputValue.length > 0) {
            titleInput.classList.remove("red-border");
            titleInputError.classList.add("dNone");
        }
    });
}

/**
 * Updates the due date error state based on whether the field is filled and not set in the past.
 */
function initDueDateInputListeners() {
    dueDateInput.addEventListener("focus", function() {
        let dueDateInputValue = dueDateInput.value;
        if (dueDateInputValue.length != 10) {
            dueDateInputError.textContent = "This field is required";
            showDueDateError();
        }
    }); 
    dueDateInput.addEventListener("input", function() {
        let dueDateInputValue = dueDateInput.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDateInputValue.length == 10 && new Date(dueDateInputValue) >= today) {
            hideDueDateError();
        } else if (dueDateInputValue.length == 10 && new Date(dueDateInputValue) < today) {
            dueDateInputError.textContent = "Due date cannot be in the past";
            showDueDateError();
        } else {
            dueDateInputError.textContent = "This field is required";
            showDueDateError();
        }
    });
}
    
/**
 * Opens the native date picker when the calendar icon is clicked.
 */
function initCalendarIconListener() {
    calendarIcon.addEventListener("click", function() {
        dueDateInput.showPicker();
    });
    calendarIcon.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            dueDateInput.showPicker();
        }
    });
}           

// ASSIGNED TO
/**
 * Highlights the assignment input while it is active.
 */
function initAssignedToListener() {
    assignedToInput.addEventListener("focus", function() {
        assignedToInputWrapper.classList.add("blue-border");
    });
    assignedToInput.addEventListener("blur", function() {
        assignedToInputWrapper.classList.remove("blue-border");
    });
    assignedToInputWrapper.addEventListener("keydown", function(event) {
        if (event.key === 'Escape') {
            closeAssignedDropdown();
        }
    });
    assignedToInputWrapper.addEventListener("input", function() {
        if (assignedToInput.value.length == 1) {
            openAssignedDropdown();
        } else if (assignedToInput.value.length == 0) {
            closeAssignedDropdown();
        }
    });
}

// CATEGORY
/**
 * Applies the selected category option on click and triggers the shared change-based validation flow.
 */
function initClickCategoryListeners() {
    technicalTask.addEventListener("click", function() {
        categoryInput.value = "Technical Task";
        categoryInput.dispatchEvent(new Event("change"));
        closeCategoryDropdown();
    })
    userStory.addEventListener("click", function() {
        categoryInput.value = "User Story";
        categoryInput.dispatchEvent(new Event("change"));
        closeCategoryDropdown();
    })
}

/**
 * Applies the selected category option on Enter or Space and triggers the shared change-based validation flow.
 */
function initKeyboardCategoryListeners()  {
    technicalTask.parentElement.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            categoryInput.value = "Technical Task";
            categoryInput.dispatchEvent(new Event("change"));
            closeCategoryDropdown();
        }
    });
    userStory.parentElement.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            categoryInput.value = "User Story";
            categoryInput.dispatchEvent(new Event("change"));
            closeCategoryDropdown();
        }
    });
}

// SUBTASKS
/**
 * Wires the subtask input to show its controls and handle click-based clear and add actions.
 */
function initClickSubtaskListeners() {
    subtasksInput.addEventListener("focus", function() {
        showSubtaskInputButtons();
    });
    clearSubtasksBtn.addEventListener("click", function() {
        subtasksInput.value = "";
        hideSubtaskInputButtons();
    });
    addSubtaskBtn.addEventListener("click", function() {
        if (subtasksInput.value.length > 0) {
            subtasksList.insertAdjacentHTML("beforeend", renderSubtaskItemsTemplate(subtasksInput));
            subtasksInput.value = "";
            hideSubtaskInputButtons();
        }
    });
}

/**
 * Enables keyboard access for adding and clearing subtasks with Enter or Space.
 */
function initKeyboardSubtaskListeners() {
    subtasksInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addSubtaskBtn.click();
            showSubtaskInputButtons();
        }
    });
    clearSubtasksBtn.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            subtasksInput.value = "";
            hideSubtaskInputButtons();
        }
    });
    addSubtaskBtn.addEventListener("keydown", function(event) {
        if (subtasksInput.value.length > 0 && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            subtasksList.insertAdjacentHTML("beforeend", renderSubtaskItemsTemplate(subtasksInput));
            subtasksInput.value = "";
            hideSubtaskInputButtons();
        }
    });
}

// FORM VALIDATION
/**
 * Keeps the required-field validation flags in sync so the submit state can be recalculated after each change.
 */
function initFormValidationListeners() {
    titleInput.addEventListener("change", function() {
        titleInput.value.length > 0 ? isTitleValid = true : isTitleValid = false
        checkFormValidity()
    });
    dueDateInput.addEventListener("change", function() {
        let dueDateInputValue = dueDateInput.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDateInputValue.length == 10 && new Date(dueDateInputValue) >= today) {
            isDueDateValid = true;
        } else {
            isDueDateValid = false;
        }
        checkFormValidity()
    });
    categoryInput.addEventListener("change", function() {
        categoryInput.value == "Technical Task" || categoryInput.value == "User Story" ? isCategoryValid = true : isCategoryValid = false;
        checkFormValidity()
    })
}

// FORM ACTIONS
/**
 * Resets the form through both mouse and keyboard interaction on the clear button.
 */
function initClearFormListener() {
    clearFormBtn.addEventListener("click", function () {
        clearFormular();
    });
    clearFormBtn.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            clearFormular();
        }
    });
}

function initAddTaskListener() {
    addTaskBtn.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            addTask();
        }
    });
}