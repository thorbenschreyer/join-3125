let tasksInBoard;
let tasksInProgress;
let awaitingFeedback; 
let todo;
let done;

function findNumberOfTask(taskdefinition) {
    return tasks.filter(task => task.state === taskdefinition).length;
}

tasksInBoard = tasks.length;
tasksInProgress = findNumberOfTask("In Progress")
awaitingFeedback = findNumberOfTask("Await Feedback")
todo = findNumberOfTask("To do")
done = findNumberOfTask("Done")