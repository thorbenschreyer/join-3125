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
            hideTitleError();
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
        hideCategoryError();
    })
    userStory.addEventListener("click", function() {
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
    technicalTask.parentElement.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            categoryInput.value = "Technical Task";
            categoryInput.dispatchEvent(new Event("change"));
            closeCategoryDropdown();
            hideCategoryError();
        }
    });
    userStory.parentElement.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            categoryInput.value = "User Story";
            categoryInput.dispatchEvent(new Event("change"));
            closeCategoryDropdown();
            hideCategoryError();
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
 * @param {KeyboardEvent} event The keydown event triggered on the subtask input or buttons.
 */
function initKeyboardSubtaskListeners() {
    subtasksInput.addEventListener("keydown", function(event) {
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
 * Resets the form when the clear button is clicked.
 */
function initClearFormListener() {
    clearFormBtn.addEventListener("click", function () {
        clearFormular();
    });
}

/**
 * Validates the form and shows error states for invalid fields when the user tries to submit an incomplete form.
 */
function initAddTaskListener() {
    disabledBtnWrapper.addEventListener("click", function() {
        if (addTaskBtn.classList.contains("disabled-btn")) {
            titleInput.value.length == 0 ? showTitleError() : "";  
            if (dueDateInput.value.length == 0) {
                dueDateInputError.textContent = "This field is required";
                showDueDateError();
            }
            if (categoryInput.value !== "Technical Task" && categoryInput.value !== "User Story") {
                showCategoryError()
            }       
        }
    })
}