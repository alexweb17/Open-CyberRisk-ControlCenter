const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');
const MasterControl = require('../models/MasterControl');
const mongoose = require('mongoose');
require('dotenv').config();

const masterControls = [
    {
        codigo_control: "CYB-01",
        lineamiento: "Gestión de Activos de Información",
        dominio: "Gobernanza y Gestión de Riesgos",
        recomendacion: "Mantener un inventario actualizado de todos los activos de información físicos y lógicos.",
        sla_dias: 30,
        severidad: "Media",
        guia_evidencia: "Inventario de activos firmado por el CISO."
    },
    {
        codigo_control: "CYB-02",
        lineamiento: "Control de Acceso Lógico",
        dominio: "Seguridad de Identidad y Acceso",
        recomendacion: "Implementar el principio de mínimo privilegio y revisión trimestral de accesos.",
        sla_dias: 15,
        severidad: "Alta",
        guia_evidencia: "Logs de acceso y bitácora de revisión de privilegios."
    }
];

async function seedMaster() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB...");

        for (const ctrl of masterControls) {
            await MasterControl.findOneAndUpdate(
                { codigo_control: ctrl.codigo_control },
                ctrl,
                { upsert: true, new: true }
            );
        }

        console.log("Seeding de Master Controls (Español) completado.");
        process.exit(0);
    } catch (err) {
        console.error("Error en seed:", err);
        process.exit(1);
    }
}

seedMaster();
