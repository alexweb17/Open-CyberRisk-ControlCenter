const mongoose = require('mongoose');

const FrameworkRequirementSchema = new mongoose.Schema({
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Framework', required: true },
    code: { type: String, required: true },
    domain: { type: String, default: '' },
    requirement: { type: String, required: true },
    guidance: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

FrameworkRequirementSchema.index({ framework_id: 1, code: 1 }, { unique: true });

FrameworkRequirementSchema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('FrameworkRequirement', FrameworkRequirementSchema);
