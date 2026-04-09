function initClickOutsideElementsListener() {
    document.addEventListener("click", function(event) {
        if (assignedToWrapper && !assignedToWrapper.contains(event.target)) {
            closeAssignedDropdown();
        }  
        if (categoryWrapper && !categoryWrapper.contains(event.target)) {
            closeCategoryDropdown()
        }
        if (subtasksInput && !subtasksInput.contains(event.target)) {
            hideSubtaskInputButtons();
        }
    });
}

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

function initCalendarIconListener() {
    calendarIcon.addEventListener("click", function() {
        dueDateInput.showPicker();
    });
}

function initAssignedToListener() {
    assignedToInput.addEventListener("focus", function() {
        assignedToInputWrapper.classList.add("blue-border");
    });
}

function initCategoryListeners() {
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

function initSubtaskListeners() {
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
    })
    subtasksInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addSubtaskBtn.click();
            showSubtaskInputButtons();
        }
    });
}

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
        if (categoryInput.value == "Technical Task" || categoryInput.value == "User Story") {
            isCategoryValid = true;
        } else {
            isCategoryValid = false;
        }
        checkFormValidity()
    })
}

function initClearFormListener() {
    clearFormBtn.addEventListener("click", function () {
        clearFormular();
    })
}

function initAddTaskListeners() {
    initClickOutsideElementsListener();
    initTitleInputListeners();
    initDueDateInputListeners();
    initCalendarIconListener();
    initAssignedToListener();
    initCategoryListeners();
    initSubtaskListeners();
    initFormValidationListeners();
    initClearFormListener();
}