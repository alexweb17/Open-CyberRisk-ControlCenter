// ============ MAIN NAVIGATION & INITIALIZATION ============

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize MSAL and Auth state
    if (typeof initializeMsal === 'function') {
        await initializeMsal();
    }

    // Initial data load
    if (typeof checkSession === 'function') checkSession();
    if (typeof loadLocalData === 'function') loadLocalData();
    if (typeof loadProjects === 'function') loadProjects();

    // Set default view
    showSection('proyectos');

    // Global Event Listeners for Dynamic Content
    document.addEventListener('click', e => {
        // Master Controls Actions
        const controlBtn = e.target.closest('button[data-action]');
        if (controlBtn) {
            const action = controlBtn.dataset.action;
            const code = controlBtn.dataset.code;
            if (action === 'edit') openControlModal(code);
            if (action === 'delete') deleteControl(code);
        }

        // Master Controls Table Rows
        const row = e.target.closest('#master-controls-body tr');
        if (row && !e.target.closest('button')) {
            viewControlDetails(row.dataset.code);
        }

        // Project Actions
        const projectBtn = e.target.closest('button[data-project-action]');
        if (projectBtn) {
            const action = projectBtn.dataset.projectAction; // Corrected camelCase
            const id = projectBtn.dataset.projectId;
            const name = projectBtn.dataset.projectName;
            console.log(`[Project Action Click] Action: ${action}, ID: ${id}, Name: ${name}`);
            if (action === 'edit') openProjectModal(id);
            if (action === 'delete') openDeleteProjectModal(id, name);
        }

        // Consultorías Actions
        const rcsBtn = e.target.closest('button[data-rcs-action]');
        if (rcsBtn) {
            const action = rcsBtn.dataset.rcsAction;
            const id = rcsBtn.dataset.rcsId;
            const code = rcsBtn.dataset.rcsCode;
            if (action === 'delete') openDeleteRCSModal(id, code);
        }
    });

    // Form Submissions - Already handled by onsubmit in HTML usually, but adding listeners for assurance
    const projectForm = document.getElementById('project-form');
    if (projectForm) projectForm.addEventListener('submit', handleProjectSubmit);

    const controlForm = document.getElementById('control-form');
    if (controlForm) controlForm.addEventListener('submit', handleControlSubmit);

    const informeForm = document.getElementById('informe-form');
    if (informeForm) informeForm.addEventListener('submit', handleInformeSubmit);

    const procesoForm = document.getElementById('proceso-form');
    if (procesoForm) procesoForm.addEventListener('submit', handleProcesoSubmit);

    // Explicit button bindings (fallback for inline onclick)
    const btnCrearRCS = document.getElementById('btn-crear-rcs');
    if (btnCrearRCS) {
        btnCrearRCS.addEventListener('click', () => {
            console.log('[main.js] btn-crear-rcs clicked');
            createNewRCS();
        });
    }
});

// --- Navigation ---
function showSection(sectionId) {
    // Block non-admin users from accessing admin-only sections
    if (sectionId === 'usuarios') {
        const user = typeof localUser === 'function' ? localUser() : localUser;
        if (!user || user.role !== 'admin') {
            console.warn('[RBAC] Access denied: usuarios section requires admin role');
            return;
        }
    }

    // Close any open modals first
    closeAllModals();

    // Update Active Nav
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(sectionId)) {
            item.classList.add('active');
        }
    });

    // Update Views
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.setProperty('display', 'none', 'important');
    });

    const targetView = document.getElementById(sectionId + '-view');
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.removeProperty('display');
    } else {
        console.error(`View with ID ${sectionId}-view not found`);
    }

    // Load section-specific data
    if (sectionId === 'riesgos') {
        if (typeof loadRiskDashboard === 'function') loadRiskDashboard();
    } else if (sectionId === 'rcs') {
        if (typeof loadRCSData === 'function') loadRCSData();
    } else if (sectionId === 'informesl3') {
        if (typeof loadInformesL3 === 'function') loadInformesL3();
    } else if (sectionId === 'procesos') {
        if (typeof loadProcesos === 'function') loadProcesos();
    } else if (sectionId === 'proyectos') {
        if (typeof loadProjects === 'function') loadProjects();
    } else if (sectionId === 'lineamientos') {
        if (typeof loadLocalData === 'function') loadLocalData();
    } else if (sectionId === 'gobernanza') {
        if (typeof loadGovernanceData === 'function') loadGovernanceData();
    } else if (sectionId === 'marcos') {
        if (typeof initMarcos === 'function') initMarcos();
    } else if (sectionId === 'usuarios') {
        if (typeof loadUsers === 'function') loadUsers();
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => m.style.display = 'none');
}

// --- Helper Functions ---
function getSeverityClass(severity) {
    if (!severity) return '';
    const s = severity.toLowerCase();
    if (s.includes('crítica') || s.includes('critica')) return 'critical';
    if (s.includes('alta')) return 'high';
    if (s.includes('media')) return 'medium';
    if (s.includes('baja')) return 'low';
    return '';
}

// --- Global Exports ---
window.showSection = showSection;
window.closeAllModals = closeAllModals;
window.getSeverityClass = getSeverityClass;

// Auth
window.login = typeof login !== 'undefined' ? login : window.login;
window.logout = typeof logout !== 'undefined' ? logout : window.logout;
window.cyberFetch = cyberFetch;
window.checkUser = typeof checkSession !== 'undefined' ? checkSession : undefined;

// Global fetch wrapper with identity headers
async function cyberFetch(url, options = {}) {
    const authHeaders = typeof getAuthHeaders === 'function' ? getAuthHeaders() : {};

    options.headers = {
        ...options.headers,
        ...authHeaders
    };

    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        console.warn("[FETCH] Auth Error:", response.status);
        if (typeof logout === 'function') logout();
    }

    return response;
}

// Projects
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.handleProjectSubmit = handleProjectSubmit;
window.openDeleteProjectModal = openDeleteProjectModal;
window.closeDeleteProjectModal = closeDeleteProjectModal;
window.confirmDeleteProject = confirmDeleteProject;
window.filterProjects = filterProjects;

// Controls
window.openControlModal = openControlModal;
window.closeControlModal = closeControlModal;
window.handleControlSubmit = handleControlSubmit;
window.deleteControl = deleteControl;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.viewControlDetails = viewControlDetails;
window.handleSearch = handleSearch;

// Consultorías de Ciberseguridad
window.loadRCSData = loadRCSData;
window.openRCSDetail = openRCSDetail;
window.showRCSList = showRCSList;
window.createNewRCS = createNewRCS;
window.saveRCSDetail = saveRCSDetail;
window.searchControlsForRCS = searchControlsForRCS;
window.addControlToRCS = addControlToRCS;
window.removeControlFromRCS = removeControlFromRCS;
window.updateControlState = updateControlState;
window.filterRCSTable = filterRCSTable;
window.openDeleteRCSModal = openDeleteRCSModal;

// Risks
window.loadRiskDashboard = loadRiskDashboard;
window.filterRiskInventory = filterRiskInventory;

// Informes
window.loadInformesL3 = loadInformesL3;
window.openInformeModal = openInformeModal;
window.closeInformeModal = closeInformeModal;
window.openEditInformeModal = openEditInformeModal;
window.handleInformeSubmit = handleInformeSubmit;
window.openDeleteInformeModal = openDeleteInformeModal;
window.closeDeleteInformeModal = closeDeleteInformeModal;
window.confirmDeleteInforme = confirmDeleteInforme;
window.filterInformesTable = filterInformesTable;

// Procesos
window.loadProcesos = loadProcesos;
window.openProcesoModal = openProcesoModal;
window.closeProcesoModal = closeProcesoModal;
window.openEditProcesoModal = openEditProcesoModal;
window.handleProcesoSubmit = handleProcesoSubmit;
window.openDeleteProcesoModal = openDeleteProcesoModal;
window.closeDeleteProcesoModal = closeDeleteProcesoModal;
window.confirmDeleteProceso = confirmDeleteProceso;
window.filterProcesosTable = filterProcesosTable;
// --- Notifications ---
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'notification-container';
        div.style.cssText = 'position: fixed; top: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 12px;';
        document.body.appendChild(div);
    }
    
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10B981' : (type === 'error' ? '#EF4444' : '#6B7280');
    
    toast.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        font-weight: 500;
        min-width: 200px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    toast.innerText = message;
    document.getElementById('notification-container').appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

window.showNotification = showNotification;

// Add CSS animation dynamically if not present
if (!document.getElementById('notif-styles')) {
    const style = document.createElement('style');
    style.id = 'notif-styles';
    style.innerHTML = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
