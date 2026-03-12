// users.js
async function loadUsers() {
    try {
        const response = await cyberFetch('/api/users');
        if (response.ok) {
            usersData = await response.json();
            renderUsersTable(usersData);
        }
    } catch (e) { console.error(e); }
}
// ...
