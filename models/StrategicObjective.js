const mongoose = require('mongoose');

const StrategicObjectiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    department: { type: String, default: 'General/Corporativo' },
    priority: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StrategicObjective', StrategicObjectiveSchema);
