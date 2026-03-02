const fs = require('fs');
const translate = require('google-translate-api-x');

const inputFile = '/tmp/nist_parsed.json';
const outputFile = '/tmp/nist_parsed_es.json';

const rawData = fs.readFileSync(inputFile, 'utf8');
const controls = JSON.parse(rawData);

async function translateWithRetry(text, options, retries = 3) {
    if (!text || text.trim() === '') return { text: '' };
    for (let i = 0; i < retries; i++) {
        try {
            // Try different TLDs on retry
            const tlds = ['com', 'es', 'cn', 'de'];
            const res = await translate(text, { ...options, tld: tlds[i % tlds.length] });
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`  Retry ${i + 1} for text starting with: ${text.substring(0, 20)}...`);
            await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        }
    }
}

async function run() {
    console.log(`Starting ROBUST translation for ${controls.length} NIST controls...`);
    let translatedControls = [];

    if (fs.existsSync(outputFile)) {
        try {
            translatedControls = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
            console.log(`Resuming from ${translatedControls.length} already translated.`);
        } catch (e) { }
    }

    const uniqueDomains = [...new Set(controls.map(c => c.domain))];
    const domainTranslations = {};
    console.log(`Translating ${uniqueDomains.length} unique domains...`);

    for (const domain of uniqueDomains) {
        try {
            const res = await translateWithRetry(domain, { to: 'es' });
            domainTranslations[domain] = res.text;
        } catch (err) {
            domainTranslations[domain] = domain;
        }
    }

    const startIndex = translatedControls.length;
    for (let i = startIndex; i < controls.length; i++) {
        const c = controls[i];
        console.log(`NIST [${i + 1}/${controls.length}]: Translating ${c.code}`);

        try {
            const translatedC = { ...c };
            translatedC.domain = domainTranslations[c.domain] || c.domain;

            const reqRes = await translateWithRetry(c.requirement, { to: 'es' });
            translatedC.requirement = reqRes.text;

            const guiRes = await translateWithRetry(c.guidance, { to: 'es' });
            translatedC.guidance = guiRes.text;

            translatedControls.push(translatedC);

            // Save every 5 controls to be safe
            if (i % 5 === 0) {
                fs.writeFileSync(outputFile, JSON.stringify(translatedControls, null, 2));
            }

            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error(`CRITICAL failure for control ${c.code}:`, err.message);
            // Push untranslated to keep progress index consistent if we decide to skip
            translatedControls.push({ ...c, domain: domainTranslations[c.domain] || c.domain });
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(translatedControls, null, 2));
    console.log('NIST translation complete!');
}

run().catch(console.error);
