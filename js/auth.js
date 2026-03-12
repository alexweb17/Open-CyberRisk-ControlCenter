// auth.js
async function cyberFetch(url, options = {}) {
    const token = localStorage.getItem('ccc_token');
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
}
// ... (remaining auth logic)
