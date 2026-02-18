const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    codigo_proyecto: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, default: '' },
    lider_proyecto: { type: String, default: '' },
    ingeniero_asignado: { type: String, default: '' },
    area: {
        type: String,
        enum: [
            'Auditoría',
            'Comercial Venta Directa',
            'Comercial Venta Indirecta',
            'Financiero Administrativo',
            'Jurídico',
            'Marketing',
            'Operaciones',
            'Regulatorio',
            'Relaciones Institucionales y Sustentabilidad',
            'Servicios y Customer Care',
            'Talento Humano',
            'Tecnología Información y Comunicación'
        ],
        default: 'Tecnología Información y Comunicación'
    },
    fecha_solicitud: { type: Date },
    fecha_emision: { type: Date },
    cumplimiento_global: { type: Number, default: 0, min: 0, max: 100 },
    estado: { type: String, enum: ['Activo', 'En Pausa', 'Completado'], default: 'Activo' },
    fecha_inicio: { type: Date, default: Date.now },
    controles_asignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MasterControl' }],
    hallazgos_abiertos: { type: Number, default: 0 },
    archivos_adjuntos: [{
        nombre: { type: String },
        ruta: { type: String },
        tipo: { type: String },
        fecha_subida: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
