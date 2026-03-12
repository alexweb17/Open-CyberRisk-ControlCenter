let objectivesData = [];
let krisData = [];

async function loadGovernanceData() {
    try {
        const [objResp, kriResp] = await Promise.all([
            cyberFetch('/api/governance/objectives'),
            cyberFetch('/api/governance/kris')
        ]);

        objectivesData = await objResp.json();
        krisData = await kriResp.json();

        updateObjectiveAlignment(objectivesData);
        updateKRIGrid(krisData);
    } catch (err) {
        console.error('Error loading governance data:', err);
    }
}

function updateKRIGrid(data) {
    const container = document.getElementById('kris-grid');
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = '<div class="glass" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No hay KRIs registrados</div>';
        return;
    }

    container.innerHTML = data.map(kri => {
        const status = getKRIStatus(kri);
        const percent = Math.min((kri.current_value / kri.threshold_critical) * 100, 100);
        return `
            <div class="glass" style="padding: 20px; border-left: 4px solid ${status.color};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">KRI</div>
                        <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${kri.name}</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 6px;">
                        <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">${kri.current_value}${kri.unit}</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">Umbral: ${kri.threshold_critical}${kri.unit}</span>
                    </div>
                    <div style="height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden;">
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

// ============ TAB SWITCH ============

function switchGovTab(tab) {
    document.querySelectorAll('.gov-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-secondary)';
    });

    document.getElementById(`gov-${tab}-tab`).style.display = tab === 'kris' ? 'grid' : 'block';

    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.toLowerCase().includes(tab === 'resumen' ? 'resumen' : tab === 'objetivos' ? 'objetivos' : 'kris'));
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.borderBottom = '2px solid var(--accent-terracotta)';
        activeBtn.style.color = 'var(--text-primary)';
    }

    if (tab === 'objetivos') loadObjectives();
    if (tab === 'kris') loadKRIs();
}

// ============ MODALS ============

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
    const formData = {
        name: document.getElementById('objective-name').value,
        department: document.getElementById('objective-dept').value,
        priority: document.getElementById('objective-priority').value,
        description: document.getElementById('objective-desc').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/governance/objectives/${id}` : '/api/governance/objectives';
        const resp = await cyberFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (resp.ok) {
            document.getElementById('objective-modal').style.display = 'none';
            loadGovernanceData();
        }
    } catch (e) {
        console.error(e);
    }
}

function updateObjectiveAlignment(objs) {
    const container = document.getElementById('gov-obj-alignment');
    if (!container) return;
    if (objs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">No hay objetivos registrados.</p>';
        return;
    }

    container.innerHTML = objs.map(o => {
        const prioColor = o.priority === 'Alta' ? '#EF4444' : o.priority === 'Media' ? '#F59E0B' : '#3B82F6';
        return `
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 8px; border: 1px solid var(--border-color);">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${prioColor}; flex-shrink: 0;"></div>
            <div style="flex: 1;">
                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${o.name}</div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">${o.description || 'Sin descripción'}</div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <span style="font-size: 0.7rem; background: ${prioColor}15; color: ${prioColor}; padding: 2px 8px; border-radius: 6px; font-weight: 600;">${o.priority}</span>
                <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 2px;">${o.department}</div>
            </div>
        </div>
    `;
    }).join('');
}

// ============ UTILITIES ============

function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

// ============ GLOBAL EXPORTS ============

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
