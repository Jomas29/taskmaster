const taskList = document.getElementById('tasks');
const addTaskForm = document.getElementById('addTaskForm');
const priorityFilter = document.getElementById('priorityFilter');

// Get the token from localStorage (assuming it's stored after login)
const token = localStorage.getItem('token');

// API URL
const apiUrl = "https://taskmaster-rough-sound-9673.fly.dev/"; // Adjust if necessary

// Fetch tasks from the server
async function fetchTasks() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error(error.message);
  }
}

// Render tasks on the page
function renderTasks(tasks) {
  taskList.innerHTML = ''; // Clear current tasks
  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
      </div>
      <button onclick="deleteTask('${task._id}')">Delete</button> <!-- Ensure _id field -->
    `;
    taskList.appendChild(taskItem);
  });
}

// Add a new task
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    deadline: document.getElementById('deadline').value,
    priority: document.getElementById('priority').value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    addTaskForm.reset();
    fetchTasks(); // Refresh tasks after creating
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    fetchTasks(); // Refresh tasks after deleting
  } catch (error) {
    console.error(error.message);
  }
}

// Filter tasks by priority
priorityFilter.addEventListener('change', async () => {
  const priority = priorityFilter.value;
  try {
    const response = await fetch(apiUrl + (priority === 'all' ? '' : `?priority=${priority}`), {
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to filter tasks');
    }

    const filteredTasks = await response.json();
    renderTasks(filteredTasks);
  } catch (error) {
    console.error(error.message);
  }
});

// Initial fetch of tasks
fetchTasks();
