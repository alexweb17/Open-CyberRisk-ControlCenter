// ============ INFORMES L3 FUNCTIONS ============
let informesL3Data = [];

async function loadInformesL3() {
    try {
        const response = await cyberFetch('/api/informesl3');
        const data = await response.json();
        informesL3Data = data; // Guardar data globalmente para editar
        renderInformesTable(data);
        updateInformesDashboard(data);
    } catch (error) {
        console.error('Error loading Informes L3:', error);
    }
}

function renderInformesTable(data) {
    const tbody = document.getElementById('informes-table-body');
    if (!tbody) return;
    tbody.innerHTML = data.map(inf => `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; font-weight: 600;">${inf.codigo_informe}</td>
            <td style="padding: 12px; font-weight: 500;">${inf.titulo || ''}</td>
            <td style="padding: 12px;">${inf.tipo || ''}</td>
            <td style="padding: 12px;">${getSeverityBadge(inf.severidad)}</td>
            <td style="padding: 12px;">${(inf.fecha_deteccion || '').split('T')[0]}</td>
            <td style="padding: 12px; text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="openEditInformeModal('${inf._id}')" class="btn-action">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/></svg>
                    </button>
                    <button onclick="openDeleteInformeModal('${inf._id}', '${inf.titulo}')" class="btn-delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getSeverityBadge(sev) {
    const colors = { 'Crítica': '#B91C1C', 'Alta': '#D97706', 'Media': '#059669', 'Baja': '#2563EB' };
    return `<span style="background: ${colors[sev] || '#6B7280'}15; color: ${colors[sev] || '#6B7280'}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${sev || 'Media'}</span>`;
}

function updateInformesDashboard(data) {
    const total = data.length;
    const criticos = data.filter(inf => inf.severidad === 'Crítica' || inf.severidad === 'Alta').length;
    const enRemediacion = data.filter(inf => inf.estado_atencion === 'En Remediación').length;
    const resueltos = data.filter(inf => inf.estado_atencion === 'Resuelto' || inf.estado_atencion === 'Cerrado').length;

    document.getElementById('total-informes-count').textContent = total;
    document.getElementById('criticos-informes-count').textContent = criticos;
    document.getElementById('remediacion-informes-count').textContent = enRemediacion;
    document.getElementById('resueltos-informes-count').textContent = resueltos;
}

function openInformeModal() {
    document.getElementById('informe-form').reset();
    document.getElementById('informe-id').value = '';
    document.getElementById('informe-modal-title').textContent = 'Nuevo Informe L3';
    document.getElementById('informe-modal').style.display = 'block';
}

function closeInformeModal() {
    document.getElementById('informe-modal').style.display = 'none';
}

function openEditInformeModal(id) {
    const inf = informesL3Data.find(i => i._id === id);
    if (!inf) return;

    document.getElementById('informe-id').value = inf._id;
    document.getElementById('informe-codigo-num').value = inf.codigo_informe ? inf.codigo_informe.split('-')[1] : '';
    document.getElementById('informe-titulo').value = inf.titulo || '';
    document.getElementById('informe-tipo').value = inf.tipo || 'Incidente de Seguridad';
    document.getElementById('informe-origen').value = inf.origen || 'Monitoreo';
    document.getElementById('informe-descripcion').value = inf.descripcion || '';
    document.getElementById('informe-severidad').value = inf.severidad || 'Media';
    document.getElementById('informe-estado').value = inf.estado_atencion || 'Nuevo';
    document.getElementById('informe-responsable').value = inf.responsable || '';
    document.getElementById('informe-area').value = inf.area_afectada || '';
    document.getElementById('informe-fecha-deteccion').value = inf.fecha_deteccion ? inf.fecha_deteccion.split('T')[0] : '';
    document.getElementById('informe-fecha-limite').value = inf.fecha_limite ? inf.fecha_limite.split('T')[0] : '';
    document.getElementById('informe-fecha-cierre').value = inf.fecha_cierre ? inf.fecha_cierre.split('T')[0] : '';
    document.getElementById('informe-acciones').value = inf.acciones_tomadas || '';
    document.getElementById('informe-lecciones').value = inf.lecciones_aprendidas || '';
    document.getElementById('informe-riesgo-residual').value = inf.riesgo_residual || 'N/A';

    document.getElementById('informe-modal-title').textContent = 'Editar Informe L3';
    document.getElementById('informe-modal').style.display = 'block';
}

async function handleInformeSubmit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('informe-id').value;
    const codigoNum = document.getElementById('informe-codigo-num').value;
    
    const formData = {
        codigo_informe: codigoNum ? `L3-${codigoNum.padStart(3, '0')}` : null,
        titulo: document.getElementById('informe-titulo').value,
        tipo: document.getElementById('informe-tipo').value,
        origen: document.getElementById('informe-origen').value,
        descripcion: document.getElementById('informe-descripcion').value,
        severidad: document.getElementById('informe-severidad').value,
        estado_atencion: document.getElementById('informe-estado').value,
        responsable: document.getElementById('informe-responsable').value,
        area_afectada: document.getElementById('informe-area').value,
        fecha_deteccion: document.getElementById('informe-fecha-deteccion').value || null,
        fecha_limite: document.getElementById('informe-fecha-limite').value || null,
        fecha_cierre: document.getElementById('informe-fecha-cierre').value || null,
        acciones_tomadas: document.getElementById('informe-acciones').value,
        lecciones_aprendidas: document.getElementById('informe-lecciones').value,
        riesgo_residual: document.getElementById('informe-riesgo-residual').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/informesl3/${id}` : '/api/informesl3';
        const response = await cyberFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeInformeModal();
            loadInformesL3();
        } else {
            const err = await response.json();
            alert("Error: " + (err.error || "Desconocido"));
        }
    } catch (error) {
        console.error('Error saving informe:', error);
        alert("Error de conexión");
    }
}

function openDeleteInformeModal(id, title) {
    document.getElementById('delete-informe-id').value = id;
    document.getElementById('delete-informe-message').innerHTML = `¿Está seguro que desea eliminar el informe <strong>${title}</strong>?<br>Esta acción no se puede deshacer.`;
    document.getElementById('delete-informe-modal').style.display = 'block';
}

function closeDeleteInformeModal() {
    document.getElementById('delete-informe-modal').style.display = 'none';
}

async function confirmDeleteInforme() {
    const id = document.getElementById('delete-informe-id').value;
    try {
        const response = await cyberFetch(`/api/informesl3/${id}`, { method: 'DELETE' });
        if (response.ok) {
            closeDeleteInformeModal();
            loadInformesL3();
        } else {
            alert("Error al eliminar");
        }
    } catch (error) {
        console.error('Error deleting informe:', error);
        alert("Error de conexión");
    }
}

function filterInformesTable() {
    const query = document.getElementById('informes-search').value.toLowerCase();
    const rows = document.querySelectorAll('#informes-table-body tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}
