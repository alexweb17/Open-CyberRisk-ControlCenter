const mongoose = require('mongoose');
const MasterControlSchema = new mongoose.Schema({
    id_control: Number,
    codigo_control: { type: String, required: true, unique: true },
    dominio: String,
    lineamiento: String,
    recomendacion: String,
    severidad: String,
    estandar_referencia: String,
    punto_especifico: String
}, { timestamps: true });
module.exports = mongoose.model('MasterControl', MasterControlSchema);
