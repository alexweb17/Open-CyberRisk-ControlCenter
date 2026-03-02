const fs = require('fs');
const translate = require('google-translate-api-x');

const inputFile = '/tmp/owasp_parsed.json';
const outputFile = '/tmp/owasp_parsed_es.json';

const rawData = fs.readFileSync(inputFile, 'utf8');
const reqs = JSON.parse(rawData);

async function translateWithRetry(text, options, retries = 3) {
    if (!text || text.trim() === '') return { text: '' };
    for (let i = 0; i < retries; i++) {
        try {
            const tlds = ['com', 'es', 'cn', 'de', 'fr'];
            const res = await translate(text, { ...options, tld: tlds[i % tlds.length] });
            return res;
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        }
    }
}

async function run() {
    console.log(`Starting ROBUST translation for ${reqs.length} OWASP requirements...`);
    let translatedReqs = [];

    if (fs.existsSync(outputFile)) {
        try {
            translatedReqs = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
            console.log(`Resuming OWASP from ${translatedReqs.length}`);
        } catch (e) { }
    }

    const uniqueDomains = [...new Set(reqs.map(c => c.domain))];
    const domainTranslations = {};
    console.log(`Translating ${uniqueDomains.length} unique domains for OWASP...`);
    for (let j = 0; j < uniqueDomains.length; j++) {
        const domain = uniqueDomains[j];
        process.stdout.write(`Domain [${j + 1}/${uniqueDomains.length}]: ${domain.substring(0, 30)}... `);
        try {
            const res = await translateWithRetry(domain, { to: 'es' });
            domainTranslations[domain] = res.text;
            console.log("OK");
        } catch (err) {
            domainTranslations[domain] = domain;
            console.log("FAIL (skipped)");
        }
        await new Promise(r => setTimeout(r, 200));
    }

    const startIndex = translatedReqs.length;
    for (let i = startIndex; i < reqs.length; i++) {
        const r = reqs[i];
        console.log(`OWASP [${i + 1}/${reqs.length}]: Translating ${r.code}`);

        try {
            const translatedR = { ...r };
            translatedR.domain = domainTranslations[r.domain] || r.domain;

            if (r.requirement && r.requirement.toLowerCase().includes('level')) {
                translatedR.requirement = r.requirement.replace(/Level/i, 'Nivel');
            } else if (r.requirement) {
                const reqRes = await translateWithRetry(r.requirement, { to: 'es' });
                translatedR.requirement = reqRes.text;
            }

            const guiRes = await translateWithRetry(r.guidance, { to: 'es' });
            translatedR.guidance = guiRes.text;

            translatedReqs.push(translatedR);

            if (i % 5 === 0) {
                fs.writeFileSync(outputFile, JSON.stringify(translatedReqs, null, 2));
            }

            await new Promise(r => setTimeout(r, 1500));
        } catch (err) {
            console.error(`OWASP failure for ${r.code}:`, err.message);
            translatedReqs.push({ ...r, domain: domainTranslations[r.domain] || r.domain });
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(translatedReqs, null, 2));
    console.log('OWASP translation complete!');
}

run().catch(console.error);
