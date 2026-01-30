// ========== KONFIGURACJA ==========
const API_URL = 'http://localhost:3000/api';

// Stan aplikacji
let currentPlanId = null;

// ========== ELEMENTY DOM ==========
// Widoki
const homeView = document.getElementById('homeView');
const planView = document.getElementById('planView');

// Strona główna
const planNameInput = document.getElementById('planNameInput');
const createPlanBtn = document.getElementById('createPlanBtn');
const plansList = document.getElementById('plansList');

// Widok planu
const backBtn = document.getElementById('backBtn');
const planTitle = document.getElementById('planTitle');
const deletePlanBtn = document.getElementById('deletePlanBtn');
const taskNameInput = document.getElementById('taskNameInput');
const taskDeadlineInput = document.getElementById('taskDeadlineInput');
const taskEstimateInput = document.getElementById('taskEstimateInput');
const createTaskBtn = document.getElementById('createTaskBtn');
const tasksList = document.getElementById('tasksList');

// ========== NAWIGACJA ==========
function showHomeView() {
    homeView.style.display = 'block';
    planView.style.display = 'none';
    currentPlanId = null;
    loadPlans();
}

function showPlanView(planId) {
    homeView.style.display = 'none';
    planView.style.display = 'block';
    currentPlanId = planId;
    loadPlanDetails(planId);
    loadTasks(planId);
}

// ========== PLANY - CRUD ==========
async function loadPlans() {
    try {
        const response = await fetch(`${API_URL}/lists`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd pobierania planów');
        }

        displayPlans(result.data);
    } catch (error) {
        console.error('Błąd:', error);
        plansList.innerHTML = '<p class="no-plans">Błąd pobierania planów</p>';
    }
}

function displayPlans(plans) {
    if (plans.length === 0) {
        plansList.innerHTML = '<p class="no-plans">Brak planów. Utwórz swój pierwszy plan!</p>';
        return;
    }

    plansList.innerHTML = plans.map(plan => `
        <div class="plan-card" onclick="showPlanView(${plan.id})">
            <h3>${escapeHtml(plan.name)}</h3>
            <div class="task-counters">
                <div class="task-count-badge">${plan.taskCount || 0} zadań</div>
                <div class="completed-count-badge">Zakończone: ${plan.completedCount || 0}</div>
                <div class="cancelled-count-badge">Anulowane: ${plan.cancelledCount || 0}</div>
            </div>
        </div>
    `).join('');
}

async function createPlan() {
    const name = planNameInput.value.trim();

    if (!name) {
        alert('Wpisz nazwę planu');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/lists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd tworzenia planu');
        }

        planNameInput.value = '';
        loadPlans();
    } catch (error) {
        console.error('Błąd:', error);
        alert(error.message);
    }
}

async function deletePlan() {
    if (!confirm('Czy na pewno chcesz usunąć ten plan i wszystkie jego zadania?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/lists/${currentPlanId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd usuwania planu');
        }

        showHomeView();
    } catch (error) {
        console.error('Błąd:', error);
        alert(error.message);
    }
}

async function loadPlanDetails(planId) {
    try {
        const response = await fetch(`${API_URL}/lists/${planId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd pobierania planu');
        }

        planTitle.textContent = result.data.name;
    } catch (error) {
        console.error('Błąd:', error);
        planTitle.textContent = 'Plan';
    }
}

// ========== ZADANIA - CRUD ==========
async function loadTasks(planId) {
    try {
        const response = await fetch(`${API_URL}/tasks?list_id=${planId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd pobierania zadań');
        }

        displayTasks(result.data);
    } catch (error) {
        console.error('Błąd:', error);
        tasksList.innerHTML = '<p class="no-tasks">Błąd pobierania zadań</p>';
    }
}

function displayTasks(tasks) {
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="no-tasks">Brak zadań. Dodaj pierwsze zadanie!</p>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.status === 'completed' ? 'checked' : ''}
                ${task.status === 'cancelled' ? 'disabled' : ''}
                onchange="changeTaskStatus(${task.id}, ${task.status === 'completed' ? "'pending'" : "'completed'"})"
            >
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
            </div>
            <div class="task-info-badges">
                ${task.deadline ? `<span class="info-badge deadline-badge">${escapeHtml(task.deadline)}</span>` : ''}
                ${task.estimated_time !== null && task.estimated_time !== undefined ? `<span class="info-badge time-badge">${task.estimated_time} h</span>` : ''}
            </div>
            ${task.status === 'pending' ? `<button class="cancel-btn" onclick="changeTaskStatus(${task.id}, 'cancelled')">Anuluj</button>` : ''}
            <button class="task-delete" onclick="deleteTask(${task.id})">Usuń</button>
        </div>
    `).join('');
}

async function createTask() {
    const title = taskNameInput.value.trim();
    const deadline = taskDeadlineInput.value.trim();
    const estimatedTimeValue = taskEstimateInput.valueAsNumber;
    const estimated_time = Number.isNaN(estimatedTimeValue) ? null : estimatedTimeValue;

    if (!title) {
        alert('Wpisz nazwę zadania');
        return;
    }

    try {
        const payload = {
            title,
            list_id: currentPlanId
        };

        if (deadline) {
            payload.deadline = deadline;
        }

        if (estimated_time !== null) {
            payload.estimated_time = estimated_time;
        }

        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd tworzenia zadania');
        }

        taskNameInput.value = '';
        taskDeadlineInput.value = '';
        taskEstimateInput.value = '';
        loadTasks(currentPlanId);
    } catch (error) {
        console.error('Błąd:', error);
        alert(error.message);
    }
}

async function changeTaskStatus(taskId, status) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd zmiany statusu zadania');
        }

        loadTasks(currentPlanId);
    } catch (error) {
        console.error('Błąd:', error);
        alert(error.message);
    }
}

async function deleteTask(taskId) {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Błąd usuwania zadania');
        }

        loadTasks(currentPlanId);
    } catch (error) {
        console.error('Błąd:', error);
        alert(error.message);
    }
}

// ========== FUNKCJE POMOCNICZE ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== EVENT LISTENERS ==========
createPlanBtn.addEventListener('click', createPlan);
planNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createPlan();
});

backBtn.addEventListener('click', showHomeView);
deletePlanBtn.addEventListener('click', deletePlan);

createTaskBtn.addEventListener('click', createTask);
taskNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createTask();
});

// ========== INICJALIZACJA ==========
document.addEventListener('DOMContentLoaded', () => {
    showHomeView();
});
