const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');

dotenv.config();

const frameworksData = [
    {
        name: "ISO 27001:2022",
        description: "Estándar internacional para sistemas de gestión de seguridad de la información (SGSI).",
        version: "2022",
        industry: "General",
        requirements: [
            { code: "5.1", domain: "Controles Organizacionales", requirement: "Políticas para la seguridad de la información", guidance: "Se deben definir, aprobar por la dirección, publicar y comunicar las políticas de seguridad de la información." },
            { code: "5.15", domain: "Controles Organizacionales", requirement: "Control de acceso", guidance: "Se deben establecer reglas para controlar el acceso físico y lógico a la información y otros activos asociados." },
            { code: "8.1", domain: "Controles Tecnológicos", requirement: "Dispositivos de usuario final", guidance: "La información almacenada, procesada o accesible a través de dispositivos de usuario final debe estar protegida." },
            { code: "8.10", domain: "Controles Tecnológicos", requirement: "Eliminación de información", guidance: "La información almacenada en sistemas de información, dispositivos o cualquier otro medio de almacenamiento debe eliminarse cuando ya no sea necesaria." }
        ]
    },
    {
        name: "NIST SP 800-53 Rev. 5",
        description: "Catálogo exhaustivo de controles de seguridad y privacidad para organizaciones y sistemas de información federales y de infraestructura crítica.",
        version: "Revision 5",
        industry: "Gobierno / Federal / Infraestructura Crítica",
        requirements: [
            // CONTROL FAMILY: ACCESS CONTROL (AC)
            { code: "AC-2", domain: "Control de Acceso (AC)", requirement: "Gestión de Cuentas", guidance: "La organización gestiona las cuentas de los sistemas de información, incluyendo el establecimiento, activación, modificación, revisión, inhabilitación y eliminación de las mismas." },
            { code: "AC-3", domain: "Control de Acceso (AC)", requirement: "Cumplimiento del Acceso", guidance: "El sistema de información aplica los privilegios de acceso aprobados para las transacciones lógicas y el acceso a la información." },
            { code: "AC-17", domain: "Control de Acceso (AC)", requirement: "Acceso Remoto", guidance: "La organización establece y gestiona el acceso remoto, incluyendo el monitoreo de las conexiones y el uso de criptografía para proteger las comunicaciones." },
            // CONTROL FAMILY: AUDIT AND ACCOUNTABILITY (AU)
            { code: "AU-2", domain: "Auditoría y Rendición de Cuentas (AU)", requirement: "Selección de Eventos de Auditoría", guidance: "La organización determina qué eventos deben ser auditados por el sistema de información en función de los riesgos y los requisitos de cumplimiento." },
            { code: "AU-6", domain: "Auditoría y Rendición de Cuentas (AU)", requirement: "Revisión, Análisis y Reporte de Registros de Auditoría", guidance: "La organización revisa y analiza los registros de auditoría del sistema de información en busca de indicios de actividades inusuales o sospechosas." },
            // CONTROL FAMILY: IDENTIFICATION AND AUTHENTICATION (IA)
            { code: "IA-2", domain: "Identificación y Autenticación (IA)", requirement: "Identificación y Autenticación (Organizacional)", guidance: "El sistema de información identifica y autentica de forma única a los usuarios de la organización (o procesos que actúan en nombre de los usuarios)." },
            { code: "IA-5", domain: "Identificación y Autenticación (IA)", requirement: "Gestión del Autenticador", guidance: "La organización gestiona los autenticadores del sistema de información, asegurando su protección, cambio periódico y complejidad adecuada." },
            // CONTROL FAMILY: SYSTEM AND COMMUNICATIONS PROTECTION (SC)
            { code: "SC-7", domain: "Protección de Sistemas y Comunicaciones (SC)", requirement: "Protección de Fronteras", guidance: "El sistema de información separa las comunicaciones internas de las externas y protege las fronteras del sistema mediante firewalls, gateways y proxies." },
            { code: "SC-8", domain: "Protección de Sistemas y Comunicaciones (SC)", requirement: "Transmisión de Confidencialidad e Integridad", guidance: "El sistema de información protege la confidencialidad y la integridad de la información transmitida mediante el uso de mecanismos criptográficos." },
            // CONTROL FAMILY: SYSTEM AND INFORMATION INTEGRITY (SI)
            { code: "SI-2", domain: "Integridad de Sistemas e Información (SI)", requirement: "Corrección de Fallas en el Sistema", guidance: "La organización identifica, reporta y corrige fallas en el sistema de información mediante la aplicación rápida de parches y actualizaciones de seguridad." },
            { code: "SI-4", domain: "Integridad de Sistemas e Información (SI)", requirement: "Monitoreo del Sistema de Información", guidance: "La organización monitorea el sistema de información para detectar ataques, intrusiones y el uso de software no autorizado." }
        ]
    },
    {
        name: "PCI DSS v4.0",
        description: "Estándar de seguridad de datos para la industria de tarjetas de pago, versión 4.0.",
        version: "4.0",
        industry: "Fintech / Retail / Banca",
        requirements: [
            // REQUISITO 1
            { code: "1.2.1", domain: "Controles de Seguridad de Red", requirement: "El tráfico entrante y saliente está restringido a lo necesario para el entorno de datos de tarjeta (CDE).", guidance: "Asegurar que solo el tráfico autorizado pueda entrar o salir de la red." },
            { code: "1.3.1", domain: "Controles de Seguridad de Red", requirement: "Se instalan controles de seguridad de red en todas las conexiones entre internet y el CDE.", guidance: "Mantener una frontera clara y protegida mediante firewalls o similares." },
            // REQUISITO 2
            { code: "2.2.1", domain: "Configuraciones Seguras", requirement: "Se cambian todos los valores predeterminados de los proveedores y se eliminan las cuentas innecesarias.", guidance: "Nunca dejar contraseñas por defecto en routers, servidores o aplicaciones." },
            { code: "2.2.3", domain: "Configuraciones Seguras", requirement: "Se habilitan solo las funciones, protocolos y servicios necesarios para el negocio.", guidance: "Desactivar servicios como Telnet o FTP si no son estrictamente requeridos." },
            // REQUISITO 3
            { code: "3.2.1", domain: "Protección de Datos de Cuenta", requirement: "No se almacenan datos de autenticación sensibles (como el CVV) después de la autorización.", guidance: "La persistencia de datos sensibles de la banda magnética o chip está prohibida." },
            { code: "3.4.1", domain: "Protección de Datos de Cuenta", requirement: "El número de cuenta principal (PAN) es ilegible en cualquier lugar donde se almacene.", guidance: "Usar hashing fuerte, truncamiento o tokenización." },
            // REQUISITO 4
            { code: "4.2.1", domain: "Criptografía en Transmisión", requirement: "Se utiliza criptografía sólida para proteger los datos de cuentas durante la transmisión.", guidance: "Utilizar protocolos seguros como TLS 1.2+ para datos en tránsito sobre redes públicas." },
            // REQUISITO 5
            { code: "5.2.1", domain: "Protección contra Malware", requirement: "Se implementan y mantienen soluciones antivirus en todos los activos del sistema.", guidance: "Asegurar que los escaneos estén activos y las firmas actualizadas." },
            // REQUISITO 6
            { code: "6.2.1", domain: "Desarrollo Seguro", requirement: "Las vulnerabilidades de seguridad se identifican y asignan con una clasificación de riesgo.", guidance: "Mantener un proceso para detectar y parchear vulnerabilidades críticas en 30 días." },
            { code: "6.2.4", domain: "Desarrollo Seguro", requirement: "Se realizan revisiones de código para identificar fallas de seguridad en aplicaciones personalizadas.", guidance: "Asegurar que el código sea revisado por alguien distinto al autor antes de producción." },
            // REQUISITO 7
            { code: "7.2.1", domain: "Restricción de Acceso", requirement: "El acceso a los componentes del sistema se basa en la necesidad de saber del negocio.", guidance: "Aplicar el principio de mínimo privilegio (Least Privilege)." },
            // REQUISITO 8
            { code: "8.4.1", domain: "Identificación y Autenticación", requirement: "Se implementa autenticación multifactor (MFA) para todos los accesos al CDE.", guidance: "Obligatorio para cualquier usuario que acceda a la red de datos de tarjeta." },
            // REQUISITO 9
            { code: "9.2.1", domain: "Acceso Físico", requirement: "Se utilizan controles de entrada para limitar el acceso físico a las áreas de datos de tarjetas.", guidance: "Uso de tarjetas de acceso, cámaras y registros de visitantes." },
            // REQUISITO 10
            { code: "10.2.1", domain: "Registro y Monitoreo", requirement: "Se implementan registros de auditoría para todas las acciones de usuarios con privilegios administrativos.", guidance: "Rastrear quién hizo qué y cuándo en los sistemas críticos." },
            // REQUISITO 11
            { code: "11.2.1", domain: "Pruebas de Seguridad", requirement: "Se realizan escaneos de vulnerabilidades internos y externos trimestralmente.", guidance: "Los escaneos externos deben ser realizados por un ASV aprobado por el PCI SSC." },
            { code: "11.3.1", domain: "Pruebas de Seguridad", requirement: "Se realizan pruebas de penetración al menos una vez al año y tras cambios significativos.", guidance: "Verificar la efectividad de los controles de segmentación y seguridad." },
            // REQUISITO 12
            { code: "12.1.1", domain: "Políticas Organizacionales", requirement: "Se establece, mantiene y difunde una política de seguridad de la información.", guidance: "La política debe ser revisada anualmente y aceptada por todo el personal." }
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para seeding de marcos...");

        // Clear existing data
        await Framework.deleteMany({});
        await FrameworkRequirement.deleteMany({});
        console.log("Limpieza de datos previa completada.");

        for (const fData of frameworksData) {
            const { requirements, ...fInfo } = fData;
            const framework = new Framework(fInfo);
            await framework.save();
            console.log(`Marco guardado: ${framework.name}`);

            const reqsToSave = requirements.map(r => ({
                ...r,
                framework_id: framework._id
            }));
            await FrameworkRequirement.insertMany(reqsToSave);
            console.log(`  Requisitos guardados para ${framework.name}: ${reqsToSave.length}`);
        }

        console.log("Seeding completado satisfactoriamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error durante el seeding:", err);
        process.exit(1);
    }
}

seed();
