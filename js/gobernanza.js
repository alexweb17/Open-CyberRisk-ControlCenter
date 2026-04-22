// ============ GOBERNANZA & DIRECTORIO FUNCTIONS ============

let objectivesData = [];
let krisData = [];

// --- Risk appetite threshold (configurable) ---
const RISK_APPETITE_THRESHOLD = 1000000; // $1M default organizational risk appetite

const RISK_COLORS = {
    'Crítico': '#B91C1C',
    'Alto': '#D97706',
    'Medio': '#2563EB',
    'Bajo': '#059669'
};

const MATURITY_CONFIG = {
    'Identificado': { color: '#94A3B8', icon: '🔍', order: 1 },
    'En Evaluación': { color: '#F59E0B', icon: '📊', order: 2 },
    'En Tratamiento': { color: '#3B82F6', icon: '🛠️', order: 3 },
    'Monitoreado': { color: '#10B981', icon: '📡', order: 4 },
    'Cerrado': { color: '#6366F1', icon: '✅', order: 5 }
};

async function loadGovernanceData() {
    try {
        const summaryResp = await cyberFetch('/api/governance/executive-summary');
        const summaryData = await summaryResp.json();
        renderExecutiveSummary(summaryData);

        loadObjectives();
        loadKRIs();
    } catch (error) {
        console.error("Error loading governance data", error);
    }
}

function renderExecutiveSummary(summary) {
    // --- Financial Exposure ---
    document.getElementById('gov-total-exposure').textContent = formatCurrency(summary.totalFinancialExposure || 0);
    document.getElementById('gov-obj-count').textContent = summary.strategicObjectivesCount || 0;

    const processCountEl = document.getElementById('gov-process-count');
    if (processCountEl) processCountEl.textContent = summary.totalProcesses || 0;

    // --- Risk Appetite Bar ---
    renderRiskAppetiteBar(summary.totalFinancialExposure || 0);

    // --- KRI Summary ---
    const stats = summary.kriStatus || { total: 0, critical: 0, warning: 0, normal: 0 };
    document.getElementById('gov-kri-total').textContent = stats.total;
    document.getElementById('gov-kri-summary').innerHTML = `
        <span style="color: #EF4444;">${stats.critical} Críticos</span> /
        <span style="color: #F59E0B;">${stats.warning} Advertencias</span>
    `;
    renderKRIMiniBar(stats);

    // --- Risk Distribution ---
    renderRiskDistribution(summary.riskDistribution || {}, summary.totalProcesses || 0);

    // --- ALE by Risk Level ---
    renderALEByLevel(summary.aleByRiskLevel || {}, summary.totalFinancialExposure || 0);

    // --- Top Processes ---
    renderTopProcesses(summary.topProcesses || []);

    // --- Program Maturity ---
    renderProgramMaturity(summary.programMaturity || {}, summary.totalProcesses || 0);

    // --- ALE by Area ---
    renderALEByArea(summary.aleByArea || {}, summary.totalFinancialExposure || 0);

    // --- Objective Alignment (uses separate load) ---
}

function renderRiskAppetiteBar(totalALE) {
    const container = document.getElementById('gov-risk-appetite-bar');
    if (!container) return;

    const percent = Math.min(100, (totalALE / RISK_APPETITE_THRESHOLD) * 100);
    const isOver = totalALE > RISK_APPETITE_THRESHOLD;
    const barColor = isOver ? '#B91C1C' : percent > 70 ? '#D97706' : '#10B981';
    const statusText = isOver ? 'Excede el apetito de riesgo' : percent > 70 ? 'Cerca del umbral' : 'Dentro del apetito de riesgo';
    const statusIcon = isOver ? '⚠️' : percent > 70 ? '⚡' : '✓';

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 0.7rem; font-weight: 600; color: ${barColor}; display: flex; align-items: center; gap: 4px;">
                ${statusIcon} ${statusText}
            </span>
            <span style="font-size: 0.7rem; color: var(--text-secondary);">Apetito: ${formatCurrency(RISK_APPETITE_THRESHOLD)}</span>
        </div>
        <div style="height: 8px; background: rgba(0,0,0,0.06); border-radius: 4px; overflow: hidden; position: relative;">
            <div style="height: 100%; width: ${percent}%; background: ${barColor}; border-radius: 4px; transition: width 0.6s ease;"></div>
        </div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 4px; text-align: right;">${percent.toFixed(1)}% del umbral utilizado</div>
    `;
}

function renderKRIMiniBar(stats) {
    const container = document.getElementById('gov-kri-bar-mini');
    if (!container || stats.total === 0) {
        if (container) container.innerHTML = '<div style="font-size: 0.7rem; color: var(--text-secondary);">Sin KRIs configurados</div>';
        return;
    }

    const critPct = (stats.critical / stats.total) * 100;
    const warnPct = (stats.warning / stats.total) * 100;
    const normPct = (stats.normal / stats.total) * 100;

    container.innerHTML = `
        <div style="display: flex; height: 8px; border-radius: 4px; overflow: hidden; gap: 2px;">
            ${critPct > 0 ? `<div style="width: ${critPct}%; background: #EF4444; border-radius: 2px;" title="${stats.critical} Críticos"></div>` : ''}
            ${warnPct > 0 ? `<div style="width: ${warnPct}%; background: #F59E0B; border-radius: 2px;" title="${stats.warning} Advertencias"></div>` : ''}
            ${normPct > 0 ? `<div style="width: ${normPct}%; background: #10B981; border-radius: 2px;" title="${stats.normal} Normales"></div>` : ''}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.65rem; color: var(--text-secondary);">
            <span style="display: flex; align-items: center; gap: 3px;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #EF4444;"></span> ${stats.critical}</span>
            <span style="display: flex; align-items: center; gap: 3px;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #F59E0B;"></span> ${stats.warning}</span>
            <span style="display: flex; align-items: center; gap: 3px;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span> ${stats.normal}</span>
        </div>
    `;
}

function renderRiskDistribution(distribution, total) {
    const container = document.getElementById('gov-risk-distribution');
    if (!container) return;

    if (total === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">No hay procesos registrados.</p>';
        return;
    }

    const levels = ['Crítico', 'Alto', 'Medio', 'Bajo'];
    container.innerHTML = levels.map(level => {
        const count = distribution[level] || 0;
        const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
        const color = RISK_COLORS[level];

        return `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 10px; height: 10px; border-radius: 3px; background: ${color}; flex-shrink: 0;"></span>
                        <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-primary);">${level}</span>
                    </div>
                    <div style="display: flex; align-items: baseline; gap: 6px;">
                        <span style="font-size: 0.9rem; font-weight: 700; color: ${color};">${count}</span>
                        <span style="font-size: 0.7rem; color: var(--text-secondary);">(${pct}%)</span>
                    </div>
                </div>
                <div style="height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${pct}%; background: ${color}; border-radius: 3px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderALEByLevel(aleByLevel, totalALE) {
    const container = document.getElementById('gov-ale-by-level');
    if (!container) return;

    if (totalALE === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">No hay datos de exposición financiera.</p>';
        return;
    }

    const levels = ['Crítico', 'Alto', 'Medio', 'Bajo'];
    container.innerHTML = levels.map(level => {
        const ale = aleByLevel[level] || 0;
        const pct = totalALE > 0 ? ((ale / totalALE) * 100).toFixed(0) : 0;
        const color = RISK_COLORS[level];

        return `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 10px; height: 10px; border-radius: 3px; background: ${color}; flex-shrink: 0;"></span>
                        <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-primary);">${level}</span>
                    </div>
                    <div style="display: flex; align-items: baseline; gap: 6px;">
                        <span style="font-size: 0.9rem; font-weight: 700; color: ${color};">${formatCurrency(ale)}</span>
                        <span style="font-size: 0.7rem; color: var(--text-secondary);">(${pct}%)</span>
                    </div>
                </div>
                <div style="height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${pct}%; background: ${color}; border-radius: 3px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTopProcesses(topProcesses) {
    const container = document.getElementById('gov-top-risk-business');
    if (!container) return;

    if (topProcesses.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">No hay datos de exposición financiera registrados.</p>';
        return;
    }

    const maxALE = topProcesses[0]?.ale || 1;

    container.innerHTML = topProcesses.map((p, i) => {
        const barPct = Math.max(5, (p.ale / maxALE) * 100);
        const riskColor = RISK_COLORS[p.nivel_riesgo] || '#94A3B8';

        return `
            <div style="background: rgba(0,0,0,0.02); border-radius: 10px; padding: 14px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-size: 0.7rem; background: ${riskColor}15; color: ${riskColor}; padding: 2px 8px; border-radius: 6px; font-weight: 700;">${p.nivel_riesgo}</span>
                            <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${p.nombre}</span>
                        </div>
                        <span style="font-size: 0.7rem; color: var(--text-secondary);">${p.area} · ${p.estado}</span>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                        <div style="font-weight: 700; color: var(--accent-terracotta); font-size: 1rem;">${formatCurrency(p.ale)}</div>
                        <div style="font-size: 0.65rem; color: var(--text-secondary);">ALE Anual</div>
                    </div>
                </div>
                <div style="height: 4px; background: rgba(0,0,0,0.05); border-radius: 2px; overflow: hidden;">
                    <div style="height: 100%; width: ${barPct}%; background: ${riskColor}; border-radius: 2px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderProgramMaturity(maturity, total) {
    const container = document.getElementById('gov-program-maturity');
    if (!container) return;

    if (total === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">No hay procesos registrados.</p>';
        return;
    }

    const stages = Object.entries(MATURITY_CONFIG).sort((a, b) => a[1].order - b[1].order);

    container.innerHTML = stages.map(([name, config]) => {
        const count = maturity[name] || 0;
        const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;

        return `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 28px; height: 28px; border-radius: 8px; background: ${config.color}15; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">${config.icon}</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-primary);">${name}</span>
                        <span style="font-size: 0.85rem; font-weight: 700; color: ${config.color};">${count} <span style="font-weight: 400; font-size: 0.7rem; color: var(--text-secondary);">(${pct}%)</span></span>
                    </div>
                    <div style="height: 5px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${pct}%; background: ${config.color}; border-radius: 3px; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderALEByArea(aleByArea, totalALE) {
    const container = document.getElementById('gov-ale-by-area');
    if (!container) return;

    const entries = Object.entries(aleByArea).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">No hay exposición financiera por área.</p>';
        return;
    }

    const areaColors = ['#D97757', '#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    container.innerHTML = entries.map(([area, ale], i) => {
        const pct = totalALE > 0 ? ((ale / totalALE) * 100).toFixed(0) : 0;
        const color = areaColors[i % areaColors.length];

        return `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-primary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${area}">${area}</span>
                    <div style="display: flex; align-items: baseline; gap: 6px;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: ${color};">${formatCurrency(ale)}</span>
                        <span style="font-size: 0.65rem; color: var(--text-secondary);">(${pct}%)</span>
                    </div>
                </div>
                <div style="height: 5px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${pct}%; background: ${color}; border-radius: 3px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    }).join('');
}

// ============ OBJECTIVES ============

async function loadObjectives() {
    try {
        const resp = await cyberFetch('/api/governance/objectives');
        const data = await resp.json();
        if (!Array.isArray(data)) { console.warn('[gobernanza] objectives API error:', data); return; }
        objectivesData = data;
        renderObjectivesTable(objectivesData);
        updateObjectiveAlignment(objectivesData);
        populateKRIObjectiveSelect(objectivesData);
    } catch (e) {
        console.error('Error loading objectives:', e);
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

// ============ KRIs ============

async function loadKRIs() {
    try {
        const resp = await cyberFetch('/api/governance/kris');
        const data = await resp.json();
        if (!Array.isArray(data)) { console.warn('[gobernanza] KRI API error:', data); return; }
        krisData = data;
        renderKRITable(krisData);
    } catch (error) {
        console.error('Error loading KRIs:', error);
    }
}

function renderKRITable(data) {
    const list = document.getElementById('gov-kris-list');
    if (!list) return;

    if (data.length === 0) {
        list.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">No hay KRIs registrados. Comience agregando uno vinculado a un objetivo estratégico.</td></tr>';
        return;
    }

    list.innerHTML = data.map(kri => {
        const status = getKRIStatus(kri);
        const percent = Math.min(100, (kri.current_value / (kri.threshold_critical || 1)) * 100);

        return `
            <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.2s;">
                <td style="padding: 12px;">
                    <div style="font-weight: 600; color: var(--text-primary);">${kri.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">Unidad: ${kri.unit}</div>
                </td>
                <td style="padding: 12px; font-size: 0.85rem; color: var(--text-secondary);">
                    ${kri.objective_id?.name || 'N/A'}
                </td>
                <td style="padding: 12px;">
                    <div style="font-weight: 700; color: ${status.color};">${kri.current_value}${kri.unit}</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">Advertencia: ${kri.threshold_warning}${kri.unit}</div>
                </td>
                <td style="padding: 12px; font-size: 0.85rem; font-weight: 600;">
                    ${kri.threshold_critical}${kri.unit}
                </td>
                <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: ${status.color}; text-transform: uppercase;">${status.label}</span>
                        <div style="height: 6px; width: 60px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; width: ${percent}%; background: ${status.color};"></div>
                        </div>
                    </div>
                </td>
                <td style="padding: 12px; text-align: right;">
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button onclick="openEditKRIModal('${kri._id}')" class="btn-action" title="Editar" style="padding: 6px; border-radius: 6px; background: #EEF2FF; color: #4F46E5; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button onclick="openDeleteKRIModal('${kri._id}')" class="btn-action" title="Eliminar" style="padding: 6px; border-radius: 6px; background: #FEF2F2; color: #EF4444; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
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

    document.getElementById(`gov-${tab}-tab`).style.display = 'block';

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

    if (!formData.name || !formData.department) {
        if (typeof showNotification === 'function') {
            showNotification('Nombre y Departamento son obligatorios.', 'warning');
        } else {
            alert('Nombre y Departamento son obligatorios.');
        }
        return;
    }

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

async function deleteObjective(id) {
    if (!confirm('¿Seguro que desea eliminar este objetivo?')) return;
    try {
        await cyberFetch(`/api/governance/objectives/${id}`, { method: 'DELETE' });
        loadGovernanceData();
    } catch (e) {
        console.error(e);
    }
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

function openEditKRIModal(id) {
    const kri = krisData.find(k => k._id === id);
    if (!kri) return;

    populateKRIObjectiveSelect(objectivesData);

    document.getElementById('kri-id').value = kri._id;
    document.getElementById('kri-name').value = kri.name;
    document.getElementById('kri-objective').value = kri.objective_id?._id || kri.objective_id || '';
    document.getElementById('kri-unit').value = kri.unit;
    document.getElementById('kri-warning').value = kri.threshold_warning;
    document.getElementById('kri-critical').value = kri.threshold_critical;
    document.getElementById('kri-current').value = kri.current_value;

    document.getElementById('kri-modal-title').textContent = 'Editar Key Risk Indicator (KRI)';
    document.getElementById('kri-modal').style.display = 'block';
}

function openDeleteKRIModal(id) {
    document.getElementById('delete-kri-id').value = id;
    document.getElementById('delete-kri-modal').style.display = 'block';
}

function closeDeleteKRIModal() {
    document.getElementById('delete-kri-modal').style.display = 'none';
}

async function confirmDeleteKRI() {
    const id = document.getElementById('delete-kri-id').value;
    if (!id) return;

    try {
        const resp = await cyberFetch(`/api/governance/kris/${id}`, { method: 'DELETE' });
        if (resp.ok) {
            closeDeleteKRIModal();
            loadGovernanceData();
            if (typeof showNotification === 'function') showNotification('KRI eliminado correctamente', 'success');
        } else {
            const err = await resp.json();
            if (typeof showNotification === 'function') showNotification(err.error || 'Error al eliminar KRI', 'error');
        }
    } catch (e) {
        console.error(e);
        if (typeof showNotification === 'function') showNotification('Error de conexión', 'error');
    }
}

function populateKRIObjectiveSelect(objs) {
    const select = document.getElementById('kri-objective');
    if (!select) return;
    select.innerHTML = objs.map(o => `<option value="${o._id}">${o.name}</option>`).join('');
}

async function handleKRISubmit(e) {
    e.preventDefault();
    const id = document.getElementById('kri-id').value;
    const formData = {
        name: document.getElementById('kri-name').value,
        objective_id: document.getElementById('kri-objective').value,
        unit: document.getElementById('kri-unit').value,
        threshold_warning: parseFloat(document.getElementById('kri-warning').value),
        threshold_critical: parseFloat(document.getElementById('kri-critical').value),
        current_value: parseFloat(document.getElementById('kri-current').value || 0)
    };
    if (!formData.name || isNaN(formData.threshold_critical)) {
        if (typeof showNotification === 'function') {
            showNotification('Verifique el nombre y los umbrales del KRI.', 'warning');
        } else {
            alert('Verifique el nombre y los umbrales del KRI.');
        }
        return;
    }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/governance/kris/${id}` : '/api/governance/kris';
        const resp = await cyberFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (resp.ok) {
            document.getElementById('kri-modal').style.display = 'none';
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
window.openEditKRIModal = openEditKRIModal;
window.openDeleteKRIModal = openDeleteKRIModal;
window.closeDeleteKRIModal = closeDeleteKRIModal;
window.confirmDeleteKRI = confirmDeleteKRI;
window.handleKRISubmit = handleKRISubmit;
