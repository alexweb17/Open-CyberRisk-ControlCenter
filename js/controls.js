// ============ MASTER CONTROLS MANAGEMENT ============
let liveControls = {};
let controlsMaster = {};
let allControls = [];

async function loadLocalData() {
    try {
        const resp = await fetch('/api/master-controls');
        const controls = await resp.json();

        liveControls = {};
        controlsMaster = {};
        controls.forEach(item => {
            const mappedItem = {
                _id: item._id,
                codigo_control: item.codigo_control,
                lineamiento: item.lineamiento,
                recomendacion: item.recomendacion,
                severidad: item.severidad,
                guia_evidencia: item.guia_evidencia,
                justificacion_riesgo: item.justificacion_riesgo,
                sla_dias: item.sla_dias,
                dominio: item.dominio,
                name: item.lineamiento,
                justification: item.justificacion_riesgo,
                sla: parseInt(item.sla_dias) || 30,
                severity: item.severidad,
                evidence: item.guia_evidencia
            };
            liveControls[item.codigo_control] = mappedItem;
            controlsMaster[item.codigo_control] = mappedItem;
        });

        if (Array.isArray(controls)) {
            allControls = controls.map(item => ({
                ...item,
                _id: item._id ? item._id.toString() : null
            }));
            renderLineamientosList(allControls);
            updateControlSelect(allControls);
        }
    } catch (err) {
        console.error("Error loading local data:", err);
    }
}

function handleSearch() {
    const query = document.getElementById('controls-search').value.toLowerCase();
    const filtered = allControls.filter(c =>
        c.codigo_control.toLowerCase().includes(query) ||
        c.lineamiento.toLowerCase().includes(query) ||
        c.severidad.toLowerCase().includes(query) ||
        (c.recomendacion && c.recomendacion.toLowerCase().includes(query)) ||
        (c.dominio && c.dominio.toLowerCase().includes(query))
    );
    renderLineamientosList(filtered);
}

function updateControlSelect(data) {
    const select = document.getElementById('control-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione un control --</option>';

    data.forEach(item => {
        const id = item.codigo_control;
        const option = document.createElement('option');
        option.value = id;
        option.innerText = `${id}: ${item.lineamiento}`;
        select.appendChild(option);
    });
}

function renderLineamientosList(controls) {
    const body = document.getElementById('master-controls-body');
    const countEl = document.getElementById('total-controls-count');
    if (!body) return;

    body.innerHTML = '';
    countEl.innerText = controls.length;

    controls.forEach(c => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color)';
        tr.style.cursor = 'pointer';
        tr.dataset.code = c.codigo_control;
        tr.innerHTML = `
            <td style="padding: 16px; font-weight: 600;">${c.codigo_control}</td>
            <td style="padding: 16px;">
                <div style="font-weight: 500;">${c.lineamiento}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${c.recomendacion ? c.recomendacion.substring(0, 60) + '...' : ''}</div>
            </td>
            <td style="padding: 16px;">
                <span class="status-badge ${getSeverityClass(c.severidad)}">${c.severidad}</span>
            </td>
            <td style="padding: 16px; text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button data-action="edit" data-code="${c.codigo_control}" style="background: none; border: 1px solid var(--border-color); padding: 6px; border-radius: 6px; cursor: pointer;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/></svg>
                    </button>
                    <button data-action="delete" data-code="${c.codigo_control}" style="background: none; border: 1px solid #FEE2E2; padding: 6px; border-radius: 6px; cursor: pointer; color: #B91C1C;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        `;
        body.appendChild(tr);
    });
}

function openControlModal(controlId = null) {
    const modal = document.getElementById('control-modal');
    const form = document.getElementById('control-form');
    const title = document.getElementById('modal-title');

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    form.reset();
    document.getElementById('modal-control-id').value = '';

    if (controlId && liveControls[controlId]) {
        const c = liveControls[controlId];
        title.innerText = 'Editar Control ' + controlId;
        document.getElementById('modal-control-id').value = c._id;
        document.getElementById('modal-codigo').value = controlId;
        document.getElementById('modal-nombre').value = c.name;
        document.getElementById('modal-recomendacion').value = c.recomendacion || '';
        document.getElementById('modal-justificacion').value = c.justification || '';
        document.getElementById('modal-severidad').value = c.severity;
        document.getElementById('modal-sla').value = c.sla;
        document.getElementById('modal-evidencia').value = c.evidence || '';

        if (c.dominio) document.getElementById('modal-dominio').value = c.dominio;

        document.getElementById('modal-codigo-container').style.display = 'block';
        document.getElementById('modal-codigo').disabled = true;
        document.getElementById('modal-dominio-container').style.display = 'block';
        title.innerText = 'Editar Control ' + controlId + ' (Cambiar dominio re-asignará código)';
    } else {
        title.innerText = 'Agregar Nuevo Control';
        document.getElementById('modal-codigo-container').style.display = 'none';
        document.getElementById('modal-dominio-container').style.display = 'block';
    }

    modal.style.display = 'block';
}

function closeControlModal() {
    document.getElementById('control-modal').style.display = 'none';
}

function viewControlDetails(controlId) {
    const c = liveControls[controlId];
    if (!c) return;

    const container = document.getElementById('control-detail-view');
    container.style.display = 'block';

    document.getElementById('detail-code').innerText = c.codigo_control;
    document.getElementById('detail-name').innerText = c.lineamiento;
    document.getElementById('detail-domain').innerText = c.dominio || 'N/A';
    document.getElementById('detail-recommendation').innerText = c.recomendacion || 'Sin recomendación';
    document.getElementById('detail-evidence').innerText = c.guia_evidencia || 'Sin guía específica';

    const sevBadge = document.getElementById('detail-severity');
    sevBadge.innerText = c.severidad;
    sevBadge.className = `status-badge ${getSeverityClass(c.severidad)}`;

    document.getElementById('detail-sla').innerText = c.sla_dias || 30;
}

function deleteControl(controlId) {
    const control = liveControls[controlId];
    if (!control) {
        alert("Control no encontrado: " + controlId);
        return;
    }

    document.getElementById('delete-control-code').value = controlId;
    document.getElementById('delete-modal-message').innerHTML =
        `¿Está seguro que desea eliminar el control <strong>${controlId}</strong>?<br>Esta acción no se puede deshacer.`;
    document.getElementById('delete-modal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    document.getElementById('delete-control-code').value = '';
}

async function confirmDelete() {
    const controlId = document.getElementById('delete-control-code').value;
    const control = liveControls[controlId];

    if (!control || !control._id) {
        alert("Error: No se puede identificar el control.");
        closeDeleteModal();
        return;
    }

    try {
        const resp = await fetch(`/api/master-controls/${control._id}`, { method: 'DELETE' });
        if (resp.ok) {
            closeDeleteModal();
            await loadLocalData();
        } else {
            const err = await resp.json();
            alert("Error al eliminar: " + (err.error || "Desconocido"));
        }
    } catch (err) {
        console.error("Delete Error:", err);
        alert("Error de conexión al eliminar.");
    }
}
async function handleControlSubmit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('modal-control-id').value;
    const data = {
        lineamiento: document.getElementById('modal-nombre').value,
        recomendacion: document.getElementById('modal-recomendacion').value,
        justificacion_riesgo: document.getElementById('modal-justificacion').value,
        severidad: document.getElementById('modal-severidad').value,
        sla_dias: parseInt(document.getElementById('modal-sla').value) || 30,
        guia_evidencia: document.getElementById('modal-evidencia').value,
        dominio: document.getElementById('modal-dominio').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/master-controls/${id}` : '/api/master-controls';
        const resp = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            closeControlModal();
            loadLocalData();
        } else {
            const err = await resp.json();
            alert("Error: " + (err.error || "Desconocido"));
        }
    } catch (err) {
        console.error("Submit Error:", err);
        alert("Error de conexión al guardar.");
    }
}

window.handleControlSubmit = handleControlSubmit;
window.loadLocalData = loadLocalData;
