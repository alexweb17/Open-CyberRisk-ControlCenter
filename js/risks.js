// ============ RISK DASHBOARD FUNCTIONS ============
let riskDashboardData = null;

async function loadRiskDashboard() {
    try {
        const res = await fetch('/api/risk-dashboard');
        const data = await res.json();
        riskDashboardData = data;

        // KPIs
        document.getElementById('kpi-total').textContent = data.kpis.total;
        document.getElementById('kpi-criticos').textContent = data.kpis.criticos;
        document.getElementById('kpi-mitigacion').textContent = data.kpis.en_mitigacion;
        document.getElementById('kpi-sla-vencido').textContent = data.kpis.sla_vencido;
        document.getElementById('risk-total-badge').textContent = `${data.kpis.total} Riesgos`;

        renderTopCritical(data.topCritical, data.severityCounts);
        renderTopOldest(data.topOldest);
        renderHeatMap(data.heatMap);
        renderRiskInventory(data.inventory);
        renderSeverityDistribution(data.severityCounts);
        renderEstadoDistribution(data.inventory);
    } catch (err) {
        console.error('Error loading risk dashboard:', err);
    }
}

function getSevBadge(severity) {
    const colors = {
        'Crítica': 'background: #DC2626; color: white;',
        'Alta': 'background: #EA580C; color: white;',
        'Media': 'background: #CA8A04; color: white;',
        'Baja': 'background: #16A34A; color: white;',
        'N/A': 'background: #9CA3AF; color: white;'
    };
    return `<span style="${colors[severity] || colors['N/A']} padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${severity || 'N/A'}</span>`;
}

function getEstadoBadge(estado) {
    const colors = {
        'Pendiente de Revisión': 'background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A;',
        'En Curso': 'background: #DBEAFE; color: #1E40AF; border: 1px solid #93C5FD;',
        'Implementado/Mitigado': 'background: #D1FAE5; color: #065F46; border: 1px solid #6EE7B7;'
    };
    return `<span style="${colors[estado] || ''} padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${estado || '-'}</span>`;
}

function formatDateShort(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderTopCritical(items, severityCounts) {
    const tbody = document.getElementById('top-critical-body');
    if (!tbody) return;
    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-secondary);">Sin datos de riesgos</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(r => {
        const controlCodes = (r.controles_asociados || []).map(c => c.codigo_control).join(', ') || '-';
        const incidencias = severityCounts[r.severidad_maxima] || 0;
        return `<tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 10px; font-weight: 500;">${controlCodes}</td>
            <td style="padding: 10px;">${r.proyecto_asociado || '-'}</td>
            <td style="padding: 10px;">${getSevBadge(r.severidad_maxima)}</td>
            <td style="padding: 10px; text-align: center; font-weight: 700; font-size: 1.1rem;">${incidencias}</td>
            <td style="padding: 10px;">${getEstadoBadge(r.estado)}</td>
        </tr>`;
    }).join('');
}

function renderTopOldest(items) {
    const tbody = document.getElementById('top-oldest-body');
    if (!tbody) return;
    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-secondary);">Sin datos de riesgos</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(r => {
        const controlCodes = (r.controles_asociados || []).map(c => c.codigo_control).join(', ') || '-';
        return `<tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 10px; font-weight: 500;">${controlCodes}</td>
            <td style="padding: 10px;">${r.proyecto_asociado || '-'}</td>
            <td style="padding: 10px;">${getSevBadge(r.severidad_maxima)}</td>
            <td style="padding: 10px; text-align: center; font-weight: 700;">${r.antiguedad_dias}d</td>
            <td style="padding: 10px;">${formatDateShort(r.fecha_registro)}</td>
        </tr>`;
    }).join('');
}

function renderHeatMap(heatMap) {
    const tbody = document.getElementById('heatmap-body');
    if (!tbody) return;
    const severities = ['Crítica', 'Alta', 'Media', 'Baja'];
    const estados = ['Pendiente de Revisión', 'En Curso', 'Implementado/Mitigado'];
    const sevRowColors = { 'Crítica': '#DC2626', 'Alta': '#EA580C', 'Media': '#CA8A04', 'Baja': '#16A34A' };

    tbody.innerHTML = severities.map(sev => {
        const cells = estados.map(est => {
            const count = (heatMap[sev] && heatMap[sev][est]) || 0;
            const intensity = count === 0 ? 0 : Math.min(count / 5, 1);
            const bgColor = count === 0 ? 'transparent' : `${sevRowColors[sev]}${Math.round(intensity * 40 + 15).toString(16).padStart(2, '0')}`;
            return `<td style="padding: 16px; border: 1px solid var(--border-color); background: ${bgColor}; font-size: 1.3rem; font-weight: 700;">${count}</td>`;
        }).join('');
        return `<tr>
            <td style="padding: 12px; border: 1px solid var(--border-color); font-weight: 600; text-align: left;">${getSevBadge(sev)}</td>
            ${cells}
        </tr>`;
    }).join('');
}

function renderRiskInventory(items) {
    const tbody = document.getElementById('risk-inventory-body');
    if (!tbody) return;
    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="padding: 20px; text-align: center; color: var(--text-secondary);">Sin registros de riesgos</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(r => {
        const controlCodes = (r.controles_asociados || []).map(c => c.codigo_control).join(', ') || '-';
        const slaClass = r.sla_vencido ? 'color: #DC2626; font-weight: 700;' : '';
        return `<tr style="border-bottom: 1px solid var(--border-color);" data-search="${(r.codigo_rcs + ' ' + r.proyecto_asociado + ' ' + r.responsable).toLowerCase()}" data-severity="${r.severidad_maxima}" data-estado="${r.estado}">
            <td style="padding: 10px; font-weight: 600;">${r.codigo_rcs || '-'}</td>
            <td style="padding: 10px;">${r.proyecto_asociado || '-'}</td>
            <td style="padding: 10px;">${r.responsable || '-'}</td>
            <td style="padding: 10px;">${getSevBadge(r.severidad_maxima)}</td>
            <td style="padding: 10px;">${getEstadoBadge(r.estado)}</td>
            <td style="padding: 10px; font-size: 0.8rem;">${controlCodes}</td>
            <td style="padding: 10px;">${formatDateShort(r.fecha_registro)}</td>
            <td style="padding: 10px; ${slaClass}">${formatDateShort(r.fecha_limite)}</td>
            <td style="padding: 10px; font-weight: 500;">${r.antiguedad_dias}d</td>
        </tr>`;
    }).join('');
}

function filterRiskInventory() {
    const search = (document.getElementById('risk-inventory-search').value || '').toLowerCase();
    const sevFilter = document.getElementById('risk-severity-filter').value;
    const estFilter = document.getElementById('risk-estado-filter').value;
    const rows = document.querySelectorAll('#risk-inventory-body tr');
    rows.forEach(row => {
        const searchData = row.getAttribute('data-search') || '';
        const severity = row.getAttribute('data-severity') || '';
        const estado = row.getAttribute('data-estado') || '';
        const matchSearch = !search || searchData.includes(search);
        const matchSev = !sevFilter || severity === sevFilter;
        const matchEst = !estFilter || estado === estFilter;
        row.style.display = (matchSearch && matchSev && matchEst) ? '' : 'none';
    });
}

function renderSeverityDistribution(severityCounts) {
    const container = document.getElementById('severity-distribution');
    if (!container) return;
    const sevs = ['Crítica', 'Alta', 'Media', 'Baja'];
    const colors = { 'Crítica': '#DC2626', 'Alta': '#EA580C', 'Media': '#CA8A04', 'Baja': '#16A34A' };
    const total = Object.values(severityCounts).reduce((a, b) => a + b, 0) || 1;

    container.innerHTML = sevs.map(sev => {
        const count = severityCounts[sev] || 0;
        const pct = Math.round((count / total) * 100);
        return `<div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                <span style="font-weight: 500;">${sev}</span>
                <span style="font-weight: 700;">${count} (${pct}%)</span>
            </div>
            <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${pct}%; background: ${colors[sev]}; border-radius: 4px; transition: width 0.5s ease;"></div>
            </div>
        </div>`;
    }).join('');
}

function renderEstadoDistribution(inventory) {
    const container = document.getElementById('estado-distribution');
    if (!container) return;
    const estados = ['Pendiente de Revisión', 'En Curso', 'Implementado/Mitigado'];
    const colors = { 'Pendiente de Revisión': '#F59E0B', 'En Curso': '#3B82F6', 'Implementado/Mitigado': '#10B981' };
    const labels = { 'Pendiente de Revisión': 'Pendiente', 'En Curso': 'En Curso', 'Implementado/Mitigado': 'Mitigado' };
    const total = inventory.length || 1;

    container.innerHTML = estados.map(est => {
        const count = inventory.filter(r => r.estado === est).length;
        const pct = Math.round((count / total) * 100);
        return `<div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                <span style="font-weight: 500;">${labels[est]}</span>
                <span style="font-weight: 700;">${count} (${pct}%)</span>
            </div>
            <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${pct}%; background: ${colors[est]}; border-radius: 4px; transition: width 0.5s ease;"></div>
            </div>
        </div>`;
    }).join('');
}
