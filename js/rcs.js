let currentRCSControls = [];
let currentControlSource = 'master'; // 'master' or 'framework'

async function loadRCSData() {
    try {
        const response = await cyberFetch('/api/rcs');
        const data = await response.json();
        renderRCSTable(data);
    } catch (err) {
        console.error('Error loading RCS data:', err);
    }
}

function renderRCSTable(data) {
    const tbody = document.getElementById('rcs-table-body');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--text-secondary);">No hay consultorías registradas</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(r => {
        const compliance = r.cumplimiento || 0;
        const barColor = compliance >= 70 ? '#10B981' : (compliance >= 40 ? '#F59E0B' : '#EF4444');
        return `
        <tr style="border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="openRCSDetail('${r._id}')">
            <td style="padding: 12px; font-weight: 600;">${r.codigo_rcs}</td>
            <td style="padding: 12px; font-weight: 500;">${r.proyecto_id?.nombre || 'General'}</td>
            <td style="padding: 12px;">${r.responsable || '-'}</td>
            <td style="padding: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 6px; background: #F3F4F6; border-radius: 3px; overflow: hidden; min-width: 60px;">
                        <div style="width: ${compliance}%; height: 100%; background: ${barColor};"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: ${barColor};">${compliance}%</span>
                </div>
            </td>
            <td style="padding: 12px; text-align: right;">
                <button onclick="event.stopPropagation(); openDeleteRCSModal('${r._id}', '${r.codigo_rcs}')" class="btn-delete" style="padding: 4px; border-radius: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>
        </tr>
    `;
    }).join('');
}
