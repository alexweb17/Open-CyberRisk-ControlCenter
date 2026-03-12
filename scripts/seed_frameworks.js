const mongoose = require('mongoose');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');
require('dotenv').config();

const frameworksData = [
    {
        name: "ISO/IEC 27001:2022",
        description: "Estándar internacional para sistemas de gestión de seguridad de la información (SGSI).",
        version: "2022",
        industry: "Multi-sector",
        requirements: [
            { code: "A.5.1", domain: "Políticas de Seguridad", requirement: "Se han definido y aprobado políticas para la seguridad de la información.", guidance: "Asegurar que la dirección apoye y establezca el marco para la seguridad." }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB...");

        for (const f of frameworksData) {
            const fw = await Framework.findOneAndUpdate(
                { name: f.name },
                { ...f },
                { upsert: true, new: true }
            );
            
            for (const r of f.requirements) {
                await FrameworkRequirement.findOneAndUpdate(
                    { framework_id: fw._id, code: r.code },
                    { ...r, framework_id: fw._id },
                    { upsert: true }
                );
            }
        }

        console.log("Framework seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
