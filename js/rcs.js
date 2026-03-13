// ============ RCS MANAGEMENT ============
let rcsData = {};
let currentRCSId = null;
let currentRCSControls = [];
let searchTimeout = null;
let currentControlSource = 'marco_base'; // 'marco_base' or 'framework'
let rcsFrameworks = []; // cached framework list

async function loadRCSData() {
    try {
        const resp = await cyberFetch('/api/rcs');
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
        tbody.innerHTML = `<tr><td colspan="4" style="padding: 40px; text-align: center; color: var(--text-secondary);">No hay registros de Consultoría. Haga clic en "+ AGREGAR CONSULTORÍA" para crear una.</td></tr>`;
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
        const resp = await cyberFetch('/api/rcs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const result = await resp.json();
        if (resp.ok && result.data) {
            openRCSDetail(result.data._id);
        } else {
            alert('Error al crear nueva consultoría');
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
        const resp = await cyberFetch(`/api/rcs/${rcsId}`);
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

        // Load metadata (frameworks and projects)
        await Promise.all([
            loadFrameworksForRCS(),
            loadProjectsForRCS()
        ]);

        // Set selected project after loading
        document.getElementById('rcs-detail-proyecto').value = rcs.proyecto_asociado || '';

    } catch (err) {
        console.error('Error loading RCS detail:', err);
        alert('Error al cargar consultoría');
        showRCSList();
    }
}

async function saveRCSDetail() {
    const id = document.getElementById('rcs-detail-id').value;
    const data = {
        proyecto_asociado: document.getElementById('rcs-detail-proyecto').value,
        responsable: document.getElementById('rcs-detail-responsable').value,
        estado: document.getElementById('rcs-detail-estado').value,
        comentarios_tecnicos: document.getElementById('rcs-detail-comentarios').value,
        fecha_limite: document.getElementById('rcs-detail-fecha').value || null
    };

    try {
        const resp = await cyberFetch(`/api/rcs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            showRCSList();
        } else {
            alert('Error al guardar consultoría');
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

    if (source === 'marco_base') {
        mbTab.style.background = 'var(--accent-color)';
        mbTab.style.color = 'white';
        fwTab.style.background = 'transparent';
        fwTab.style.color = 'var(--text-secondary)';
        fwPanel.style.display = 'none';
        if (searchInput) searchInput.placeholder = 'Buscar en Marco Base...';
        loadFullMasterControls();
    } else {
        fwTab.style.background = '#4F46E5';
        fwTab.style.color = 'white';
        mbTab.style.background = 'transparent';
        mbTab.style.color = 'var(--text-secondary)';
        fwPanel.style.display = '';
        if (searchInput) searchInput.placeholder = 'Buscar en Marco Normativo...';
        // Only load if a framework is already selected
        const fwId = document.getElementById('rcs-framework-select')?.value;
        if (fwId) loadFullFrameworkRequirements(fwId);
        else document.getElementById('control-search-results').innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">Seleccione un marco normativo para ver los controles</div>';
    }
}

async function loadFrameworksForRCS() {
    try {
        const resp = await cyberFetch('/api/frameworks');
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



async function loadProjectsForRCS() {
    try {
        const resp = await cyberFetch('/api/projects');
        let projects = await resp.json();
        const select = document.getElementById('rcs-detail-proyecto');
        if (!select) return;

        // Filter projects: only show projects assigned to the user unless admin/security_manager
        if (localUser && localUser.role === 'engineer') {
            projects = projects.filter(p => 
                p.ingeniero_asignado === localUser.name || 
                p.lider_proyecto === localUser.name || 
                p.ingeniero_asignado === localUser.email || 
                p.lider_proyecto === localUser.email
            );
        }

        select.innerHTML = '<option value="">-- Seleccionar Proyecto --</option>';
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.nombre; // We store the project name or ID? Schema says String.
            opt.textContent = `${p.codigo_proyecto} - ${p.nombre}`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Error loading projects for RCS:', err);
    }
}

async function searchControlsForRCS(query) {
    clearTimeout(searchTimeout);
    const resultsDiv = document.getElementById('control-search-results');

    if (!query || query.length < 2) {
        if (currentControlSource === 'marco_base') loadFullMasterControls();
        else {
            const fwId = document.getElementById('rcs-framework-select')?.value;
            if (fwId) loadFullFrameworkRequirements(fwId);
        }
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

            const resp = await cyberFetch(url);
            const items = await resp.json();
            renderExplorerResults(items);
        } catch (err) {
            console.error('Error searching controls:', err);
        }
    }, 300);
}

async function addControlToRCS(controlId, codigoControl, tipoFuente) {
    if (!currentRCSId) return;
    tipoFuente = tipoFuente || 'MasterControl';

    try {
        const resp = await cyberFetch(`/api/rcs/${currentRCSId}/controls`, {
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
    if (!confirm(`¿Quitar control ${codigoControl} de esta consultoría?`)) return;

    try {
        const resp = await cyberFetch(`/api/rcs/${currentRCSId}/controls/${codigoControl}`, {
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
        const resp = await cyberFetch(`/api/rcs/${currentRCSId}/controls/${codigoControl}`, {
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
            <p style="margin: 0; font-size: 0.85rem;">Use el buscador para agregar controles a esta consultoría</p>
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
        const resp = await cyberFetch(`/api/rcs/${rcsId}`, { method: 'DELETE' });
        if (resp.ok) {
            loadRCSData();
        } else {
            alert('Error al eliminar consultoría');
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

async function loadFullMasterControls() {
    try {
        const resp = await cyberFetch('/api/master-controls');
        const items = await resp.json();
        renderExplorerResults(items);
    } catch (err) {
        console.error('Error loading full master controls:', err);
    }
}

async function loadFullFrameworkRequirements(frameworkId) {
    if (!frameworkId) return;
    try {
        const resp = await cyberFetch(`/api/frameworks/${frameworkId}/requirements`);
        const items = await resp.json();
        renderExplorerResults(items);
    } catch (err) {
        console.error('Error loading framework requirements:', err);
    }
}

function renderExplorerResults(items) {
    const resultsDiv = document.getElementById('control-search-results');
    if (!resultsDiv) return;

    if (!items || items.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No se encontraron controles</div>';
        return;
    }

    resultsDiv.innerHTML = items.map(item => {
        const isFR = currentControlSource === 'framework';
        const code = isFR ? item.code : item.codigo_control;
        const isAdded = currentRCSControls.some(rc => rc.codigo_control === code);

        const bgColor = isFR ? '#EEF2FF' : '#F0FDF4';
        const color = isFR ? '#4338CA' : '#166534';
        const badge = isFR ? '📋 Normativo' : '🛡️ Base';
        const title = isFR ? item.requirement : item.lineamiento;
        const subTitle = isFR ? item.domain : item.dominio;
        const desc = isFR ? (item.guidance || '') : (item.recomendacion || '');
        const id = item._id;
        const type = isFR ? 'FrameworkRequirement' : 'MasterControl';

        return `
        <div style="background: white; border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; position: relative; transition: all 0.2s; ${isAdded ? 'border-color: #10B981; background: #F0FDF410;' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${code}</span>
                    <span style="background: ${bgColor}; color: ${color}; padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 700;">${badge}</span>
                </div>
                ${isAdded ? '<span style="color: #10B981; font-weight: 600; font-size: 0.75rem; display: flex; align-items: center; gap: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Agregado</span>' :
                `<button onclick="addControlToRCS('${id}', '${code}', '${type}')" style="background: var(--accent-color); color: white; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">Agregar</button>`}
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${subTitle || ''}</div>
            <div style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 6px; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title || ''}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${desc}</div>
        </div>`;
    }).join('');
}

function filterAddedControls() {
    const query = document.getElementById('rcs-added-controls-search').value.toLowerCase();
    const cards = document.querySelectorAll('#rcs-controls-list > div[style*="background: white"]');

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (text.includes(query)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Handle empty state if filtering results in no matches
    // (Check visibility of cards)
    const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
    const emptyMsg = document.querySelector('#rcs-controls-list .empty-state');
    if (visibleCards.length === 0 && cards.length > 0) {
        // We could inject a "no matches" message but for now just showing empty state is fine
    }
}

function onFrameworkSelected() {
    const fwId = document.getElementById('rcs-framework-select')?.value;
    if (fwId) {
        loadFullFrameworkRequirements(fwId);
    } else {
        document.getElementById('control-search-results').innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">Seleccione un marco normativo para ver los controles</div>';
    }
}
