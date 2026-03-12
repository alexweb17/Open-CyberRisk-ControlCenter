let currentProcesoControls = [];
let procesosData = [];

async function loadProcesos() {
    try {
        const response = await cyberFetch('/api/procesos');
        if (response.ok) {
            procesosData = await response.json();
            renderProcesosTable(procesosData);
        }
    } catch (error) {
        console.error('Error loading procesos:', error);
    }
}

function renderProcesosTable(data) {
    const tbody = document.getElementById('procesos-table-body');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 24px; text-align: center; color: var(--text-secondary);">No hay procesos críticos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(p => {
        const compliance = p.cumplimiento || 0;
        const barColor = compliance >= 70 ? '#10B981' : (compliance >= 40 ? '#F59E0B' : '#EF4444');
        return `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; font-weight: 600;">${p.codigo_proceso}</td>
            <td style="padding: 12px; font-weight: 500;">${p.nombre_proceso}</td>
            <td style="padding: 12px;">${p.dueno_proceso || '-'}</td>
            <td style="padding: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 6px; background: #F3F4F6; border-radius: 3px; overflow: hidden; min-width: 60px;">
                        <div style="width: ${compliance}%; height: 100%; background: ${barColor};"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: ${barColor};">${compliance}%</span>
                </div>
            </td>
            <td style="padding: 12px; text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button onclick="openEditProcesoModal('${p._id}')" class="btn-action">
                        ✏️
                    </button>
                    <button onclick="openDeleteProcesoModal('${p._id}', '${p.nombre_proceso}')" class="btn-delete">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}
