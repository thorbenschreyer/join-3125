let tasksInBoard = tasks.length;
let tasksInProgress = findNumberOfTask("In Progress");
let awaitingFeedback = findNumberOfTask("Await Feedback");
let todo = findNumberOfTask("To do");
let done = findNumberOfTask("Done");
let formattedDate;
let numberofSameDate;

/**
 * This function iterates through the `tasks` array. It searches for the corresponding status
 * @param {To do, Done, In Progress, Await Feedback} taskdefinition
 * @returns the number of items in the new arrays
 */
function findNumberOfTask(taskdefinition) {
  return tasks.filter((task) => task.state === taskdefinition).length;
}

function setTaskSummaryInformation() {
  document.getElementById("all-tasks").innerText = tasksInBoard;
  document.getElementById("in-progress").innerText = tasksInProgress;
  document.getElementById("awaiting-feedback").innerText = awaitingFeedback;
  document.getElementById("task-todo").innerText = todo;
  document.getElementById("task-done").innerText = done;

  /* Hier muss ebenfalls der Status gesetzt werden welche Prio!*/
  document.getElementById("todo-date").innerText = numberofSameDate;
  document.getElementById("date-in-Summary").innerText = formattedDate;
}

function sortTodoforDate() {
  let toDoArray = tasks.filter((task) => task.state === "To do");

  toDoArray.sort((a, b) => new Date(b.date) - new Date(a.date));

  numberofSameDate = toDoArray.filter((sameDayToDo) => sameDayToDo.dueDate === toDoArray[0].dueDate,).length;
  nextToDoDate = toDoArray[0].dueDate;

  const date = new Date(nextToDoDate);
  formattedDate = date.toLocaleDateString("de-DE", { day: "2-digit", month: "long" }) + ", " + date.getFullYear();
}

/**
 
 *  Das erste Array nehmen und den "Wichtigkeitsstauts ermitteln"
 *  wichtigkeit dann speichern und als Classe setzen
 * */
