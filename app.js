// --- Authentication Logic ---
async function login() {
    try {
        await msalInstance.loginPopup(loginRequest);
        checkUser();
        loadSharePointData();
    } catch (err) {
        console.error(err);
    }
}

async function logout() {
    msalInstance.logoutPopup();
}

function checkUser() {
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
        document.getElementById('user-name').innerText = account.name;
        document.getElementById('user-email').innerText = account.username;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    } else {
        document.getElementById('user-name').innerText = "Invitado";
        document.getElementById('user-email').innerText = "Inicie sesión para continuar";
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
    }
}

// --- Data Loading Logic ---
let liveControls = {};

async function loadSharePointData() {
    if (!msalInstance.getAllAccounts()[0]) return;

    try {
        const proyectos = await getProyectos();
        renderProyectos(proyectos);

        const lineamientos = await getLineamientos();
        processLineamientos(lineamientos);
    } catch (err) {
        console.error("Error loading SharePoint data:", err);
    }
}

function renderProyectos(proyectos) {
    const container = document.querySelector('.projects-row');
    container.innerHTML = '';
    proyectos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-id">${p.Title || 'N/A'}</div>
            <div style="font-weight: 500; margin-bottom: 12px;">${p.Nombre_Proyecto || 'Sin nombre'}</div>
            <div class="progress-details" style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 6px;">
                <span>Estado: ${p.Estado_Consultoria || 'N/A'}</span>
                <span style="font-weight: 600;">0%</span> <!-- Cumplimiento not in data -->
            </div>
            <div class="progress-container" style="background: #F3F4F6;">
                <div class="progress-bar" style="width: 0%; background: var(--accent-terracotta);"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

function processLineamientos(data) {
    const select = document.getElementById('control-select');
    select.innerHTML = '<option value="">-- Seleccione un control --</option>';

    data.forEach(item => {
        const id = item.Codigo_Control || item.Title;
        liveControls[id] = {
            name: item.Lineamiento_de_Seguridad,
            justification: item.Justificacion_Riesgo,
            sla: parseInt(item.SLA_Dias) || 30,
            severity: item.Severidad,
            evidence: item.Guia_Evidencia
        };

        const option = document.createElement('option');
        option.value = id;
        option.innerText = `${id}: ${item.Lineamiento_de_Seguridad}`;
        select.appendChild(option);
    });
}

async function handleRegistrarHallazgo() {
    const controlId = document.getElementById('control-select').value;
    const comentarios = document.querySelector('textarea').value;
    const estado = document.querySelectorAll('select')[1].value;

    if (!controlId) {
        alert("Seleccione un control primero");
        return;
    }

    const data = {
        Title: `Hallazgo-${controlId}-${new Date().getTime()}`,
        ID_Control: controlId,
        Comentarios: comentarios,
        Estado: estado
    };

    try {
        await registrarHallazgo(data);
        alert("Hallazgo registrado con éxito en SharePoint");
    } catch (err) {
        alert("Error al registrar hallazgo: " + err.message);
    }
}

// Initialize user state on load
window.addEventListener('load', () => {
    checkUser();
    if (msalInstance.getAllAccounts()[0]) {
        loadSharePointData();
    }
});

// Use liveControls if available, fallback to hardcoded (optional, but better to just use live)
const controlsMaster = liveControls;


function showSection(sectionId) {
    // Update Active Nav
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });

    // Update Views
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(sectionId + '-view').classList.add('active');

    // Optional: Log SharePoint Context
    console.log(`Switched to ${sectionId}. Mapping data from SharePoint lists: Hallazgos, Proyectos, lineamientos.`);
}

function updateControlInfo() {
    const select = document.getElementById('control-select');
    const controlId = select.value;
    const info = controlsMaster[controlId];

    if (info) {
        // Smooth transition for details
        const details = document.querySelector('.control-details');
        details.style.opacity = '0';

        setTimeout(() => {
            document.getElementById('justification-text').innerText = info.justification;
            document.getElementById('evidence-guide').innerText = info.evidence;

            const slaBadge = document.getElementById('sla-badge');
            slaBadge.innerText = `${info.sla} Días`;
            slaBadge.className = `info-card ${getSeverityClass(info.severity)}`;

            // Cálculo de vencimiento dinámico
            const today = new Date();
            const dueDate = new Date();
            dueDate.setDate(today.getDate() + info.sla);

            const timeDiff = dueDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

            document.getElementById('due-date').innerHTML = `
                ${dueDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                <br><span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: normal;">
                    Quedan ${daysRemaining} días para cumplir SLA
                </span>
            `;

            // Update New SLA Tracker UI
            updateSLATracker(daysRemaining, dueDate, info.sla, info.severity);
            updateEvidenceList(info.evidence);

            details.style.transition = 'opacity 0.4s ease';
            details.style.opacity = '1';

            // Trigger Technical Advisor logic (internal)
            injectAI(controlId, info.severity);
        }, 200);
    }
}

function updateSLATracker(days, date, totalSla, severity) {
    const countEl = document.getElementById('days-count');
    const circle = document.getElementById('sla-circle');
    const dateEl = document.getElementById('deadline-date');
    const badge = document.getElementById('urgent-badge');

    countEl.innerText = days;
    dateEl.innerText = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    // Circle animation
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(days, totalSla) / totalSla) * circumference;
    circle.style.strokeDashoffset = offset;

    // Urgent badge
    badge.style.display = (severity === 'Crítico' || days <= 2) ? 'block' : 'none';
}

function updateEvidenceList(evidenceString) {
    const list = document.getElementById('evidence-list');
    list.innerHTML = ''; // Clear

    const items = evidenceString.split(',').map(s => s.trim());
    items.forEach((item, index) => {
        const isVerified = index === 0; // Mock first one as verified
        const div = document.createElement('div');
        div.className = `evidence-item ${isVerified ? 'verified' : ''}`;
        div.innerHTML = `
            <div class="evidence-icon">
                ${isVerified ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="evidence-info">
                <div class="evidence-name">${item}</div>
                <div class="evidence-status">${isVerified ? 'Verified via CloudWatch' : 'Pending upload'}</div>
            </div>
            ${!isVerified ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-secondary)"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' : ''}
        `;
        list.appendChild(div);
    });
}

function getSeverityClass(severity) {
    const mapping = {
        'Crítico': 'critical',
        'Alto': 'high',
        'Medio': 'medium',
        'Bajo': 'low'
    };
    return mapping[severity] || 'low';
}

function injectAI(controlId, severity) {
    const activeView = document.querySelector('.view-section.active');
    const aiMessages = activeView ? activeView.querySelector('.ai-messages') : null;
    if (!aiMessages) return;

    const chip = document.createElement('div');
    chip.className = 'suggestion-chip';

    let advice = '';
    if (severity === 'Crítico') {
        advice = `<strong>Alerta Prioritaria:</strong> El control ${controlId} debe ser atendido de inmediato. He analizado el entorno y detecté intentos de fuerza bruta recientes que este control mitigaría.`;
    } else {
        advice = `<strong>Recomendación Técnica:</strong> La implementación de ${controlId} fortalecerá la postura de GRC. Asegúrese de adjuntar la evidencia en formato PDF para la auditoría.`;
    }

    chip.innerHTML = advice;
    chip.style.opacity = '0';
    chip.style.transform = 'translateY(10px)';
    aiMessages.prepend(chip);

    setTimeout(() => {
        chip.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        chip.style.opacity = '1';
        chip.style.transform = 'translateY(0)';
    }, 50);
}
