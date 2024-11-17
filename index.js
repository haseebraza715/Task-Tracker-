document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task-button");
  const taskList = document.getElementById("task-list");
  const taskProgress = document.getElementById("task-progress");
  const progressText = document.getElementById("progress-text");
  const themeToggle = document.getElementById("theme-toggle");
  const markAllCompleted = document.getElementById("mark-all-completed");
  const deleteAllTasks = document.getElementById("delete-all-tasks");
  const unmarkAllCompleted = document.getElementById("unmark-all-completed");

  let tasks = [];

  // Load tasks and theme from localStorage
  function initialize() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedTheme = localStorage.getItem("theme");

    tasks = storedTasks;
    if (storedTheme === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️";
    }

    renderTasks();
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Save theme to localStorage
  function saveTheme(theme) {
    localStorage.setItem("theme", theme);
  }

  // Render tasks and update progress bar
  function renderTasks() {
    taskList.innerHTML = "";

    // Render all tasks
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
      taskItem.dataset.index = index;

      taskItem.innerHTML = `
          <div>
            <input type="checkbox" ${
              task.completed ? "checked" : ""
            } data-index="${index}">
            <span>${task.description}</span>
          </div>
          <button data-index="${index}">🗑️</button>
        `;

      taskList.appendChild(taskItem);
    });

    // Update progress bar
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    taskProgress.value = completionRate;
    progressText.textContent = `${Math.round(completionRate)}% Completed`;

    saveTasks();
  }

  // Add a new task
  function addTask(description) {
    if (!description.trim()) return;

    tasks.push({ description, completed: false });
    renderTasks();
    taskInput.value = "";
  }

  // Toggle task completion
  function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  }

  // Delete a specific task
  function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
  }

  // Mark all tasks as completed
  function markAllTasksAsCompleted() {
    tasks = tasks.map((task) => ({ ...task, completed: true }));
    renderTasks();
  }

  // Delete all tasks
  function deleteAllTasksHandler() {
    tasks = [];
    renderTasks();
  }

  // Unmark all completed tasks
  function unmarkAllTasks() {
    tasks = tasks.map((task) => ({ ...task, completed: false }));
    renderTasks();
  }

  // Toggle light/dark mode
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");
    themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
    saveTheme(isDarkMode ? "dark" : "light");
  });

  // Event listeners
  addTaskButton.addEventListener("click", () => addTask(taskInput.value));
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask(taskInput.value);
  });

  taskList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.type === "checkbox") {
      toggleTaskCompletion(index);
    } else if (e.target.tagName === "BUTTON") {
      deleteTask(index);
    }
  });

  markAllCompleted.addEventListener("click", markAllTasksAsCompleted);
  deleteAllTasks.addEventListener("click", deleteAllTasksHandler);
  unmarkAllCompleted.addEventListener("click", unmarkAllTasks);

  // Initialize app
  initialize();
});
