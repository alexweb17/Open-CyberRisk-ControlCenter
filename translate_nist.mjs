import fs from 'fs';
import translate from 'google-translate-api-x';

const inputFile = '/tmp/nist_parsed.json';
const outputFile = '/tmp/nist_parsed_es.json';

const rawData = fs.readFileSync(inputFile, 'utf8');
const controls = JSON.parse(rawData);

// We need to translate requirement and guidance for each control.
// And domain as well. We'll translate Domain, Requirement, Guidance.
// Batch size 10 controls (30 strings per batch)

async function run() {
    console.log(`Starting translation for ${controls.length} controls...`);
    const translatedControls = [];

    // Let's get unique domains first to translate them once
    const uniqueDomains = [...new Set(controls.map(c => c.domain))];
    const domainTranslations = {};
    console.log(`Translating ${uniqueDomains.length} unique domains...`);
    for (let i = 0; i < uniqueDomains.length; i += 10) {
        const batch = uniqueDomains.slice(i, i + 10);
        try {
            const res = await translate(batch, { to: 'es' });
            // res is an array if batch > 1, or single object if batch == 1
            const resArray = Array.isArray(res) ? res : [res];
            batch.forEach((domain, idx) => {
                domainTranslations[domain] = resArray[idx].text;
            });
            console.log(`Translated domains batch ${i / 10 + 1}`);
        } catch (err) {
            console.error('Domain translation failed:', err);
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    const batchSize = 10;
    for (let i = 0; i < controls.length; i += batchSize) {
        const batch = controls.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(controls.length / batchSize)}`);

        const stringsToTranslate = [];
        for (const c of batch) {
            stringsToTranslate.push(c.requirement);
            stringsToTranslate.push(c.guidance);
        }

        try {
            const res = await translate(stringsToTranslate, { to: 'es' });
            const resArray = Array.isArray(res) ? res : [res];

            let resIdx = 0;
            for (const c of batch) {
                const translatedC = { ...c };
                translatedC.domain = domainTranslations[c.domain] || c.domain;
                translatedC.requirement = resArray[resIdx++].text;
                translatedC.guidance = resArray[resIdx++].text;
                translatedControls.push(translatedC);
            }
        } catch (err) {
            console.error('Batch failed, retrying one by one in this batch', err);
            // fallback
            for (const c of batch) {
                try {
                    const translatedC = { ...c };
                    translatedC.domain = domainTranslations[c.domain] || c.domain;
                    const reqRes = await translate(c.requirement, { to: 'es' });
                    translatedC.requirement = reqRes.text;
                    const guiRes = await translate(c.guidance, { to: 'es' });
                    translatedC.guidance = guiRes.text;
                    translatedControls.push(translatedC);
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error(`Failed control ${c.code}`, e);
                    translatedControls.push(c); // push original
                }
            }
        }
        fs.writeFileSync(outputFile, JSON.stringify(translatedControls, null, 2));
        await new Promise(r => setTimeout(r, 1500)); // sleep 1.5s
    }

    console.log('Done!');
}

run();
