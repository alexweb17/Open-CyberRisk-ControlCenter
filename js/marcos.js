let allFrameworks = [];
let currentRequirements = [];

const fwColors = {
    'iso': { accent: '#3B82F6', bg: '#EFF6FF', text: '#1E40AF', emoji: '🔒' },
    'nist': { accent: '#10B981', bg: '#ECFDF5', text: '#065F46', emoji: '🛡️' },
    'pci': { accent: '#6366F1', bg: '#EEF2FF', text: '#3730A3', emoji: '💳' },
    'soc': { accent: '#F59E0B', bg: '#FFFBEB', text: '#92400E', emoji: '☁️' },
    'owasp': { accent: '#D83B01', bg: '#FDF2EB', text: '#7A2201', emoji: '🌐' }
};

function getFrameworkTheme(name) {
    const n = name.toLowerCase();
    if (n.includes('iso')) return fwColors.iso;
    if (n.includes('nist')) return fwColors.nist;
    if (n.includes('pci')) return fwColors.pci;
    if (n.includes('soc')) return fwColors.soc;
    if (n.includes('owasp')) return fwColors.owasp;
    return fwColors.iso;
}

async function loadFrameworks() {
    try {
        const response = await cyberFetch('/api/frameworks');
        allFrameworks = await response.json();

        const selector = document.getElementById('framework-selector');
        selector.innerHTML = '<option value="">-- Seleccione un marco --</option>' +
            allFrameworks.map(f => `<option value="${f._id}">${f.name}</option>`).join('');

        renderFrameworkOverviewCards();
        renderSidebarList();
    } catch (err) {
        console.error('Error al cargar marcos:', err);
    }
}

function renderFrameworkOverviewCards() {
    const container = document.getElementById('frameworks-overview');
    if (!container || allFrameworks.length === 0) return;

    container.innerHTML = allFrameworks.map(f => {
        const theme = getFrameworkTheme(f.name);
        return `
        <div class="glass card-hover" onclick="selectFramework('${f._id}')"
            style="padding: 20px; cursor: pointer; border-top: 4px solid ${theme.accent}; text-align: center; transition: all 0.2s;">
            <div style="font-size: 2rem; margin-bottom: 10px;">${theme.emoji}</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: ${theme.text}; margin-bottom: 4px;">${f.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${f.industry || 'General'}</div>
        </div>`;
    }).join('');
}

function renderSidebarList() {
    const container = document.getElementById('marcos-sidebar-list');
    if (!container) return;

    container.innerHTML = allFrameworks.map(f => {
        const theme = getFrameworkTheme(f.name);
        return `
        <div onclick="selectFramework('${f._id}')" style="display: flex; align-items: center; gap: 10px; padding: 10px 4px; cursor: pointer; border-bottom: 1px solid var(--border-color); transition: background 0.15s;" onmouseover="this.style.background='${theme.bg}'" onmouseout="this.style.background='transparent'">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${theme.accent}; flex-shrink: 0;"></span>
            <div>
                <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">${f.name}</div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">${f.version || ''}</div>
            </div>
        </div>`;
    }).join('');
}

function selectFramework(frameworkId) {
    const selector = document.getElementById('framework-selector');
    selector.value = frameworkId;
    loadFrameworkRequirements();
}

async function loadFrameworkRequirements() {
    const frameworkId = document.getElementById('framework-selector').value;
    const detailsDiv = document.getElementById('framework-details');
    const grid = document.getElementById('requirements-grid');

    if (!frameworkId) {
        detailsDiv.style.display = 'none';
        grid.innerHTML = '';
        document.getElementById('marcos-total-badge').textContent = '0 Requisitos';
        document.getElementById('domain-filter').innerHTML = '<option value="">Todos los dominios</option>';
        document.getElementById('marcos-domain-distribution').innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 20px; font-size: 0.85rem;">Seleccione un marco para ver la distribución</div>';
        return;
    }

    try {
        const framework = allFrameworks.find(f => f._id === frameworkId);
        const theme = getFrameworkTheme(framework.name);

        // Update banner
        document.getElementById('framework-name-display').textContent = framework.name;
        document.getElementById('framework-name-display').style.color = theme.text;
        document.getElementById('framework-desc-display').textContent = framework.description;
        detailsDiv.style.display = 'block';
        detailsDiv.style.borderLeftColor = theme.accent;
        detailsDiv.style.background = `linear-gradient(135deg, ${theme.bg}, #F8FAFC)`;

        const response = await cyberFetch(`/api/frameworks/${frameworkId}/requirements`);
        currentRequirements = await response.json();

        // Update count
        document.getElementById('framework-req-count').textContent = currentRequirements.length;
        document.getElementById('framework-req-count').style.color = theme.accent;
        document.getElementById('marcos-total-badge').textContent = `${currentRequirements.length} Requisitos`;

        // Populate domain filter
        const domains = [...new Set(currentRequirements.map(r => r.domain).filter(Boolean))].sort();
        const domainFilter = document.getElementById('domain-filter');
        domainFilter.innerHTML = '<option value="">Todos los dominios</option>' +
            domains.map(d => `<option value="${d}">${d}</option>`).join('');

        // Update sidebar domain distribution
        updateDomainDistribution(theme);

        // Clear search
        document.getElementById('requirement-search').value = '';

        renderRequirements(currentRequirements);
    } catch (err) {
        console.error('Error al cargar requisitos:', err);
    }
}

function updateDomainDistribution(theme) {
    const container = document.getElementById('marcos-domain-distribution');
    if (!container) return;

    const domainCounts = {};
    currentRequirements.forEach(r => {
        const d = r.domain || 'Sin dominio';
        domainCounts[d] = (domainCounts[d] || 0) + 1;
    });

    const sorted = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]);
    container.innerHTML = sorted.map(([domain, count]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 4px; border-bottom: 1px solid var(--border-color);">
            <span style="font-size: 0.8rem; color: var(--text-primary); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${domain}">${domain}</span>
            <span style="background: ${theme.bg}; color: ${theme.text}; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">${count}</span>
        </div>
    `).join('');
}

function renderRequirements(requirements) {
    const grid = document.getElementById('requirements-grid');
    if (requirements.length === 0) {
        grid.innerHTML = `
            <div class="glass" style="grid-column: 1/-1; text-align: center; padding: 60px; border: 1px dashed var(--border-color);">
                <div style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">No se encontraron requisitos</h3>
                <p style="color: var(--text-secondary);">Intenta ajustar los criterios de búsqueda o selecciona otro marco.</p>
            </div>`;
        return;
    }

    const frameworkSelector = document.getElementById('framework-selector');
    const selectedText = frameworkSelector.options[frameworkSelector.selectedIndex].text.toLowerCase();
    const theme = getFrameworkTheme(selectedText);

    grid.innerHTML = requirements.map(req => `
        <div class="glass card-hover" style="padding: 24px; position: relative; overflow: hidden; border-top: 4px solid ${theme.accent}; display: flex; flex-direction: column; width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 20px;">
                <span style="font-weight: 800; color: ${theme.accent}; font-size: 1.25rem; letter-spacing: -0.02em; white-space: nowrap;">${req.code}</span>
                <span style="font-size: 0.7rem; background: ${theme.bg}; color: ${theme.text}; padding: 4px 10px; border-radius: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">${req.domain}</span>
            </div>
            <h4 style="margin: 0 0 16px 0; line-height: 1.5; font-weight: 600; color: var(--text-primary); font-size: 1.1rem;">${req.requirement}</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.02); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="font-weight: 700; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">Descripción / Guía</div>
                <div style="line-height: 1.6;">${req.guidance}</div>
            </div>
        </div>
    `).join('');
}

function filterRequirements() {
    const query = document.getElementById('requirement-search').value.toLowerCase();
    const domainFilter = document.getElementById('domain-filter')?.value || '';

    let filtered = currentRequirements;

    if (domainFilter) {
        filtered = filtered.filter(req => req.domain === domainFilter);
    }

    if (query) {
        filtered = filtered.filter(req =>
            req.code.toLowerCase().includes(query) ||
            req.domain.toLowerCase().includes(query) ||
            req.requirement.toLowerCase().includes(query) ||
            req.guidance.toLowerCase().includes(query)
        );
    }

    renderRequirements(filtered);
}

// Initial load if section is active (handled by main.js)
function initMarcos() {
    loadFrameworks();
}
