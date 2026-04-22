// ============ PROJECT MANAGEMENT ============
let allProjects = [];

async function loadProjects() {
    try {
        const resp = await cyberFetch('/api/projects');
        allProjects = await resp.json();

        // Ensure Consultoría data is loaded before rendering projects to calculate metrics
        if (typeof rcsData === 'undefined' || Object.keys(rcsData || {}).length === 0) {
            await loadRCSData();
        }

        renderProjectCards(allProjects);

        // Update dashboard counters
        const activeCount = allProjects.filter(p => p.estado === 'Activo').length;
        const totalFindings = allProjects.reduce((sum, p) => sum + (p.hallazgos_abiertos || 0), 0);
        const avgCompliance = allProjects.length > 0
            ? Math.round(allProjects.reduce((sum, p) => sum + (p.cumplimiento_global || 0), 0) / allProjects.length)
            : 0;

        document.getElementById('active-projects-count').innerText = activeCount;
        document.getElementById('open-findings-count').innerText = totalFindings;
        document.getElementById('avg-compliance-count').innerText = avgCompliance + '%';
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

function filterProjects(query) {
    const filtered = query.trim()
        ? allProjects.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()) ||
            p.codigo_proyecto.toLowerCase().includes(query.toLowerCase()))
        : allProjects;
    renderProjectCards(filtered);
}

function renderProjectCards(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="glass" style="padding: 40px; text-align: center; width: 100%;">
                <p style="color: var(--text-secondary); margin: 0;">No hay proyectos. Haga clic en "+ AGREGAR PROYECTO" para crear uno.</p>
            </div>`;
        return;
    }

    container.innerHTML = projects.map(p => {
        // Calculate metrics from RCS that match this project's code (expediente)
        const projectRCS = Object.values(rcsData || {}).filter(r => r.expediente === p.codigo_proyecto);

        let stats = { Pendiente: 0, 'En Curso': 0, Mitigados: 0, Aceptado: 0 };
        let totalControls = 0;
        let mitigatedCount = 0;

        projectRCS.forEach(r => {
            (r.controles_asociados || []).forEach(c => {
                totalControls++;
                if (c.estado_control === 'Mitigado' || c.estado_control === 'Aceptado') mitigatedCount++;

                if (c.estado_control === 'Pendiente') stats.Pendiente++;
                else if (c.estado_control === 'En Mitigación') stats['En Curso']++;
                else if (c.estado_control === 'Mitigado') stats.Mitigados++;
                else if (c.estado_control === 'Aceptado') stats.Aceptado++;
            });
        });

        const p_pendientes = stats.Pendiente || p.hallazgos_abiertos || 0;
        const p_mitigados = stats.Mitigados || p.hallazgos_mitigados || 0;

        const compliance = totalControls > 0 ? Math.round((mitigatedCount / totalControls) * 100) : (p.cumplimiento_global || 0);
        const barColor = compliance >= 70 ? '#059669' :
            compliance >= 40 ? '#F59E0B' : 'var(--risk-critical)';
        const textColor = compliance >= 70 ? 'color: #059669;' :
            compliance >= 40 ? 'color: #F59E0B;' : 'color: var(--risk-critical);';
        const fechaSol = p.fecha_solicitud ? new Date(p.fecha_solicitud).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

        // Status badge class
        const estadoLower = (p.estado || 'Activo').toLowerCase();
        const statusClass = estadoLower === 'activo' ? 'status-activo' :
            estadoLower === 'cerrado' ? 'status-cerrado' : 'status-inactivo';

        return `
        <div class="project-card glass clickable-card" style="position: relative; cursor: pointer;" data-project-id="${p._id}">
            <div class="action-btns">
                <button class="action-btn" data-project-action="edit" data-project-id="${p._id}" title="Editar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/>
                    </svg>
                </button>
                <button class="action-btn delete" data-project-action="delete" data-project-id="${p._id}" data-project-name="${p.nombre}" title="Eliminar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>

            <div class="project-card-inner">
                <div class="card-header">
                    <div>
                        <div class="project-code">${p.codigo_proyecto}</div>
                        <div class="project-title-row">
                            <h3 class="project-title">${p.nombre}</h3>
                            <span class="project-status-badge ${statusClass}">${p.estado || 'Activo'}</span>
                        </div>
                    </div>
                </div>

                <div class="project-meta">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <span class="meta-value">${p.area || 'Sin área'}</span>
                    <span class="meta-separator">·</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>${fechaSol}</span>
                    <span class="meta-separator">·</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span class="meta-value">${p.lider_proyecto || 'Sin asignar'}</span>
                </div>

                <div class="progress-section">
                    <div class="progress-header">
                        <span class="progress-label">Cumplimiento Global</span>
                        <span class="progress-value" style="${textColor}">${compliance}%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${compliance}%; background: ${barColor};"></div>
                    </div>
                </div>

                <div class="stats-row">
                    <span class="stat-pill pill-pendientes">${p_pendientes} Pendientes</span>
                    <span class="stat-pill pill-encurso">${stats['En Curso']} En Curso</span>
                    <span class="stat-pill pill-mitigados">${p_mitigados} Mitigados</span>
                    <span class="stat-pill pill-aceptados">${stats.Aceptado} Aceptados</span>
                </div>
            </div>
        </div>`;
    }).join('');
}


function openProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const title = document.getElementById('project-modal-title');

    form.reset();
    document.getElementById('project-id').value = '';
    
    const fileList = document.getElementById('project-files-list');
    if (fileList) fileList.innerHTML = '';

    // Load engineers list before setting value
    loadEngineersForProjectModal().then(() => {
        if (projectId) {
        const project = allProjects.find(p => p._id === projectId);
        if (project) {
            title.innerText = 'Editar Proyecto';
            document.getElementById('project-id').value = project._id;
            document.getElementById('project-nombre').value = project.nombre;
            document.getElementById('project-descripcion').value = project.descripcion || '';
            document.getElementById('project-lider').value = project.lider_proyecto || '';
            document.getElementById('project-ingeniero').value = project.ingeniero_asignado || '';
            document.getElementById('project-area').value = project.area || 'Tecnología de la Información';
            document.getElementById('project-fecha-solicitud').value = project.fecha_solicitud ? project.fecha_solicitud.split('T')[0] : '';
            document.getElementById('project-estado').value = project.estado;
        }
    } else {
        title.innerText = 'Nuevo Proyecto';
    }
    });

    modal.style.display = 'block';
}

function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
}

function openProjectPreview(projectId) {
    const project = allProjects.find(p => p._id === projectId);
    if (!project) return;

    document.getElementById('preview-project-code').innerText = project.codigo_proyecto;
    document.getElementById('preview-project-nombre').innerText = project.nombre;
    document.getElementById('preview-project-descripcion').innerText = project.descripcion || 'Sin descripción disponible.';
    document.getElementById('preview-project-area').innerText = project.area || 'Sin área asignada';
    document.getElementById('preview-project-lider').innerText = project.lider_proyecto || 'Sin asignar';
    document.getElementById('preview-project-ingeniero').innerText = project.ingeniero_asignado || 'Sin asignar';
    document.getElementById('preview-project-fecha').innerText = project.fecha_solicitud ? new Date(project.fecha_solicitud).toLocaleDateString('es-ES') : 'N/A';
    
    // Status Badge
    const badge = document.getElementById('preview-project-estado-badge');
    const estado = project.estado || 'Activo';
    const statusClass = estado.toLowerCase() === 'activo' ? 'status-activo' : (estado.toLowerCase() === 'cerrado' ? 'status-cerrado' : 'status-inactivo');
    badge.innerHTML = `<span class="project-status-badge ${statusClass}" style="position: static; padding: 4px 12px; font-size: 0.8rem;">${estado}</span>`;

    // Files
    const filesList = document.getElementById('preview-project-files');
    if (project.archivos_adjuntos && project.archivos_adjuntos.length > 0) {
        filesList.innerHTML = project.archivos_adjuntos.map(f => `
            <a href="/${f.ruta.replace(/^\.\//, '')}" target="_blank" class="glass" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; text-decoration: none; color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; transition: background 0.2s;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; font-size: 0.85rem;">${f.nombre}</span>
                        <span style="font-size: 0.7rem; color: var(--text-secondary);">${f.tipo || 'Archivo'}</span>
                    </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-terracotta)" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
        `).join('');
    } else {
        filesList.innerHTML = '<div style="color: var(--text-secondary); font-style: italic; font-size: 0.85rem;">No hay archivos adjuntos.</div>';
    }

    document.getElementById('project-preview-modal').style.display = 'block';
}

function closeProjectPreview() {
    document.getElementById('project-preview-modal').style.display = 'none';
}

async function handleProjectSubmit(e) {
    e.preventDefault();
    const projectId = document.getElementById('project-id').value;
    const nombre = document.getElementById('project-nombre').value;
    const lider = document.getElementById('project-lider').value;
    const ingeniero = document.getElementById('project-ingeniero').value;

    if (!nombre || !lider || !ingeniero) {
        if (typeof showNotification === 'function') {
            showNotification('Nombre, Líder e Ingeniero son obligatorios.', 'warning');
        } else {
            alert('Nombre, Líder e Ingeniero son obligatorios.');
        }
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Guardando...';
    }

    try {
        const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
        const method = projectId ? 'PUT' : 'POST';

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', document.getElementById('project-descripcion').value);
        formData.append('lider_proyecto', lider);
        formData.append('ingeniero_asignado', ingeniero);
        formData.append('area', document.getElementById('project-area').value);
        formData.append('fecha_solicitud', document.getElementById('project-fecha-solicitud').value || '');
        formData.append('estado', document.getElementById('project-estado').value);

        const fileInput = document.getElementById('project-files');
        if (fileInput && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('archivos', fileInput.files[i]);
            }
        }

        const resp = await cyberFetch(url, {
            method,
            // Do NOT set Content-Type header when using FormData, browser will set it with boundary
            body: formData
        });

        if (resp.ok) {
            closeProjectModal();
            await loadProjects();
            if (typeof showNotification === 'function') {
                showNotification(projectId ? 'Proyecto actualizado' : 'Proyecto creado');
            }
        } else {
            const err = await resp.json();
            if (typeof showNotification === 'function') {
                showNotification('Error: ' + (err.error || 'Desconocido') + (err.details ? ' - ' + err.details : ''), 'error');
            } else {
                alert('Error: ' + (err.error || 'Desconocido') + (err.details ? '\nDetalles: ' + err.details : ''));
            }
        }
    } catch (err) {
        console.error('Project submit error:', err);
        if (typeof showNotification === 'function') {
            showNotification('Error de conexión', 'error');
        } else {
            alert('Error de conexión');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Guardar Proyecto';
        }
    }
}

function handleProjectFiles(input) {
    const list = document.getElementById('project-files-list');
    if (!list) return;

    if (input.files.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = Array.from(input.files).map(f => `
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; color: var(--text-primary);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <span>${f.name}</span>
            <span style="color: var(--text-secondary); font-size: 0.7rem;">(${(f.size / 1024).toFixed(1)} KB)</span>
        </div>
    `).join('');
}

window.handleProjectFiles = handleProjectFiles;

function openDeleteProjectModal(projectId, projectName) {
    document.getElementById('delete-project-id').value = projectId;
    document.getElementById('delete-project-message').innerHTML =
        `¿Está seguro que desea eliminar el proyecto <strong>${projectName}</strong>?<br>Esta acción no se puede deshacer.`;
    document.getElementById('delete-project-modal').style.display = 'block';
}

function closeDeleteProjectModal() {
    document.getElementById('delete-project-modal').style.display = 'none';
}

async function confirmDeleteProject() {
    const projectId = document.getElementById('delete-project-id').value;
    try {
        const resp = await cyberFetch(`/api/projects/${projectId}`, { method: 'DELETE' });
        if (resp.ok) {
            closeDeleteProjectModal();
            await loadProjects();
        } else {
            alert('Error al eliminar proyecto');
        }
    } catch (err) {
        alert('Error de conexión');
    }
}
async function loadEngineersForProjectModal() {
    try {
        const resp = await cyberFetch('/api/users/engineers');
        if (!resp.ok) return;

        const engineers = await resp.json();
        const select = document.getElementById('project-ingeniero');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccionar Ingeniero --</option>';
        engineers.forEach(eng => {
            const opt = document.createElement('option');
            opt.value = eng.name; // Storing name as string to match schema
            opt.textContent = `${eng.name} (${eng.email})`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Error loading engineers:', err);
    }
}
