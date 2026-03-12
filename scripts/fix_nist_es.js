const fs = require('fs');
const translate = require('google-translate-api-x');

const originalFile = '/tmp/nist_parsed.json';
const translatedFile = '/tmp/nist_parsed_es.json';
const failureListFile = '/tmp/nist_failures.txt';

async function translateWithRetry(text, options, retries = 5) {
    if (!text || text.trim() === '') return { text: '' };
    for (let i = 0; i < retries; i++) {
        try {
            const tlds = ['com', 'es', 'cn', 'de', 'fr', 'pt', 'it'];
            const res = await translate(text, { ...options, tld: tlds[i % tlds.length] });
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`  Retry ${i + 1} for: ${text.substring(0, 20)}...`);
            await new Promise(r => setTimeout(r, 3000 * (i + 1)));
        }
    }
}

async function run() {
    const original = JSON.parse(fs.readFileSync(originalFile, 'utf8'));
    const translated = JSON.parse(fs.readFileSync(translatedFile, 'utf8'));
    const failures = fs.readFileSync(failureListFile, 'utf8').split('\n').filter(Boolean);

    console.log(`Fixing ${failures.length} NIST failures...`);

    const translatedMap = {};
    translated.forEach(c => {
        translatedMap[c.code] = c;
    });

    for (const code of failures) {
        console.log(`Fixing ${code}...`);
        const orig = original.find(o => o.code === code);
        if (!orig) continue;

        try {
            const reqRes = await translateWithRetry(orig.requirement, { to: 'es' });
            const guiRes = await translateWithRetry(orig.guidance, { to: 'es' });

            if (translatedMap[code]) {
                translatedMap[code].requirement = reqRes.text;
                translatedMap[code].guidance = guiRes.text;
            } else {
                translatedMap[code] = {
                    ...orig,
                    requirement: reqRes.text,
                    guidance: guiRes.text
                };
            }
            console.log(`  Fixed ${code}`);
        } catch (err) {
            console.error(`  Failed to fix ${code}:`, err.message);
        }
        await new Promise(r => setTimeout(r, 2000));
    }

    // Convert back to array
    const finalData = Object.values(translatedMap);
    fs.writeFileSync(translatedFile, JSON.stringify(finalData, null, 2));
    console.log('Fix complete!');
}

run().catch(console.error);
