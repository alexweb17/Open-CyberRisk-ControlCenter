const mongoose = require('mongoose');
const RCSSchema = new mongoose.Schema({
    codigo_rcs: { type: String, required: true, unique: true },
    expediente: { type: String, default: '' },
    proyecto_asociado: { type: String, default: '' },
    responsable: { type: String, default: '' },
    estado: { type: String, enum: ['Pendiente de Revisión', 'En Curso', 'Implementado/Mitigado'], default: 'Pendiente de Revisión' }
}, { timestamps: true });
module.exports = mongoose.model('RCS', RCSSchema);
