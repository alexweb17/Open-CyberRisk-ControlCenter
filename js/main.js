// ============ MAIN NAVIGATION & INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
    // Initial data load
    checkUser();
    loadLocalData();
    loadProjects();

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
            if (action === 'edit') openProjectModal(id);
            if (action === 'delete') openDeleteProjectModal(id, name);
        }

        // RCS Actions
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
});

// --- Navigation ---
function showSection(sectionId) {
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
        sec.style.display = 'none';
    });

    const targetView = document.getElementById(sectionId + '-view');
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = '';
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
window.login = login;
window.logout = logout;

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

// RCS
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
