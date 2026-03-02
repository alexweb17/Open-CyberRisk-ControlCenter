// ============ RCS MANAGEMENT ============
let rcsData = {};
let currentRCSId = null;
let currentRCSControls = [];
let searchTimeout = null;
let currentControlSource = 'marco_base'; // 'marco_base' or 'framework'
let rcsFrameworks = []; // cached framework list

async function loadRCSData() {
    try {
        const resp = await fetch('/api/rcs');
        const data = await resp.json();
        rcsData = {};
        data.forEach(r => { rcsData[r._id] = r; });
        renderRCSTable(data);
        document.getElementById('total-rcs-count').innerText = data.length;
    } catch (err) {
        console.error('Error loading RCS data:', err);
    }
}

function renderRCSTable(data) {
    const tbody = document.getElementById('rcs-table-body');
    if (!tbody) return;
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding: 40px; text-align: center; color: var(--text-secondary);">No hay registros RCS. Haga clic en "+ AGREGAR RCS" para crear uno.</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(r => {
        const controlCount = r.controles_asociados ? r.controles_asociados.length : 0;
        const estadoColor = r.estado === 'Implementado/Mitigado' ? '#10B981' : r.estado === 'En Curso' ? '#F59E0B' : '#EF4444';
        return `
        <tr style="border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="openRCSDetail('${r._id}')">
            <td style="padding: 16px; font-weight: 600; color: var(--text-primary);">${r.codigo_rcs}</td>
            <td style="padding: 16px;">
                <span style="background: #E5E7EB; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${controlCount}</span>
            </td>
            <td style="padding: 16px;"><span style="background: ${estadoColor}15; color: ${estadoColor}; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">${r.estado}</span></td>
            <td style="padding: 16px;">
                <button data-rcs-action="delete" data-rcs-id="${r._id}" data-rcs-code="${r.codigo_rcs}"
                    style="background: none; border: none; cursor: pointer; padding: 8px; color: #B91C1C;" title="Eliminar" onclick="event.stopPropagation();">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>
        </tr>`;
    }).join('');
}

function filterRCSTable() {
    const search = document.getElementById('rcs-search').value.toLowerCase();
    const filtered = Object.values(rcsData).filter(r =>
        r.codigo_rcs.toLowerCase().includes(search) ||
        r.estado.toLowerCase().includes(search)
    );
    renderRCSTable(filtered);
}

function showRCSList() {
    document.getElementById('rcs-list-view').style.display = '';
    document.getElementById('rcs-detail-view').style.display = 'none';
    currentRCSId = null;
    currentRCSControls = [];
    currentControlSource = 'marco_base';
    loadRCSData();
}

function showRCSDetail() {
    document.getElementById('rcs-list-view').style.display = 'none';
    document.getElementById('rcs-detail-view').style.display = '';
}

async function createNewRCS() {
    try {
        const resp = await fetch('/api/rcs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const result = await resp.json();
        if (resp.ok && result.data) {
            openRCSDetail(result.data._id);
        } else {
            alert('Error al crear nuevo RCS');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
}

async function openRCSDetail(rcsId) {
    currentRCSId = rcsId;
    showRCSDetail();

    // Reset source selector to Marco Base
    switchControlSource('marco_base');

    try {
        const resp = await fetch(`/api/rcs/${rcsId}`);
        const rcs = await resp.json();

        document.getElementById('rcs-detail-id').value = rcs._id;
        document.getElementById('rcs-detail-codigo').value = rcs.codigo_rcs;
        document.getElementById('rcs-detail-responsable').value = rcs.responsable || '';
        document.getElementById('rcs-detail-estado').value = rcs.estado;
        document.getElementById('rcs-detail-comentarios').value = rcs.comentarios_tecnicos || '';
        document.getElementById('rcs-detail-title').innerText = rcs.codigo_rcs;

        if (rcs.fecha_limite) {
            document.getElementById('rcs-detail-fecha').value = new Date(rcs.fecha_limite).toISOString().split('T')[0];
        } else {
            document.getElementById('rcs-detail-fecha').value = '';
        }

        currentRCSControls = rcs.controles_asociados || [];
        renderControlsList();
        updateRCSStats();

        // Pre-load frameworks for the selector
        loadFrameworksForRCS();

    } catch (err) {
        console.error('Error loading RCS detail:', err);
        alert('Error al cargar RCS');
        showRCSList();
    }
}

async function saveRCSDetail() {
    const id = document.getElementById('rcs-detail-id').value;
    const data = {
        responsable: document.getElementById('rcs-detail-responsable').value,
        estado: document.getElementById('rcs-detail-estado').value,
        comentarios_tecnicos: document.getElementById('rcs-detail-comentarios').value,
        fecha_limite: document.getElementById('rcs-detail-fecha').value || null
    };

    try {
        const resp = await fetch(`/api/rcs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            showRCSList();
        } else {
            alert('Error al guardar RCS');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
}

// ============ SOURCE SELECTOR ============

function switchControlSource(source) {
    currentControlSource = source;
    const mbTab = document.getElementById('src-tab-marco-base');
    const fwTab = document.getElementById('src-tab-framework');
    const fwPanel = document.getElementById('framework-selector-panel');
    const searchInput = document.getElementById('control-search-input');
    const resultsDiv = document.getElementById('control-search-results');

    // Clear search
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

async function loadFrameworksForRCS() {
    try {
        const resp = await fetch('/api/frameworks');
        rcsFrameworks = await resp.json();

        const select = document.getElementById('rcs-framework-select');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccione un marco --</option>';
        rcsFrameworks.forEach(fw => {
            const opt = document.createElement('option');
            opt.value = fw._id;
            opt.textContent = `${fw.name} ${fw.version ? '(' + fw.version + ')' : ''}`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Error loading frameworks:', err);
    }
}

function onFrameworkSelected() {
    // Re-trigger search with new framework filter if there's text in search
    const searchInput = document.getElementById('control-search-input');
    if (searchInput && searchInput.value.length >= 2) {
        searchControlsForRCS(searchInput.value);
    }
}

// ============ CONTROL SEARCH ============

async function searchControlsForRCS(query) {
    clearTimeout(searchTimeout);
    const resultsDiv = document.getElementById('control-search-results');

    if (query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            let url;
            if (currentControlSource === 'framework') {
                const frameworkId = document.getElementById('rcs-framework-select')?.value || '';
                url = `/api/framework-requirements/search?q=${encodeURIComponent(query)}${frameworkId ? '&framework_id=' + frameworkId : ''}`;
            } else {
                url = `/api/master-controls/search?q=${encodeURIComponent(query)}`;
            }

            const resp = await fetch(url);
            const items = await resp.json();

            if (items.length === 0) {
                resultsDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No se encontraron controles</div>';
            } else if (currentControlSource === 'framework') {
                resultsDiv.innerHTML = items.map(r => {
                    const isAdded = currentRCSControls.some(rc => rc.codigo_control === r.code);
                    return `
                    <div style="padding: 16px; border-bottom: 1px solid var(--border-color); ${isAdded ? 'opacity: 0.5;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <div>
                                <span style="font-weight: 600; color: var(--text-primary);">${r.code}</span>
                                <span style="background: #EEF2FF; color: #4338CA; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">📋 ${r.framework_name || 'Marco'}</span>
                            </div>
                            ${isAdded ? '<span style="color: #10B981; font-size: 0.8rem;">✓ Agregado</span>' :
                            `<button onclick="addControlToRCS('${r._id}', '${r.code}', 'FrameworkRequirement')" style="background: #4F46E5; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">+ Agregar</button>`}
                        </div>
                        <div style="font-size: 0.85rem; color: #6366F1; margin-bottom: 6px;">${r.domain || 'Sin dominio'}</div>
                        <div style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 8px;">${r.requirement || ''}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${r.guidance ? r.guidance.substring(0, 200) + (r.guidance.length > 200 ? '...' : '') : ''}</div>
                    </div>`;
                }).join('');
            } else {
                resultsDiv.innerHTML = items.map(c => {
                    const isAdded = currentRCSControls.some(rc => rc.codigo_control === c.codigo_control);
                    const severityClass = getSeverityClass(c.severidad);
                    return `
                    <div style="padding: 16px; border-bottom: 1px solid var(--border-color); ${isAdded ? 'opacity: 0.5;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <div>
                                <span style="font-weight: 600; color: var(--text-primary);">${c.codigo_control}</span>
                                <span class="severity-badge ${severityClass}" style="margin-left: 8px;">${c.severidad}</span>
                            </div>
                            ${isAdded ? '<span style="color: #10B981; font-size: 0.8rem;">✓ Agregado</span>' :
                            `<button onclick="addControlToRCS('${c._id}', '${c.codigo_control}', 'MasterControl')" style="background: #10B981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">+ Agregar</button>`}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">${c.dominio || 'Sin dominio'}</div>
                        <div style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 8px;">${c.lineamiento || 'Sin lineamiento'}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${c.recomendacion ? c.recomendacion.substring(0, 200) + (c.recomendacion.length > 200 ? '...' : '') : 'Sin recomendación'}</div>
                    </div>`;
                }).join('');
            }
            resultsDiv.style.display = 'block';
        } catch (err) {
            console.error('Error searching controls:', err);
        }
    }, 300);
}

async function addControlToRCS(controlId, codigoControl, tipoFuente) {
    if (!currentRCSId) return;
    tipoFuente = tipoFuente || 'MasterControl';

    try {
        const resp = await fetch(`/api/rcs/${currentRCSId}/controls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ control_id: controlId, codigo_control: codigoControl, tipo_fuente: tipoFuente })
        });

        if (resp.ok) {
            await openRCSDetail(currentRCSId);
            const searchInput = document.getElementById('control-search-input');
            if (searchInput.value) {
                searchControlsForRCS(searchInput.value);
            }
        } else {
            const error = await resp.json();
            alert(error.error || 'Error al agregar control');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
}

async function removeControlFromRCS(codigoControl) {
    if (!currentRCSId) return;
    if (!confirm(`¿Quitar control ${codigoControl} de este RCS?`)) return;

    try {
        const resp = await fetch(`/api/rcs/${currentRCSId}/controls/${codigoControl}`, {
            method: 'DELETE'
        });

        if (resp.ok) {
            await openRCSDetail(currentRCSId);
        } else {
            alert('Error al quitar control');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
}

async function updateControlState(codigoControl, newState) {
    if (!currentRCSId) return;

    try {
        const resp = await fetch(`/api/rcs/${currentRCSId}/controls/${codigoControl}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado_control: newState })
        });

        if (resp.ok) {
            await openRCSDetail(currentRCSId);
        }
    } catch (err) {
        console.error(err);
    }
}

function renderControlsList() {
    const container = document.getElementById('rcs-controls-list');
    document.getElementById('rcs-controls-count').innerText = currentRCSControls.length;

    if (!container) return;

    if (currentRCSControls.length === 0) {
        container.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; opacity: 0.5;">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>
            <p style="margin: 0 0 8px 0; font-weight: 500;">Sin controles asociados</p>
            <p style="margin: 0; font-size: 0.85rem;">Use el buscador para agregar controles a este RCS</p>
        </div>`;
        return;
    }

    container.innerHTML = currentRCSControls.map(c => {
        const info = c.control_info || {};
        const isFR = c.tipo_fuente === 'FrameworkRequirement';

        // For MasterControl
        const mcSeverity = info.severidad || 'Media';
        const severityClass = isFR ? '' : getSeverityClass(mcSeverity);

        // Badge colors
        const sourceBadge = isFR
            ? '<span style="background: #EEF2FF; color: #4338CA; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">📋 Marco Regulatorio</span>'
            : '<span style="background: #F0FDF4; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">🛡️ Marco Base</span>';

        // Severity badge for MC only
        const sevBadge = isFR ? '' : `<span class="severity-badge ${severityClass}" style="margin-left: 10px;">${mcSeverity}</span>`;

        const stateColor = {
            'Pendiente': '#EF4444',
            'En Mitigación': '#F59E0B',
            'Mitigado': '#10B981',
            'Aceptado': '#6B7280'
        }[c.estado_control] || '#EF4444';

        // Description line
        const descLine = isFR
            ? `<div style="font-size: 0.85rem; color: #6366F1; margin-bottom: 8px;">${info.domain || 'Sin dominio'}</div>
               <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.4;">${info.requirement || ''}</div>
               <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">${info.guidance ? info.guidance.substring(0, 300) + (info.guidance.length > 300 ? '...' : '') : ''}</div>`
            : `<div style="font-size: 0.85rem; color: #6366F1; margin-bottom: 8px;">${info.dominio || 'Sin dominio'}</div>
               <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.4;">${info.lineamiento || 'Sin lineamiento'}</div>
               <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5;">${info.recomendacion ? info.recomendacion.substring(0, 300) + (info.recomendacion.length > 300 ? '...' : '') : ''}</div>`;

        const borderColor = isFR ? '#818CF8' : '#10B981';

        return `
        <div style="background: white; border: 1px solid var(--border-color); border-left: 4px solid ${borderColor}; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <span style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${c.codigo_control}</span>
                    ${sevBadge}
                    ${sourceBadge}
                </div>
                <button onclick="removeControlFromRCS('${c.codigo_control}')" style="background: none; border: none; cursor: pointer; color: #B91C1C; padding: 4px;" title="Quitar control">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            ${descLine}
            
            <div style="display: flex; align-items: center; gap: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                <label style="font-size: 0.8rem; color: var(--text-secondary);">Estado:</label>
                <select onchange="updateControlState('${c.codigo_control}', this.value)" style="flex: 1; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; border: 1px solid var(--border-color);">
                    <option value="Pendiente" ${c.estado_control === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                    <option value="En Mitigación" ${c.estado_control === 'En Mitigación' ? 'selected' : ''}>🔄 En Mitigación</option>
                    <option value="Mitigado" ${c.estado_control === 'Mitigado' ? 'selected' : ''}>✅ Mitigado</option>
                    <option value="Aceptado" ${c.estado_control === 'Aceptado' ? 'selected' : ''}>🤝 Aceptado</option>
                </select>
                <span style="background: ${stateColor}15; color: ${stateColor}; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">${c.estado_control}</span>
            </div>
        </div>`;
    }).join('');
}

function updateRCSStats() {
    const total = currentRCSControls.length;
    const mitigated = currentRCSControls.filter(c => c.estado_control === 'Mitigado' || c.estado_control === 'Aceptado').length;
    const progress = total > 0 ? Math.round((mitigated / total) * 100) : 0;

    const totalEl = document.getElementById('rcs-detail-total-controls');
    const mitigatedEl = document.getElementById('rcs-detail-mitigated');
    const barEl = document.getElementById('rcs-detail-progress-bar');
    const textEl = document.getElementById('rcs-detail-progress-text');

    if (totalEl) totalEl.innerText = total;
    if (mitigatedEl) mitigatedEl.innerText = mitigated;
    if (barEl) barEl.style.width = `${progress}%`;
    if (textEl) textEl.innerText = `${progress}%`;

    const severityCounts = { 'Crítica': 0, 'Alta': 0, 'Media': 0, 'Baja': 0 };
    currentRCSControls.forEach(c => {
        const sev = c.control_info?.severidad || 'Media';
        if (severityCounts[sev] !== undefined) severityCounts[sev]++;
    });

    const breakdownEl = document.getElementById('rcs-severity-breakdown');
    if (breakdownEl) {
        breakdownEl.innerHTML = Object.entries(severityCounts)
            .filter(([, count]) => count > 0)
            .map(([sev, count]) => {
                const colors = { 'Crítica': '#7C3AED', 'Alta': '#EF4444', 'Media': '#F59E0B', 'Baja': '#10B981' };
                return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: ${colors[sev]};"></span>
                        ${sev}
                    </span>
                    <span style="font-weight: 600;">${count}</span>
                </div>`;
            }).join('') || '<div style="color: var(--text-secondary); text-align: center; padding: 20px;">Sin controles</div>';
    }
}

async function deleteRCS(rcsId) {
    try {
        const resp = await fetch(`/api/rcs/${rcsId}`, { method: 'DELETE' });
        if (resp.ok) {
            loadRCSData();
        } else {
            alert('Error al eliminar RCS');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
}

function openDeleteRCSModal(rcsId, rcsCode) {
    if (confirm(`¿Está seguro que desea eliminar el registro ${rcsCode}?\n\nEsta acción no se puede deshacer.`)) {
        deleteRCS(rcsId);
    }
}
