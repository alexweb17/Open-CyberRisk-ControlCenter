/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
const msalConfig = {
    auth: {
        clientId: "TU_CLIENT_ID_AQUI", // Reemplazar con el Application (client) ID de Azure
        authority: "https://login.microsoftonline.com/TU_TENANT_ID_AQUI", // Reemplazar con el Directory (tenant) ID de Azure
        redirectUri: window.location.origin, // Asegúrate de que esta URL esté registrada en Azure
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
const loginRequest = {
    scopes: ["User.Read", "Sites.Read.All", "Sites.ReadWrite.All"]
};

/**
 * Add here the endpoints and scopes for custom services you would like to use.
 * The endpoints for SharePoint and Graph API
 */
const apiConfig = {
    sharepointUrl: "https://TU_TENANT.sharepoint.com/sites/TU_SITIO", // Reemplazar con la URL de tu sitio
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphSitesEndpoint: "https://graph.microsoft.com/v1.0/sites"
};
