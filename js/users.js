// ============ USER MANAGEMENT FUNCTIONS ============
let usersData = [];

async function loadUsers() {
    if (typeof localUser === 'function' && localUser()?.role !== 'admin') return;

    try {
        const response = await cyberFetch('/api/users');
        if (response.ok) {
            usersData = await response.json();
            renderUsersTable(usersData);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsersTable(data) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    tbody.innerHTML = data.map(u => `
        <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
            <td style="padding: 12px; font-weight: 600;">${u.name || 'N/A'}</td>
            <td style="padding: 12px;">${u.email}</td>
            <td style="padding: 12px;">
                <select onchange="updateUserRole('${u._id}', this.value)" style="padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: white; font-size: 0.9rem;">
                    <option value="engineer" ${u.role === 'engineer' ? 'selected' : ''}>Engineer</option>
                    <option value="security_manager" ${u.role === 'security_manager' ? 'selected' : ''}>Security Manager</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td style="padding: 12px; color: var(--text-secondary); font-size: 0.85rem;">
                ${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Nunca'}
            </td>
            <td style="padding: 12px; text-align: right; display: flex; gap: 8px; justify-content: flex-end; align-items: center;">
                <button onclick="openUserModal('${u._id}')" title="Editar Usuario" 
                    style="background: #f3f4f6; border: none; padding: 6px; border-radius: 6px; cursor: pointer; color: #4b5563;">
                    ✏️
                </button>
                <button onclick="openDeleteUserModal('${u._id}', '${u.email}')" title="Eliminar Usuario" 
                    style="background: #fee2e2; border: none; padding: 6px; border-radius: 6px; cursor: pointer; color: #b91c1c;">
                    🗑️
                </button>
                <span style="font-size: 0.7rem; color: var(--text-secondary); margin-left: 8px;">ID: ${u._id.substring(0, 6)}</span>
            </td>
        </tr>
    `).join('');
}

async function updateUserRole(userId, newRole) {
    if (!confirm(`¿Seguro que desea cambiar el rol a ${newRole}?`)) {
        loadUsers(); 
        return;
    }

    try {
        const response = await cyberFetch(`/api/users/${userId}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });

        if (response.ok) {
            showNotification(`Rol de usuario actualizado a ${newRole}`, 'success');
            loadUsers();
        }
    } catch (error) {
        console.error('Error updating user role:', error);
    }
}

// Modal Toggle Functions
function openUserModal(userId = null) {
    try {
        const modal = document.getElementById('user-modal');
        const form = document.getElementById('user-form');
        const title = document.getElementById('user-modal-title');
        const submitBtn = document.getElementById('btn-user-submit');
        const pwdLabel = document.getElementById('label-user-password');
        
        if (!modal || !form) {
            console.error('Modal elements not found');
            return;
        }
        
        form.reset();
        document.getElementById('modal-user-id').value = userId || '';
        
        // Reset password visibility
        const pwdInput = document.getElementById('modal-user-password');
        if (pwdInput) {
            pwdInput.type = 'password';
            const btn = pwdInput.nextElementSibling;
            if (btn) btn.innerText = '👁️';
        }
        
        if (userId) {
            const user = usersData.find(u => u._id === userId);
            if (user) {
                if (title) title.innerText = 'Editar Usuario';
                if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
                if (pwdLabel) pwdLabel.innerText = 'Nueva Contraseña (dejar vacío para no cambiar)';
                
                document.getElementById('modal-user-name').value = user.name || '';
                document.getElementById('modal-user-email').value = user.email || '';
                document.getElementById('modal-user-role').value = user.role || 'engineer';
            }
        } else {
            if (title) title.innerText = 'Nuevo Usuario';
            if (submitBtn) submitBtn.innerText = 'Crear Usuario';
            if (pwdLabel) pwdLabel.innerText = 'Contraseña Inicial *';
        }
        
        modal.style.display = 'block';
    } catch (err) {
        console.error('Error opening user modal:', err);
    }
}

function closeUserModal() {
    document.getElementById('user-modal').style.display = 'none';
}

async function handleUserSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('modal-user-id').value;
    const name = document.getElementById('modal-user-name').value.trim();
    const email = document.getElementById('modal-user-email').value.trim().toLowerCase();
    const password = document.getElementById('modal-user-password').value;
    const role = document.getElementById('modal-user-role').value;

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `/api/users/${id}` : '/api/users';

    try {
        const response = await cyberFetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        if (response.ok) {
            showNotification(id ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 'success');
            closeUserModal();
            loadUsers();
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const err = await response.json();
                showNotification(err.error || 'Error en la operación', 'error');
            } else {
                const text = await response.text();
                console.error('Server error (non-JSON):', text);
                showNotification(`Error del servidor (${response.status})`, 'error');
            }
        }
    } catch (error) {
        console.error('Error submitting user:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Delete User Modal Logic
function openDeleteUserModal(userId, email) {
    document.getElementById('delete-user-id').value = userId;
    document.getElementById('delete-user-message').innerText = `¿Está seguro que desea eliminar al usuario ${email}? Esta acción no se puede deshacer.`;
    document.getElementById('delete-user-modal').style.display = 'flex';
}

function closeDeleteUserModal() {
    document.getElementById('delete-user-modal').style.display = 'none';
}

async function confirmDeleteUser() {
    const userId = document.getElementById('delete-user-id').value;
    
    try {
        const response = await cyberFetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Usuario eliminado correctamente', 'success');
            closeDeleteUserModal();
            loadUsers();
        } else {
            showNotification('Error al eliminar usuario', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Export to window
window.loadUsers = loadUsers;
window.updateUserRole = updateUserRole;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.handleUserSubmit = handleUserSubmit;
window.openDeleteUserModal = openDeleteUserModal;
window.closeDeleteUserModal = closeDeleteUserModal;
window.confirmDeleteUser = confirmDeleteUser;
