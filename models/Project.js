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
            'Marketing',
            'Operaciones',
            'Tecnología de la Información',
            'Legal',
            'Talento Humano',
            'Logística',
            'Financiero',
            'Servicio al Cliente',
            'Relaciones Publicas',
            'Comercial',
            'Auditoría'
        ],
        default: 'Tecnología de la Información'
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
