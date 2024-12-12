// Base URL for the API
const usersUrl = 'http://localhost:3000/users'; // Replace with your API URL
const tasksUrl = 'http://localhost:3000/tasks'; // Replace with your API URL

// Get references to the forms and other DOM elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tasksContainer = document.getElementById('tasks-container');

// Function to handle user signup
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
      const response = await fetch(usersUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed. Please try again.');
      }

      alert('Signup successful! Please log in.');
      window.location.href = 'login.html'; // Redirect to the login page
    } catch (error) {
      console.error(error.message);
      alert('Signup failed: ' + error.message);
    }
  });
}

// Function to handle user login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch(`${usersUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token); // Store the token in localStorage
      window.location.href = 'task.html'; // Redirect to the tasks page
    } catch (error) {
      console.error(error.message);
      alert('Login failed: ' + error.message);
    }
  });
}

// Function to fetch and display tasks
async function fetchTasks() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You are not logged in.');
    }

    const response = await fetch(tasksUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks.');
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error(error.message);
    alert('Error fetching tasks: ' + error.message);
  }
}

// Function to render tasks on the page
function renderTasks(tasks) {
  tasksContainer.innerHTML = '';

  tasks.forEach((task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.innerHTML = `
      <p>${task.description}</p>
      <button data-id="${task.id}" class="delete-task">Delete</button>
    `;
    tasksContainer.appendChild(taskElement);
  });

  // Attach event listeners to delete buttons
  const deleteButtons = document.querySelectorAll('.delete-task');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDeleteTask);
  });
}

// Function to handle task deletion
async function handleDeleteTask(e) {
  const taskId = e.target.getAttribute('data-id');

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You are not logged in.');
    }

    const response = await fetch(`${tasksUrl}/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to delete task.');
    }

    alert('Task deleted successfully!');
    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error(error.message);
    alert('Error deleting task: ' + error.message);
  }
}

// Load tasks if on the task page
if (tasksContainer) {
  document.addEventListener('DOMContentLoaded', fetchTasks);
}
