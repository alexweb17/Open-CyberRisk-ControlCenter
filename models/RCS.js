const mongoose = require('mongoose');

const ControlAsociadoSchema = new mongoose.Schema({
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterControl' },
    codigo_control: { type: String, required: true },
    estado_control: {
        type: String,
        enum: ['Pendiente', 'En Mitigación', 'Mitigado', 'Aceptado'],
        default: 'Pendiente'
    },
    notas: { type: String, default: '' },
    fecha_agregado: { type: Date, default: Date.now }
});

const RCSSchema = new mongoose.Schema({
    codigo_rcs: { type: String, required: true, unique: true },
    expediente: { type: String, default: '' },
    proyecto_asociado: { type: String, default: '' },
    responsable: { type: String, default: '' },
    estado: {
        type: String,
        enum: ['Pendiente de Revisión', 'En Curso', 'Implementado/Mitigado'],
        default: 'Pendiente de Revisión'
    },
    severidad_maxima: {
        type: String,
        enum: ['Crítica', 'Alta', 'Media', 'Baja', 'N/A'],
        default: 'N/A'
    },
    comentarios_tecnicos: { type: String, default: '' },
    controles_asociados: [ControlAsociadoSchema],
    fecha_limite: { type: Date },
    fecha_registro: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    // Soft delete fields
    deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null }
});

// Calculate severity and progress before saving
RCSSchema.pre('save', function () {
    this.updated_at = Date.now();

    // Calculate max severity from controls
    if (this.controles_asociados && this.controles_asociados.length > 0) {
        const severityOrder = ['Crítica', 'Alta', 'Media', 'Baja'];
        let maxSeverity = 'Baja';
        // We'll need to populate control info to get severity
        // For now, keep the manually set value
    }
});

module.exports = mongoose.model('RCS', RCSSchema);
