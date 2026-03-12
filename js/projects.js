let allProjects = [];

async function loadProjects() {
    try {
        const response = await cyberFetch('/api/projects');
        if (response.ok) {
            allProjects = await response.json();
            renderProjects(allProjects);
        }
    } catch (err) {
        console.error('Error loading projects:', err);
    }
}

function renderProjects(data) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = `
            <div class="glass" style="grid-column: 1/-1; text-align: center; padding: 60px; border: 1px dashed var(--border-color);">
                <div style="font-size: 3rem; margin-bottom: 20px;">📁</div>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">No hay proyectos activos</h3>
                <p style="color: var(--text-secondary);">Comience agregando un nuevo proyecto de seguridad.</p>
            </div>`;
        return;
    }

    container.innerHTML = data.map(p => {
        const stats = p.risk_stats || { 'Pendiente': 0, 'En Curso': 0, 'Mitigado': 0, 'Aceptado': 0 };
        const p_pendientes = stats.Pendiente || 0;
        const p_mitigados = stats.Mitigado || 0;
        const total = p_pendientes + stats['En Curso'] + p_mitigados + stats.Aceptado;
        const compliance = total > 0 ? Math.round(((p_mitigados + stats.Aceptado) / total) * 100) : 0;

        const barColor = compliance >= 70 ? '#10B981' : (compliance >= 40 ? '#F59E0B' : '#EF4444');
        const textColor = compliance >= 70 ? 'color: #059669;' :
            compliance >= 40 ? 'color: #F59E0B;' : 'color: var(--risk-critical);';
        const fechaSol = p.fecha_solicitud ? new Date(p.fecha_solicitud).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

        // Status badge class
        const estadoLower = (p.estado || 'Activo').toLowerCase();
        const statusClass = estadoLower === 'activo' ? 'status-activo' :
            estadoLower === 'cerrado' ? 'status-cerrado' : 'status-inactivo';

        return `
        <div class="project-card glass" style="position: relative;">
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
