const mongoose = require('mongoose');

const MasterControlSchema = new mongoose.Schema({
    id_control: Number,
    codigo_control: { type: String, required: true, unique: true },
    dominio: String,
    lineamiento: String,
    recomendacion: String,
    severidad: String,
    estandar_referencia: String,
    punto_especifico: String,
    estado: String,
    justificacion_riesgo: String,
    sla_dias: Number,
    guia_evidencia: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

MasterControlSchema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('MasterControl', MasterControlSchema);
