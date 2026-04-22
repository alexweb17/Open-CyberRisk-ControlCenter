const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MasterControl = require('../models/MasterControl');

dotenv.config();

const expertControls = [
    {
        codigo_control: "ACC-001",
        dominio: "Gestión de Accesos",
        lineamiento: "Autenticación Multifactor (MFA)",
        recomendacion: "Implementar MFA para todos los accesos administrativos y remotos a la infraestructura crítica y aplicaciones corporativas.",
        severidad: "Crítica",
        estandar_referencia: "ISO 27001 / NIST SP 800-53",
        punto_especifico: "Control de Acceso Lógico",
        sla_dias: 30,
        guia_evidencia: "Capturas de pantalla de la configuración de MFA, logs de autenticación exitosa con segundo factor."
    },
    {
        codigo_control: "DAT-001",
        dominio: "Datos Personales",
        lineamiento: "Cifrado de Datos en Reposo",
        recomendacion: "Cifrar todas las bases de datos y volúmenes de almacenamiento que contengan información sensible (PII, datos financieros).",
        severidad: "Crítica",
        estandar_referencia: "GDPR / PCI DSS",
        punto_especifico: "Protección de Datos",
        sla_dias: 45,
        guia_evidencia: "Certificado de cifrado de volumen, configuración de KMS (Key Management Service)."
    },
    {
        codigo_control: "INF-001",
        dominio: "Infraestructura",
        lineamiento: "Gestión Centralizada de Logs (SIEM)",
        recomendacion: "Implementar un sistema de gestión de eventos e información de seguridad (SIEM) para centralizar y analizar logs de servidores y red.",
        severidad: "Alta",
        estandar_referencia: "NIST IR",
        punto_especifico: "Monitoreo de Seguridad",
        sla_dias: 60,
        guia_evidencia: "Configuración de agentes de log, Dashboard de alertas del SIEM."
    },
    {
        codigo_control: "INF-002",
        dominio: "Infraestructura",
        lineamiento: "Gestión de Parches de Seguridad",
        recomendacion: "Establecer un proceso mensual de actualización de parches de seguridad para sistemas operativos y aplicaciones críticas.",
        severidad: "Alta",
        estandar_referencia: "NIST SP 800-40",
        punto_especifico: "Vulnerability Management",
        sla_dias: 30,
        guia_evidencia: "Reporte de cumplimiento de parches, inventario de sistemas actualizados."
    },
    {
        codigo_control: "ACC-002",
        dominio: "Gestión de Accesos",
        lineamiento: "Revisión Periódica de Privilegios",
        recomendacion: "Realizar una revisión formal trimestral de los accesos de usuarios para asegurar el principio de mínimo privilegio.",
        severidad: "Media",
        estandar_referencia: "ISO 27001 A.9.2.5",
        punto_especifico: "Revisión de Derechos de Acceso",
        sla_dias: 90,
        guia_evidencia: "Actas de reunión de revisión de accesos, logs de revocación de permisos innecesarios."
    },
    {
        codigo_control: "DEV-001",
        dominio: "Codificación Segura",
        lineamiento: "Análisis Estático de Código (SAST)",
        recomendacion: "Integrar herramientas de análisis estático de seguridad (SAST) en los pipelines de CI/CD para detectar vulnerabilidades antes del despliegue.",
        severidad: "Alta",
        estandar_referencia: "OWASP ASVS",
        punto_especifico: "Ciclo de Vida de Desarrollo Seguro",
        sla_dias: 60,
        guia_evidencia: "Reporte de escaneo integrados en el pipeline, registro de remediación de hallazgos críticos."
    },
    {
        codigo_control: "INF-003",
        dominio: "Infraestructura",
        lineamiento: "Respaldo y Recuperación ante Desastres",
        recommendation: "Realizar respaldos diarios automatizados de bases de datos críticas y asegurar que una copia se mantenga fuera de línea o en una región distinta.",
        severidad: "Crítica",
        estandar_referencia: "ISO 27001 A.12.3",
        punto_especifico: "Continuidad del Negocio",
        sla_dias: 30,
        guia_evidencia: "Logs de éxito de backups, reporte de prueba de restauración semestral."
    },
    {
        codigo_control: "INF-004",
        dominio: "Infraestructura",
        lineamiento: "Pruebas de Penetración Anuales",
        recomendacion: "Ejecutar pruebas de penetración externas e internas al menos una vez al año por un tercero independiente.",
        severidad: "Alta",
        estandar_referencia: "PCI DSS / NIST",
        punto_especifico: "Validación de Controles",
        sla_dias: 365,
        guia_evidencia: "Resumen ejecutivo del reporte del Pentest, plan de remediación de hallazgos."
    },
    {
        codigo_control: "AIA-001",
        dominio: "Seguridad en IA/Automatizaciones",
        lineamiento: "Monitoreo de Inputs/Outputs en Modelos de IA",
        recomendacion: "Implementar filtros de seguridad para validar entradas (prompt injection) y salidas (fuga de datos) en aplicaciones basadas en IA generativa.",
        severidad: "Alta",
        estandar_referencia: "OWASP Top 10 for LLM",
        punto_especifico: "Seguridad en IA",
        sla_dias: 60,
        guia_evidencia: "Configuración de guardrails, logs de bloqueos de prompts maliciosos."
    },
    {
        codigo_control: "ARQ-001",
        dominio: "Arquitectura",
        lineamiento: "Segmentación de Red",
        recomendacion: "Segmentar la red interna en zonas de confianza (DMZ, Interna, Datos) utilizando firewalls y listas de control de acceso (ACL).",
        severidad: "Crítica",
        estandar_referencia: "NIST Zerotrust",
        punto_especifico: "Defensa en Profundidad",
        sla_dias: 90,
        guia_evidencia: "Diagrama de red segmentada, reglas de firewall auditadas."
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para seeding de controles expertos...");

        // Usamos upsert basado en codigo_control
        for (const controlData of expertControls) {
            await MasterControl.findOneAndUpdate(
                { codigo_control: controlData.codigo_control },
                controlData,
                { upsert: true, new: true }
            );
            console.log(`Control procesado: ${controlData.codigo_control} - ${controlData.lineamiento}`);
        }

        console.log("Seeding de controles expertos completado satisfactoriamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error durante el seeding de controles expertos:", err);
        process.exit(1);
    }
}

seed();
