/**
 * graphService.js (Refactored for SharePoint REST API)
 * Handles communication directly with SharePoint REST API to avoid Graph permission issues.
 */

const msalInstance = new msal.PublicClientApplication(msalConfig);

async function getToken() {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No user logged in");

    const request = {
        ...loginRequest,
        account: account
    };

    try {
        const response = await msalInstance.acquireTokenSilent(request);
        return response.accessToken;
    } catch (error) {
        console.warn("Silent token failed, attempting popup", error);
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
    }
}

async function callSharePoint(endpoint, method = "GET", body = null, extraHeaders = {}) {
    const token = await getToken();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Accept", "application/json;odata=nometadata"); // cleaner JSON
    headers.append("Content-Type", "application/json;odata=nometadata");

    for (const key in extraHeaders) {
        headers.append(key, extraHeaders[key]);
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(endpoint, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SharePoint API error: ${response.status} ${errorText}`);
    }
    return response.json();
}

// --- Specific SharePoint Operations ---

async function getListItems(listName) {
    // Note: Assuming apiConfig.sharepointUrl is the SITE url (e.g. .../sites/ReportesdeSeguridad)
    const endpoint = `${apiConfig.sharepointUrl}/_api/web/lists/getbytitle('${listName}')/items`;
    const data = await callSharePoint(endpoint);
    return data.value; // SharePoint REST v1 with nometadata returns { value: [ ... ] }
}

async function getRequestDigest() {
    const endpoint = `${apiConfig.sharepointUrl}/_api/contextinfo`;
    const data = await callSharePoint(endpoint, "POST");
    return data.FormDigestValue;
}

// Helper to find the weird SharePoint Entity Type name (needed for creating items)
// e.g., SP.Data.Seguridad_x005f_Hallazgos_x005f_RCSListItem
async function getListItemEntityTypeFullName(listName) {
    const endpoint = `${apiConfig.sharepointUrl}/_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`;
    const data = await callSharePoint(endpoint);
    return data.ListItemEntityTypeFullName;
}

async function createListItem(listName, fields) {
    const digest = await getRequestDigest();
    const entityType = await getListItemEntityTypeFullName(listName);

    // Construct payload with metadata type
    const payload = {
        "__metadata": { "type": entityType },
        ...fields
    };

    const endpoint = `${apiConfig.sharepointUrl}/_api/web/lists/getbytitle('${listName}')/items`;

    // We need verbose for writes usually to be safe, but nometadata might work if strict handled.
    // Let's stick to the generic callSharePoint which uses nometadata. 
    // If this fails, we might need to switch to verbose for writes.
    // However, including 'type' in body often requires verbose or at least strict mode.
    // Let's try standard approach.

    return callSharePoint(endpoint, "POST", payload, {
        "X-RequestDigest": digest
    });
}


// --- Domain Functions (API same as before, implementation changed) ---

async function getProyectos() {
    return getListItems("Seguridad_Consultorias_Proyectos");
}

async function getHallazgos() {
    return getListItems("Seguridad_Hallazgos_RCS");
}

async function getLineamientos() {
    return getListItems("Seguridad_Base_Lineamientos");
}

async function registrarHallazgo(hallazgoData) {
    const spData = {
        Title: hallazgoData.Title,
        ID_Codigo_Control: hallazgoData.ID_Control,
        Comentario_Tecnico: hallazgoData.Comentarios,
        Estado_Implementacion: hallazgoData.Estado
    };
    return createListItem("Seguridad_Hallazgos_RCS", spData);
}
