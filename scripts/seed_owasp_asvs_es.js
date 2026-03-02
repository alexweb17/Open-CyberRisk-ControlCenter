const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');

dotenv.config();

const frameworkInfo = {
    name: "OWASP ASVS 5.0.0",
    description: "Estándar de Verificación de Seguridad de Aplicaciones. Un marco de trabajo para validar y probar la seguridad de las aplicaciones web y móviles.",
    version: "5.0.0",
    industry: "Desarrollo / Ciberseguridad"
};

async function seedOWASP() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para seeding de OWASP ASVS (Español)...");

        // Load translated requirements
        const translatedFile = '/tmp/owasp_parsed_es.json';
        if (!fs.existsSync(translatedFile)) {
            console.error("No se encontró el archivo de traducción de OWASP.");
            process.exit(1);
        }
        const requirements = JSON.parse(fs.readFileSync(translatedFile, 'utf8'));

        let framework = await Framework.findOne({ name: frameworkInfo.name });
        
        if (framework) {
            console.log(`El marco ${framework.name} ya existe. Limpiando sus requisitos antiguos...`);
            await FrameworkRequirement.deleteMany({ framework_id: framework._id });
        } else {
            console.log(`Creando el marco ${frameworkInfo.name}...`);
            framework = new Framework(frameworkInfo);
            await framework.save();
        }

        console.log(`Preparando ${requirements.length} controles para insertar...`);

        const reqsToSave = requirements.map(r => ({
            code: r.code,
            domain: r.domain,
            requirement: r.requirement,
            guidance: r.guidance,
            framework_id: framework._id
        }));

        await FrameworkRequirement.insertMany(reqsToSave);
        console.log(`Inserción exitosa de ${reqsToSave.length} controles para ${framework.name}.`);

        console.log("Seeding de OWASP completado satisfactoriamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error durante el seeding de OWASP:", err);
        process.exit(1);
    }
}

seedOWASP();
