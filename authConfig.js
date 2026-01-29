const msalConfig = {
    auth: {
        clientId: "your_client_id_here",
        authority: "https://login.microsoftonline.com/your_tenant_id_here",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
};

const tokenRequest = {
    scopes: ["User.Read", "Mail.Read"]
};
