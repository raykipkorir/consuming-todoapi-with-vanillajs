const allTasks = document.getElementById("tasks");
const taskForm = document.getElementById("taskForm");
const csrftoken = Cookies.get("csrftoken");

const host = "https://todoapi.up.railway.app";
const listCreateUrl = `${host}/api/tasks/`;

//add task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = { name: e.target[0].value };
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };
  const postData = async () => {
    const response = await fetch(listCreateUrl, options);
    const content = await response.json();
    console.log(content);
  };
  postData();
});

//get tasks
async function getData() {
  const response = await fetch(listCreateUrl);
  const tasks = await response.json();
  if (tasks.length === 0) {
    allTasks.innerHTML = "<h2>No tasks</h2>";
  } else {
    function BuildList() {
      tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add(
          "list-group-item",
          "rounded",
          "d-flex",
          "justify-content-between"
        );
        allTasks.appendChild(taskItem);
        taskItem.innerHTML = `
            <span>${task.name}</span>
            <div class="d-flex justify-content-around">
              <input id="taskStatus" type="checkbox" ${
                task.completed ? `checked=""` : null
              }/>
              <i id="editTask" class="fa-solid fa-pen-to-square px-2"></i>
              <i id="deleteTask" class="fa-solid fa-trash"></i>
            </div>
            `;
        const editDeleteUrl = `${host}/api/tasks/${task.id}/`;
        //edit task status
        updateTaskStatus(taskItem, task, editDeleteUrl);
        //edit task
        updateTaskName(taskItem, task, editDeleteUrl);
        //delete task
        deleteTask(taskItem, editDeleteUrl);
      });
    }
    BuildList();
    console.log(tasks);
  }
}
getData();

//edit task name
function updateTaskName(taskItem, task, editDeleteUrl) {
  const editIcon = taskItem.querySelector("#editTask");
  editIcon.addEventListener("click", () => {
    const updateTask = async (updatedTask) => {
      const options = {
        method: "PUT",
        body: JSON.stringify({ name: updatedTask }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      };
      const response = await fetch(editDeleteUrl, options);
      const content = await response.json();
      console.log(content.name);
    };
    let updatedTask = prompt("Update Task", task.name);
    if (!(updatedTask == null || "")) {
      updateTask(updatedTask);
    }
  });
}

//edit task status
function updateTaskStatus(taskItem, task, editDeleteUrl) {
  const taskStatus = taskItem.querySelector("#taskStatus");
  taskStatus.addEventListener("change", () => {
    const updateStatus = async () => {
      const options = {
        method: "PATCH",
        body: JSON.stringify({
          completed: task.completed === false ? true : false,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      };
      const response = await fetch(editDeleteUrl, options);
      const content = await response.json();
      console.log("updated");
    };
    updateStatus();
  });
}

//delete task
function deleteTask(taskItem, editDeleteUrl) {
  const deleteIcon = taskItem.querySelector("#deleteTask");
  deleteIcon.addEventListener("click", () => {
    const options = {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrftoken,
      },
    };
    const deleteTask = async () => {
      const response = await fetch(editDeleteUrl, options);
      const content = await response.json();
    };
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask();
    }
  });
}
