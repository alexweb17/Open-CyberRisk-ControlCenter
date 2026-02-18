/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
const msalConfig = {
    auth: {
        clientId: "567c8b34-2f6f-4570-9efa-7b6899cca0fd", // Application (client) ID
        authority: "https://login.microsoftonline.com/4533da84-5b4e-4397-bd68-9cf040c83029", // Directory (tenant) ID
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
    // Scopes for SharePoint REST API directly
    scopes: [
        "User.Read",
        "https://clarocomec.sharepoint.com/AllSites.Read",
        "https://clarocomec.sharepoint.com/AllSites.Write"
    ]
};

/**
 * Add here the endpoints and scopes for custom services you would like to use.
 * The endpoints for SharePoint and Graph API
 */
const apiConfig = {
    sharepointUrl: "https://clarocomec.sharepoint.com/sites/ReportesdeSeguridad", // Updated URL
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphSitesEndpoint: "https://graph.microsoft.com/v1.0/sites"
};
