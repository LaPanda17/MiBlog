// Simulación de base de datos de usuarios
let users = JSON.parse(localStorage.getItem('users')) || [];

// Registrar nuevo usuario
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    // Validación básica
    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    // Verificar si el usuario ya existe
    if (users.some(user => user.email === email)) {
        showAlert('Este correo ya está registrado', 'error');
        return;
    }
    
    // Crear nuevo usuario con estructura extendida
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        notes: [],
        tasks: [],
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showAlert('Registro exitoso! Redirigiendo a tu dashboard...', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
});

// Iniciar sesión
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('Inicio de sesión exitoso!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showAlert('Correo o contraseña incorrectos', 'error');
    }
});

// Función para cerrar sesión
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            
            // Mostrar mensaje de confirmación
            showAlert('Sesión cerrada correctamente', 'success');
            
            // Redirigir después de un breve retraso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Llamar a esta función cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    setupLogout();
    
    // Verificar autenticación para páginas protegidas
    if (window.location.pathname.includes('dashboard.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            showAlert('Por favor inicia sesión primero', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
});

// Mostrar alertas estilizadas
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
    }, 3000);
}

// Estilos para alertas (añadir al CSS)
const alertStyles = document.createElement('style');
alertStyles.textContent = `
.alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    z-index: 1000;
    transform: translateX(120%);
    animation: slideIn 0.5s forwards;
    color: white;
    font-weight: 500;
}

.alert-success {
    background-color: var(--success-color);
}

.alert-error {
    background-color: var(--danger-color);
}

.fade-out {
    animation: fadeOut 0.5s forwards;
}

@keyframes slideIn {
    to { transform: translateX(0); }
}

@keyframes fadeOut {
    to { opacity: 0; }
}
`;
document.head.appendChild(alertStyles);