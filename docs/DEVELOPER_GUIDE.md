# 🔧 Guía para Desarrolladores - Open CyberRisk Control Center (OCCC)

Esta guía está dirigida a desarrolladores que deseen contribuir, mantener o extender el Open CyberRisk Control Center.

---

## Arquitectura del Proyecto

```
OpenCyberRiskControlCenter/
├── server.js                 # Servidor Express + API REST completa
├── index.html                # SPA (Single Page Application)
├── index.css                 # Estilos de la página de login
├── authConfig.js             # Configuración de autenticación global
├── install.sh                # Script de instalación automatizada
├── package.json              # Dependencias del proyecto
│
├── models/                   # Modelos Mongoose (MongoDB)
│   ├── User.js               # Usuarios con RBAC y bcrypt
│   ├── Project.js            # Proyectos de ciberseguridad
│   ├── RCS.js                # Consultorías (Risk Control Self-assessment)
│   ├── InformeL3.js          # Informes Críticos Nivel 3
│   ├── ProcesoNegocio.js     # Procesos de negocio con FAIR-lite
│   ├── KRI.js                # Key Risk Indicators
│   ├── StrategicObjective.js # Objetivos estratégicos
│   ├── Framework.js          # Marcos regulatorios
│   ├── FrameworkRequirement.js # Requisitos de cada marco
│   ├── MasterControl.js      # Controles maestros
│   └── AuditLog.js           # Registro de auditoría
│
├── js/                       # Lógica del frontend (módulos)
│   ├── main.js               # Navegación y lógica general
│   ├── auth.js               # Autenticación (login/logout/signup)
│   ├── projects.js           # Gestión de proyectos
│   ├── rcs.js                # Gestión de consultorías
│   ├── informes.js           # Informes Críticos L3
│   ├── procesos.js           # Procesos de negocio
│   ├── gobernanza.js         # Gobernanza (KRIs, ALE, Objetivos)
│   ├── marcos.js             # Biblioteca de marcos regulatorios
│   ├── controls.js           # Controles maestros
│   ├── risks.js              # Análisis de riesgos tecnológicos
│   └── users.js              # Gestión de usuarios (admin)
│
├── css/                      # Hojas de estilo por módulo
│
├── scripts/                  # Scripts de seeding y utilidades
│   ├── seed_master_es.js     # Orquestador maestro de seeding
│   ├── seed_frameworks.js    # Seeding no-destructivo de marcos
│   ├── seed_iso27001.js      # ISO 27001 (datos embebidos)
│   ├── seed_owasp_asvs.js    # OWASP ASVS EN (datos embebidos)
│   ├── seed_pcidss.js        # PCI DSS (datos embebidos)
│   ├── seed_nist.js          # NIST SP 800-53 (desde Markdown)
│   ├── seed_nist_es.js       # NIST SP 800-53 ES (desde Markdown)
│   ├── seed_owasp_asvs_es.js # OWASP ASVS ES (desde Markdown)
│   └── utils/
│       └── mdParser.js       # Parser de archivos Markdown para seeding
│
├── Biblioteca de Marcos/     # Fuente de verdad de estándares (.md)
│   ├── NIST _SP800-53.md
│   ├── ASVS_OWASP.md
│   └── ISO_27001.md
│
└── docs/                     # Documentación y manual de usuario
    ├── MANUAL.md
    ├── DEVELOPER_GUIDE.md
    └── screenshots/
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JavaScript (SPA) |
| **Backend** | Node.js + Express.js |
| **Base de datos** | MongoDB + Mongoose ODM |
| **Autenticación** | JWT + bcryptjs |
| **Comunicación** | HTTPS con certificados autogenerados (cert.pem/key.pem) |

---

## Configuración del Entorno

### Variables de entorno (.env)

```env
MONGO_URI=mongodb://usuario:password@host:port/ccc_system?authSource=admin
JWT_SECRET=tu_clave_secreta_jwt
PORT=3000
```

### Instalación rápida

```bash
git clone https://github.com/alexweb17/Open-CyberRisk-ControlCenter.git
cd Open-CyberRisk-ControlCenter
npm install     # Las dependencias ya están incluidas en node_modules
npm start       # Inicia el servidor en https://localhost:3000
```

---

## Seeding de Datos

### Esquema de seeding

El proceso de seeding carga los marcos regulatorios en la base de datos. Los datos provienen de dos fuentes:

1. **Datos embebidos**: Los scripts `seed_iso27001.js`, `seed_owasp_asvs.js` y `seed_pcidss.js` contienen los requisitos directamente en el código.
2. **Archivos Markdown**: Los scripts `seed_nist.js`, `seed_nist_es.js` y `seed_owasp_asvs_es.js` utilizan `scripts/utils/mdParser.js` para parsear los archivos `.md` de la `Biblioteca de Marcos/`.

### Ejecutar seeding completo

```bash
node scripts/seed_master_es.js   # Ejecuta todos los seeders en orden
```

### Ejecutar seeders individuales

```bash
node scripts/seed_nist.js          # NIST SP 800-53 (Español)
node scripts/seed_owasp_asvs_es.js # OWASP ASVS 5.0 (Español)
node scripts/seed_iso27001.js      # ISO 27001:2022
node scripts/seed_pcidss.js        # PCI DSS v4.0
```

---

## API REST - Endpoints Principales

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/signup` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión (retorna JWT) |

### Proyectos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects` | Listar proyectos |
| POST | `/api/projects` | Crear proyecto |
| PUT | `/api/projects/:id` | Actualizar proyecto |
| DELETE | `/api/projects/:id` | Eliminar proyecto |

### Consultorías (RCS)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/rcs` | Listar consultorías |
| POST | `/api/rcs` | Crear consultoría |
| PUT | `/api/rcs/:id` | Actualizar consultoría |
| DELETE | `/api/rcs/:id` | Eliminar (soft delete) |

### Marcos Regulatorios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/frameworks` | Listar marcos |
| GET | `/api/frameworks/:id/requirements` | Requisitos de un marco |

### Gobernanza
| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/strategic-objectives` | Objetivos estratégicos |
| GET/POST | `/api/kris` | Indicadores de riesgo (KRIs) |
| GET/POST | `/api/procesos` | Procesos de negocio |

### Informes L3
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/informes` | Listar informes |
| POST | `/api/informes` | Crear informe |
| PUT | `/api/informes/:id` | Actualizar informe |

---

## Agregar un Nuevo Marco Regulatorio

Para agregar un nuevo estándar (ej: SOC 2, LGPD, HIPAA):

1. Crear el archivo Markdown en `Biblioteca de Marcos/NOMBRE_MARCO.md`.
2. Añadir un parser si el formato es diferente en `scripts/utils/mdParser.js`.
3. Crear el script de seeding `scripts/seed_nuevo_marco.js`.
4. Registrar el nuevo script en `scripts/seed_master_es.js`.

Consulte la guía detallada en `.agent/skills/onboarding_framework/SKILL.md`.

---

## Modelo de Datos

```
User ──────── Projects ──── MasterControl
  │                              │
  │           RCS ──── ControlAsociado ──── FrameworkRequirement
  │                              │
  │           InformeL3          │
  │                          Framework
  │
  ├── StrategicObjective ── KRI
  │
  └── ProcesoNegocio ── ControlAsociado
```

---

## Convenciones de Código

- **Idioma del código**: Inglés para nombres de variables, funciones y modelos.
- **Idioma de la UI**: Español para toda la interfaz de usuario y mensajes.
- **Soft delete**: Los modelos `RCS`, `InformeL3` y `ProcesoNegocio` usan eliminación lógica (campo `deleted`).
- **Timestamps**: Todos los modelos incluyen `created_at` y `updated_at`.

---

*Guía mantenida por el equipo de Open CyberRisk Control Center – Marzo 2026.*
