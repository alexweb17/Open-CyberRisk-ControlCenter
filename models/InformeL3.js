const mongoose = require('mongoose');

const InformeL3Schema = new mongoose.Schema({
    codigo_informe: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    tipo: {
        type: String,
        enum: ['Incidente de Seguridad', 'Vulnerabilidad Crítica', 'Hallazgo de Auditoría', 'Evento de Riesgo'],
        default: 'Incidente de Seguridad'
    },
    descripcion: { type: String, default: '' },
    origen: {
        type: String,
        enum: ['SOC', 'Auditoría Interna', 'Auditoría Externa', 'Monitoreo', 'Pentest', 'Revisión Interna', 'Otro'],
        default: 'Monitoreo'
    },
    severidad: {
        type: String,
        enum: ['Crítica', 'Alta', 'Media', 'Baja'],
        default: 'Media'
    },
    estado_atencion: {
        type: String,
        enum: ['Nuevo', 'En Análisis', 'En Remediación', 'Escalado', 'Resuelto', 'Cerrado'],
        default: 'Nuevo'
    },
    responsable: { type: String, default: '' },
    area_afectada: { type: String, default: '' },
    fecha_deteccion: { type: Date, default: Date.now },
    fecha_limite: { type: Date },
    fecha_cierre: { type: Date },
    acciones_tomadas: { type: String, default: '' },
    lecciones_aprendidas: { type: String, default: '' },
    riesgo_residual: {
        type: String,
        enum: ['Alto', 'Medio', 'Bajo', 'Eliminado', 'N/A'],
        default: 'N/A'
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null }
});

InformeL3Schema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('InformeL3', InformeL3Schema);
