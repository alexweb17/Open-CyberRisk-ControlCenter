const mongoose = require('mongoose');
const FrameworkRequirementSchema = new mongoose.Schema({
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Framework', required: true },
    code: { type: String, required: true },
    domain: { type: String, default: '' },
    requirement: { type: String, required: true },
    guidance: { type: String, default: '' }
}, { timestamps: true });
FrameworkRequirementSchema.index({ framework_id: 1, code: 1 }, { unique: true });
module.exports = mongoose.model('FrameworkRequirement', FrameworkRequirementSchema);
