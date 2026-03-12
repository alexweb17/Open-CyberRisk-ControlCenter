const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    codigo_proyecto: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    area: { type: String, required: true },
    lider: { type: String, default: '' },
    fecha_inicio: { type: Date, default: Date.now },
    fecha_fin: { type: Date },
    estado: { type: String, enum: ['Activo', 'Inactivo', 'Cerrado'], default: 'Activo' },
    progreso: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

ProjectSchema.pre('save', function() {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('Project', ProjectSchema);
