// DOM ELEMENT VARIABLES
let TITLE_INPUT;
let DESC_INPUT;
let DUE_DATE_INPUT;
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

function initAddTaskElements() {
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
    feedbackOnRequiredInput();
}

function feedbackOnRequiredInput() {
    TITLE_INPUT.addEventListener("focus", function() {
        let titleInput = TITLE_INPUT.value;
        if (titleInput.length == 0) {
            TITLE_INPUT.classList.add("red-border")
            TITLE_INPUT_ERROR.classList.remove("dNone")
        }
    });
    TITLE_INPUT.addEventListener("input", function() {
        let titleInput = TITLE_INPUT.value;
        if (titleInput.length == 0) {
            TITLE_INPUT.classList.add("red-border");
            TITLE_INPUT_ERROR.classList.remove("dNone");
        } else if (titleInput.length > 0) {
            TITLE_INPUT.classList.remove("red-border");
            TITLE_INPUT_ERROR.classList.add("dNone");
        }
    });
    DUE_DATE_INPUT.addEventListener("focus", function() {
        let dueDateInput = DUE_DATE_INPUT.value;
        if (dueDateInput.length != 10) {
            DUE_DATE_INPUT.classList.add("red-border");
            DUE_DATE_INPUT_ERROR.classList.remove("dNone");
        }
    }); 
    DUE_DATE_INPUT.addEventListener("input", function() {
        let dueDateInput = DUE_DATE_INPUT.value;
        if (dueDateInput.length != 10) {
            DUE_DATE_INPUT.classList.add("red-border");
            DUE_DATE_INPUT_ERROR.classList.remove("dNone");
        } else if (dueDateInput.length == 10) {
            DUE_DATE_INPUT.classList.remove("red-border");
            DUE_DATE_INPUT_ERROR.classList.add("dNone");
        }
    })
}

function higlightSelectedPriority(priority) {
    PRIORITY_BUTTONS.forEach(btn => btn.classList.remove("selected-priority"));
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