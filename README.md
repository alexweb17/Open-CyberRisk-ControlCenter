# 🛡️ Open CyberRisk Control Center (OCCC)

![Open CyberRisk Control Center](imagenes/logoCCC.png)

## Descripción General
Open CyberRisk Control Center (OCCC) es una plataforma integral de código abierto diseñada para optimizar la gestión de riesgos de ciberseguridad, el cumplimiento regulatorio y la gobernanza. Pensada para gerentes de seguridad, ingenieros y administradores, ofrece un panel centralizado para rastrear riesgos, gestionar controles y asegurar la alineación con estándares internacionales de seguridad.

> **SGRT – Sistema de Gobernanza de Riesgo Tecnológico**

## 🚀 Características Principales

### 📊 Gobernanza & Directorio
Alineación estratégica y cuantificación financiera del riesgo tecnológico mediante la **metodología FAIR**. Monitoreo en tiempo real de **Indicadores Clave de Riesgo (KRI)**, **Expectativa de Pérdida Anualizada (ALE)** y objetivos estratégicos.

![Gobernanza & Directorio](docs/screenshots/03_gobernanza.png)

### 🔥 Riesgos Tecnológicos
Análisis ejecutivo de riesgos con mapas de calor, gráficos de distribución por severidad y seguimiento de riesgos críticos/más antiguos para priorizar los esfuerzos de remediación.

![Riesgos Tecnológicos](docs/screenshots/04_riesgos.png)

### 📁 Proyectos de Ciberseguridad
Panel moderno de cumplimiento para dar seguimiento a proyectos de seguridad, hallazgos abiertos y porcentaje de cumplimiento global. Incluye un **Asesor de Riesgos** potenciado por IA (Vertex AI).

![Proyectos](docs/screenshots/02_proyectos.png)

### 🔍 Consultorías (RCS)
Registro de Autoevaluación de Controles de Riesgo para gestionar hallazgos y dar seguimiento a la remediación de controles derivados de consultorías de seguridad.

### 📚 Biblioteca de Marcos Regulatorios
Repositorio integrado con estándares internacionales de cumplimiento:
- **ISO/IEC 27001:2022** – Sistemas de Gestión de Seguridad de la Información (SGSI)
- **NIST SP 800-53 Rev. 5** – 313+ Controles de Seguridad y Privacidad
- **OWASP ASVS 5.0.0** – 341+ Requisitos de Seguridad en Aplicaciones
- **PCI DSS v4.0** – Estándar de Seguridad de Datos para la Industria de Tarjetas de Pago

![Biblioteca de Marcos](docs/screenshots/06_marcos.png)

### ⚠️ Informes Críticos L3
Gestión de incidentes y vulnerabilidades críticas de seguridad que representan un riesgo financiero significativo para la organización.

### ⚙️ Procesos de Negocio
Evaluación de riesgos en procesos de negocio con cuantificación financiera (FAIR-lite: Valor del Activo × Factor de Exposición × Tasa Anualizada de Ocurrencia = ALE).

### 🔐 Seguridad
- **Control de Acceso Basado en Roles (RBAC)**: Admin, Security Manager, Engineer.
- **Autenticación JWT** con hash de contraseñas mediante bcrypt.
- **Comunicación HTTPS** con certificados TLS.

## 🛠️ Stack Tecnológico
| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JavaScript (SPA) |
| **Backend** | Node.js + Express.js |
| **Base de Datos** | MongoDB + Mongoose ODM |
| **Autenticación** | JWT + bcryptjs |
| **IA** | Vertex AI (Asesor de Riesgos) |

## 📦 Instalación Rápida

### Requisitos Previos
- [Node.js](https://nodejs.org/) (v16.x o superior)
- [MongoDB](https://www.mongodb.com/) (Instancia local o cadena de conexión Atlas)
- [Git](https://git-scm.com/)

### Instalación en un paso (Linux/macOS)
```bash
bash install.sh
```

### Instalación Manual
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/alexweb17/Open-CyberRisk-ControlCenter.git
   cd Open-CyberRisk-ControlCenter
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Copia el archivo de ejemplo y actualiza los valores con los tuyos:
   ```bash
   cp .env.example .env
   ```
   *Nota: Asegúrate de actualizar `.env` con tu cadena de conexión MongoDB y un `JWT_SECRET` seguro.*

4. **Poblar la base de datos (marcos regulatorios):**
   Este repositorio incluye scripts automatizados en el directorio `scripts/` para cargar los marcos de seguridad preconfigurados (ISO 27001, NIST, OWASP ASVS, PCI DSS):
   ```bash
   node scripts/seed_master_es.js
   ```

5. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```
   Accede a la interfaz en `https://localhost:3000`.

## 🔑 Primer Inicio de Sesión

Al **iniciar el servidor por primera vez**, si no existen usuarios en la base de datos, se crea automáticamente una cuenta de administrador por defecto:

| Campo | Valor |
|---|---|
| **Email** | `admin@occc.local` |
| **Contraseña** | `OpenCyberRisk2026!` |
| **Rol** | `admin` |

> ⚠️ **IMPORTANTE:** Cambia la contraseña por defecto inmediatamente después de tu primer inicio de sesión desde el menú de perfil de usuario (icono 🔒).

## 📖 Documentación

| Documento | Descripción |
|---|---|
| [📖 Manual de Usuario](docs/MANUAL.md) | Manual completo con capturas de pantalla y explicaciones de conceptos de ciberseguridad (KRI, ALE, ISO, OWASP, PCI DSS, Informes L3, etc.) |
| [🔧 Guía para Desarrolladores](docs/DEVELOPER_GUIDE.md) | Arquitectura, endpoints API, proceso de seed, modelo de datos y convenciones de código |
| [📚 Biblioteca de Marcos](Biblioteca%20de%20Marcos/) | Archivos fuente Markdown de marcos regulatorios (NIST, OWASP ASVS, ISO 27001) |

## 🤝 Contribuciones
Las contribuciones son lo que hacen de la comunidad open-source un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será **enormemente apreciada**.

1. Haz un Fork del proyecto
2. Crea tu rama de funcionalidad (`git checkout -b feature/MiFuncionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agregar MiFuncionalidad'`)
4. Haz Push a la rama (`git push origin feature/MiFuncionalidad`)
5. Abre un Pull Request

## 📜 Licencia
Este proyecto está bajo la **Licencia MIT** – consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor
**Alex Arana Northia** - *Diseño e Implementación*

---
*Desarrollado con enfoque en eficiencia y excelencia en seguridad.*
