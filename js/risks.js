async function loadRiskDashboard() {
    try {
        const resp = await cyberFetch('/api/risks/dashboard');
        const data = await resp.json();

        renderTopCritical(data.topCritical, data.severityCounts);
        renderTopOldest(data.topOldest);
        renderHeatMap(data.heatMap);
        renderSeverityDistribution(data.severityCounts);
        renderEstadoDistribution(data.inventory);
        renderRiskInventory(data.inventory);

        // Update counts
        document.getElementById('total-risks-count').textContent = data.inventory.length;
        document.getElementById('critical-risks-count').textContent = data.severityCounts['Crítica'] || 0;
        document.getElementById('expired-sla-count').textContent = data.inventory.filter(r => r.sla_vencido).length;
    } catch (err) {
        console.error('Error loading risk dashboard:', err);
    }
}
