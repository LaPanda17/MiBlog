// Datos para notas aleatorias
const randomTitles = [
    "Ideas para el proyecto",
    "Lista de compras",
    "Recordatorios importantes",
    "Metas personales",
    "Libros por leer"
];

const randomContents = [
    "Investigar sobre frameworks frontend modernos. Revisar documentación de React y Vue.",
    "Leche, huevos, pan integral, frutas, vegetales, carne magra.",
    "Llamar al médico para cita anual. Pagar factura de electricidad antes del viernes.",
    "Aprender un nuevo idioma este año. Hacer ejercicio 3 veces por semana.",
    "Cien años de soledad - García Márquez. El principito - Saint-Exupéry."
];

const randomCategories = ["Trabajo", "Personal", "Estudio", "Salud", "Finanzas"];

// Obtener usuario actual
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Elementos del DOM
const notesContainer = document.getElementById('notesContainer');
const generateNotesBtn = document.getElementById('generateNotes');
const addNoteBtn = document.getElementById('addNote');
const noteModal = document.getElementById('noteModal');
const modalTitle = document.getElementById('modalTitle');
const noteForm = document.getElementById('noteForm');
const closeModal = document.querySelector('.close');

// Mostrar notas al cargar la página
document.addEventListener('DOMContentLoaded', renderNotes);

// Generar notas aleatorias
generateNotesBtn?.addEventListener('click', function() {
    // Limitar a 3 notas aleatorias
    for (let i = 0; i < 3; i++) {
        const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)];
        const randomContent = randomContents[Math.floor(Math.random() * randomContents.length)];
        const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
        
        const newNote = {
            id: Date.now() + i,
            title: randomTitle,
            content: randomContent,
            category: randomCategory,
            date: new Date().toLocaleDateString()
        };
        
        currentUser.notes.push(newNote);
    }
    
    updateUserData();
    renderNotes();
});

// Abrir modal para nueva nota
addNoteBtn?.addEventListener('click', function() {
    document.getElementById('noteId').value = '';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    modalTitle.textContent = 'Nueva Nota';
    noteModal.style.display = 'block';
});

// Cerrar modal
closeModal?.addEventListener('click', function() {
    noteModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target === noteModal) {
        noteModal.style.display = 'none';
    }
});

// Guardar nota (crear o editar)
noteForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const noteId = document.getElementById('noteId').value;
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    if (noteId) {
        // Editar nota existente
        const noteIndex = currentUser.notes.findIndex(note => note.id == noteId);
        if (noteIndex !== -1) {
            currentUser.notes[noteIndex].title = title;
            currentUser.notes[noteIndex].content = content;
        }
    } else {
        // Crear nueva nota
        const newNote = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleDateString()
        };
        currentUser.notes.push(newNote);
    }
    
    updateUserData();
    renderNotes();
    noteModal.style.display = 'none';
});

// Renderizar notas
function renderNotes() {
    if (!currentUser || !currentUser.notes) return;
    
    notesContainer.innerHTML = '';
    
    currentUser.notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>Creada: ${note.date}</small>
            <div class="note-actions">
                <button class="edit-btn btn" data-id="${note.id}">Editar</button>
                <button class="delete-btn btn" data-id="${note.id}">Eliminar</button>
            </div>
        `;
        
        notesContainer.appendChild(noteElement);
    });
    
    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = this.getAttribute('data-id');
            editNote(noteId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = this.getAttribute('data-id');
            deleteNote(noteId);
        });
    });
}

// Editar nota
function editNote(noteId) {
    const note = currentUser.notes.find(note => note.id == noteId);
    if (note) {
        document.getElementById('noteId').value = note.id;
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        modalTitle.textContent = 'Editar Nota';
        noteModal.style.display = 'block';
    }
}

// Eliminar nota
function deleteNote(noteId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
        currentUser.notes = currentUser.notes.filter(note => note.id != noteId);
        updateUserData();
        renderNotes();
    }
}

// Actualizar datos del usuario en localStorage
function updateUserData() {
    // Actualizar el usuario en el array de usuarios
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}