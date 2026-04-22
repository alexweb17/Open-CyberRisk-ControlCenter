const mongoose = require('mongoose');

const ControlAsociadoSchema = new mongoose.Schema({
    control_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    tipo_fuente: { type: String, enum: ['MasterControl', 'FrameworkRequirement'], required: true },
    codigo_control: { type: String, required: true },
    estado_control: { type: String, enum: ['Pendiente', 'En Mitigación', 'Mitigado', 'Aceptado'], default: 'Pendiente' },
    notas: { type: String, default: '' },
    agregado_en: { type: Date, default: Date.now }
}, { _id: false });

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
    // Financial Quantification (FAIR-lite)
    valor_activo: { type: Number, default: 0 }, // Asset Value ($)
    ef_factor_exposicion: { type: Number, default: 0 }, // Exposure Factor (%) 0-1
    aro_tasa_ocurrencia: { type: Number, default: 0 }, // Annualized Rate of Occurrence
    ale_expectativa_perdida: { type: Number, default: 0 }, // Calculated ALE

    fecha_identificacion: { type: Date, default: Date.now },
    fecha_proxima_revision: { type: Date },
    controles_asociados: [ControlAsociadoSchema],
    comentarios: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    // Soft delete fields
    deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null }
});

ProcesoNegocioSchema.pre('save', function () {
    this.updated_at = Date.now();

    // Calculate ALE: Expectativa de Pérdida Anualizada
    // ALE = Valor Activo * Factor de Exposición * Tasa Anual de Ocurrencia
    this.ale_expectativa_perdida = (this.valor_activo || 0) * (this.ef_factor_exposicion || 0) * (this.aro_tasa_ocurrencia || 0);
});

module.exports = mongoose.model('ProcesoNegocio', ProcesoNegocioSchema);
