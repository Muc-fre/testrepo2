const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
let tasks = [];

function addTask(){
    const taskText = taskInput.value.trim();
    if (taskText !=="") {
        tasks.push({text: taskText});
        taskInput.value="";
        displayTasks();
    }  

}
function displayTasks() {
            taskList.innerHTML = "";
            tasks.forEach((task, index) => {
                const li = document.createElement("li");
                li.innerHTML = `<input type="checkbox" id="task-${index}" ${task.completed ? "checked" : ""}>
                    <label for="task-${index}">${task.text}</label>`;
                li.querySelector("input").addEventListener("change", () => toggleTask(index));
                taskList.appendChild(li);
            });
        }
function toggleTask(index){
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

function clearCompletedTasks() {
            tasks = tasks.filter(task => !task.completed);
            displayTasks();
        }
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

clearCompletedBtn.addEventListener("click", clearCompletedTasks);

 displayTasks();

const clearAllBtn = document.getElementById("clearAllBtn");

function clearAllTasks() {
    tasks = []; // Empty the tasks array
    displayTasks(); // Refresh the list
}

clearAllBtn.addEventListener("click", clearAllTasks);



