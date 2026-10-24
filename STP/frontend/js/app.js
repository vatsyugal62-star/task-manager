import { signUp, logIn, logOut, updateUsername, onAuthStateChange, verifyPasswordAndLogOut } from '../../backend/auth.js';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../database/tasks.js';
import { isConfigured } from '../../backend/firebase.js';

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const onboardSection = document.getElementById('onboard-section');

// Auth Form Elements
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authError = document.getElementById('auth-error');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const btnAuthSubmit = document.getElementById('btn-auth-submit');
const authSwitchText = document.getElementById('auth-switch-text');
const btnSwitchMode = document.getElementById('btn-switch-mode');

// Onboard Form Elements
const onboardForm = document.getElementById('onboard-form');
const onboardUsername = document.getElementById('onboard-username');
const onboardError = document.getElementById('onboard-error');
const btnOnboardSubmit = document.getElementById('btn-onboard-submit');

const greetingEl = document.getElementById('greeting');
const btnLogout = document.getElementById('btn-logout');

// Logout Modal Elements
const logoutModal = document.getElementById('logout-modal');
const logoutForm = document.getElementById('logout-form');
const logoutPasswordInput = document.getElementById('logout-password');
const toggleLogoutPasswordBtn = document.getElementById('toggle-logout-password');
const logoutError = document.getElementById('logout-error');
const btnCancelLogout = document.getElementById('btn-cancel-logout');
const btnConfirmLogout = document.getElementById('btn-confirm-logout');

// Task Elements
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskPrioritySelect = document.getElementById('task-priority');
const taskDueInput = document.getElementById('task-due');
const taskError = document.getElementById('task-error');
const taskListEl = document.getElementById('task-list');
const btnSaveTask = document.getElementById('btn-save-task');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

// Filters
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterPriority = document.getElementById('filter-priority');
const sortBy = document.getElementById('sort-by');
const chips = document.querySelectorAll('.chip');

// Overlays and Toasts
const toastContainer = document.getElementById('toast-container');
const toastTimer = document.getElementById('toast-timer');
const btnUndoDelete = document.getElementById('btn-undo-delete');
const animOverlay = document.getElementById('anim-overlay');

// Progress Overview Elements
const progressPercent = document.getElementById('progress-percent');
const progressBarFill = document.getElementById('progress-bar-fill');
const statCompleted = document.getElementById('stat-completed');
const statInProgress = document.getElementById('stat-in-progress');
const statPending = document.getElementById('stat-pending');
const statOverdueWrap = document.getElementById('stat-overdue-wrap');
const statOverdue = document.getElementById('stat-overdue');

let currentUser = null;
let tasks = [];
let isLoginMode = true;
let deletedTaskQueue = null;
let currentFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  quick: 'all',
  sort: 'created-desc'
};

// --- Auth UI Logic ---

togglePasswordBtn.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  if (type === 'text') {
    togglePasswordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
  } else {
    togglePasswordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
});

btnSwitchMode.addEventListener('click', () => {
  isLoginMode = !isLoginMode;
  authError.classList.add('hidden');
  
  if (isLoginMode) {
    authTitle.textContent = 'Log In';
    authSubtitle.textContent = 'Welcome back. Please enter your details.';
    btnAuthSubmit.textContent = 'Log In';
    authSwitchText.textContent = "Don't have an account?";
    btnSwitchMode.textContent = 'Sign Up';
  } else {
    authTitle.textContent = 'Create an account';
    authSubtitle.textContent = 'Get started by creating a new account.';
    btnAuthSubmit.textContent = 'Sign Up';
    authSwitchText.textContent = 'Already have an account?';
    btnSwitchMode.textContent = 'Log In';
  }
});

const showAuthError = (msg) => {
  authError.textContent = msg;
  authError.classList.remove('hidden');
};

if (!isConfigured) {
  showAuthError('⚡ Setup: Please add your Firebase credentials in js/config.js to activate the app.');
}

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.classList.add('hidden');
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  btnAuthSubmit.disabled = true;
  btnAuthSubmit.textContent = 'Please wait...';

  try {
    if (isLoginMode) {
      await logIn(email, password);
    } else {
      const data = await signUp(email, password);
      if (data.user && data.session === null) {
        showAuthError('Check your email for the confirmation link.');
      }
    }
  } catch (err) {
    let errorMsg = err.message;
    if (isLoginMode && (
      errorMsg.includes('Invalid login credentials') ||
      errorMsg.includes('invalid-credential') ||
      errorMsg.includes('user-not-found') ||
      errorMsg.includes('wrong-password') ||
      errorMsg.includes('configuration-not-found') ||
      errorMsg.includes('auth/')
    )) {
      errorMsg = "May be you are entering a wrong password, or the account is not created (signup to create an account!)";
    }
    showAuthError(errorMsg);
  }
 finally {
    btnAuthSubmit.disabled = false;
    btnAuthSubmit.textContent = isLoginMode ? 'Log In' : 'Sign Up';
  }
});

btnLogout.addEventListener('click', () => {
  logoutPasswordInput.value = '';
  logoutError.classList.add('hidden');
  logoutModal.classList.remove('hidden');
  logoutPasswordInput.focus();
});

btnCancelLogout.addEventListener('click', () => {
  logoutModal.classList.add('hidden');
});

logoutModal.addEventListener('click', (e) => {
  if (e.target === logoutModal) {
    logoutModal.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!logoutModal.classList.contains('hidden')) {
      logoutModal.classList.add('hidden');
    } else if (!btnCancelEdit.classList.contains('hidden')) {
      resetTaskForm();
    }
  }
});

toggleLogoutPasswordBtn.addEventListener('click', () => {
  const type = logoutPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  logoutPasswordInput.setAttribute('type', type);
});

logoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  logoutError.classList.add('hidden');
  const password = logoutPasswordInput.value;
  btnConfirmLogout.disabled = true;
  btnConfirmLogout.textContent = 'Verifying...';

  try {
    await verifyPasswordAndLogOut(password);
    logoutModal.classList.add('hidden');
  } catch (err) {
    logoutError.textContent = err.message;
    logoutError.classList.remove('hidden');
  } finally {
    btnConfirmLogout.disabled = false;
    btnConfirmLogout.textContent = 'Log Out';
  }
});

onboardForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  onboardError.classList.add('hidden');
  const name = onboardUsername.value.trim();
  
  btnOnboardSubmit.disabled = true;
  btnOnboardSubmit.textContent = 'Saving...';
  
  try {
    await updateUsername(name);
    currentUser.user_metadata = currentUser.user_metadata || {};
    currentUser.user_metadata.username = name;
    
    onboardSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    greetingEl.textContent = `Hello, ${escapeHTML(name)}!`;
    loadTasks();
  } catch (err) {
    onboardError.textContent = err.message;
    onboardError.classList.remove('hidden');
  } finally {
    btnOnboardSubmit.disabled = false;
    btnOnboardSubmit.textContent = 'Continue';
  }
});

onAuthStateChange((session) => {
  if (session) {
    currentUser = session.user;
    const name = currentUser.user_metadata?.username;
    
    authSection.classList.add('hidden');
    
    if (!name) {
      onboardSection.classList.remove('hidden');
      appSection.classList.add('hidden');
    } else {
      onboardSection.classList.add('hidden');
      appSection.classList.remove('hidden');
      greetingEl.textContent = `Hello, ${escapeHTML(name)}!`;
      loadTasks();
    }
  } else {
    currentUser = null;
    appSection.classList.add('hidden');
    onboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    if (!isLoginMode) {
      btnSwitchMode.click();
    }
  }
});

// --- Filters Logic ---
searchInput.addEventListener('input', (e) => {
  currentFilters.search = e.target.value;
  renderTasks();
});

filterStatus.addEventListener('change', (e) => {
  currentFilters.status = e.target.value;
  renderTasks();
});

filterPriority.addEventListener('change', (e) => {
  currentFilters.priority = e.target.value;
  renderTasks();
});

sortBy.addEventListener('change', (e) => {
  currentFilters.sort = e.target.value;
  renderTasks();
});

chips.forEach(chip => {
  chip.addEventListener('click', (e) => {
    chips.forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    currentFilters.quick = e.target.getAttribute('data-filter');
    renderTasks();
  });
});

// --- Tasks UI Logic ---

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dueDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const getDueBadge = (dueDate, status) => {
  if (!dueDate || status === 'done') return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dueDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return `<span class="deadline-badge deadline-overdue">⚠ Overdue (${daysAgo}d)</span>`;
  }
  if (diffDays === 0) {
    return `<span class="deadline-badge deadline-today">⏳ Due Today</span>`;
  }
  if (diffDays === 1) {
    return `<span class="deadline-badge deadline-tomorrow">Due Tomorrow</span>`;
  }
  return `<span class="deadline-badge">Due: ${dueDate}</span>`;
};

const updateProgressOverview = () => {
  if (!progressPercent) return;
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status !== 'done' && t.status !== 'in_progress').length;
  const overdue = tasks.filter(t => t.status !== 'done' && isOverdue(t.due_date)).length;
  
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  progressPercent.textContent = `${rate}%`;
  progressBarFill.style.width = `${rate}%`;
  statCompleted.textContent = `${completed} completed`;
  statInProgress.textContent = `${inProgress} in progress`;
  statPending.textContent = `${pending} to do`;
  
  if (overdue > 0) {
    statOverdueWrap.classList.remove('hidden');
    statOverdue.textContent = `${overdue} overdue`;
  } else {
    statOverdueWrap.classList.add('hidden');
  }
};

const getPriorityBadge = (priority) => {
  if (priority === 'high') return '<span class="priority-badge priority-high">↑ High</span>';
  if (priority === 'low') return '<span class="priority-badge priority-low">↓ Low</span>';
  return '<span class="priority-badge">- Medium</span>';
};

const renderTasks = () => {
  updateProgressOverview();
  taskListEl.innerHTML = '';
  
  let filteredTasks = tasks.filter(task => {
    if (currentFilters.search && !task.title.toLowerCase().includes(currentFilters.search.toLowerCase())) return false;
    if (currentFilters.status !== 'all' && task.status !== currentFilters.status) return false;
    if (currentFilters.priority !== 'all' && task.priority !== currentFilters.priority) return false;
    
    if (currentFilters.quick === 'high-priority' && task.priority !== 'high') return false;
    if (currentFilters.quick === 'overdue') {
      if (task.status === 'done' || !isOverdue(task.due_date)) return false;
    }
    if (currentFilters.quick === 'due-soon') {
      if (!task.due_date || task.status === 'done') return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [y, m, d] = task.due_date.split('-').map(Number);
      const due = new Date(y, m - 1, d);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 2) return false;
    }
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (currentFilters.sort === 'created-asc') {
      return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    }
    if (currentFilters.sort === 'due-asc') {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (currentFilters.sort === 'priority-desc') {
      const pMap = { high: 3, medium: 2, low: 1 };
      return (pMap[b.priority] || 2) - (pMap[a.priority] || 2);
    }
    if (currentFilters.sort === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  if (filteredTasks.length === 0) {
    taskListEl.innerHTML = `
      <div class="empty-state">
        <p>${tasks.length === 0 ? 'No tasks created yet' : 'No tasks match your filters.'}</p>
      </div>
    `;
    return;
  }

  filteredTasks.forEach(task => {
    const el = document.createElement('div');
    el.className = `task-item ${task.status === 'done' ? 'task-done' : ''}`;
    
    let actionButtons = '';
    if (task.status === 'done') {
      actionButtons = `<button class="status-btn btn-undo" data-id="${task.id}" data-action="undo">Undo</button>`;
    } else if (task.status === 'in_progress') {
      actionButtons = `<button class="status-btn btn-done" data-id="${task.id}" data-action="done">Done</button>`;
    } else {
      actionButtons = `
        <button class="status-btn btn-start" data-id="${task.id}" data-action="start">Start</button>
        <button class="status-btn btn-done" data-id="${task.id}" data-action="done">Done</button>
      `;
    }

    el.innerHTML = `
      <div class="task-content">
        <div class="task-title">${escapeHTML(task.title)}</div>
        <div class="task-meta mono">
          ${getPriorityBadge(task.priority)}
          ${getDueBadge(task.due_date, task.status)}
          ${task.status === 'done' ? '<span class="status-badge status-done-badge">✓ Done</span>' : ''}
          ${task.status === 'in_progress' ? '<span class="status-badge status-in-progress">● In Progress</span>' : ''}
        </div>
      </div>
      <div class="task-actions">
        ${actionButtons}
        <button class="edit-btn" data-id="${task.id}" aria-label="Edit task: ${escapeHTML(task.title)}">Edit</button>
        <button class="delete-btn" data-id="${task.id}" aria-label="Delete task: ${escapeHTML(task.title)}">Delete</button>
      </div>
    `;

    taskListEl.appendChild(el);
  });
};

const escapeHTML = (str) => {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
};

const loadTasks = async () => {
  taskListEl.innerHTML = '<div class="empty-state"><p>Loading tasks...</p></div>';
  try {
    const fetchPromise = fetchTasks();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
    tasks = await Promise.race([fetchPromise, timeoutPromise]);
    renderTasks();
  } catch (err) {
    if (err.message === 'timeout') {
      tasks = [];
      renderTasks();
    } else {
      taskListEl.innerHTML = `<div class="empty-state"><p style="color:var(--error)">Error loading tasks: ${err.message}</p></div>`;
    }
  }
};

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  taskError.classList.add('hidden');
  
  const id = taskIdInput.value;
  const title = taskTitleInput.value.trim();
  const priority = taskPrioritySelect.value;
  const due_date = taskDueInput.value || null;

  if (!title) {
    taskError.textContent = 'Task title is required.';
    taskError.classList.remove('hidden');
    return;
  }

  const taskData = { title, priority, due_date, user_id: currentUser.id };
  
  btnSaveTask.disabled = true;
  btnSaveTask.textContent = 'Saving...';

  try {
    if (id) {
      const updated = await updateTask(id, taskData);
      tasks = tasks.map(t => t.id === id ? updated : t);
    } else {
      const created = await createTask(taskData);
      tasks.unshift(created);
    }
    resetTaskForm();
    renderTasks();
  } catch (err) {
    taskError.textContent = err.message;
    taskError.classList.remove('hidden');
  } finally {
    btnSaveTask.disabled = false;
    btnSaveTask.textContent = id ? 'Save Changes' : 'Add Task';
  }
});

const playCheckmarkAnimation = () => {
  animOverlay.classList.remove('hidden');
  
  setTimeout(() => {
    animOverlay.style.opacity = '0';
    animOverlay.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      animOverlay.classList.add('hidden');
      animOverlay.style.opacity = '1';
      animOverlay.style.transition = '';
    }, 300);
  }, 1200);
};

taskListEl.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    
    if (deletedTaskQueue) {
      clearTimeout(deletedTaskQueue.timeoutId);
      clearInterval(deletedTaskQueue.timerIntervalId);
      deleteTask(deletedTaskQueue.task.id).catch(console.error);
    }
    
    let timeLeft = 10;
    toastTimer.textContent = `${timeLeft}s`;
    toastContainer.classList.remove('hidden');
    
    const timerIntervalId = setInterval(() => {
      timeLeft -= 1;
      toastTimer.textContent = `${timeLeft}s`;
    }, 1000);
    
    const timeoutId = setTimeout(async () => {
      clearInterval(timerIntervalId);
      toastContainer.classList.add('hidden');
      deletedTaskQueue = null;
      try {
        await deleteTask(id);
      } catch (err) {
        alert('Failed to delete task permanently: ' + err.message);
        tasks.unshift(taskToDelete);
        renderTasks();
      }
    }, 10000);
    
    deletedTaskQueue = { task: taskToDelete, timeoutId, timerIntervalId };
    
  } else if (e.target.classList.contains('status-btn')) {
    const id = e.target.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    const task = tasks.find(t => t.id === id);
    if (task) {
      let newStatus = 'done';
      if (action === 'start') newStatus = 'in_progress';
      else if (action === 'undo') newStatus = 'todo';
      else if (action === 'done') newStatus = 'done';
      else newStatus = task.status === 'done' ? 'todo' : 'done';

      e.target.disabled = true;
      e.target.textContent = '...';
      try {
        const updated = await updateTask(id, { status: newStatus });
        tasks = tasks.map(t => t.id === id ? updated : t);
        renderTasks();
        
        if (newStatus === 'done') {
           playCheckmarkAnimation();
        }
      } catch (err) {
        alert('Failed to update status: ' + err.message);
        e.target.disabled = false;
        renderTasks();
      }
    }
  } else if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    const task = tasks.find(t => t.id === id);
    if (task) {
      taskIdInput.value = task.id;
      taskTitleInput.value = task.title;
      taskPrioritySelect.value = task.priority;
      taskDueInput.value = task.due_date || '';
      btnSaveTask.textContent = 'Save Changes';
      btnCancelEdit.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});

btnUndoDelete.addEventListener('click', () => {
  if (deletedTaskQueue) {
    clearTimeout(deletedTaskQueue.timeoutId);
    clearInterval(deletedTaskQueue.timerIntervalId);
    
    tasks.unshift(deletedTaskQueue.task);
    tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderTasks();
    
    toastContainer.classList.add('hidden');
    deletedTaskQueue = null;
  }
});

btnCancelEdit.addEventListener('click', () => {
  resetTaskForm();
});

const resetTaskForm = () => {
  taskIdInput.value = '';
  taskTitleInput.value = '';
  taskPrioritySelect.value = 'medium';
  taskDueInput.value = '';
  btnSaveTask.textContent = 'Add Task';
  btnCancelEdit.classList.add('hidden');
  taskError.classList.add('hidden');
};
