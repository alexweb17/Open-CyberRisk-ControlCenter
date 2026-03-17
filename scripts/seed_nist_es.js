const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');

dotenv.config();

// Load the parsed NIST controls from the temp file (Spanish version)
const nistDataFile = '/tmp/nist_parsed_es.json';
let nistControls = [];
try {
    if (fs.existsSync(nistDataFile)) {
        nistControls = JSON.parse(fs.readFileSync(nistDataFile, 'utf8'));
    } else {
        console.error('El archivo de traducción NIST aún no existe.');
        process.exit(1);
    }
} catch (err) {
    console.error('Error al leer el archivo de controles NIST traducidos:', err);
    process.exit(1);
}

const nistFrameworkInfo = {
    name: "NIST SP 800-53 Rev. 5",
    description: "Catálogo exhaustivo de controles de seguridad y privacidad para organizaciones y sistemas de información federales y de infraestructura crítica.",
    version: "Revision 5",
    industry: "Gobierno / Federal / Infraestructura Crítica"
};

async function seedNIST() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para seeding de NIST SP 800-53 r5 (Español)...");

        let framework = await Framework.findOne({ name: nistFrameworkInfo.name });

        if (framework) {
            console.log(`El marco ${framework.name} ya existe. Limpiando sus requisitos antiguos...`);
            await FrameworkRequirement.deleteMany({ framework_id: framework._id });
        } else {
            console.log(`Creando el marco ${nistFrameworkInfo.name}...`);
            framework = new Framework(nistFrameworkInfo);
            await framework.save();
        }

        console.log(`Preparando ${nistControls.length} controles para insertar...`);

        const reqsToSave = [];
        const seenCodes = new Set();

        for (const r of nistControls) {
            if (!seenCodes.has(r.code)) {
                seenCodes.add(r.code);
                reqsToSave.push({
                    code: r.code,
                    domain: r.domain,
                    requirement: r.requirement,
                    guidance: r.guidance,
                    framework_id: framework._id
                });
            }
        }

        await FrameworkRequirement.insertMany(reqsToSave);
        console.log(`Inserción exitosa de ${reqsToSave.length} controles para ${framework.name}.`);

        console.log("Seeding de NIST completado satisfactoriamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error durante el seeding de NIST:", err);
        process.exit(1);
    }
}

seedNIST();
