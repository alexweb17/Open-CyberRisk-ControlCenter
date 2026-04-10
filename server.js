/**
 * server.js - Open CyberRisk Control Center (OCCC) Backend
 * Versión Hardened v1.1
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('./authConfig');

const User = require('./models/User');
const MasterControl = require('./models/MasterControl');
const AuditLog = require('./models/AuditLog');
const Project = require('./models/Project');
const RCS = require('./models/RCS');
const InformeL3 = require('./models/InformeL3');
const ProcesoNegocio = require('./models/ProcesoNegocio');
const StrategicObjective = require('./models/StrategicObjective');
const KRI = require('./models/KRI');
const Framework = require('./models/Framework');
const FrameworkRequirement = require('./models/FrameworkRequirement');

const DOMAIN_PREFIXES = {
    "Arquitectura": "ARQ",
    "Codificación Segura": "DEV",
    "Cumplimiento Normativo y Contractual": "CUM",
    "Data Sensible y Transacciones Críticas": "DAT",
    "Gestión de Accesos": "ACC",
    "Integraciones": "INT",
    "Lineamientos de Seguridad (Infraestructura y Aplicaciones)": "INF",
    "Seguridad en IA/Automatizaciones": "AIA"
};

async function getNextAvailableCode(dominio) {
    const prefix = DOMAIN_PREFIXES[dominio] || "GEN";
    const controls = await MasterControl.find({
        codigo_control: new RegExp(`^${prefix}-`)
    }).select('codigo_control').lean();

    const usedNumbers = controls
        .map(c => {
            const match = c.codigo_control.match(/-(\d+)$/);
            return match ? parseInt(match[1]) : null;
        })
        .filter(n => n !== null)
        .sort((a, b) => a - b);

    let nextNum = 1;
    for (const num of usedNumbers) {
        if (num === nextNum) {
            nextNum++;
        } else if (num > nextNum) {
            break;
        }
    }
    return `${prefix}-${String(nextNum).padStart(3, '0')}`;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

// 1. Conexión Segura a MongoDB (vía .env)
const mongoUri = process.env.MONGO_URI || `mongodb://localhost:27017/ccc_system`;

// Mask password for logging
const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
console.log(`Intentando conectar a DB: ${maskedUri}`);

// Auto-seed: Create default admin user on first run (if no users exist)
async function seedAdminUser() {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            await User.create({
                name: 'Administrador OCCC',
                email: 'admin@occc.local',
                password: 'OpenCyberRisk2026!',
                role: 'admin'
            });
            console.log('🔑 Usuario admin inicial creado: admin@occc.local / OpenCyberRisk2026!');
            console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión.');
        }
    } catch (err) {
        console.error('Error al crear usuario admin inicial:', err.message);
    }
}

mongoose.connect(mongoUri)
    .then(async () => {
        console.log("Conectado a MongoDB - Cerebro OCCC Operativo");
        await seedAdminUser();
    })
    .catch(err => {
        console.error("Error de conexión OCCC:", err.message);
        console.error("Asegúrate de que MongoDB esté corriendo y que las credenciales sean correctas.");
        process.exit(1);
    });

// 2. Esquema de Hallazgos
const FindingSchema = new mongoose.Schema({
    project_id: { type: String, required: true },
    control_id: { type: String, required: true },
    summary: { type: String, required: true },
    severity: { type: String, enum: ['Crítica', 'Alta', 'Media', 'Baja'], default: 'Media' },
    status: { type: String, default: 'Pendiente' },
    due_date: Date,
    evidence_path: [String],
    created_at: { type: Date, default: Date.now }
});

const Finding = mongoose.model('Finding', FindingSchema);

// 3. Configuración de Multer (Hardened)
const uploadDir = process.env.UPLOAD_DIR || '/opt/cyberriskcontrolcenter/uploads/evidencias';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * 4. SOBERAN AUTHENTICATION & AUTHORIZATION (JWT + RBAC)
 */

// JWT Helper: Create and sign token
const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

// Middleware: Protect routes with JWT verification
async function protect(req, res, next) {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: "No has iniciado sesión. Por favor, ingresa para obtener acceso." });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ error: "El usuario perteneciente a este token ya no existe." });
        }

        // 4. Grant access to protected route
        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
}

// Middleware: restrictTo(roles) for RBAC
function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Permisos Denegados",
                message: `Tu rol (${req.user.role}) no tiene autorización para esta acción.`
            });
        }
        next();
    };
}

// Legacy alias for checkPerms (backwards compatibility if needed, but we should use restrictTo)
const checkPerms = (allowedRoles) => restrictTo(...allowedRoles);

// --- AUTH ENDPOINTS ---

app.post('/api/auth/signup', async (req, res) => {
    try {
        // Only allow first user or admin to create others if needed
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'engineer'
        });

        const token = signToken(newUser._id);

        // Remove password from output
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser }
        });
    } catch (err) {
        console.error("[SIGNUP ERROR]", err);
        res.status(400).json({ error: "No se pudo crear el usuario. Verifique los datos." });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ error: "Por favor, proporciona email y contraseña." });
        }

        // 2. Find user & check password (select password field explicitly because select:false)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Email o contraseña incorrectos." });
        }

        // 3. Update last login
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // 4. Send token
        const token = signToken(user._id);
        user.password = undefined;

        res.json({
            status: 'success',
            token,
            user
        });
    } catch (err) {
        console.error("[LOGIN ERROR]", err);
        res.status(500).json({ error: "Error en el inicio de sesión." });
    }
});

app.get('/api/me', protect, (req, res) => {
    res.json(req.user);
});

// Self-service password change (any authenticated user)
app.patch('/api/me/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Se requiere la contraseña actual y la nueva contraseña.' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
        }

        // Fetch user with password field (select: false by default)
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (err) {
        console.error('PATCH /api/me/password Error:', err);
        res.status(500).json({ error: 'Error al actualizar la contraseña.' });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Solo permitir extensiones seguras (incluyendo Office legacy y moderno)
    const allowedTypes = /jpeg|jpg|png|pdf|docx|doc|xlsx|xls|pptx|ppt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Check mimetype more permissively for common office types
    const isOffice = file.mimetype.includes('ms-excel') || 
                   file.mimetype.includes('spreadsheetml') || 
                   file.mimetype.includes('wordprocessingml') || 
                   file.mimetype.includes('presentationml') ||
                   file.mimetype.includes('ms-powerpoint') ||
                   file.mimetype.includes('msword') ||
                   file.mimetype.includes('officedocument');
    
    const isImage = file.mimetype.startsWith('image/');
    const isPDF = file.mimetype === 'application/pdf';

    if (extname && (isOffice || isImage || isPDF)) {
        return cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido (Solo imágenes, PDF y Office)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 } // 5MB default
});

// --- GLOBAL AUTHENTICATION FOR ALL API ROUTES ---
app.use('/api', (req, res, next) => {
    // Exclude auth routes from global protect
    if (req.path.startsWith('/auth')) return next();
    protect(req, res, next);
});

// 4. Endpoints

// Obtener hallazgos
app.get('/api/findings', async (req, res) => {
    try {
        const findings = await Finding.find().sort({ created_at: -1 });
        res.json(findings);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar hallazgos" });
    }
});

// Obtener controles maestros (Lista 1)
app.get('/api/master-controls', async (req, res) => {
    try {
        const controls = await MasterControl.find().sort({ codigo_control: 1 });
        res.json(controls);
    } catch (err) {
        console.error("GET /api/master-controls Error:", err);
        res.status(500).json({ error: "Error al recuperar controles maestros" });
    }
});

// Search controls for autocomplete (used in RCS)
app.get('/api/master-controls/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const searchRegex = new RegExp(query, 'i');
        const controls = await MasterControl.find({
            $or: [
                { codigo_control: searchRegex },
                { lineamiento: searchRegex },
                { dominio: searchRegex },
                { recomendacion: searchRegex }
            ]
        }).sort({ codigo_control: 1 }).limit(10);
        res.json(controls);
    } catch (err) {
        console.error("GET /api/master-controls/search Error:", err);
        res.status(500).json({ error: "Error en búsqueda de controles" });
    }
});

// Agregar nuevo control maestro
app.post('/api/master-controls', checkPerms(['security_manager', 'admin']), async (req, res) => {
    try {
        // Auto-generate code if not provided
        if (!req.body.codigo_control && req.body.dominio) {
            req.body.codigo_control = await getNextAvailableCode(req.body.dominio);
        }

        const newControl = new MasterControl(req.body);
        await newControl.save();

        // Audit log
        await new AuditLog({
            action: 'CREATE',
            entity: 'MasterControl',
            entityId: newControl._id,
            details: { codigo: newControl.codigo_control }
        }).save();

        res.status(201).json({ message: "Control maestro agregado", data: newControl });
    } catch (err) {
        console.error("POST /api/master-controls Error:", err);
        res.status(400).json({ error: "Error al procesar la solicitud del control maestro." });
    }
});

// Actualizar control maestro
app.put('/api/master-controls/:id', checkPerms(['security_manager', 'admin']), async (req, res) => {
    try {
        const existingControl = await MasterControl.findById(req.params.id);
        if (!existingControl) return res.status(404).json({ error: "Control no encontrado" });

        // If domain changed, re-generate code
        if (req.body.dominio && req.body.dominio !== existingControl.dominio) {
            req.body.codigo_control = await getNextAvailableCode(req.body.dominio);

            // Log code change in audit
            await new AuditLog({
                action: 'UPDATE_DOMAIN',
                entity: 'MasterControl',
                entityId: existingControl._id,
                details: {
                    old_code: existingControl.codigo_control,
                    new_code: req.body.codigo_control,
                    new_domain: req.body.dominio
                }
            }).save();
        }

        const updatedControl = await MasterControl.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: Date.now() },
            { new: true, runValidators: true }
        );
        res.json({ message: "Control actualizado", data: updatedControl });
    } catch (err) {
        console.error("PUT /api/master-controls Error:", err);
        res.status(400).json({ error: "Error al actualizar el control maestro." });
    }
});

// Eliminar control maestro
app.delete('/api/master-controls/:id', checkPerms(['security_manager', 'admin']), async (req, res) => {
    try {
        const deletedControl = await MasterControl.findByIdAndDelete(req.params.id);
        if (!deletedControl) return res.status(404).json({ error: "Control no encontrado" });

        // Audit log
        await new AuditLog({
            action: 'DELETE',
            entity: 'MasterControl',
            entityId: deletedControl._id,
            details: { codigo: deletedControl.codigo_control, name: deletedControl.lineamiento }
        }).save();

        res.json({ message: "Control eliminado" });
    } catch (err) {
        console.error("DELETE /api/master-controls Error:", err);
        res.status(500).json({ error: "No se pudo eliminar el control maestro." });
    }
});

// Registrar hallazgo
app.post('/api/findings', async (req, res) => {
    try {
        const newFinding = new Finding(req.body);
        await newFinding.save();
        res.status(201).json({ message: "Hallazgo registrado", data: newFinding });
    } catch (err) {
        console.error("POST /api/findings Error:", err);
        res.status(400).json({ error: "Error al registrar el hallazgo." });
    }
});

// ============ PROJECT ENDPOINTS ============

// Area abbreviations for project codes
const AREA_ABBREV = {
    'Auditoría': 'AUD',
    'Comercial Venta Directa': 'CVD',
    'Comercial Venta Indirecta': 'CVI',
    'Financiero Administrativo': 'FIN',
    'Jurídico': 'LEG',
    'Marketing': 'MKT',
    'Operaciones': 'OPE',
    'Regulatorio': 'REG',
    'Relaciones Institucionales y Sustentabilidad': 'SRC',
    'Servicios y Customer Care': 'SAC',
    'Talento Humano': 'THU',
    'Tecnología Información y Comunicación': 'TIC'
};

// Generate project code: PROY-AREA-XXX-YYYY
async function getNextProjectCode(area) {
    const year = new Date().getFullYear();
    const areaAbbrev = AREA_ABBREV[area] || 'GEN';

    // Find projects with same area and year pattern
    const pattern = new RegExp(`^PROY-${areaAbbrev}-\\d{3}-${year}$`);
    const projects = await Project.find({
        codigo_proyecto: pattern
    }).select('codigo_proyecto').lean();

    const usedNumbers = projects
        .map(p => {
            const match = p.codigo_proyecto.match(new RegExp(`PROY-${areaAbbrev}-(\\d{3})-`));
            return match ? parseInt(match[1]) : null;
        })
        .filter(n => n !== null)
        .sort((a, b) => a - b);

    let nextNum = 1;
    for (const num of usedNumbers) {
        if (num === nextNum) nextNum++;
        else if (num > nextNum) break;
    }
    return `PROY-${areaAbbrev}-${String(nextNum).padStart(3, '0')}-${year}`;
}

// GET all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ created_at: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar proyectos" });
    }
});

// POST create new project
app.post('/api/projects', upload.array('archivos', 10), async (req, res) => {
    try {
        if (!req.body) {
            console.error("POST /api/projects: req.body is undefined");
            return res.status(400).json({ error: "No se recibieron datos del formulario. Verifique el formato de envío." });
        }

        const { nombre, lider_proyecto, ingeniero_asignado } = req.body;
        if (!nombre || !lider_proyecto || !ingeniero_asignado) {
            console.warn("POST /api/projects: Faltan campos obligatorios", { nombre, lider_proyecto, ingeniero_asignado });
            return res.status(400).json({ error: "Faltan campos obligatorios para el proyecto." });
        }

        // Handle uploaded files
        const adjuntos = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(f => {
                adjuntos.push({
                    nombre: f.originalname,
                    ruta: f.path,
                    tipo: f.mimetype,
                    fecha_subida: new Date()
                });
            });
        }
        
        req.body.codigo_proyecto = await getNextProjectCode(req.body.area || 'Tecnología Información y Comunicación');
        req.body.archivos_adjuntos = adjuntos;

        const newProject = new Project(req.body);
        await newProject.save();

        await new AuditLog({
            action: 'CREATE',
            entity: 'Project',
            entityId: newProject._id,
            details: { codigo: newProject.codigo_proyecto, nombre: newProject.nombre }
        }).save();

        res.status(201).json({ message: "Proyecto creado", data: newProject });
    } catch (err) {
        console.error("POST /api/projects Error Detallado:", err);
        res.status(400).json({ 
            error: "Error interno al crear el proyecto.",
            details: err.message
        });
    }
});

// PUT update project
app.put('/api/projects/:id', upload.array('archivos', 10), async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "No se recibieron datos para actualizar." });
        }

        // Handle uploaded files
        const newAdjuntos = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(f => {
                newAdjuntos.push({
                    nombre: f.originalname,
                    ruta: f.path,
                    tipo: f.mimetype,
                    fecha_subida: new Date()
                });
            });
        }

        // Get the current project to check if area changed
        const currentProject = await Project.findById(req.params.id);
        if (!currentProject) return res.status(404).json({ error: "Proyecto no encontrado" });

        // If new files were uploaded, append them to existing ones
        if (newAdjuntos.length > 0) {
            req.body.archivos_adjuntos = [...(currentProject.archivos_adjuntos || []), ...newAdjuntos];
        }

        // If area changed, regenerate project code for the new area
        if (req.body.area && req.body.area !== currentProject.area) {
            const newCode = await getNextProjectCode(req.body.area);
            req.body.codigo_proyecto = newCode;

            // Log area change for audit
            await new AuditLog({
                action: 'UPDATE',
                entity: 'Project',
                entityId: currentProject._id,
                details: {
                    area_change: { from: currentProject.area, to: req.body.area },
                    code_change: { from: currentProject.codigo_proyecto, to: newCode }
                }
            }).save();
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: Date.now() },
            { new: true, runValidators: true }
        );
        res.json({ message: "Proyecto actualizado", data: updatedProject });
    } catch (err) {
        console.error("PUT /api/projects Error:", err);
        res.status(400).json({ 
            error: "Error al actualizar el proyecto.",
            details: err.message
        });
    }
});

// DELETE project
app.delete('/api/projects/:id', checkPerms(['security_manager', 'admin']), async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ error: "Proyecto no encontrado" });

        await new AuditLog({
            action: 'DELETE',
            entity: 'Project',
            entityId: deletedProject._id,
            details: { codigo: deletedProject.codigo_proyecto, nombre: deletedProject.nombre }
        }).save();

        res.json({ message: "Proyecto eliminado" });
    } catch (err) {
        console.error("DELETE /api/projects Error:", err);
        res.status(500).json({ error: "Error al eliminar el proyecto." });
    }
});

// ============ RCS ENDPOINTS ============

// Generate RCS code: AIC-SIT-RCS-XXX-YY
async function getNextRCSCode() {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `AIC-SIT-RCS-`;
    const pattern = new RegExp(`^${prefix}\\d{3}-${year}$`);

    const rcsList = await RCS.find({ codigo_rcs: pattern }).select('codigo_rcs').lean();

    let maxNum = 0;
    rcsList.forEach(r => {
        const parts = r.codigo_rcs.split('-');
        if (parts.length >= 4) {
            const num = parseInt(parts[3]);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });

    const nextNum = maxNum + 1;
    return `${prefix}${String(nextNum).padStart(3, '0')}-${year}`;
}

// GET Risk Dashboard aggregated data
app.get('/api/risk-dashboard', async (req, res) => {
    try {
        const rcsList = await RCS.find({ deleted: { $ne: true } }).sort({ created_at: -1 });
        const allControls = await MasterControl.find({});
        const controlMap = {};
        allControls.forEach(c => { controlMap[c.codigo_control] = c; });

        const severityOrder = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1, 'N/A': 0 };
        const now = new Date();

        // Build enriched list
        const enriched = rcsList.map(rcs => {
            const obj = rcs.toObject();
            obj.controles_detalle = (obj.controles_asociados || []).map(ca => {
                const mc = controlMap[ca.codigo_control] || {};
                return { ...ca, dominio: mc.dominio, recomendacion: mc.recomendacion, severidad_control: mc.severidad, sla_dias: mc.sla_dias, estandar_referencia: mc.estandar_referencia };
            });
            obj.antiguedad_dias = Math.floor((now - new Date(obj.fecha_registro || obj.created_at)) / (1000 * 60 * 60 * 24));
            obj.sla_vencido = obj.fecha_limite ? new Date(obj.fecha_limite) < now && obj.estado !== 'Implementado/Mitigado' : false;
            return obj;
        });

        // Count incidences per severity
        const severityCounts = {};
        enriched.forEach(r => {
            const sev = r.severidad_maxima || 'N/A';
            severityCounts[sev] = (severityCounts[sev] || 0) + 1;
        });

        // Top 5 critical: sort by severity desc, then by incidence count desc
        const topCritical = [...enriched]
            .sort((a, b) => {
                const sevDiff = (severityOrder[b.severidad_maxima] || 0) - (severityOrder[a.severidad_maxima] || 0);
                if (sevDiff !== 0) return sevDiff;
                return (severityCounts[b.severidad_maxima] || 0) - (severityCounts[a.severidad_maxima] || 0);
            })
            .slice(0, 5);

        // Top 5 oldest: sort by fecha_registro ASC
        const topOldest = [...enriched]
            .sort((a, b) => new Date(a.fecha_registro || a.created_at) - new Date(b.fecha_registro || b.created_at))
            .slice(0, 5);

        // Heat map: severity × estado
        const heatMap = {};
        const severities = ['Crítica', 'Alta', 'Media', 'Baja'];
        const estados = ['Pendiente de Revisión', 'En Curso', 'Implementado/Mitigado'];
        severities.forEach(s => {
            heatMap[s] = {};
            estados.forEach(e => { heatMap[s][e] = 0; });
        });
        enriched.forEach(r => {
            const sev = r.severidad_maxima || 'N/A';
            const est = r.estado || 'Pendiente de Revisión';
            if (heatMap[sev] && heatMap[sev][est] !== undefined) {
                heatMap[sev][est]++;
            }
        });

        // KPIs
        const kpis = {
            total: enriched.length,
            criticos: enriched.filter(r => r.severidad_maxima === 'Crítica' || r.severidad_maxima === 'Alta').length,
            en_mitigacion: enriched.filter(r => r.estado === 'En Curso').length,
            sla_vencido: enriched.filter(r => r.sla_vencido).length
        };

        res.json({ kpis, topCritical, topOldest, heatMap, inventory: enriched, severityCounts });
    } catch (err) {
        console.error("GET /api/risk-dashboard Error:", err);
        res.status(500).json({ error: "Error al generar dashboard de riesgos" });
    }
});

// GET all RCS entries (excluding soft-deleted)
app.get('/api/rcs', async (req, res) => {
    try {
        const rcsList = await RCS.find({ deleted: { $ne: true } }).sort({ created_at: -1 });
        res.json(rcsList);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar registros RCS" });
    }
});

// POST new RCS entry
app.post('/api/rcs', async (req, res) => {
    try {
        // Fallback for responsable if not provided by frontend
        if (!req.body.responsable) {
            req.body.responsable = req.user ? req.user.name : "Consultor OCCC";
        }
        
        req.body.codigo_rcs = await getNextRCSCode();
        
        const newRCS = new RCS(req.body);
        await newRCS.save();

        await new AuditLog({
            action: 'CREATE',
            entity: 'RCS',
            entityId: newRCS._id,
            details: { codigo: newRCS.codigo_rcs, estado: newRCS.estado }
        }).save();

        res.status(201).json({ message: "RCS creado", data: newRCS });
    } catch (err) {
        console.error("POST /api/rcs Error:", err);
        res.status(400).json({ error: "Error al crear el registro RCS.", details: err.message, stack: err.stack });
    }
});

// PUT update RCS entry
app.put('/api/rcs/:id', async (req, res) => {
    try {
        const updatedRCS = await RCS.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedRCS) return res.status(404).json({ error: "RCS no encontrado" });

        await new AuditLog({
            action: 'UPDATE',
            entity: 'RCS',
            entityId: updatedRCS._id,
            details: { codigo: updatedRCS.codigo_rcs, estado: updatedRCS.estado }
        }).save();

        res.json({ message: "RCS actualizado", data: updatedRCS });
    } catch (err) {
        console.error("PUT /api/rcs Error:", err);
        res.status(400).json({ error: "Error al actualizar el registro RCS." });
    }
});

// DELETE RCS entry
app.delete('/api/rcs/:id', async (req, res) => {
    try {
        // Soft delete: mark as deleted instead of removing from database
        const rcs = await RCS.findByIdAndUpdate(
            req.params.id,
            { deleted: true, deleted_at: new Date() },
            { new: true }
        );
        if (!rcs) return res.status(404).json({ error: "RCS no encontrado" });

        await new AuditLog({
            action: 'SOFT_DELETE',
            entity: 'RCS',
            entityId: rcs._id,
            details: { codigo: rcs.codigo_rcs, deleted_at: rcs.deleted_at }
        }).save();

        res.json({ message: "RCS eliminado", codigo: rcs.codigo_rcs });
    } catch (err) {
        console.error("DELETE /api/rcs Error:", err);
        res.status(500).json({ error: "Error al eliminar el registro RCS." });
    }
});

// GET single RCS with populated control info
app.get('/api/rcs/:id', async (req, res) => {
    try {
        const rcs = await RCS.findById(req.params.id);
        if (!rcs) return res.status(404).json({ error: "RCS no encontrado" });

        // Separate controls by source type
        const mcIds = [];
        const frIds = [];
        rcs.controles_asociados.forEach(c => {
            if (!c.control_id) return;
            if (c.tipo_fuente === 'FrameworkRequirement') {
                frIds.push(c.control_id);
            } else {
                mcIds.push(c.control_id);
            }
        });

        // Fetch both types in parallel
        const [masterControls, frameworkReqs] = await Promise.all([
            MasterControl.find({ _id: { $in: mcIds } }),
            FrameworkRequirement.find({ _id: { $in: frIds } })
        ]);

        const controlMap = {};
        masterControls.forEach(c => { controlMap[c._id.toString()] = c; });
        frameworkReqs.forEach(c => { controlMap[c._id.toString()] = c; });

        // Merge control details
        const enrichedControls = rcs.controles_asociados.map(ca => {
            const info = controlMap[ca.control_id?.toString()] || null;
            return {
                ...ca.toObject(),
                control_info: info
            };
        });

        res.json({
            ...rcs.toObject(),
            controles_asociados: enrichedControls
        });
    } catch (err) {
        console.error("GET /api/rcs/:id Error:", err);
        res.status(500).json({ error: "Error al recuperar el registro de riesgos." });
    }
});

// POST add control to RCS
app.post('/api/rcs/:id/controls', async (req, res) => {
    try {
        const { control_id, codigo_control, tipo_fuente } = req.body;
        const rcs = await RCS.findById(req.params.id);
        if (!rcs) return res.status(404).json({ error: "RCS no encontrado" });

        // Check if control already exists
        const exists = rcs.controles_asociados.some(c => c.codigo_control === codigo_control);
        if (exists) return res.status(400).json({ error: "Control ya existe en este RCS" });

        rcs.controles_asociados.push({
            control_id,
            tipo_fuente: tipo_fuente || 'MasterControl',
            codigo_control,
            estado_control: 'Pendiente',
            notas: '',
            fecha_agregado: new Date()
        });

        await rcs.save();
        res.json({ message: "Control agregado", data: rcs });
    } catch (err) {
        res.status(400).json({ error: "Error al agregar control", details: err.message });
    }
});

// PUT update control state in RCS
app.put('/api/rcs/:id/controls/:codigo', async (req, res) => {
    try {
        const { estado_control, notas } = req.body;
        const rcs = await RCS.findById(req.params.id);
        if (!rcs) return res.status(404).json({ error: "RCS no encontrado" });

        const control = rcs.controles_asociados.find(c => c.codigo_control === req.params.codigo);
        if (!control) return res.status(404).json({ error: "Control no encontrado en RCS" });

        if (estado_control) control.estado_control = estado_control;
        if (notas !== undefined) control.notas = notas;

        await rcs.save();
        res.json({ message: "Control actualizado", data: rcs });
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar control", details: err.message });
    }
});

// DELETE remove control from RCS
app.delete('/api/rcs/:id/controls/:codigo', async (req, res) => {
    try {
        const rcs = await RCS.findById(req.params.id);
        if (!rcs) return res.status(404).json({ error: "RCS no encontrado" });

        const idx = rcs.controles_asociados.findIndex(c => c.codigo_control === req.params.codigo);
        if (idx === -1) return res.status(404).json({ error: "Control no encontrado en RCS" });

        rcs.controles_asociados.splice(idx, 1);
        await rcs.save();
        res.json({ message: "Control removido", data: rcs });
    } catch (err) {
        res.status(500).json({ error: "Error al remover control", details: err.message });
    }
});

// Carga de evidencias
app.post('/api/upload/:id', upload.array('files', 5), async (req, res) => {
    try {
        const paths = req.files.map(f => f.path);
        const updatedFinding = await Finding.findByIdAndUpdate(
            req.params.id,
            { $push: { evidence_path: { $each: paths } } },
            { new: true }
        );
        res.json({ message: "Evidencias cargadas", data: updatedFinding });
    } catch (err) {
        res.status(500).json({ error: "Error en carga", details: err.message });
    }
});

// ============ INFORMES CRÍTICOS L3 ENDPOINTS ============

// Generate InformeL3 code: AIC-SIT-APP-XXX-YY
async function getNextInformeL3Code() {
    const year = new Date().getFullYear().toString().slice(-2);
    const pattern = new RegExp(`^AIC-SIT-APP-\\d{3}-${year}$`);

    const informes = await InformeL3.find({
        codigo_informe: pattern
    }).select('codigo_informe').lean();

    const usedNumbers = informes
        .map(i => {
            const match = i.codigo_informe.match(/AIC-SIT-APP-(\d{3})-/);
            return match ? parseInt(match[1]) : null;
        })
        .filter(n => n !== null);

    const maxNum = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;
    const nextNum = maxNum + 1;

    return `AIC-SIT-APP-${String(nextNum).padStart(3, '0')}-${year}`;
}

// GET all Informes Críticos L3 (excluding soft-deleted)
app.get('/api/informesl3', async (req, res) => {
    try {
        const informes = await InformeL3.find({ deleted: { $ne: true } }).sort({ created_at: -1 });
        res.json(informes);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar informes críticos L3" });
    }
});

// POST new InformeL3
app.post('/api/informesl3', async (req, res) => {
    try {
        // Use provided code or generate one if missing
        if (!req.body.codigo_informe) {
            req.body.codigo_informe = await getNextInformeL3Code();
        }
        const newInforme = new InformeL3(req.body);
        await newInforme.save();

        await new AuditLog({
            action: 'CREATE',
            entity: 'InformeL3',
            entityId: newInforme._id,
            details: { codigo: newInforme.codigo_informe, titulo: newInforme.titulo }
        }).save();

        res.status(201).json({ message: "Informe Crítico L3 creado", data: newInforme });
    } catch (err) {
        console.error("POST /api/informesl3 Error:", err);
        res.status(400).json({ error: "Error al crear informe crítico L3", details: err.message });
    }
});

// PUT update InformeL3
app.put('/api/informesl3/:id', async (req, res) => {
    try {
        const updated = await InformeL3.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: "Informe Crítico L3 no encontrado" });

        await new AuditLog({
            action: 'UPDATE',
            entity: 'InformeL3',
            entityId: updated._id,
            details: { codigo: updated.codigo_informe, estado: updated.estado_atencion }
        }).save();

        res.json({ message: "Informe Crítico L3 actualizado", data: updated });
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar informe crítico L3", details: err.message });
    }
});

// DELETE InformeL3 (soft delete)
app.delete('/api/informesl3/:id', async (req, res) => {
    try {
        const informe = await InformeL3.findByIdAndUpdate(
            req.params.id,
            { deleted: true, deleted_at: new Date() },
            { new: true }
        );
        if (!informe) return res.status(404).json({ error: "Informe Crítico L3 no encontrado" });

        await new AuditLog({
            action: 'SOFT_DELETE',
            entity: 'InformeL3',
            entityId: informe._id,
            details: { codigo: informe.codigo_informe, deleted_at: informe.deleted_at }
        }).save();

        res.json({ message: "Informe Crítico L3 eliminado", codigo: informe.codigo_informe });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar informe crítico L3", details: err.message });
    }
});

// GET single InformeL3
app.get('/api/informesl3/:id', async (req, res) => {
    try {
        const informe = await InformeL3.findById(req.params.id);
        if (!informe) return res.status(404).json({ error: "Informe Crítico L3 no encontrado" });
        res.json(informe);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener informe crítico L3", details: err.message });
    }
});

// ============ PROCESOS DE NEGOCIO ENDPOINTS ============

// Generate ProcesoNegocio code: PRN-XXX-YY
async function getNextProcesoCode() {
    const year = new Date().getFullYear().toString().slice(-2);
    const pattern = new RegExp(`^PRN-\\d{3}-${year}$`);

    const procesos = await ProcesoNegocio.find({
        codigo_proceso: pattern
    }).select('codigo_proceso').lean();

    const usedNumbers = procesos
        .map(p => {
            const match = p.codigo_proceso.match(/PRN-(\d{3})-/);
            return match ? parseInt(match[1]) : null;
        })
        .filter(n => n !== null);

    const maxNum = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;
    const nextNum = maxNum + 1;

    return `PRN-${String(nextNum).padStart(3, '0')}-${year}`;
}

// GET all Procesos de Negocio (excluding soft-deleted)
app.get('/api/procesos', async (req, res) => {
    try {
        const procesos = await ProcesoNegocio.find({ deleted: { $ne: true } }).sort({ created_at: -1 });
        res.json(procesos);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar procesos de negocio" });
    }
});

// POST new ProcesoNegocio
app.post('/api/procesos', async (req, res) => {
    try {
        req.body.codigo_proceso = await getNextProcesoCode();
        const newProceso = new ProcesoNegocio(req.body);
        await newProceso.save();

        await new AuditLog({
            action: 'CREATE',
            entity: 'ProcesoNegocio',
            entityId: newProceso._id,
            details: { codigo: newProceso.codigo_proceso, nombre: newProceso.nombre_proceso }
        }).save();

        res.status(201).json({ message: "Proceso de negocio creado", data: newProceso });
    } catch (err) {
        console.error("POST /api/procesos Error:", err);
        res.status(400).json({ error: "Error al crear proceso de negocio", details: err.message });
    }
});

// PUT update ProcesoNegocio
app.put('/api/procesos/:id', async (req, res) => {
    try {
        const updated = await ProcesoNegocio.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: "Proceso no encontrado" });

        await new AuditLog({
            action: 'UPDATE',
            entity: 'ProcesoNegocio',
            entityId: updated._id,
            details: { codigo: updated.codigo_proceso, estado: updated.estado }
        }).save();

        res.json({ message: "Proceso actualizado", data: updated });
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar proceso", details: err.message });
    }
});

// DELETE ProcesoNegocio (soft delete)
app.delete('/api/procesos/:id', async (req, res) => {
    try {
        const proceso = await ProcesoNegocio.findByIdAndUpdate(
            req.params.id,
            { deleted: true, deleted_at: new Date() },
            { new: true }
        );
        if (!proceso) return res.status(404).json({ error: "Proceso no encontrado" });

        await new AuditLog({
            action: 'SOFT_DELETE',
            entity: 'ProcesoNegocio',
            entityId: proceso._id,
            details: { codigo: proceso.codigo_proceso, deleted_at: proceso.deleted_at }
        }).save();

        res.json({ message: "Proceso eliminado", codigo: proceso.codigo_proceso });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar proceso", details: err.message });
    }
});

// GET single ProcesoNegocio
app.get('/api/procesos/:id', async (req, res) => {
    try {
        const proceso = await ProcesoNegocio.findById(req.params.id);
        if (!proceso) return res.status(404).json({ error: "Proceso no encontrado" });

        // Separate controls by source type
        const mcIds = [];
        const frIds = [];
        if (proceso.controles_asociados) {
            proceso.controles_asociados.forEach(c => {
                if (!c.control_id) return;
                if (c.tipo_fuente === 'FrameworkRequirement') {
                    frIds.push(c.control_id);
                } else {
                    mcIds.push(c.control_id);
                }
            });
        }

        // Fetch both types in parallel
        const [masterControls, frameworkReqs] = await Promise.all([
            MasterControl.find({ _id: { $in: mcIds } }),
            FrameworkRequirement.find({ _id: { $in: frIds } })
        ]);

        const controlMap = {};
        masterControls.forEach(c => { controlMap[c._id.toString()] = c; });
        frameworkReqs.forEach(c => { controlMap[c._id.toString()] = c; });

        // Merge control details
        const enrichedControls = (proceso.controles_asociados || []).map(ca => {
            const info = controlMap[ca.control_id?.toString()] || null;
            return {
                ...ca.toObject(),
                control_info: info
            };
        });

        res.json({
            ...proceso.toObject(),
            controles_asociados: enrichedControls
        });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener proceso", details: err.message });
    }
});

// 4.6 Governance API Endpoints

// Strategic Objectives
app.get('/api/governance/objectives', async (req, res) => {
    try {
        const objectives = await StrategicObjective.find().sort({ created_at: -1 });
        res.json(objectives);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar objetivos estratégicos" });
    }
});

app.post('/api/governance/objectives', async (req, res) => {
    try {
        console.log("Creando Objetivo:", req.body);
        const obj = new StrategicObjective(req.body);
        await obj.save();
        res.status(201).json(obj);
    } catch (err) {
        console.error("Error al crear objetivo:", err.message);
        res.status(400).json({ error: "Error al crear objetivo", details: err.message });
    }
});

app.put('/api/governance/objectives/:id', async (req, res) => {
    try {
        const obj = await StrategicObjective.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(obj);
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar objetivo" });
    }
});

app.delete('/api/governance/objectives/:id', async (req, res) => {
    try {
        await StrategicObjective.findByIdAndDelete(req.params.id);
        res.json({ message: "Objetivo eliminado" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar objetivo" });
    }
});

// KRIs (Key Risk Indicators)
app.get('/api/governance/kris', async (req, res) => {
    try {
        const kris = await KRI.find().populate('objective_id').sort({ name: 1 });
        res.json(kris);
    } catch (err) {
        res.status(500).json({ error: "Error al recuperar KRIs" });
    }
});

app.post('/api/governance/kris', async (req, res) => {
    try {
        console.log("Creando KRI:", req.body);
        const kri = new KRI(req.body);
        await kri.save();
        res.status(201).json(kri);
    } catch (err) {
        console.error("Error al crear KRI:", err.message);
        res.status(400).json({ error: "Error al crear KRI", details: err.message });
    }
});

app.put('/api/governance/kris/:id', async (req, res) => {
    try {
        const kri = await KRI.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(kri);
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar KRI" });
    }
});

app.delete('/api/governance/kris/:id', async (req, res) => {
    try {
        await KRI.findByIdAndDelete(req.params.id);
        res.json({ message: "KRI eliminado" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar KRI" });
    }
});

// GET executive summary for Governance Dashboard
app.get('/api/governance/executive-summary', async (req, res) => {
    try {
        const procesos = await ProcesoNegocio.find({ deleted: { $ne: true } });
        const totalALE = procesos.reduce((sum, p) => sum + (p.ale_expectativa_perdida || 0), 0);

        // --- Risk Distribution by Level ---
        const riskDistribution = { 'Crítico': 0, 'Alto': 0, 'Medio': 0, 'Bajo': 0 };
        procesos.forEach(p => {
            const level = p.nivel_riesgo || 'Medio';
            if (riskDistribution[level] !== undefined) riskDistribution[level]++;
        });

        // --- Program Maturity (processes by state) ---
        const programMaturity = {
            'Identificado': 0, 'En Evaluación': 0, 'En Tratamiento': 0, 'Monitoreado': 0, 'Cerrado': 0
        };
        procesos.forEach(p => {
            const state = p.estado || 'Identificado';
            if (programMaturity[state] !== undefined) programMaturity[state]++;
        });

        // --- ALE by Area ---
        const aleByArea = {};
        procesos.forEach(p => {
            const area = p.area_responsable || 'Sin Asignar';
            aleByArea[area] = (aleByArea[area] || 0) + (p.ale_expectativa_perdida || 0);
        });

        // --- ALE by Risk Level ---
        const aleByRiskLevel = { 'Crítico': 0, 'Alto': 0, 'Medio': 0, 'Bajo': 0 };
        procesos.forEach(p => {
            const level = p.nivel_riesgo || 'Medio';
            if (aleByRiskLevel[level] !== undefined) {
                aleByRiskLevel[level] += (p.ale_expectativa_perdida || 0);
            }
        });

        // --- Top 5 processes by ALE ---
        const topProcesses = procesos
            .filter(p => (p.ale_expectativa_perdida || 0) > 0)
            .sort((a, b) => b.ale_expectativa_perdida - a.ale_expectativa_perdida)
            .slice(0, 5)
            .map(p => ({
                nombre: p.nombre_proceso,
                area: p.area_responsable,
                ale: p.ale_expectativa_perdida,
                nivel_riesgo: p.nivel_riesgo,
                estado: p.estado,
                impacto: p.impacto_negocio
            }));

        // --- KRI stats ---
        const kris = await KRI.find();
        const kriStats = {
            total: kris.length,
            critical: kris.filter(k => k.current_value >= k.threshold_critical).length,
            warning: kris.filter(k => k.current_value >= k.threshold_warning && k.current_value < k.threshold_critical).length,
            normal: kris.filter(k => k.current_value < k.threshold_warning).length
        };

        const objectivesCount = await StrategicObjective.countDocuments();

        res.json({
            totalFinancialExposure: totalALE,
            totalProcesses: procesos.length,
            riskDistribution,
            programMaturity,
            aleByArea,
            aleByRiskLevel,
            topProcesses,
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

// Get engineers list (for project assignment)
app.get('/api/users/engineers', checkPerms(['admin', 'security_manager', 'engineer']), async (req, res) => {
    try {
        const engineers = await User.find({ role: 'engineer' })
            .select('name email _id')
            .sort({ name: 1 });
        res.json(engineers);
    } catch (err) {
        console.error("GET /api/users/engineers Error:", err);
        res.status(500).json({ error: "Error al recuperar ingenieros" });
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

// 5. Manejador Global de Errores para Multer y Otros
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'El archivo es demasiado grande (Máximo 5MB)' });
        }
        return res.status(400).json({ error: `Error en la subida de archivos: ${err.message}` });
    }
    
    if (err.message === 'Tipo de archivo no permitido (Solo imágenes, PDF y Office)') {
        return res.status(400).json({ error: err.message });
    }

    console.error('SERVER ERROR RECOGNISED:', err);
    res.status(500).json({ error: 'Ha ocurrido un error inesperado en el servidor.', details: err.message });
});

// 6. Servidor con Fallback HTTPS/HTTP
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
