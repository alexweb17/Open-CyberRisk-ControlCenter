/**
 * graphService.js
 * Handles all communication with Microsoft Graph API using MSAL for tokens.
 */

const msalInstance = new msal.PublicClientApplication(msalConfig);

async function getGraphToken() {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) {
        throw new Error("No user logged in");
    }

    const silentRequest = {
        ...loginRequest,
        account: account
    };

    try {
        const response = await msalInstance.acquireTokenSilent(silentRequest);
        return response.accessToken;
    } catch (error) {
        console.warn("Silent token acquisition failed, attempting popup", error);
        const response = await msalInstance.acquireTokenPopup(loginRequest);
        return response.accessToken;
    }
}

async function callGraph(endpoint, method = "GET", data = null) {
    const token = await getGraphToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    const options = {
        method: method,
        headers: headers
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Graph API error: ${response.status} ${errorText}`);
    }
    return response.json();
}

/**
 * Helper to get the Site ID from the SharePoint URL
 */
async function getSiteId() {
    // Expected URL format: https://tenant.sharepoint.com/sites/SiteName
    const url = new URL(apiConfig.sharepointUrl);
    const hostname = url.hostname;
    const path = url.pathname;

    const endpoint = `${apiConfig.graphSitesEndpoint}/${hostname}:${path}`;
    const result = await callGraph(endpoint);
    return result.id;
}

/**
 * SharePoint Data Fetchers
 */

async function getListItems(listName) {
    const siteId = await getSiteId();
    const endpoint = `${apiConfig.graphSitesEndpoint}/${siteId}/lists/${listName}/items?expand=fields`;
    const result = await callGraph(endpoint);
    return result.value.map(item => ({
        id: item.id,
        ...item.fields
    }));
}

async function createListItem(listName, fields) {
    const siteId = await getSiteId();
    const endpoint = `${apiConfig.graphSitesEndpoint}/${siteId}/lists/${listName}/items`;
    const data = { fields: fields };
    return callGraph(endpoint, "POST", data);
}

// Specific Domain Functions
async function getProyectos() {
    return getListItems("Proyectos"); // Asegúrate de que la lista se llame exactamente así
}

async function getHallazgos() {
    return getListItems("Hallazgos");
}

async function getLineamientos() {
    return getListItems("Lineamientos");
}

async function registrarHallazgo(hallazgoData) {
    return createListItem("Hallazgos", hallazgoData);
}
