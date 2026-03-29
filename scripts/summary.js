let tasksInBoard = tasks.length;
let tasksInProgress = findNumberOfTask("In Progress");
let awaitingFeedback = findNumberOfTask("Await Feedback");
let todo = findNumberOfTask("To do");
let done = findNumberOfTask("Done");
let todoNextTime = "20";
let nextDate = "März 18, 2026";

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
  document.getElementById("todo-date").innerText = todoNextTime;
  document.getElementById("date-in-Summary").innerText = nextDate;
}

/**
 *  Nehmen der Array todo
 *  Sortieren des Array nach datum
 *  Das erste Array nehmen und den "Wichtigkeitsstauts ermitteln"
 *  wichtigkeit dann speichern und als Classe setzen
 *  Prüfen wie viele Arrays auch das gleiche enddatum haben
 *  in ein neues Array packen und length ermitteln
 *  Zahl als todoNextTIme Setzen
 *  Datum in entsprechendes format bringen und dann in next Date speichern
 * */
