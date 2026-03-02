const { execSync } = require('child_process');

console.log("===Starting Master Seeding Process (Spanish Edition)===");

function runScript(name) {
    console.log(`\n--- Running ${name} ---`);
    try {
        const out = execSync(`node scripts/${name}`, { encoding: 'utf8' });
        console.log(out);
    } catch (e) {
        console.error(`Error running ${name}:`, e.message);
    }
}

// Order matters: 
// 1. Base frameworks (ISO/PCI) -> Warning: seed_frameworks.js is destructive.
// 2. Full NIST
// 3. Full OWASP

// Let's modify seed_frameworks.js behavior by running it first
runScript('seed_frameworks.js');
runScript('seed_nist_es.js');
runScript('seed_owasp_asvs_es.js');

console.log("\n===All Seeding Complete!===");
