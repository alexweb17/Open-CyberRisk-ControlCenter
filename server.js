/**
 * CyberRisk Control Center - Backend (Hardened)
 * Express server with Mongoose integration.
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'cyber-risk-secret-2024-secure';
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN ---
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

// --- MIDDLEWARES ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
        req.user = user;
        next();
    });
};

const authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
};

// --- ROUTES ---
// (Simplified for the Open version - include essential endpoints)
// Authentication, Users, Projects, RCS, Frameworks...

// Placeholder for the full server.js logic pushed in previous steps
// ...

app.listen(PORT, () => console.log(`🚀 Open CCC Server running on port ${PORT}`));
