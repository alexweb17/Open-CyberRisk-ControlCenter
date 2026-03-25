const fs = require('fs');
const path = require('path');

/**
 * Parses NIST SP 800-53 Markdown format.
 * Expected structure:
 * ## [Domain Name]
 * - **[Code]--[Title]:** [Content]
 */
function parseNIST(filePath) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const requirements = [];
    let currentDomain = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Match Domain (## Domain)
        const domainMatch = line.match(/^##\s+(.+)$/);
        if (domainMatch) {
            currentDomain = domainMatch[1].trim();
            continue;
        }

        // Match Control Code (- **AC-1--TITLE:** Content)
        const controlMatch = line.match(/^-\s+\*\*\s*(.+?)--(.+?):\*\*\s*(.*)$/);
        if (controlMatch) {
            requirements.push({
                code: controlMatch[1].trim(),
                domain: currentDomain,
                requirement: `${controlMatch[2].trim()}\n\n${controlMatch[3].trim()}`.trim(),
                guidance: ''
            });
        }
    }

    return requirements;
}

/**
 * Parses OWASP ASVS Markdown format.
 * Expected structure:
 * ## [Domain Name]
 * - **[Category]**
 *   - **[Code]:** [Content]
 */
function parseASVS(filePath) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const requirements = [];
    let currentDomain = '';
    let currentCategory = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Match Domain (## V1 Domain)
        const domainMatch = line.match(/^##\s+(.+)$/);
        if (domainMatch) {
            currentDomain = domainMatch[1].trim();
            continue;
        }

        // Match Category (- **V1.1 – Category**)
        const categoryMatch = line.match(/^-\s+\*\*(.+?)\*\*$/);
        if (categoryMatch) {
            currentCategory = categoryMatch[1].trim();
            continue;
        }

        // Match Requirement (- **1.1.1:** Content)
        const reqMatch = line.match(/^\s*-\s+\*\*(.+?):\*\*\s+(.+)$/);
        if (reqMatch) {
            requirements.push({
                code: reqMatch[1].trim(),
                domain: `${currentDomain}${currentCategory ? ' - ' + currentCategory : ''}`,
                requirement: reqMatch[2].trim(),
                guidance: ''
            });
        }
    }

    return requirements;
}

module.exports = {
    parseNIST,
    parseASVS
};
