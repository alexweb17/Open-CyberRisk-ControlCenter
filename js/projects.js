// projects.js
async function loadProjects() {
    const res = await cyberFetch('/api/projects');
    if (res.ok) {
        const data = await res.json();
        renderProjects(data);
    }
}
// ...
