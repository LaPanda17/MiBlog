// Obtener usuario actual
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Mostrar nombre de usuario
document.getElementById('userName').textContent = currentUser.name;

// Elementos del DOM
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Sistema de pestañas
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}Tab`).classList.add('active');
    });
});

// ========== SISTEMA DE NOTAS ========== //
// (El código existente de notas puede mantenerse igual)

// ========== NUEVO SISTEMA DE TAREAS ========== //
const tasksContainer = document.getElementById('tasksContainer');
const addTaskBtn = document.getElementById('addTask');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');

// Datos para tareas aleatorias
const randomTasks = [
    "Revisar correo electrónico",
    "Hacer ejercicio",
    "Completar informe mensual",
    "Llamar al cliente importante",
    "Actualizar documentación del proyecto",
    "Reunión con el equipo",
    "Aprender nueva tecnología",
    "Planificar semana próxima"
];

// Abrir modal para nueva tarea
addTaskBtn.addEventListener('click', () => {
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskModalTitle').textContent = 'Nueva Tarea';
    openModal(taskModal);
});

// Guardar tarea
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    
    if (!currentUser.tasks) currentUser.tasks = [];
    
    if (taskId) {
        // Editar tarea existente
        const taskIndex = currentUser.tasks.findIndex(task => task.id == taskId);
        if (taskIndex !== -1) {
            currentUser.tasks[taskIndex] = {
                ...currentUser.tasks[taskIndex],
                title,
                dueDate,
                priority
            };
        }
    } else {
        // Crear nueva tarea
        const newTask = {
            id: Date.now(),
            title,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };
        currentUser.tasks.push(newTask);
    }
    
    updateUserData();
    renderTasks();
    closeModal(taskModal);
});

// Renderizar tareas
function renderTasks() {
    if (!currentUser.tasks || currentUser.tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="empty-message">No hay tareas creadas aún.</p>';
        return;
    }
    
    tasksContainer.innerHTML = '';
    
    // Ordenar tareas por prioridad y fecha
    const sortedTasks = [...currentUser.tasks].sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    sortedTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'card fade-in';
        
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha';
        const priorityClass = `priority-${task.priority}`;
        
        taskElement.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${task.title}</h3>
                <span class="priority-badge ${priorityClass}">${task.priority}</span>
            </div>
            <div class="card-body">
                <div class="task-item">
                    <input type="checkbox" id="task-${task.id}" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <label for="task-${task.id}" class="task-label">${task.title}</label>
                </div>
                <p><i class="far fa-calendar-alt"></i> Fecha límite: ${dueDate}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary edit-task" data-id="${task.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger delete-task" data-id="${task.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        
        tasksContainer.appendChild(taskElement);
        
        // Evento para marcar tarea como completada
        const checkbox = taskElement.querySelector(`#task-${task.id}`);
        checkbox.addEventListener('change', function() {
            const taskIndex = currentUser.tasks.findIndex(t => t.id == task.id);
            if (taskIndex !== -1) {
                currentUser.tasks[taskIndex].completed = this.checked;
                updateUserData();
            }
        });
    });
    
    // Eventos para botones de editar y eliminar
    document.querySelectorAll('.edit-task').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            editTask(taskId);
        });
    });
    
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
}

// Editar tarea
function editTask(taskId) {
    const task = currentUser.tasks.find(task => task.id == taskId);
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskModalTitle').textContent = 'Editar Tarea';
        openModal(taskModal);
    }
}

// Eliminar tarea
function deleteTask(taskId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        currentUser.tasks = currentUser.tasks.filter(task => task.id != taskId);
        updateUserData();
        renderTasks();
    }
}

// Generar tareas aleatorias (opcional)
function generateRandomTasks() {
    if (!currentUser.tasks) currentUser.tasks = [];
    
    for (let i = 0; i < 3; i++) {
        const randomTitle = randomTasks[Math.floor(Math.random() * randomTasks.length)];
        const randomDueDate = new Date();
        randomDueDate.setDate(randomDueDate.getDate() + Math.floor(Math.random() * 7));
        
        const newTask = {
            id: Date.now() + i,
            title: randomTitle,
            dueDate: randomDueDate.toISOString().split('T')[0],
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        currentUser.tasks.push(newTask);
    }
    
    updateUserData();
    renderTasks();
}

// Funciones auxiliares para modales
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Cerrar modales al hacer clic en la X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Cerrar modales al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target);
    }
});

// Inicializar la vista
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser.tasks) currentUser.tasks = [];
    renderTasks();
    
    // Opcional: Botón para generar tareas aleatorias
    const generateTasksBtn = document.createElement('button');
    generateTasksBtn.className = 'btn btn-primary';
    generateTasksBtn.innerHTML = '<i class="fas fa-random"></i> Generar Tareas';
    generateTasksBtn.addEventListener('click', generateRandomTasks);
    document.querySelector('#tasksTab .notes-actions').appendChild(generateTasksBtn);
});

// Actualizar datos del usuario
function updateUserData() {
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}