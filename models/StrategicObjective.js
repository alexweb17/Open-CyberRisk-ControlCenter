const mongoose = require('mongoose');

const StrategicObjectiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    department: {
        type: String,
        enum: [
            'Auditoría',
            'Comercial',
            'Financiero Administrativo',
            'Jurídico',
            'Marketing',
            'Operaciones',
            'Sistemas/TI',
            'General/Corporativo'
        ],
        default: 'General/Corporativo'
    },
    priority: {
        type: String,
        enum: ['Alta', 'Media', 'Baja'],
        default: 'Media'
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

StrategicObjectiveSchema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('StrategicObjective', StrategicObjectiveSchema);
