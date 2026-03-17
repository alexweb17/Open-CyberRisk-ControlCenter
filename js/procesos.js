// ============ PROCESOS DE NEGOCIO FUNCTIONS ============
let procesosData = [];
let currentProcesoControls = [];
let procesoSearchTimeout = null;
let currentProcesoControlSource = 'marco_base'; // 'marco_base' or 'framework'
let procesoFrameworks = [];
async function loadProcesos() {
    try {
        const response = await cyberFetch('/api/procesos');
        procesosData = await response.json();
        renderProcesos(procesosData);
        updateProcesosDashboard(procesosData);
    } catch (error) {
        console.error('Error loading procesos:', error);
    }
}

function renderProcesos(data) {
    const tbody = document.getElementById('procesos-table-body');
    if (!tbody) return;
    tbody.innerHTML = data.map(p => `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; font-weight: 600;">${p.codigo_proceso || '-'}</td>
            <td style="padding: 12px; font-weight: 500;">${p.nombre_proceso}</td>
            <td style="padding: 12px;">${p.tipo_revision || '-'}</td>
            <td style="padding: 12px;">${getSeverityBadge(p.nivel_riesgo)}</td>
            <td style="padding: 12px; font-weight: 700; color: var(--accent-terracotta);">${formatCurrency(p.ale_expectativa_perdida || 0)}</td>
            <td style="padding: 12px;">${getEstadoBadgeProcesos(p.estado)}</td>
            <td style="padding: 12px; text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="openEditProcesoModal('${p._id}')" style="background:none; border:1px solid var(--border-color); cursor:pointer; padding: 6px; border-radius: 6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/></svg>
                    </button>
                    <button onclick="openDeleteProcesoModal('${p._id}', '${p.nombre_proceso}')" style="background:none; border:1px solid #FEE2E2; cursor:pointer; padding: 6px; border-radius: 6px; color: #B91C1C;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getEstadoBadgeProcesos(est) {
    const colors = { 'Identificado': '#3B82F6', 'En Evaluación': '#F59E0B', 'En Tratamiento': '#8B5CF6', 'Monitoreado': '#10B981', 'Cerrado': '#6B7280' };
    return `<span style="background: ${colors[est] || '#9CA3AF'}15; color: ${colors[est] || '#9CA3AF'}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${est || '-'}</span>`;
}

function updateProcesosDashboard(data) {
    const total = data.length;
    const criticos = data.filter(p => p.nivel_riesgo === 'Crítico' || p.nivel_riesgo === 'Alta').length;
    const enEvaluacion = data.filter(p => p.estado === 'En Evaluación').length;
    const monitoreados = data.filter(p => p.estado === 'Monitoreado' || p.estado === 'Cerrado').length;

    document.getElementById('total-procesos-count').textContent = total;
    document.getElementById('criticos-procesos-count').textContent = criticos;
    document.getElementById('evaluacion-procesos-count').textContent = enEvaluacion;
    document.getElementById('cerrados-procesos-count').textContent = monitoreados;
}

function openProcesoModal() {
    document.getElementById('proceso-form').reset();
    document.getElementById('proceso-id').value = '';

    currentProcesoControls = [];
    currentProcesoControlSource = 'marco_base';
    switchProcesoControlSource('marco_base');
    renderProcesoControlsList();
    loadFrameworksForProceso();

    document.getElementById('proceso-modal-title').textContent = 'Nuevo Proceso de Negocio';
    document.getElementById('proceso-modal').style.display = 'block';
}

function closeProcesoModal() {
    document.getElementById('proceso-modal').style.display = 'none';
}

function openEditProcesoModal(id) {
    const p = procesosData.find(i => i._id === id);
    if (!p) return;

    document.getElementById('proceso-id').value = p._id;
    document.getElementById('proceso-nombre').value = p.nombre_proceso || '';
    document.getElementById('proceso-tipo').value = p.tipo_revision || 'Revisión Periódica';
    document.getElementById('proceso-area').value = p.area_responsable || 'Tecnología Información y Comunicación';
    document.getElementById('proceso-descripcion').value = p.descripcion || '';
    document.getElementById('proceso-responsable').value = p.responsable || '';
    document.getElementById('proceso-estado').value = p.estado || 'Identificado';
    document.getElementById('proceso-riesgo').value = p.nivel_riesgo || 'Medio';
    document.getElementById('proceso-impacto').value = p.impacto_negocio || 'Moderado';
    document.getElementById('proceso-probabilidad').value = p.probabilidad || 'Media';
    document.getElementById('proceso-desc-riesgo').value = p.descripcion_riesgo || '';
    document.getElementById('proceso-plan').value = p.plan_tratamiento || '';
    document.getElementById('proceso-fecha-id').value = p.fecha_identificacion ? p.fecha_identificacion.split('T')[0] : '';
    document.getElementById('proceso-fecha-revision').value = p.fecha_proxima_revision ? p.fecha_proxima_revision.split('T')[0] : '';
    document.getElementById('proceso-comentarios').value = p.comentarios || '';

    // Financial fields
    document.getElementById('proceso-valor-activo').value = p.valor_activo || 0;
    document.getElementById('proceso-ef').value = p.ef_factor_exposicion || 0;
    document.getElementById('proceso-aro').value = p.aro_tasa_ocurrencia || 0;

    currentProcesoControls = p.controles_asociados || [];
    currentProcesoControlSource = 'marco_base';
    switchProcesoControlSource('marco_base');
    renderProcesoControlsList();
    loadFrameworksForProceso();

    document.getElementById('proceso-modal-title').textContent = 'Editar Proceso de Negocio';
    document.getElementById('proceso-modal').style.display = 'block';
}

async function handleProcesoSubmit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('proceso-id').value;
    const formData = {
        nombre_proceso: document.getElementById('proceso-nombre').value,
        tipo_revision: document.getElementById('proceso-tipo').value,
        area_responsable: document.getElementById('proceso-area').value,
        descripcion: document.getElementById('proceso-descripcion').value,
        responsable: document.getElementById('proceso-responsable').value,
        estado: document.getElementById('proceso-estado').value,
        nivel_riesgo: document.getElementById('proceso-riesgo').value,
        impacto_negocio: document.getElementById('proceso-impacto').value,
        probabilidad: document.getElementById('proceso-probabilidad').value,
        descripcion_riesgo: document.getElementById('proceso-desc-riesgo').value,
        plan_tratamiento: document.getElementById('proceso-plan').value,
        fecha_identificacion: document.getElementById('proceso-fecha-id').value || null,
        fecha_proxima_revision: document.getElementById('proceso-fecha-revision').value || null,
        comentarios: document.getElementById('proceso-comentarios').value,
        // Financial fields
        valor_activo: parseFloat(document.getElementById('proceso-valor-activo').value || 0),
        ef_factor_exposicion: parseFloat(document.getElementById('proceso-ef').value || 0),
        aro_tasa_ocurrencia: parseFloat(document.getElementById('proceso-aro').value || 0),
        // Associated Controls
        controles_asociados: currentProcesoControls
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/procesos/${id}` : '/api/procesos';
        const response = await cyberFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeProcesoModal();
            loadProcesos();
        } else {
            const err = await response.json();
            alert("Error: " + (err.error || "Desconocido"));
        }
    } catch (error) {
        console.error('Error saving proceso:', error);
        alert("Error de conexión");
    }
}

function openDeleteProcesoModal(id, name) {
    document.getElementById('delete-proceso-id').value = id;
    document.getElementById('delete-proceso-message').innerHTML = `¿Está seguro que desea eliminar el proceso <strong>${name}</strong>?<br>Esta acción no se puede deshacer.`;
    document.getElementById('delete-proceso-modal').style.display = 'block';
}

function closeDeleteProcesoModal() {
    document.getElementById('delete-proceso-modal').style.display = 'none';
}

async function confirmDeleteProceso() {
    const id = document.getElementById('delete-proceso-id').value;
    if (!id) return;

    try {
        const response = await cyberFetch(`/api/procesos/${id}`, { method: 'DELETE' });
        if (response.ok) {
            closeDeleteProcesoModal();
            loadProcesos();
        } else {
            alert("Error al eliminar");
        }
    } catch (error) {
        console.error('Error deleting proceso:', error);
        alert("Error de conexión");
    }
}

function filterProcesosTable() {
    const query = document.getElementById('procesos-search').value.toLowerCase();
    const rows = document.querySelectorAll('#procesos-table-body tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}

function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

// ============ PROCESO CONTROLS SELECTOR ============
function switchProcesoControlSource(source) {
    currentProcesoControlSource = source;
    const mbTab = document.getElementById('proceso-src-tab-marco-base');
    const fwTab = document.getElementById('proceso-src-tab-framework');
    const fwPanel = document.getElementById('proceso-framework-selector-panel');
    const searchInput = document.getElementById('proceso-control-search-input');
    const resultsDiv = document.getElementById('proceso-control-search-results');

    if (searchInput) searchInput.value = '';
    if (resultsDiv) resultsDiv.style.display = 'none';

    if (source === 'marco_base') {
        mbTab.style.background = 'var(--accent-color)';
        mbTab.style.color = 'white';
        fwTab.style.background = 'transparent';
        fwTab.style.color = 'var(--text-secondary)';
        fwPanel.style.display = 'none';
        if (searchInput) searchInput.placeholder = 'Buscar control para agregar (código, nombre, dominio)...';
    } else {
        fwTab.style.background = '#4F46E5';
        fwTab.style.color = 'white';
        mbTab.style.background = 'transparent';
        mbTab.style.color = 'var(--text-secondary)';
        fwPanel.style.display = '';
        if (searchInput) searchInput.placeholder = 'Buscar requisito regulatorio (código, requisito, guía)...';
    }
}

async function loadFrameworksForProceso() {
    try {
        const resp = await cyberFetch('/api/frameworks');
        procesoFrameworks = await resp.json();
        const select = document.getElementById('proceso-framework-select');
        if (!select) return;
        select.innerHTML = '<option value="">-- Seleccione un marco --</option>';
        procesoFrameworks.forEach(fw => {
            const opt = document.createElement('option');
            opt.value = fw._id;
            opt.textContent = `${fw.name} ${fw.version ? '(' + fw.version + ')' : ''}`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Error loading frameworks for proceso:', err);
    }
}

function onProcesoFrameworkSelected() {
    const searchInput = document.getElementById('proceso-control-search-input');
    if (searchInput && searchInput.value.length >= 2) {
        searchControlsForProceso(searchInput.value);
    }
}

async function searchControlsForProceso(query) {
    clearTimeout(procesoSearchTimeout);
    const resultsDiv = document.getElementById('proceso-control-search-results');
    if (query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    procesoSearchTimeout = setTimeout(async () => {
        try {
            let url;
            if (currentProcesoControlSource === 'framework') {
                const frameworkId = document.getElementById('proceso-framework-select')?.value || '';
                url = `/api/framework-requirements/search?q=${encodeURIComponent(query)}${frameworkId ? '&framework_id=' + frameworkId : ''}`;
            } else {
                url = `/api/master-controls/search?q=${encodeURIComponent(query)}`;
            }

            const resp = await cyberFetch(url);
            const items = await resp.json();

            if (items.length === 0) {
                resultsDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No se encontraron controles</div>';
            } else if (currentProcesoControlSource === 'framework') {
                resultsDiv.innerHTML = items.map(r => {
                    const isAdded = currentProcesoControls.some(rc => rc.codigo_control === r.code);
                    return `
                    <div style="padding: 16px; border-bottom: 1px solid var(--border-color); ${isAdded ? 'opacity: 0.5;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <div>
                                <span style="font-weight: 600; color: var(--text-primary);">${r.code}</span>
                                <span style="background: #EEF2FF; color: #4338CA; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">📋 ${r.framework_name || 'Marco'}</span>
                            </div>
                            ${isAdded ? '<span style="color: #10B981; font-size: 0.8rem;">✓ Agregado</span>' :
                            `<button type="button" onclick="addControlToProceso('${r._id}', '${r.code}', 'FrameworkRequirement', '${(r.domain || '').replace(/'/g, "\\\\'")}', '${(r.requirement || '').replace(/'/g, "\\\\'")}')" style="background: #4F46E5; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">+ Agregar</button>`}
                        </div>
                        <div style="font-size: 0.85rem; color: #6366F1; margin-bottom: 6px;">${r.domain || 'Sin dominio'}</div>
                        <div style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 8px;">${r.requirement || ''}</div>
                    </div>`;
                }).join('');
            } else {
                resultsDiv.innerHTML = items.map(c => {
                    const isAdded = currentProcesoControls.some(rc => rc.codigo_control === c.codigo_control);
                    const severityClass = getSeverityBadge(c.severidad);
                    return `
                    <div style="padding: 16px; border-bottom: 1px solid var(--border-color); ${isAdded ? 'opacity: 0.5;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <div>
                                <span style="font-weight: 600; color: var(--text-primary);">${c.codigo_control}</span>
                                ${severityClass}
                            </div>
                            ${isAdded ? '<span style="color: #10B981; font-size: 0.8rem;">✓ Agregado</span>' :
                            `<button type="button" onclick="addControlToProceso('${c._id}', '${c.codigo_control}', 'MasterControl', '${(c.dominio || '').replace(/'/g, "\\\\'")}', '${(c.lineamiento || '').replace(/'/g, "\\\\'")}')" style="background: #10B981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">+ Agregar</button>`}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">${c.dominio || 'Sin dominio'}</div>
                        <div style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 8px;">${c.lineamiento || 'Sin lineamiento'}</div>
                    </div>`;
                }).join('');
            }
            resultsDiv.style.display = 'block';
        } catch (err) {
            console.error('Error searching controls:', err);
        }
    }, 300);
}

function addControlToProceso(controlId, codigoControl, tipoFuente, domain, requirement) {
    if (!currentProcesoControls.some(c => c.codigo_control === codigoControl)) {
        currentProcesoControls.push({
            control_id: controlId,
            codigo_control: codigoControl,
            tipo_fuente: tipoFuente,
            estado_control: 'Pendiente',
            // Transient info for UI
            _info: { domain, requirement }
        });
        renderProcesoControlsList();

        const searchInput = document.getElementById('proceso-control-search-input');
        if (searchInput && searchInput.value) {
            searchControlsForProceso(searchInput.value);
        }
    }
}

function removeControlFromProceso(codigoControl) {
    currentProcesoControls = currentProcesoControls.filter(c => c.codigo_control !== codigoControl);
    renderProcesoControlsList();
    const searchInput = document.getElementById('proceso-control-search-input');
    if (searchInput && searchInput.value) {
        searchControlsForProceso(searchInput.value);
    }
}

function renderProcesoControlsList() {
    const container = document.getElementById('proceso-controls-list');
    const countEl = document.getElementById('proceso-controls-count');
    if (countEl) countEl.innerText = currentProcesoControls.length;
    if (!container) return;

    if (currentProcesoControls.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 0.9rem;">Sin controles asociados</div>`;
        return;
    }

    container.innerHTML = currentProcesoControls.map(c => {
        const isFR = c.tipo_fuente === 'FrameworkRequirement';
        const sourceBadge = isFR
            ? '<span style="background: #EEF2FF; color: #4338CA; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">📋 Marco Regulatorio</span>'
            : '<span style="background: #F0FDF4; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">🛡️ Marco Base</span>';

        const borderColor = isFR ? '#818CF8' : '#10B981';

        let infoHtml = '';
        let info = c.control_info || c._info;
        if (info) {
            const domain = isFR ? info.domain : info.dominio;
            const title = isFR ? info.requirement : info.lineamiento;
            infoHtml = `<div style="font-size: 0.8rem; color: #6366F1; margin-top: 4px;">${domain || ''}</div>
                        <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 4px; line-height: 1.3;">${title || ''}</div>`;
        }

        return `
        <div style="background: white; border: 1px solid var(--border-color); border-left: 3px solid ${borderColor}; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <div>
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${c.codigo_control}</span>
                    ${sourceBadge}
                </div>
                ${infoHtml}
            </div>
            <button type="button" onclick="removeControlFromProceso('${c.codigo_control}')" style="background: none; border: none; cursor: pointer; color: #B91C1C; padding: 4px;" title="Quitar control">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>`;
    }).join('');
}
