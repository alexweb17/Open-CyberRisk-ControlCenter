const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MasterControl = require('../models/MasterControl');

dotenv.config();

const migrations = [
    { old: "Cumplimiento Normativo y Contractual", new: "Cumplimiento Normativo" },
    { old: "Data Sensible y Transacciones Críticas", new: "Datos Personales" },
    { old: "Integraciones", new: "Integraciones a Sistemas" },
    { old: "Lineamientos de Seguridad (Infraestructura y Aplicaciones)", new: "Infraestructura" }
];

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para migración de dominios...");

        for (const m of migrations) {
            const result = await MasterControl.updateMany(
                { dominio: m.old },
                { $set: { dominio: m.new } }
            );
            console.log(`Migrado: "${m.old}" -> "${m.new}" (${result.modifiedCount} registros)`);
        }

        console.log("Migración de dominios completada satisfactoriamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error durante la migración:", err);
        process.exit(1);
    }
}

migrate();
