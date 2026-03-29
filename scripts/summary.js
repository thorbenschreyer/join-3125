let formattedDate;
let numberofSameDate;
let nexttoDoPriority;
let toDoSOrted;
/**
 * This function iterates through the `tasks` array. It searches for the corresponding status
 * @param {To do, Done, In Progress, Await Feedback} taskdefinition
 * @returns the number of items in the new arrays
 */
function findNumberOfTask(taskdefinition) {
  return tasks.filter((task) => task.state === taskdefinition).length;
}

function setTaskSummaryInformation() {
  let tasksInBoard = tasks.length;
  let tasksInProgress = findNumberOfTask("In Progress");
  let awaitingFeedback = findNumberOfTask("Await Feedback");
  let todo = findNumberOfTask("To do");
  let done = findNumberOfTask("Done");

  sortTodoforDate();

  document.getElementById("all-tasks").innerText = tasksInBoard;
  document.getElementById("in-progress").innerText = tasksInProgress;
  document.getElementById("awaiting-feedback").innerText = awaitingFeedback;
  document.getElementById("task-todo").innerText = todo;
  document.getElementById("task-done").innerText = done;

  document.getElementById("todo-date").innerText = numberofSameDate;
  document.getElementById("date-in-Summary").innerText = formattedDate;

  setOpticalPriority();
}

function sortTodoforDate() {
  let toDoArray = tasks.filter((task) => task.state === "To do");

  toDoSOrted = toDoArray.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );
  nexttoDoPriority = toDoArray[0].priority;

  numberofSameDate = toDoArray.filter(
    (sameDayToDo) => sameDayToDo.dueDate === toDoArray[0].dueDate,
  ).length;
  nextToDoDate = toDoArray[0].dueDate;

  const date = new Date(nextToDoDate);
  formattedDate =
    date.toLocaleDateString("de-DE", { day: "2-digit", month: "long" }) +
    ", " +
    date.getFullYear();
}

function setOpticalPriority() {
  let prio = document.getElementById("prio-img");
  prio.classList.remove("high-prio", "medium-prio", "low-prio");

  if (nexttoDoPriority === "urgent") {
    prio.classList.add("high-prio");
  }
  if (nexttoDoPriority === "medium") {
    prio.classList.add("medium-prio");
  }
  if (nexttoDoPriority === "low") {
    prio.classList.add("low-prio");
  }
}
