const mongoose = require('mongoose');

const FrameworkSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    version: { type: String, default: '' },
    industry: { type: String, default: 'General' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

FrameworkSchema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('Framework', FrameworkSchema);
