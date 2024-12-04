const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('task-form');
const priorityFilter = document.getElementById('task-priority');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const authContainer = document.getElementById('auth-container');
const taskContainer = document.getElementById('task-container');
const logoutButton = document.getElementById('logout-button');

// API URL
const apiUrl = "https://taskmaster-rough-sound-9673.fly.dev"; // Adjust this to match your backend URL

// Toggle auth UI visibility
function toggleAuthUI(isLoggedIn) {
  if (isLoggedIn) {
    authContainer.style.display = 'none';
    taskContainer.style.display = 'block';
  } else {
    authContainer.style.display = 'block';
    taskContainer.style.display = 'none';
  }
}

// Handle registration
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${apiUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to register');
    }

    alert('Registration successful! You can now log in.');
  } catch (error) {
    console.error(error.message);
    alert('Registration failed. Please try again.');
  }
});

// Handle login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${apiUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const data = await response.json();
    const token = data.token;

    // Save token to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));

    toggleAuthUI(true); // Switch UI after login
    fetchTasks(); // Fetch tasks after login
  } catch (error) {
    console.error(error.message);
    alert('Login failed. Please check your credentials and try again.');
  }
});

// Handle logout
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  toggleAuthUI(false); // Show auth UI after logout
});

// Fetch tasks from the server
async function fetchTasks() {
  const token = localStorage.getItem('token');
  if (!token) return; // No token found, do nothing

  try {
    const response = await fetch(`${apiUrl}/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in header
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
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    taskList.appendChild(taskItem);
  });
}

// Add a new task
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const task = {
    title: document.getElementById('task-title').value,
    description: document.getElementById('task-desc').value,
    deadline: document.getElementById('task-deadline').value,
    priority: document.getElementById('task-priority').value,
  };

  try {
    const response = await fetch(`${apiUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
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

// Initial check for authentication and UI setup
function initializeApp() {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token; // If token exists, user is logged in

  toggleAuthUI(isLoggedIn);
  if (isLoggedIn) {
    fetchTasks(); // Fetch tasks if logged in
  }
}

// Initialize on page load
initializeApp();
