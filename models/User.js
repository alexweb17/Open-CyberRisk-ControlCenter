const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema - Open CyberRisk Control Center
 * Manages local identities, passwords and RBAC roles.
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 8,
        select: false // Do not include in queries by default
    },
    role: {
        type: String,
        enum: ['admin', 'security_manager', 'engineer'],
        default: 'engineer'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    // Hash with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
