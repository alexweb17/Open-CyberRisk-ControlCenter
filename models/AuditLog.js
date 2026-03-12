const mongoose = require('mongoose');
const AuditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: String,
    details: Object,
    timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AuditLog', AuditLogSchema);
