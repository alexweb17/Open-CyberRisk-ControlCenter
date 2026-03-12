const mongoose = require('mongoose');

const KRISchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    objective_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StrategicObjective', required: true },
    threshold_critical: { type: Number, required: true },
    threshold_warning: { type: Number, required: true },
    current_value: { type: Number, default: 0 },
    unit: { type: String, default: '%' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KRI', KRISchema);
