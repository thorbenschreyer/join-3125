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
let ASSIGNED_TO_SELECT;
let CATEGORY_SELECT;
let SUBTASKS;
let ADDTASK_BTN;

// BASE URL
const BASE_URL = "https://join-3125-default-rtdb.europe-west1.firebasedatabase.app/"

// TASK DATA
/* let tasks = []; */

// USER NAMES
let userNames = [];
/*
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
    ASSIGNED_TO_SELECT = document.getElementById("task-assigned");
    CATEGORY_SELECT = document.getElementById("task-category");
    SUBTASKS = document.getElementById("task-subtasks");
    ADDTASK_BTN = document.getElementById("add-task-btn");
    feedbackOnRequiredInput();
    higlightSelectedPriority();
    await getUserNames();
    pushUserNames();
} 
/*
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
*/
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

function addTask() {
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
    let taskAssignedTo = ASSIGNED_TO_SELECT.value;
    let taskCategory = CATEGORY_SELECT.value;
    let taskSubtasks = SUBTASKS.value;

    tasks.push({
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        assignedTo: taskAssignedTo,
        category: taskCategory,
        subtasks: taskSubtasks
    });
    saveTaskData();
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

async function getUserNames() {
    let allUserData = await fetch(`${BASE_URL}users.json`);
    let allUserDataToJson = await allUserData.json(); 
    let UserKeysArray = Object.keys(allUserDataToJson);

    for (let userIndex = 0; userIndex < UserKeysArray.length; userIndex++) {
        userNames.push(allUserDataToJson[UserKeysArray[userIndex]].name)
    }    
}

function pushUserNames() {
    for (let userIndex = 0; userIndex < userNames.length; userIndex++) {
        ASSIGNED_TO_SELECT.insertAdjacentHTML("beforeend", pushUserNamesTemplate(userNames[userIndex]))
    }
}

function pushUserNamesTemplate(user) {
  return `
           <option>${user}</option>
         `
}

/**
 * Testdaten zum enwickeln! Wenn diese gelöscht werden, müssen die Daten im Local Storage mit dem KEY: "tasks" gespeichert werden!
 */

/* TESTDATA DELETE IF FIREBASE WORKS */
const tasks = [
{
id: "1",
title: "Fix Login Bug",
description: "Fix authentication issue on login page",
assignedTo: "Tunc Senel",
category: "Technical Task",
dueDate: "2026-04-01",
priority: "urgent",
subtasks: "Check API;Fix token validation",
state: "To do"
},
{
id: "2",
title: "Create User Profile Page",
description: "Implement UI and backend connection",
assignedTo: "Anna Müller",
category: "User Story",
dueDate: "2026-04-02",
priority: "medium",
subtasks: "Design layout;Connect API",
state: "In Progress"
},
{
id: "3",
title: "Optimize Database",
description: "Improve performance of slow queries",
assignedTo: "Max Weber",
category: "Technical Task",
dueDate: "2026-04-03",
priority: "low",
subtasks: "Analyze queries;Add indexes",
state: "To do"
},
{
id: "4",
title: "Fix Navbar Responsive",
description: "Navbar breaks on small screens",
assignedTo: "Lisa Schneider",
category: "Bugfix",
dueDate: "2026-04-04",
priority: "medium",
subtasks: "Check breakpoints;Fix CSS",
state: "Done"
},
{
id: "5",
title: "Dark Mode Toggle",
description: "Add dark mode feature",
assignedTo: "Tunc Senel",
category: "User Story",
dueDate: "2026-04-05",
priority: "low",
subtasks: "Create toggle;Save preference",
state: "Await Feedback"
},
{
id: "6",
title: "Auth Refactor",
description: "Clean up authentication logic",
assignedTo: "Sarah Klein",
category: "Technical Task",
dueDate: "2026-04-06",
priority: "urgent",
subtasks: "Split modules;Improve security",
state: "In Progress"
},
{
id: "7",
title: "Calendar Bug",
description: "Calendar shows wrong dates",
assignedTo: "Max Weber",
category: "Bugfix",
dueDate: "2026-04-07",
priority: "medium",
subtasks: "Fix parsing;Update UI",
state: "To do"
},
{
id: "8",
title: "Notification System",
description: "Create notifications for tasks",
assignedTo: "Anna Müller",
category: "User Story",
dueDate: "2026-04-08",
priority: "urgent",
subtasks: "Create UI;Backend event",
state: "In Progress"
},
{
id: "9",
title: "Improve Performance",
description: "Reduce loading time",
assignedTo: "Lisa Schneider",
category: "Technical Task",
dueDate: "2026-04-09",
priority: "medium",
subtasks: "Lazy loading;Optimize images",
state: "Done"
},
{
id: "10",
title: "Task Search",
description: "Add search bar for tasks",
assignedTo: "Tunc Senel",
category: "User Story",
dueDate: "2026-04-10",
priority: "medium",
subtasks: "Search input;Filter tasks",
state: "Await Feedback"
},
{
id: "11",
title: "Caching System",
description: "Implement caching layer",
assignedTo: "Max Weber",
category: "Technical Task",
dueDate: "2026-04-11",
priority: "low",
subtasks: "Add cache;Test speed",
state: "To do"
},
{
id: "12",
title: "Avatar Upload Fix",
description: "Fix file upload issue",
assignedTo: "Sarah Klein",
category: "Bugfix",
dueDate: "2026-04-12",
priority: "urgent",
subtasks: "Validate type;Preview image",
state: "In Progress"
},
{
id: "13",
title: "Dashboard Overview",
description: "Create dashboard statistics",
assignedTo: "Anna Müller",
category: "User Story",
dueDate: "2026-04-13",
priority: "medium",
subtasks: "Widgets;Charts",
state: "Done"
},
{
id: "14",
title: "CSS Refactor",
description: "Improve CSS structure",
assignedTo: "Lisa Schneider",
category: "Technical Task",
dueDate: "2026-04-14",
priority: "low",
subtasks: "Variables;Class cleanup",
state: "To do"
},
{
id: "15",
title: "Logout Redirect",
description: "Fix redirect after logout",
assignedTo: "Tunc Senel",
category: "Bugfix",
dueDate: "2026-04-15",
priority: "medium",
subtasks: "Check session;Fix route",
state: "Done"
},
{
id: "16",
title: "Activity Log",
description: "Track user actions",
assignedTo: "Max Weber",
category: "User Story",
dueDate: "2026-04-16",
priority: "low",
subtasks: "Track events;Show history",
state: "Await Feedback"
},
{
id: "17",
title: "API Rate Limit",
description: "Prevent API abuse",
assignedTo: "Sarah Klein",
category: "Technical Task",
dueDate: "2026-04-17",
priority: "urgent",
subtasks: "Limiter;Test endpoints",
state: "In Progress"
},
{
id: "18",
title: "Drag and Drop Fix",
description: "Fix drag issue in board",
assignedTo: "Anna Müller",
category: "Bugfix",
dueDate: "2026-04-18",
priority: "medium",
subtasks: "Check events;Fix UI",
state: "To do"
},
{
id: "19",
title: "Export Tasks",
description: "Allow exporting tasks as CSV",
assignedTo: "Lisa Schneider",
category: "User Story",
dueDate: "2026-04-19",
priority: "low",
subtasks: "Export button;Generate CSV",
state: "Await Feedback"
},
{
id: "20",
title: "Error Logging",
description: "Improve error monitoring",
assignedTo: "Tunc Senel",
category: "Technical Task",
dueDate: "2026-04-20",
priority: "medium",
subtasks: "Add logger;Send to backend",
state: "In Progress"
}
];