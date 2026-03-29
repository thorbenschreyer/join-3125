let tasksInBoard = tasks.length;
let tasksInProgress = findNumberOfTask("In Progress")
let awaitingFeedback = findNumberOfTask("Await Feedback")
let todo = findNumberOfTask("To do")
let done = findNumberOfTask("Done")
let todoNextTime = "20";
let nextDate = "März 18, 2026"

function findNumberOfTask(taskdefinition) {
    return tasks.filter(task => task.state === taskdefinition).length;
}

function setTaskSummaryInformation () {
    document.getElementById("all-tasks").innerText = tasksInBoard
    document.getElementById("in-progress").innerText = tasksInProgress
    document.getElementById("awaiting-feedback").innerText = awaitingFeedback
    document.getElementById("task-todo").innerText = todo
    document.getElementById("task-done").innerText = done

    /* Hier muss ebenfalls der Status gesetzt werden welche Prio!*/
    document.getElementById("todo-date").innerText = todoNextTime
    document.getElementById("date-in-Summary").innerText = nextDate
}