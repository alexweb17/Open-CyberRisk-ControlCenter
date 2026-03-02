// ============ PROJECT MANAGEMENT ============
let allProjects = [];

async function loadProjects() {
    try {
        const resp = await fetch('/api/projects');
        allProjects = await resp.json();

        // Ensure RCS data is loaded before rendering projects to calculate metrics
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

        let stats = { Pendiente: 0, 'En Curso': 0, 'Implementado/Mitigado': 0, Aceptado: 0 };
        let totalControls = 0;
        let mitigatedCount = 0;

        projectRCS.forEach(r => {
            (r.controles_asociados || []).forEach(c => {
                totalControls++;
                if (c.estado_control === 'Mitigado' || c.estado_control === 'Aceptado') mitigatedCount++;

                if (c.estado_control === 'Pendiente') stats.Pendiente++;
                else if (c.estado_control === 'En Mitigación') stats['En Curso']++;
                else if (c.estado_control === 'Mitigado') stats['Implementado/Mitigado']++;
                else if (c.estado_control === 'Aceptado') stats.Aceptado++;
            });
        });

        const compliance = totalControls > 0 ? Math.round((mitigatedCount / totalControls) * 100) : 0;
        const barColor = compliance >= 70 ? 'var(--accent-terracotta)' :
            compliance >= 40 ? '#F59E0B' : 'var(--risk-critical)';
        const textColor = compliance < 40 ? 'color: var(--risk-critical);' : '';
        const fechaSol = p.fecha_solicitud ? new Date(p.fecha_solicitud).toLocaleDateString() : 'N/A';

        return `
        <div class="project-card glass" style="position: relative; min-width: 280px; text-align: center;">
            <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 6px;">
                <button data-project-action="edit" data-project-id="${p._id}" 
                    style="background: none; border: 1px solid var(--border-color); padding: 6px; border-radius: 6px; cursor: pointer;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/>
                    </svg>
                </button>
                <button data-project-action="delete" data-project-id="${p._id}" data-project-name="${p.nombre}"
                    style="background: none; border: 1px solid #FEE2E2; padding: 6px; border-radius: 6px; cursor: pointer; color: #B91C1C;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
            <div class="project-id" style="margin-bottom: 4px;">${p.codigo_proyecto}</div>
            <div style="font-weight: 700; margin-bottom: 4px; font-size: 1.1rem; color: var(--text-primary);">${p.nombre}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px; font-weight: 500;">
                ${p.area || 'Sin área asignada'}
            </div>
            
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 12px;">
                📅 Solicitud: <span style="font-weight: 600; color: var(--text-primary);">${fechaSol}</span>
            </div>

            <div class="progress-details" style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 6px;">
                <span>Cumplimiento Global</span>
                <span style="font-weight: 700; ${textColor}">${compliance}%</span>
            </div>
            <div class="progress-container" style="background: #F3F4F6; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
                <div class="progress-bar" style="width: ${compliance}%; background: ${barColor}; height: 100%; transition: width 0.5s ease;"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
                <div style="text-align: center;">
                    <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">Pendientes</div>
                    <div style="font-weight: 700; color: var(--risk-critical);">${stats.Pendiente}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">En Curso</div>
                    <div style="font-weight: 700; color: #F59E0B;">${stats['En Curso']}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">Mitigados</div>
                    <div style="font-weight: 700; color: #10B981;">${stats['Implementado/Mitigado']}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">Aceptados</div>
                    <div style="font-weight: 700; color: #6B7280;">${stats.Aceptado}</div>
                </div>
            </div>

            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6; border-top: 1px solid var(--border-color); padding-top: 12px;">
                <div style="margin-bottom: 2px;">👤 <strong>Líder:</strong> ${p.lider_proyecto || 'Sin asignar'}</div>
                <div>🔧 <strong>Ingeniero:</strong> ${p.ingeniero_asignado || 'Sin asignar'}</div>
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

    if (projectId) {
        const project = allProjects.find(p => p._id === projectId);
        if (project) {
            title.innerText = 'Editar Proyecto';
            document.getElementById('project-id').value = project._id;
            document.getElementById('project-nombre').value = project.nombre;
            document.getElementById('project-descripcion').value = project.descripcion || '';
            document.getElementById('project-lider').value = project.lider_proyecto || '';
            document.getElementById('project-ingeniero').value = project.ingeniero_asignado || '';
            document.getElementById('project-area').value = project.area || 'Tecnología Información y Comunicación';
            document.getElementById('project-fecha-solicitud').value = project.fecha_solicitud ? project.fecha_solicitud.split('T')[0] : '';
            document.getElementById('project-estado').value = project.estado;
        }
    } else {
        title.innerText = 'Nuevo Proyecto';
    }

    modal.style.display = 'block';
}

function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
}

async function handleProjectSubmit(e) {
    e.preventDefault();
    const projectId = document.getElementById('project-id').value;
    const data = {
        nombre: document.getElementById('project-nombre').value,
        descripcion: document.getElementById('project-descripcion').value,
        lider_proyecto: document.getElementById('project-lider').value,
        ingeniero_asignado: document.getElementById('project-ingeniero').value,
        area: document.getElementById('project-area').value,
        fecha_solicitud: document.getElementById('project-fecha-solicitud').value || null,
        estado: document.getElementById('project-estado').value
    };

    try {
        const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
        const method = projectId ? 'PUT' : 'POST';

        const resp = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            closeProjectModal();
            await loadProjects();
        } else {
            const err = await resp.json();
            alert('Error: ' + (err.error || 'Desconocido'));
        }
    } catch (err) {
        console.error('Project submit error:', err);
        alert('Error de conexión');
    }
}

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
        const resp = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
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
