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

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'cyber-risk-secret-2024-secure';

// --- CONFIGURACIÓN ---
app.use(express.json());
app.use(cors());

// --- MODELS ---
const User = require('./models/User');

const MasterControlSchema = new mongoose.Schema({
    codigo_control: { type: String, unique: true },
    lineamiento: String,
    dominio: String,
    recomendacion: String,
    justificacion_riesgo: String,
    severidad: String,
    sla_dias: Number,
    guia_evidencia: String
});
const MasterControl = mongoose.model('MasterControl', MasterControlSchema);

const ProjectSchema = new mongoose.Schema({
    codigo_proyecto: String,
    nombre: String,
    descripcion: String,
    estado: String,
    area: String,
    lider_proyecto: String,
    fecha_solicitud: Date,
    prioridad: String
});
const Project = mongoose.model('Project', ProjectSchema);

const RiskSchema = new mongoose.Schema({
    codigo_riesgo: String,
    proyecto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    nombre_riesgo: String,
    descripcion: String,
    impacto: String,
    probabilidad: String,
    severidad: String,
    estado: String,
    fecha_deteccion: Date,
    sla_vencido: Boolean
});
const Risk = mongoose.model('Risk', RiskSchema);

const RCSSchema = new mongoose.Schema({
    codigo_rcs: String,
    proyecto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    responsable: String,
    fecha_inicio: Date,
    cumplimiento: Number,
    controles_asociados: [{
        control_id: mongoose.Schema.Types.ObjectId,
        tipo_fuente: { type: String, enum: ['MasterControl', 'FrameworkRequirement'] },
        codigo_control: String,
        estado_control: String,
        notas: String,
        evidencia_url: String,
        fecha_agregado: Date
    }]
});
const RCS = mongoose.model('RCS', RCSSchema);

const InformeL3Schema = new mongoose.Schema({
    codigo_num: String,
    codigo_informe: String,
    titulo: String,
    nombre_informe: String, // Legacy field support
    tipo: String,
    tipo_revision: String, // Legacy field support
    origen: String,
    descripcion: String,
    severidad: String,
    nivel_riesgo: String, // Legacy field support
    estado_atencion: String,
    responsable: String,
    area_afectada: String,
    fecha_deteccion: Date,
    fecha_emision: Date, // Legacy field support
    fecha_limite: Date,
    fecha_cierre: Date,
    acciones_tomadas: String,
    lecciones_aprendidas: String,
    riesgo_residual: String
});
const InformeL3 = mongoose.model('InformeL3', InformeL3Schema);

const ProcesoSchema = new mongoose.Schema({
    codigo_proceso: String,
    nombre_proceso: String,
    dueno_proceso: String,
    criticidad: String,
    cumplimiento: Number
});
const Proceso = mongoose.model('Proceso', ProcesoSchema);

const FrameworkSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    description: String,
    version: String,
    industry: String,
    last_updated: { type: Date, default: Date.now }
});
const Framework = mongoose.model('Framework', FrameworkSchema);

const FrameworkRequirementSchema = new mongoose.Schema({
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Framework' },
    code: String,
    domain: String,
    requirement: String,
    guidance: String
});
const FrameworkRequirement = mongoose.model('FrameworkRequirement', FrameworkRequirementSchema);

const StrategicObjectiveSchema = new mongoose.Schema({
    name: String,
    department: String,
    priority: { type: String, enum: ['Alta', 'Media', 'Baja'] },
    status: { type: String, default: 'En Progreso' },
    description: String
});
const StrategicObjective = mongoose.model('StrategicObjective', StrategicObjectiveSchema);

const KRISchema = new mongoose.Schema({
    name: String,
    current_value: Number,
    threshold_warning: Number,
    threshold_critical: Number,
    unit: String,
    objective_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StrategicObjective' }
});
const KRI = mongoose.model('KRI', KRISchema);

const AuditLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    action: String,
    entity: String,
    entityId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed
});
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// --- SEEDER (Optional Logic) ---
const seedInitialUser = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log("Creando usuario administrador inicial...");
            await User.create({
                name: 'Administrador CCC',
                email: 'admin@ccc.local',
                password: 'adminPassword123!',
                role: 'admin'
            });
            console.log("Usuario administrador creado.");
        }
    } catch (err) {
        console.error("Error al crear usuario inicial:", err);
    }
};

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system')
    .then(() => {
        console.log('--- Conexión establecida con MongoDB Atlas/Local ---');
        seedInitialUser();
    })
    .catch(err => console.error('Error de conexión MongoDB:', err));

// --- MIDDLEWARES ---

// Verify JWT Token
const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado.' });
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

// RBAC Permissions Middleware
const checkPerms = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'No autenticado' });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tiene permisos para esta acción' });
        }
        next();
    };
};

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '8h' });
        user.lastLogin = new Date();
        await user.save();

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/me', checkAuth, (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});

app.patch('/api/me/password', checkAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Find user with password explicitly selected
        const user = await User.findById(req.user.id).select('+password');
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Use checkAuth for all following API routes
app.use('/api/', checkAuth);

// --- MASTER CONTROLS ROUTES ---

app.get('/api/master-controls', async (req, res) => {
    try {
        const controls = await MasterControl.find().sort({ codigo_control: 1 });
        res.json(controls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/master-controls', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        // Auto-generate ID if not provided (placeholder logic)
        const count = await MasterControl.countDocuments({ dominio: req.body.dominio });
        const prefix = req.body.dominio === 'Identidad' ? 'ID' : 'PR';
        const code = `${prefix}-${(count + 1).toString().padStart(2, '0')}`;
        
        const control = await MasterControl.create({ ...req.body, codigo_control: code });
        res.status(201).json(control);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/master-controls/:id', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const control = await MasterControl.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(control);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/master-controls/:id', checkPerms(['admin']), async (req, res) => {
    try {
        await MasterControl.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- PROJECTS ROUTES ---

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ fecha_solicitud: -1 });
        
        // Calculate dynamic stats for each project
        const enriched = await Promise.all(projects.map(async (p) => {
            const risks = await Risk.find({ proyecto_id: p._id });
            const stats = { 'Pendiente': 0, 'En Curso': 0, 'Mitigado': 0, 'Aceptado': 0 };
            risks.forEach(r => { if (stats[r.estado] !== undefined) stats[r.estado]++; });
            return { ...p.toObject(), risk_stats: stats };
        }));
        
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/projects/:id', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', checkPerms(['admin']), async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- RISKS ROUTES ---

app.get('/api/risks/dashboard', async (req, res) => {
    try {
        const risks = await Risk.find().populate('proyecto_id');
        
        const severityCounts = { 'Crítica': 0, 'Alta': 0, 'Media': 0, 'Baja': 0 };
        risks.forEach(r => severityCounts[r.severidad]++);

        const topCritical = risks
            .filter(r => r.severidad === 'Crítica' || r.severidad === 'Alta')
            .sort((a, b) => b.fecha_deteccion - a.fecha_deteccion)
            .slice(0, 5);

        const topOldest = risks
            .filter(r => r.estado !== 'Mitigado' && r.estado !== 'Aceptado')
            .sort((a, b) => a.fecha_deteccion - b.fecha_deteccion)
            .slice(0, 5);

        const heatMap = risks.reduce((acc, r) => {
            const key = `${r.probabilidad}-${r.impacto}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        res.json({
            inventory: risks,
            severityCounts,
            topCritical,
            topOldest,
            heatMap
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RCS (CONSULTORÍAS) ROUTES ---

app.get('/api/rcs', async (req, res) => {
    try {
        const rcs = await RCS.find().populate('proyecto_id');
        res.json(rcs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/rcs/:id', async (req, res) => {
    try {
        const rcs = await RCS.findById(req.params.id).populate('proyecto_id');
        res.json(rcs);
    } catch (err) {
        res.status(404).json({ error: "RCS no encontrado" });
    }
});

app.post('/api/rcs', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const rcs = await RCS.create(req.body);
        res.status(201).json(rcs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/rcs/:id', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const rcs = await RCS.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(rcs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/rcs/:id', checkPerms(['admin']), async (req, res) => {
    try {
        await RCS.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- INFORMES L3 ---

app.get('/api/informesl3', async (req, res) => {
    try {
        const informes = await InformeL3.find().sort({ fecha_deteccion: -1, fecha_emision: -1 });
        res.json(informes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/informesl3', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        // Handle legacy field mapping
        const body = {
            ...req.body,
            codigo_informe: req.body.codigo_informe || `INF-${req.body.codigo_num || Date.now()}`,
            nombre_informe: req.body.nombre_informe || req.body.titulo,
            tipo_revision: req.body.tipo_revision || req.body.tipo,
            nivel_riesgo: req.body.nivel_riesgo || req.body.severidad,
            fecha_emision: req.body.fecha_emision || req.body.fecha_deteccion || new Date()
        };
        const informe = await InformeL3.create(body);
        res.status(201).json(informe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/informesl3/:id', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const informe = await InformeL3.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(informe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/informesl3/:id', checkPerms(['admin']), async (req, res) => {
    try {
        await InformeL3.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- PROCESOS ---

app.get('/api/procesos', async (req, res) => {
    try {
        const procesos = await Proceso.find().sort({ codigo_proceso: 1 });
        res.json(procesos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/procesos', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const proceso = await Proceso.create(req.body);
        res.status(201).json(proceso);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/procesos/:id', checkPerms(['admin', 'security_manager']), async (req, res) => {
    try {
        const proceso = await Proceso.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(proceso);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/procesos/:id', checkPerms(['admin']), async (req, res) => {
    try {
        await Proceso.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- GOBERNANZA ---

app.get('/api/governance/objectives', async (req, res) => {
    try {
        const objs = await StrategicObjective.find();
        res.json(objs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/governance/objectives', checkPerms(['admin']), async (req, res) => {
    try {
        const obj = await StrategicObjective.create(req.body);
        res.status(201).json(obj);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/governance/kris', async (req, res) => {
    try {
        const kris = await KRI.find().populate('objective_id');
        res.json(kris);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/governance/summary', async (req, res) => {
    try {
        const totalRisks = await Risk.countDocuments();
        const criticalRisks = await Risk.countDocuments({ severidad: 'Crítica' });
        const alertsCount = await Risk.countDocuments({ sla_vencido: true });

        const kris = await KRI.find();
        const kriStats = kris.map(k => ({
            name: k.name,
            status: k.current_value >= k.threshold_critical ? 'Crítico' : (k.current_value >= k.threshold_warning ? 'Advertencia' : 'Normal')
        }));

        const objectivesCount = await StrategicObjective.countDocuments();

        res.json({
            riskSummary: { total: totalRisks, critical: criticalRisks, alerts: alertsCount },
            kriStatus: kriStats,
            strategicObjectivesCount: objectivesCount,
            lastUpdated: new Date()
        });
    } catch (err) {
        res.status(500).json({ error: "Error al generar resumen ejecutivo", details: err.message });
    }
});

// --- RCS BULK CONTROLS ---

// POST bulk-add controls to RCS from a source
app.post('/api/rcs/:id/bulk-controls', async (req, res) => {
    try {
        const { source, framework_id } = req.body;
        const rcs = await RCS.findById(req.params.id);
        if (!rcs) return res.status(404).json({ error: "RCS no encontrado" });

        let controlsToAdd = [];

        if (source === 'marco_base') {
            const allControls = await MasterControl.find().sort({ codigo_control: 1 });
            controlsToAdd = allControls.map(c => ({
                control_id: c._id,
                tipo_fuente: 'MasterControl',
                codigo_control: c.codigo_control,
                estado_control: 'Pendiente',
                notas: '',
                fecha_agregado: new Date()
            }));
        } else if (source === 'framework' && framework_id) {
            const requirements = await FrameworkRequirement.find({ framework_id }).sort({ code: 1 });
            controlsToAdd = requirements.map(r => ({
                control_id: r._id,
                tipo_fuente: 'FrameworkRequirement',
                codigo_control: r.code,
                estado_control: 'Pendiente',
                notas: '',
                fecha_agregado: new Date()
            }));
        } else {
            return res.status(400).json({ error: "Fuente inválida. Use 'marco_base' o 'framework' con framework_id." });
        }

        // Filter out already-existing controls
        const existingCodes = new Set(rcs.controles_asociados.map(c => c.codigo_control));
        const newControls = controlsToAdd.filter(c => !existingCodes.has(c.codigo_control));

        if (newControls.length === 0) {
            return res.json({ message: "Todos los controles ya existen en este RCS", added: 0, data: rcs });
        }

        rcs.controles_asociados.push(...newControls);
        await rcs.save();

        await new AuditLog({
            action: 'BULK_ADD_CONTROLS',
            entity: 'RCS',
            entityId: rcs._id,
            details: { codigo: rcs.codigo_rcs, source, count: newControls.length }
        }).save();

        res.json({ message: `${newControls.length} controles agregados`, added: newControls.length, data: rcs });
    } catch (err) {
        console.error("POST /api/rcs/:id/bulk-controls Error:", err);
        res.status(400).json({ error: "Error al cargar controles masivamente", details: err.message });
    }
});

// GET search framework requirements (for autocomplete in RCS)
app.get('/api/framework-requirements/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const frameworkId = req.query.framework_id;
        const searchRegex = new RegExp(query, 'i');

        const filter = {
            $or: [
                { code: searchRegex },
                { domain: searchRegex },
                { requirement: searchRegex },
                { guidance: searchRegex }
            ]
        };
        if (frameworkId) {
            filter.framework_id = frameworkId;
        }

        const requirements = await FrameworkRequirement.find(filter).sort({ code: 1 }).limit(10);

        // Enrich with framework name
        const frameworkIds = [...new Set(requirements.map(r => r.framework_id.toString()))];
        const frameworks = await Framework.find({ _id: { $in: frameworkIds } });
        const fwMap = {};
        frameworks.forEach(f => { fwMap[f._id.toString()] = f.name; });

        const enriched = requirements.map(r => ({
            ...r.toObject(),
            framework_name: fwMap[r.framework_id.toString()] || 'Desconocido'
        }));

        res.json(enriched);
    } catch (err) {
        console.error("GET /api/framework-requirements/search Error:", err);
        res.status(500).json({ error: "Error en búsqueda de requisitos" });
    }
});

// --- BIBLIOTECA DE MARCOS REGULATORIOS ---

app.get('/api/frameworks', async (req, res) => {
    try {
        const frameworks = await Framework.find().sort({ name: 1 });
        res.json(frameworks);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar marcos regulatorios" });
    }
});

app.get('/api/frameworks/:id/requirements', async (req, res) => {
    try {
        const requirements = await FrameworkRequirement.find({ framework_id: req.params.id }).sort({ code: 1 });
        res.json(requirements);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar requisitos del marco" });
    }
});

// --- USER MANAGEMENT (ADMIN ONLY) ---

app.get('/api/users', checkPerms(['admin']), async (req, res) => {
    try {
        const users = await User.find().sort({ email: 1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Error al listar usuarios" });
    }
});

app.patch('/api/users/:id/role', checkPerms(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'security_manager', 'engineer'].includes(role)) {
            return res.status(400).json({ error: "Rol inválido" });
        }

        await User.findByIdAndUpdate(req.params.id, { role });
        res.json({ message: "Rol actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar rol" });
    }
});

// Create User (Admin Only)
app.post('/api/users', checkPerms(['admin']), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await User.create({ name, email, password, role });
        newUser.password = undefined;
        res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete User (Admin Only)
app.delete('/api/users/:id', checkPerms(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

// Update User (Admin Only)
app.patch('/api/users/:id', checkPerms(['admin']), async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (role) user.role = role;
        if (password && password.trim().length >= 8) {
            user.password = password;
        }

        await user.save();
        res.json({ message: "Usuario actualizado correctamente", user });
    } catch (err) {
        console.error("PATCH /api/users/:id Error:", err);
        res.status(400).json({ error: err.message });
    }
});

// 5. Servidor con Fallback HTTPS/HTTP
const https = require('https');
const http = require('http');
const PORT = process.env.PORT || 3000;

const startServer = () => {
    try {
        const options = {
            key: fs.readFileSync(path.join(__dirname, 'key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
        };

        https.createServer(options, app).listen(PORT, () => {
            console.log(`Backend CCC Hardened activo en: https://localhost:${PORT}`);
        });
    } catch (err) {
        console.warn("⚠️  Aviso: No se pudo iniciar HTTPS (Certificados faltantes o inválidos). Iniciando en modo HTTP estándar.");
        console.warn("Detalle:", err.message);

        http.createServer(app).listen(PORT, () => {
            console.log(`Servidor CCC disponible en modo estándar: http://localhost:${PORT}`);
        });
    }
};

startServer();
