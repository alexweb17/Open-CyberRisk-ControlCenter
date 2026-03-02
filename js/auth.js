// --- MSAL Initialization ---
const msalInstance = new msal.PublicClientApplication(msalConfig);

// --- Authentication Logic ---
async function login() {
    try {
        await msalInstance.loginPopup(loginRequest);
        checkUser();
        // After login, we could trigger data loading if needed
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
