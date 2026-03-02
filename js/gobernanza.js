// ============ GOBERNANZA & DIRECTORIO FUNCTIONS ============

let objectivesData = [];
let krisData = [];

async function loadGovernanceData() {
    try {
        // Load Executive Summary
        const summaryResp = await fetch('/api/governance/executive-summary');
        const summary = await summaryResp.json();
        renderExecutiveSummary(summary);

        // Load specific tabs if active
        loadObjectives();
        loadKRIs();
    } catch (error) {
        console.error('Error loading governance data:', error);
    }
}

function renderExecutiveSummary(summary) {
    document.getElementById('gov-total-exposure').textContent = formatCurrency(summary.totalFinancialExposure || 0);
    document.getElementById('gov-obj-count').textContent = summary.strategicObjectivesCount || 0;

    const stats = summary.kriStatus || { total: 0, critical: 0, warning: 0 };
    document.getElementById('gov-kri-total').textContent = stats.total;
    document.getElementById('gov-kri-summary').innerHTML = `
        <span style="color: #EF4444;">${stats.critical} Críticos</span> / 
        <span style="color: #F59E0B;">${stats.warning} Advertencias</span>
    `;

    // Fetch top risks from Business Processes
    fetchTopBusinessRisks();
}

async function fetchTopBusinessRisks() {
    try {
        const resp = await fetch('/api/procesos');
        const processes = await resp.json();

        // Sort by ALE descending
        const topProcesses = processes
            .filter(p => !p.deleted && (p.ale_expectativa_perdida || 0) > 0)
            .sort((a, b) => b.ale_expectativa_perdida - a.ale_expectativa_perdida)
            .slice(0, 5);

        const container = document.getElementById('gov-top-risk-business');
        if (topProcesses.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay datos de exposición financiera registrados.</p>';
            return;
        }

        container.innerHTML = topProcesses.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 8px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.9rem;">${p.nombre_proceso}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${p.area_responsable}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--accent-terracotta);">${formatCurrency(p.ale_expectativa_perdida)}</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">ALE Anual</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching top risks:', error);
    }
}

async function loadObjectives() {
    try {
        const resp = await fetch('/api/governance/objectives');
        objectivesData = await resp.json();
        renderObjectivesTable(objectivesData);
        updateObjectiveAlignment(objectivesData);
        populateKRIObjectiveSelect(objectivesData);
    } catch (error) {
        console.error('Error loading objectives:', error);
    }
}

function renderObjectivesTable(data) {
    const tbody = document.getElementById('gov-objectives-list');
    if (!tbody) return;

    tbody.innerHTML = data.map(obj => `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;">
                <div style="font-weight: 600;">${obj.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${obj.description || 'Sin descripción'}</div>
            </td>
            <td style="padding: 12px;">${obj.department}</td>
            <td style="padding: 12px;">${getPriorityBadge(obj.priority)}</td>
            <td style="padding: 12px; text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="openEditObjectiveModal('${obj._id}')" class="btn-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/></svg>
                    </button>
                    <button onclick="deleteObjective('${obj._id}')" class="btn-icon" style="color: #B91C1C;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getPriorityBadge(prio) {
    const colors = { 'Alta': '#EF4444', 'Media': '#F59E0B', 'Baja': '#3B82F6' };
    return `<span style="background: ${colors[prio]}15; color: ${colors[prio]}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${prio}</span>`;
}

async function loadKRIs() {
    try {
        const resp = await fetch('/api/governance/kris');
        krisData = await resp.json();
        renderKRIGrid(krisData);
    } catch (error) {
        console.error('Error loading KRIs:', error);
    }
}

function renderKRIGrid(data) {
    const grid = document.getElementById('gov-kri-grid');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No hay KRIs registrados. Comience agregando uno vinculado a un objetivo estratégico.</p>';
        return;
    }

    grid.innerHTML = data.map(kri => {
        const status = getKRIStatus(kri);
        const percent = Math.min(100, (kri.current_value / kri.threshold_critical) * 100);

        return `
            <div class="glass" style="padding: 20px; border-left: 4px solid ${status.color};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${kri.name}</div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">OBJ: ${kri.objective_id?.name || 'N/A'}</div>
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                        <div style="font-size: 1.75rem; font-weight: 700; color: ${status.color};">${kri.current_value}${kri.unit}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Umbral Crítico: ${kri.threshold_critical}${kri.unit}</div>
                    </div>
                    <div style="height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${percent}%; background: ${status.color};"></div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
                    <span style="font-weight: 600; color: ${status.color}; uppercase">${status.label}</span>
                    <button onclick="openEditKRIModal('${kri._id}')" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; padding: 4px;">Editar</button>
                </div>
            </div>
        `;
    }).join('');
}

function getKRIStatus(kri) {
    if (kri.current_value >= kri.threshold_critical) return { label: 'Crítico', color: '#EF4444' };
    if (kri.current_value >= kri.threshold_warning) return { label: 'Advertencia', color: '#F59E0B' };
    return { label: 'Normal', color: '#10B981' };
}

function switchGovTab(tab) {
    document.querySelectorAll('.gov-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-secondary)';
    });

    document.getElementById(`gov-${tab}-tab`).style.display = tab === 'kris' ? 'grid' : 'block';

    // UI Visuals
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.toLowerCase().includes(tab === 'resumen' ? 'resumen' : tab === 'objetivos' ? 'objetivos' : 'kris'));
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.borderBottom = '2px solid var(--accent-terracotta)';
        activeBtn.style.color = 'var(--text-primary)';
    }

    if (tab === 'objetivos') loadObjectives();
    if (tab === 'kris') loadKRIs();
}

// Modal Handlers
function openObjectiveModal() {
    document.getElementById('objective-form').reset();
    document.getElementById('objective-id').value = '';
    document.getElementById('objective-modal-title').textContent = 'Nuevo Objetivo Estratégico';
    document.getElementById('objective-modal').style.display = 'block';
}

function closeObjectiveModal() {
    document.getElementById('objective-modal').style.display = 'none';
}

function openEditObjectiveModal(id) {
    const obj = objectivesData.find(o => o._id === id);
    if (!obj) return;
    document.getElementById('objective-id').value = obj._id;
    document.getElementById('objective-name').value = obj.name;
    document.getElementById('objective-dept').value = obj.department;
    document.getElementById('objective-priority').value = obj.priority;
    document.getElementById('objective-desc').value = obj.description || '';
    document.getElementById('objective-modal-title').textContent = 'Editar Objetivo Estratégico';
    document.getElementById('objective-modal').style.display = 'block';
}

async function handleObjectiveSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('objective-id').value;
    const data = {
        name: document.getElementById('objective-name').value,
        department: document.getElementById('objective-dept').value,
        priority: document.getElementById('objective-priority').value,
        description: document.getElementById('objective-desc').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/governance/objectives/${id}` : '/api/governance/objectives';
        const resp = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (resp.ok) {
            closeObjectiveModal();
            loadObjectives();
            loadGovernanceData();
        }
    } catch (err) { console.error(err); }
}

async function deleteObjective(id) {
    if (!confirm('¿Seguro que desea eliminar este objetivo?')) return;
    try {
        await fetch(`/api/governance/objectives/${id}`, { method: 'DELETE' });
        loadObjectives();
        loadGovernanceData();
    } catch (err) { console.error(err); }
}

function openKRIModal() {
    document.getElementById('kri-form').reset();
    document.getElementById('kri-id').value = '';
    document.getElementById('kri-modal-title').textContent = 'Nuevo Key Risk Indicator (KRI)';
    document.getElementById('kri-modal').style.display = 'block';
    populateKRIObjectiveSelect(objectivesData);
}

function closeKRIModal() {
    document.getElementById('kri-modal').style.display = 'none';
}

function populateKRIObjectiveSelect(objs) {
    const select = document.getElementById('kri-objective');
    if (!select) return;
    select.innerHTML = objs.map(o => `<option value="${o._id}">${o.name}</option>`).join('');
}

async function handleKRISubmit(e) {
    e.preventDefault();
    const id = document.getElementById('kri-id').value;
    const data = {
        name: document.getElementById('kri-name').value,
        objective_id: document.getElementById('kri-objective').value,
        unit: document.getElementById('kri-unit').value,
        threshold_warning: parseFloat(document.getElementById('kri-warning').value),
        threshold_critical: parseFloat(document.getElementById('kri-critical').value),
        current_value: parseFloat(document.getElementById('kri-current').value || 0)
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/governance/kris/${id}` : '/api/governance/kris';
        const resp = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (resp.ok) {
            closeKRIModal();
            loadKRIs();
            loadGovernanceData();
        }
    } catch (err) { console.error(err); }
}

function updateObjectiveAlignment(objs) {
    const container = document.getElementById('gov-obj-alignment');
    if (!container) return;
    if (objs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay objetivos registrados.</p>';
        return;
    }

    container.innerHTML = objs.map(o => `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${o.priority === 'Alta' ? '#EF4444' : o.priority === 'Media' ? '#F59E0B' : '#3B82F6'};"></div>
            <div style="flex: 1; font-size: 0.9rem;">${o.name}</div>
            <div style="font-size: 0.75rem; font-weight: 600;">${o.department}</div>
        </div>
    `).join('');
}

// Utilities
function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

// Global Exports
window.loadGovernanceData = loadGovernanceData;
window.switchGovTab = switchGovTab;
window.openObjectiveModal = openObjectiveModal;
window.closeObjectiveModal = closeObjectiveModal;
window.handleObjectiveSubmit = handleObjectiveSubmit;
window.openEditObjectiveModal = openEditObjectiveModal;
window.deleteObjective = deleteObjective;
window.openKRIModal = openKRIModal;
window.closeKRIModal = closeKRIModal;
window.handleKRISubmit = handleKRISubmit;
