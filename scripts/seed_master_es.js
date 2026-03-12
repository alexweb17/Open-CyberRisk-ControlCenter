const { execSync } = require('child_process');

console.log("=== Iniciando Proceso Maestro de Seeding ===");

function runScript(name) {
    console.log(`\n--- Ejecutando ${name} ---`);
    try {
        const out = execSync(`node scripts/${name}`, { encoding: 'utf8' });
        console.log(out);
    } catch (e) {
        console.error(`Error al ejecutar ${name}:`, e.message);
    }
}

// Orden de ejecución:
// 1. seed_frameworks.js (modo no-destructivo: crea frameworks base sin borrar datos existentes)
// 2. Scripts individuales con datos completos (reemplazan los controles base):
runScript('seed_frameworks.js');
runScript('seed_iso27001.js');
runScript('seed_owasp_asvs.js');
runScript('seed_pcidss.js');

console.log("\n=== Seeding Maestro Completado! ===");
