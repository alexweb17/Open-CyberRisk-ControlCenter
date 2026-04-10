// --- Authentication Logic (Soberan JWT) ---
let localUser = null;
let authToken = localStorage.getItem('open_cyberrisk_token');

async function login(email, password) {
    console.log("[AUTH] Attempting login for:", email);
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localUser = data.user;
            localStorage.setItem('open_cyberrisk_token', authToken);

            console.log("[AUTH] Login successful:", localUser.name);
            updateUI();
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            applyRoleRestrictions();

            // Reload dashboard or data if needed
            if (typeof loadGovernanceData === 'function') loadGovernanceData();
        } else {
            console.warn("[AUTH] Login failed:", data.error || "Unknown error");
            const errorMessage = (response.status === 401 || response.status === 403) 
                ? "ingresaste Credenciales incorrectas" 
                : (data.error || "Error al iniciar sesión");
            
            // Priority for user feedback: Alert (for reliability on login overlay)
            alert(errorMessage);
            
            if (typeof showNotification === 'function') {
                showNotification(errorMessage, 'error');
            }
        }
    } catch (err) {
        console.error("[AUTH] Login error:", err);
        alert("Error de conexión con el servidor");
    }
}

function logout() {
    authToken = null;
    localUser = null;
    localStorage.removeItem('open_cyberrisk_token');
    updateUI();
    if (typeof showLoginOverlay === 'function') showLoginOverlay();
}

async function checkSession() {
    if (!authToken) {
        if (typeof showLoginOverlay === 'function') showLoginOverlay();
        return;
    }

    try {
        const response = await fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            localUser = await response.json();
            console.log("[AUTH] Session valid:", localUser.name);
            updateUI();
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            applyRoleRestrictions();
        } else {
            console.warn("[AUTH] Session expired or invalid");
            logout();
        }
    } catch (err) {
        console.error("[AUTH] Error checking session:", err);
        // Do not logout on network error to prevent annoying redirects
    }
}

function updateUI() {
    const emailEl = document.getElementById('user-email');
    const pwdBtn = document.getElementById('change-pwd-btn');
    if (localUser) {
        if (emailEl) emailEl.innerText = localUser.email;
        document.getElementById('logout-btn').style.display = 'block';
        if (pwdBtn) pwdBtn.style.display = 'inline-block';
    } else {
        if (emailEl) emailEl.innerText = "Inicie sesión";
        document.getElementById('logout-btn').style.display = 'none';
        if (pwdBtn) pwdBtn.style.display = 'none';
    }
}

function getAuthHeaders() {
    if (!authToken) return {};
    return {
        'Authorization': `Bearer ${authToken}`
    };
}

function applyRoleRestrictions() {
    if (!localUser) return;

    console.log(`[AUTH] Applying restrictions for role: ${localUser.role}`);

    // First, hide everything to clear previous session state
    document.querySelectorAll('.admin-only, .sm-only, .delete-btn').forEach(el => {
        el.style.setProperty('display', 'none', 'important');
    });

    // UI visibility logic (must use setProperty to override !important in CSS)
    if (localUser.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.setProperty('display', 'flex', 'important'));
        document.querySelectorAll('.sm-only').forEach(el => el.style.setProperty('display', 'flex', 'important'));
        document.querySelectorAll('.delete-btn').forEach(el => el.style.setProperty('display', 'inline-block', 'important'));
    } else if (localUser.role === 'security_manager') {
        document.querySelectorAll('.sm-only').forEach(el => el.style.setProperty('display', 'flex', 'important'));
        document.querySelectorAll('.delete-btn').forEach(el => el.style.setProperty('display', 'inline-block', 'important'));
    }
}

// --- Self-service Password Change ---
function openChangePasswordModal() {
    document.getElementById('change-pwd-modal').style.display = 'block';
    const form = document.getElementById('change-pwd-form');
    form.reset();
    
    // Reset all password fields to type="password" and icons to 👁️
    ['pwd-current', 'pwd-new', 'pwd-confirm'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.type = 'password';
            const btn = input.nextElementSibling;
            if (btn) btn.innerText = '👁️';
        }
    });
}

function closeChangePasswordModal() {
    document.getElementById('change-pwd-modal').style.display = 'none';
}

async function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('pwd-current').value;
    const newPassword = document.getElementById('pwd-new').value;
    const confirmPassword = document.getElementById('pwd-confirm').value;

    if (newPassword !== confirmPassword) {
        if (typeof showNotification === 'function') {
            showNotification('Las contraseñas nuevas no coinciden.', 'error');
        } else {
            alert('Las contraseñas nuevas no coinciden.');
        }
        return;
    }

    try {
        const response = await cyberFetch('/api/me/password', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (response.ok) {
            if (typeof showNotification === 'function') {
                showNotification('Contraseña actualizada exitosamente.', 'success');
            }
            closeChangePasswordModal();
        } else {
            const data = await response.json();
            if (typeof showNotification === 'function') {
                showNotification(data.error || 'Error al actualizar la contraseña.', 'error');
            }
        }
    } catch (err) {
        console.error('Error changing password:', err);
        if (typeof showNotification === 'function') {
            showNotification('Error de conexión.', 'error');
        }
    }
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const icon = btn.querySelector('i.material-icons');

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.innerText = 'visibility_off';
        } else {
            btn.innerText = '🙈'; // Hide icon
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.innerText = 'visibility';
        } else {
            btn.innerText = '👁️'; // Show icon
        }
    }
}

// Global Exports
window.login = login;
window.logout = logout;
window.getAuthHeaders = getAuthHeaders;
window.localUser = () => localUser;
window.checkSession = checkSession;
window.applyRoleRestrictions = applyRoleRestrictions;
window.openChangePasswordModal = openChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.handleChangePassword = handleChangePassword;
window.togglePasswordVisibility = togglePasswordVisibility;

// Auto-check on load
document.addEventListener('DOMContentLoaded', checkSession);
