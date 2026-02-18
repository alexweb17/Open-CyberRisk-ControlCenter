const mongoose = require('mongoose');

const ProcesoNegocioSchema = new mongoose.Schema({
    codigo_proceso: { type: String, required: true, unique: true },
    nombre_proceso: { type: String, required: true },
    tipo_revision: {
        type: String,
        enum: ['Revisión Periódica', 'Cambio Mayor', 'Nuevo Proceso', 'Incidente Relacionado'],
        default: 'Revisión Periódica'
    },
    descripcion: { type: String, default: '' },
    area_responsable: {
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
    responsable: { type: String, default: '' },
    estado: {
        type: String,
        enum: ['Identificado', 'En Evaluación', 'En Tratamiento', 'Monitoreado', 'Cerrado'],
        default: 'Identificado'
    },
    nivel_riesgo: {
        type: String,
        enum: ['Crítico', 'Alto', 'Medio', 'Bajo'],
        default: 'Medio'
    },
    impacto_negocio: {
        type: String,
        enum: ['Catastrófico', 'Mayor', 'Moderado', 'Menor', 'Insignificante'],
        default: 'Moderado'
    },
    probabilidad: {
        type: String,
        enum: ['Muy Alta', 'Alta', 'Media', 'Baja', 'Muy Baja'],
        default: 'Media'
    },
    descripcion_riesgo: { type: String, default: '' },
    plan_tratamiento: { type: String, default: '' },
    fecha_identificacion: { type: Date, default: Date.now },
    fecha_proxima_revision: { type: Date },
    controles_asociados: [{ type: String }],
    comentarios: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    // Soft delete fields
    deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null }
});

ProcesoNegocioSchema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('ProcesoNegocio', ProcesoNegocioSchema);
