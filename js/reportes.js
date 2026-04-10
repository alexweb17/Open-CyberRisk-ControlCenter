// ============ CISO 360° DASHBOARD ============

let cisoCharts = {};

async function loadCISODashboard() {
    console.log('[CISO 360] loadCISODashboard called');
    try {
        const [projResp, procResp, rcsResp, infResp, objResp, kriResp, execResp] = await Promise.all([
            cyberFetch('/api/projects'),
            cyberFetch('/api/procesos'),
            cyberFetch('/api/rcs'),
            cyberFetch('/api/informesl3'),
            cyberFetch('/api/governance/objectives'),
            cyberFetch('/api/governance/kris'),
            cyberFetch('/api/governance/executive-summary')
        ]);

        console.log('[CISO 360] All fetches completed', {
            proj: projResp.status, proc: procResp.status, rcs: rcsResp.status,
            inf: infResp.status, obj: objResp.status, kri: kriResp.status, exec: execResp.status
        });

        const projects = await projResp.json();
        const procesos = await procResp.json();
        const rcsList = await rcsResp.json();
        const informes = await infResp.json();
        const objectives = await objResp.json();
        const kris = await kriResp.json();
        const execSummary = await execResp.json();

        console.log('[CISO 360] Data parsed', {
            projects: Array.isArray(projects) ? projects.length : projects,
            procesos: Array.isArray(procesos) ? procesos.length : procesos,
            rcs: Array.isArray(rcsList) ? rcsList.length : rcsList,
            informes: Array.isArray(informes) ? informes.length : informes,
            objectives: Array.isArray(objectives) ? objectives.length : objectives,
            kris: Array.isArray(kris) ? kris.length : kris
        });

        // Safe arrays
        const safeProjects = Array.isArray(projects) ? projects : [];
        const safeProcesos = Array.isArray(procesos) ? procesos : [];
        const safeRCS = Array.isArray(rcsList) ? rcsList : [];
        const safeInformes = Array.isArray(informes) ? informes : [];
        const safeObjectives = Array.isArray(objectives) ? objectives : [];
        const safeKRIs = Array.isArray(kris) ? kris : [];

        // 1. KPI Cards
        renderCISOKPIs(safeProjects, safeProcesos, safeRCS, safeInformes, safeObjectives, safeKRIs);

        // 2. Financial + Risk panel
        renderFinancialPanel(execSummary, safeProcesos);

        // 3. KRI Status panel
        renderKRIStatusPanel(safeKRIs);

        // 4. Risk Distribution donut
        renderRiskDistributionChart(safeProcesos);

        // 5. Informes L3 Severity donut
        renderInformesSeverityChart(safeInformes);

        // 6. Consultorías bar chart
        renderConsultoriasChart(safeRCS);

        // 7. Top processes by ALE table
        renderTopProcessesTable(safeProcesos);

        // 8. Active alerts table (critical/high informes)
        renderActiveAlerts(safeInformes);

        // 9. Projects status summary
        renderProjectsSummary(safeProjects);

    } catch (error) {
        console.error('Error loading CISO 360 Dashboard:', error);
    }
}

// --- KPI Cards with animation ---
function renderCISOKPIs(projects, procesos, rcs, informes, objectives, kris) {
    animateValue('ciso-kpi-proyectos', 0, projects.length, 800);
    animateValue('ciso-kpi-consultorias', 0, rcs.length, 800);
    animateValue('ciso-kpi-procesos', 0, procesos.length, 800);
    animateValue('ciso-kpi-informes', 0, informes.length, 800);
    animateValue('ciso-kpi-objetivos', 0, objectives.length, 800);
    animateValue('ciso-kpi-kris', 0, kris.length, 800);

    // KPI sub-labels
    const critInformes = informes.filter(i => i.severidad === 'Crítica' || i.severidad === 'Alta').length;
    const subInformes = document.getElementById('ciso-kpi-informes-sub');
    if (subInformes) subInformes.textContent = `${critInformes} Críticos/Altos`;

    const critKRIs = kris.filter(k => k.current_value >= k.threshold_critical).length;
    const subKRIs = document.getElementById('ciso-kpi-kris-sub');
    if (subKRIs) subKRIs.textContent = critKRIs > 0 ? `${critKRIs} en alerta` : 'Todos normales';
    if (subKRIs && critKRIs > 0) subKRIs.style.color = '#EF4444';

    const activeRCS = rcs.filter(r => r.estado === 'En Curso').length;
    const subRCS = document.getElementById('ciso-kpi-consultorias-sub');
    if (subRCS) subRCS.textContent = `${activeRCS} en curso`;
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    if (end === 0) { obj.innerText = '0'; return; }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.innerHTML = end;
    };
    window.requestAnimationFrame(step);
}

// --- Financial Panel ---
function renderFinancialPanel(execSummary, procesos) {
    const container = document.getElementById('ciso-financial-panel');
    if (!container) return;

    const totalALE = execSummary.totalFinancialExposure || 0;
    const totalProcesses = execSummary.totalProcesses || procesos.length;
    const THRESHOLD = 50000000; // $50M Risk appetite
    const percent = Math.min(100, (totalALE / THRESHOLD) * 100);
    const isOver = totalALE > THRESHOLD;
    const barColor = isOver ? '#EF4444' : percent > 70 ? '#F59E0B' : '#10B981';

    container.innerHTML = `
        <div style="font-size: 2.5rem; font-weight: 800; color: ${isOver ? '#EF4444' : 'var(--text-primary)'}; margin-bottom: 8px;">
            $${(totalALE / 1000000).toFixed(2)}M
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">
            Exposición Financiera Total (ALE) — ${totalProcesses} procesos evaluados
        </div>
        <div style="background: #F3F4F6; border-radius: 8px; height: 12px; overflow: hidden; margin-bottom: 8px;">
            <div style="height: 100%; width: ${percent}%; background: ${barColor}; border-radius: 8px; transition: width 1s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
            <span>${isOver ? '⚠️ Excede' : percent > 70 ? '⚡ Cerca del' : '✓ Dentro del'} apetito de riesgo</span>
            <span>Umbral: $${(THRESHOLD / 1000000).toFixed(0)}M</span>
        </div>
    `;
}

// --- KRI Status Panel ---
function renderKRIStatusPanel(kris) {
    const container = document.getElementById('ciso-kri-panel');
    if (!container) return;

    const total = kris.length;
    const critical = kris.filter(k => k.current_value >= k.threshold_critical).length;
    const warning = kris.filter(k => k.current_value >= k.threshold_warning && k.current_value < k.threshold_critical).length;
    const normal = kris.filter(k => k.current_value < k.threshold_warning).length;

    const cBar = total > 0 ? ((critical / total) * 100) : 0;
    const wBar = total > 0 ? ((warning / total) * 100) : 0;
    const nBar = total > 0 ? ((normal / total) * 100) : 0;

    container.innerHTML = `
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <div style="text-align: center; flex: 1;">
                <div style="font-size: 2rem; font-weight: 800; color: #EF4444;">${critical}</div>
                <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Críticos</div>
            </div>
            <div style="text-align: center; flex: 1;">
                <div style="font-size: 2rem; font-weight: 800; color: #F59E0B;">${warning}</div>
                <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Advertencia</div>
            </div>
            <div style="text-align: center; flex: 1;">
                <div style="font-size: 2rem; font-weight: 800; color: #10B981;">${normal}</div>
                <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Normales</div>
            </div>
        </div>
        <div style="display: flex; height: 10px; border-radius: 6px; overflow: hidden; background: #F3F4F6;">
            <div style="width: ${cBar}%; background: #EF4444;"></div>
            <div style="width: ${wBar}%; background: #F59E0B;"></div>
            <div style="width: ${nBar}%; background: #10B981;"></div>
        </div>
        <div style="text-align: center; margin-top: 8px; font-size: 0.75rem; color: var(--text-secondary);">${total} indicadores monitoreados</div>
    `;
}

// --- Risk Distribution Donut ---
function renderRiskDistributionChart(procesos) {
    const ctx = document.getElementById('chart-risk-distribution');
    if (!ctx) return;
    if (cisoCharts['riskDist']) cisoCharts['riskDist'].destroy();

    const counts = { 'Crítico': 0, 'Alto': 0, 'Medio': 0, 'Bajo': 0 };
    procesos.forEach(p => {
        const level = p.nivel_riesgo || 'Medio';
        if (counts[level] !== undefined) counts[level]++;
    });

    cisoCharts['riskDist'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Crítico', 'Alto', 'Medio', 'Bajo'],
            datasets: [{
                data: [counts['Crítico'], counts['Alto'], counts['Medio'], counts['Bajo']],
                backgroundColor: ['#B91C1C', '#D97706', '#059669', '#2563EB'],
                borderWidth: 0, hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { font: { size: 11 }, padding: 12 } } },
            cutout: '65%'
        }
    });
}

// --- Informes L3 Severity Chart ---
function renderInformesSeverityChart(informes) {
    const ctx = document.getElementById('chart-informes-severity');
    if (!ctx) return;
    if (cisoCharts['infSev']) cisoCharts['infSev'].destroy();

    const counts = { 'Crítica': 0, 'Alta': 0, 'Media': 0, 'Baja': 0 };
    informes.forEach(i => {
        const sev = i.severidad || 'Media';
        if (counts[sev] !== undefined) counts[sev]++;
    });

    cisoCharts['infSev'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Crítica', 'Alta', 'Media', 'Baja'],
            datasets: [{
                data: [counts['Crítica'], counts['Alta'], counts['Media'], counts['Baja']],
                backgroundColor: ['#B91C1C', '#D97706', '#059669', '#2563EB'],
                borderWidth: 0, hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { font: { size: 11 }, padding: 12 } } },
            cutout: '65%'
        }
    });
}

// --- Consultorías Status Chart ---
function renderConsultoriasChart(rcsList) {
    const ctx = document.getElementById('chart-consultorias-status');
    if (!ctx) return;
    if (cisoCharts['rcsStatus']) cisoCharts['rcsStatus'].destroy();

    const counts = { 'Pendiente de Revisión': 0, 'En Curso': 0, 'Implementado/Mitigado': 0 };
    rcsList.forEach(rcs => {
        const estado = rcs.estado || 'Pendiente de Revisión';
        if (counts[estado] !== undefined) counts[estado]++;
    });

    cisoCharts['rcsStatus'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pendientes', 'En Curso', 'Mitigados'],
            datasets: [{
                label: 'Consultorías',
                data: [counts['Pendiente de Revisión'], counts['En Curso'], counts['Implementado/Mitigado']],
                backgroundColor: ['#D97757', '#7C3AED', '#059669'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { display: false } },
                y: { grid: { display: false } }
            }
        }
    });
}

// --- Top Processes by ALE ---
function renderTopProcessesTable(procesos) {
    const tbody = document.getElementById('ciso-top-processes-body');
    if (!tbody) return;

    const top = procesos
        .filter(p => (p.ale_expectativa_perdida || 0) > 0)
        .sort((a, b) => b.ale_expectativa_perdida - a.ale_expectativa_perdida)
        .slice(0, 5);

    if (top.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: var(--text-secondary);">No hay procesos con exposición financiera registrada.</td></tr>`;
        return;
    }

    const maxALE = top[0].ale_expectativa_perdida;

    tbody.innerHTML = top.map(p => {
        const pct = ((p.ale_expectativa_perdida / maxALE) * 100).toFixed(0);
        const riskColor = p.nivel_riesgo === 'Crítico' ? '#B91C1C' : p.nivel_riesgo === 'Alto' ? '#D97706' : p.nivel_riesgo === 'Medio' ? '#059669' : '#2563EB';
        return `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;">
                <div style="font-weight: 600; font-size: 0.85rem;">${p.nombre_proceso}</div>
                <div style="font-size: 0.72rem; color: var(--text-secondary);">${p.area_responsable || 'Sin área'}</div>
            </td>
            <td style="padding: 12px;">
                <span style="background: ${riskColor}15; color: ${riskColor}; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600;">${p.nivel_riesgo || 'N/A'}</span>
            </td>
            <td style="padding: 12px; font-weight: 700; font-size: 0.85rem;">$${(p.ale_expectativa_perdida || 0).toLocaleString()}</td>
            <td style="padding: 12px; width: 120px;">
                <div style="background: #F3F4F6; border-radius: 4px; height: 8px; overflow: hidden;">
                    <div style="height: 100%; width: ${pct}%; background: ${riskColor}; border-radius: 4px;"></div>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// --- Active Alerts ---
function renderActiveAlerts(informes) {
    const tbody = document.getElementById('ciso-alerts-body');
    if (!tbody) return;

    const alerts = informes
        .filter(i => i.severidad === 'Crítica' || i.severidad === 'Alta')
        .filter(i => i.estado_atencion !== 'Resuelto' && i.estado_atencion !== 'Cerrado')
        .sort((a, b) => new Date(b.created_at || b.fecha_deteccion) - new Date(a.created_at || a.fecha_deteccion))
        .slice(0, 5);

    if (alerts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: var(--text-secondary);">🎉 Sin alertas críticas activas.</td></tr>`;
        return;
    }

    tbody.innerHTML = alerts.map(inf => {
        const sevColor = inf.severidad === 'Crítica' ? '#B91C1C' : '#D97706';
        const estColor = inf.estado_atencion === 'Nuevo' ? '#3B82F6' : '#8B5CF6';
        return `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; font-weight: 600; font-size: 0.85rem;">${inf.codigo_informe}</td>
            <td style="padding: 12px; font-size: 0.85rem;">${inf.titulo || inf.nombre_informe || 'Sin Título'}</td>
            <td style="padding: 12px;">
                <span style="background: ${sevColor}15; color: ${sevColor}; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600;">${inf.severidad}</span>
            </td>
            <td style="padding: 12px;">
                <span style="background: ${estColor}15; color: ${estColor}; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 600;">${inf.estado_atencion || 'Pendiente'}</span>
            </td>
        </tr>`;
    }).join('');
}

// --- Projects Summary ---
function renderProjectsSummary(projects) {
    const container = document.getElementById('ciso-projects-summary');
    if (!container) return;

    const total = projects.length;
    const byType = {};
    projects.forEach(p => {
        const tipo = p.tipo || 'General';
        byType[tipo] = (byType[tipo] || 0) + 1;
    });

    // Calculate avg compliance
    let totalCompliance = 0;
    let projectsWithControls = 0;
    projects.forEach(p => {
        if (p.controls && p.controls.length > 0) {
            const mitigados = p.controls.filter(c => c.estado === 'Implementado/Mitigado').length;
            totalCompliance += (mitigados / p.controls.length) * 100;
            projectsWithControls++;
        }
    });
    const avgCompliance = projectsWithControls > 0 ? (totalCompliance / projectsWithControls).toFixed(0) : 0;

    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; border: 4px solid ${avgCompliance > 70 ? '#10B981' : avgCompliance > 40 ? '#F59E0B' : '#EF4444'}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800;">
                ${avgCompliance}%
            </div>
            <div>
                <div style="font-weight: 700; font-size: 1rem;">Cumplimiento Promedio</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${projectsWithControls} de ${total} proyectos evaluados</div>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${Object.entries(byType).map(([tipo, count]) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #F9FAFB; border-radius: 8px;">
                    <span style="font-size: 0.82rem; font-weight: 500;">${tipo}</span>
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-terracotta);">${count}</span>
                </div>
            `).join('')}
        </div>
    `;
}

window.loadCISODashboard = loadCISODashboard;
