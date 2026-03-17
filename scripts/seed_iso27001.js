const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');

dotenv.config();

// ISO 27001:2022 Annex A — All 93 Controls
const isoRequirements = [
    // ── 5. Controles Organizacionales (37) ──
    { code: "5.1", domain: "Controles Organizacionales", requirement: "Políticas para la seguridad de la información", guidance: "Se debe definir, aprobar por la dirección, publicar, comunicar y dar a conocer a todo el personal pertinente y a las partes interesadas un conjunto de políticas para la seguridad de la información." },
    { code: "5.2", domain: "Controles Organizacionales", requirement: "Roles y responsabilidades de seguridad de la información", guidance: "Se deben definir y asignar los roles y responsabilidades de seguridad de la información." },
    { code: "5.3", domain: "Controles Organizacionales", requirement: "Segregación de funciones", guidance: "Se deben segregar las funciones y áreas de responsabilidad en conflicto." },
    { code: "5.4", domain: "Controles Organizacionales", requirement: "Responsabilidades de la dirección", guidance: "La dirección debe exigir a todo el personal que aplique la seguridad de la información de acuerdo con las políticas y procedimientos establecidos." },
    { code: "5.5", domain: "Controles Organizacionales", requirement: "Contacto con las autoridades", guidance: "Se deben mantener contactos apropiados con las autoridades pertinentes." },
    { code: "5.6", domain: "Controles Organizacionales", requirement: "Contacto con grupos de interés especial", guidance: "Se deben mantener contactos con grupos de interés especial u otros foros de seguridad especializados y asociaciones profesionales." },
    { code: "5.7", domain: "Controles Organizacionales", requirement: "Inteligencia de amenazas", guidance: "Se debe recopilar y analizar la información relativa a las amenazas a la seguridad de la información para producir inteligencia de amenazas." },
    { code: "5.8", domain: "Controles Organizacionales", requirement: "Seguridad de la información en la gestión de proyectos", guidance: "La seguridad de la información se debe integrar en la gestión de proyectos." },
    { code: "5.9", domain: "Controles Organizacionales", requirement: "Inventario de información y otros activos asociados", guidance: "Se debe elaborar y mantener un inventario de la información y otros activos asociados, incluidos sus propietarios." },
    { code: "5.10", domain: "Controles Organizacionales", requirement: "Uso aceptable de la información y otros activos asociados", guidance: "Se deben identificar, documentar e implementar reglas para el uso aceptable y procedimientos para el manejo de la información y otros activos asociados." },
    { code: "5.11", domain: "Controles Organizacionales", requirement: "Devolución de activos", guidance: "El personal y otras partes interesadas, según corresponda, deben devolver todos los activos de la organización que estén en su poder al cambiar o finalizar su empleo, contrato o acuerdo." },
    { code: "5.12", domain: "Controles Organizacionales", requirement: "Clasificación de la información", guidance: "La información se debe clasificar de acuerdo con las necesidades de seguridad de la organización basándose en la confidencialidad, integridad, disponibilidad y los requisitos pertinentes de las partes interesadas." },
    { code: "5.13", domain: "Controles Organizacionales", requirement: "Etiquetado de información", guidance: "Se debe desarrollar e implementar un conjunto apropiado de procedimientos para el etiquetado de la información de acuerdo con el esquema de clasificación de la información adoptado." },
    { code: "5.14", domain: "Controles Organizacionales", requirement: "Transferencia de información", guidance: "Deben existir reglas, procedimientos o acuerdos de transferencia de información para todos los tipos de instalaciones de transferencia dentro de la organización y entre la organización y otras partes." },
    { code: "5.15", domain: "Controles Organizacionales", requirement: "Control de acceso", guidance: "Se deben establecer e implementar reglas para controlar el acceso físico y lógico a la información y otros activos asociados basándose en los requisitos de negocio y de seguridad de la información." },
    { code: "5.16", domain: "Controles Organizacionales", requirement: "Gestión de identidades", guidance: "Se debe gestionar el ciclo de vida completo de las identidades." },
    { code: "5.17", domain: "Controles Organizacionales", requirement: "Información de autenticación", guidance: "La asignación y gestión de la información de autenticación se debe controlar mediante un proceso de gestión, que incluya el asesoramiento al personal sobre el manejo adecuado." },
    { code: "5.18", domain: "Controles Organizacionales", requirement: "Derechos de acceso", guidance: "Los derechos de acceso a la información y otros activos asociados se deben proveer, revisar, modificar y eliminar de acuerdo con la política de control de acceso específica de la organización." },
    { code: "5.19", domain: "Controles Organizacionales", requirement: "Seguridad de la información en las relaciones con proveedores", guidance: "Se deben definir e implementar procesos y procedimientos para gestionar los riesgos de seguridad de la información asociados con el uso de productos o servicios de proveedores." },
    { code: "5.20", domain: "Controles Organizacionales", requirement: "Abordaje de la seguridad de la información en los acuerdos con proveedores", guidance: "Se deben establecer y acordar los requisitos de seguridad de la información pertinentes con cada proveedor basándose en el tipo de relación con el proveedor." },
    { code: "5.21", domain: "Controles Organizacionales", requirement: "Gestión de la seguridad de la información en la cadena de suministro de TIC", guidance: "Se deben definir e implementar procesos y procedimientos para gestionar los riesgos de seguridad de la información asociados con la cadena de suministro de productos y servicios de TIC." },
    { code: "5.22", domain: "Controles Organizacionales", requirement: "Monitoreo, revisión y gestión del cambio de los servicios de los proveedores", guidance: "La organización debe monitorear, revisar, evaluar y gestionar regularmente los cambios en las prácticas de seguridad de la información de los proveedores y en la prestación de sus servicios." },
    { code: "5.23", domain: "Controles Organizacionales", requirement: "Seguridad de la información para el uso de servicios en la nube", guidance: "Se deben establecer procesos para la adquisición, uso, gestión y salida de los servicios en la nube de acuerdo con los requisitos de seguridad de la información de la organización." },
    { code: "5.24", domain: "Controles Organizacionales", requirement: "Planeación y preparación de la gestión de incidentes de seguridad de la información", guidance: "La organización debe planear y prepararse para gestionar incidentes de seguridad de la información definiendo, estableciendo y comunicando procesos, roles y responsabilidades de gestión de incidentes." },
    { code: "5.25", domain: "Controles Organizacionales", requirement: "Evaluación y decisión sobre eventos de seguridad de la información", guidance: "La organización debe evaluar los eventos de seguridad de la información y decidir si se categorizarán como incidentes de seguridad de la información." },
    { code: "5.26", domain: "Controles Organizacionales", requirement: "Respuesta a incidentes de seguridad de la información", guidance: "Se debe responder a los incidentes de seguridad de la información de acuerdo con los procedimientos documentados." },
    { code: "5.27", domain: "Controles Organizacionales", requirement: "Aprendizaje de los incidentes de seguridad de la información", guidance: "El conocimiento obtenido de los incidentes de seguridad de la información se debe utilizar para fortalecer y mejorar los controles de seguridad de la información." },
    { code: "5.28", domain: "Controles Organizacionales", requirement: "Recopilación de evidencia", guidance: "La organización debe establecer e implementar procedimientos para la identificación, recopilación, adquisición y preservación de evidencia relacionada con eventos de seguridad de la información." },
    { code: "5.29", domain: "Controles Organizacionales", requirement: "Seguridad de la información durante la interrupción", guidance: "La organización debe planear cómo mantener la seguridad de la información a un nivel adecuado durante la interrupción." },
    { code: "5.30", domain: "Controles Organizacionales", requirement: "Preparación de las TIC para la continuidad del negocio", guidance: "La preparación de las TIC se debe planear, implementar, mantener y probar basándose en los objetivos de continuidad del negocio y los requisitos de continuidad de las TIC." },
    { code: "5.31", domain: "Controles Organizacionales", requirement: "Requisitos legales, estatutarios, regulatorios y contractuales", guidance: "Se deben identificar, documentar y mantener actualizados los requisitos legales, estatutarios, regulatorios y contractuales pertinentes para la seguridad de la información y el enfoque de la organización para cumplir estos requisitos." },
    { code: "5.32", domain: "Controles Organizacionales", requirement: "Derechos de propiedad intelectual", guidance: "La organización debe implementar procedimientos apropiados para proteger los derechos de propiedad intelectual." },
    { code: "5.33", domain: "Controles Organizacionales", requirement: "Protección de registros", guidance: "Los registros se deben proteger contra pérdida, destrucción, falsificación, acceso no autorizado y divulgación no autorizada." },
    { code: "5.34", domain: "Controles Organizacionales", requirement: "Privacidad y protección de la información de identificación personal (PII)", guidance: "La organización debe identificar y cumplir los requisitos relativos a la preservación de la privacidad y la protección de la PII según lo exija la legislación y reglamentación aplicable, y los requisitos contractuales." },
    { code: "5.35", domain: "Controles Organizacionales", requirement: "Revisión independiente de la seguridad de la información", guidance: "El enfoque de la organización para gestionar la seguridad de la información y su implementación se deben revisar de forma independiente a intervalos planificados o cuando ocurran cambios significativos." },
    { code: "5.36", domain: "Controles Organizacionales", requirement: "Cumplimiento con políticas, reglas y estándares para la seguridad de la información", guidance: "Se debe revisar regularmente el cumplimiento con la política de seguridad de la información de la organización, las políticas específicas del tema, las reglas y los estándares." },
    { code: "5.37", domain: "Controles Organizacionales", requirement: "Procedimientos operativos documentados", guidance: "Los procedimientos operativos para las instalaciones de procesamiento de información se deben documentar y poner a disposición del personal que los necesite." },

    // ── 6. Controles de Personas (8) ──
    { code: "6.1", domain: "Controles de Personas", requirement: "Investigación de antecedentes", guidance: "Se deben llevar a cabo verificaciones de antecedentes de todos los candidatos para convertirse en personal antes de unirse a la organización." },
    { code: "6.2", domain: "Controles de Personas", requirement: "Términos y condiciones de empleo", guidance: "Los acuerdos contractuales de empleo deben establecer las responsabilidades del personal y de la organización en materia de seguridad de la información." },
    { code: "6.3", domain: "Controles de Personas", requirement: "Concientización, educación y formación en seguridad de la información", guidance: "El personal de la organización y las partes interesadas pertinentes deben recibir concientización, educación y formación adecuadas en materia de seguridad de la información, así como actualizaciones periódicas de las políticas de seguridad de la información de la organización." },
    { code: "6.4", domain: "Controles de Personas", requirement: "Proceso disciplinario", guidance: "Se debe formalizar y comunicar un proceso disciplinario para emprender acciones contra el personal y otras partes interesadas pertinentes que hayan cometido una violación de la política de seguridad de la información." },
    { code: "6.5", domain: "Controles de Personas", requirement: "Responsabilidades después de la terminación o cambio de empleo", guidance: "Se deben definir, hacer cumplir y comunicar al personal pertinente las responsabilidades y deberes de seguridad de la información que sigan siendo válidos después de la terminación o el cambio de empleo." },
    { code: "6.6", domain: "Controles de Personas", requirement: "Acuerdos de confidencialidad o no divulgación", guidance: "Se deben identificar, documentar, revisar regularmente y firmar por parte del personal acuerdos de confidencialidad o no divulgación que reflejen las necesidades de la organización para la protección de la información." },
    { code: "6.7", domain: "Controles de Personas", requirement: "Teletrabajo", guidance: "Se deben implementar medidas de seguridad cuando el personal trabaje de forma remota para proteger la información a la que se accede, se procesa o se almacena fuera de las instalaciones de la organización." },
    { code: "6.8", domain: "Controles de Personas", requirement: "Notificación de eventos de seguridad de la información", guidance: "La organización debe proporcionar un mecanismo para que el personal informe sobre eventos de seguridad de la información observados o sospechosos a través de los canales apropiados de manera oportuna." },

    // ── 7. Controles Físicos (14) ──
    { code: "7.1", domain: "Controles Físicos", requirement: "Perímetros de seguridad física", guidance: "Se deben definir y utilizar perímetros de seguridad para proteger las áreas que contienen información y otros activos asociados." },
    { code: "7.2", domain: "Controles Físicos", requirement: "Entrada física", guidance: "Las áreas seguras deben estar protegidas por controles de entrada y puntos de acceso adecuados." },
    { code: "7.3", domain: "Controles Físicos", requirement: "Aseguramiento de oficinas, salas e instalaciones", guidance: "Se debe diseñar e implementar la seguridad física de las oficinas, salas e instalaciones." },
    { code: "7.4", domain: "Controles Físicos", requirement: "Monitoreo de seguridad física", guidance: "Las instalaciones se deben monitorear continuamente para detectar el acceso físico no autorizado." },
    { code: "7.5", domain: "Controles Físicos", requirement: "Protección contra amenazas físicas y ambientales", guidance: "Se debe diseñar e implementar la protección contra amenazas físicas y ambientales, tales como desastres naturales y otras amenazas físicas intencionales o no intencionales a la infraestructura." },
    { code: "7.6", domain: "Controles Físicos", requirement: "Trabajo en áreas seguras", guidance: "Se deben diseñar e implementar medidas de seguridad para el trabajo en áreas seguras." },
    { code: "7.7", domain: "Controles Físicos", requirement: "Escritorio limpio y pantalla limpia", guidance: "Se deben definir y hacer cumplir adecuadamente reglas de escritorio limpio para documentos y medios de almacenamiento extraíbles, y reglas de pantalla limpia para las instalaciones de procesamiento de información." },
    { code: "7.8", domain: "Controles Físicos", requirement: "Ubicación y protección de equipos", guidance: "Los equipos se deben ubicar de forma segura y protegerse." },
    { code: "7.9", domain: "Controles Físicos", requirement: "Seguridad de los activos fuera de las instalaciones", guidance: "Los activos fuera de las instalaciones deben estar protegidos." },
    { code: "7.10", domain: "Controles Físicos", requirement: "Medios de almacenamiento", guidance: "Los medios de almacenamiento se deben gestionar a lo largo de su ciclo de vida de adquisición, uso, transporte y eliminación de acuerdo con el esquema de clasificación y los requisitos de manejo de la organización." },
    { code: "7.11", domain: "Controles Físicos", requirement: "Suministro de servicios públicos", guidance: "Las instalaciones de procesamiento de información deben estar protegidas contra fallas de energía y otras interrupciones causadas por fallas en los servicios públicos de apoyo." },
    { code: "7.12", domain: "Controles Físicos", requirement: "Seguridad del cableado", guidance: "Los cables que transportan energía, datos o servicios de información de apoyo deben estar protegidos contra la interceptación, interferencia o daños." },
    { code: "7.13", domain: "Controles Físicos", requirement: "Mantenimiento de equipos", guidance: "Los equipos se deben mantener correctamente para asegurar la disponibilidad, integridad y confidencialidad de la información." },
    { code: "7.14", domain: "Controles Físicos", requirement: "Eliminación segura o reutilización de equipos", guidance: "Los elementos de equipo que contengan medios de almacenamiento se deben verificar para asegurar que cualquier dato sensible y software bajo licencia haya sido eliminado o sobrescrito de forma segura antes de su eliminación o reutilización." },

    // ── 8. Controles Tecnológicos (34) ──
    { code: "8.1", domain: "Controles Tecnológicos", requirement: "Dispositivos de usuario final", guidance: "La información almacenada, procesada o accesible a través de dispositivos de usuario final debe estar protegida." },
    { code: "8.2", domain: "Controles Tecnológicos", requirement: "Derechos de acceso privilegiados", guidance: "La asignación y el uso de los derechos de acceso privilegiados deben restringirse y gestionarse." },
    { code: "8.3", domain: "Controles Tecnológicos", requirement: "Restricción de acceso a la información", guidance: "El acceso a la información y otros activos asociados debe restringirse de acuerdo con la política específica de control de acceso establecida." },
    { code: "8.4", domain: "Controles Tecnológicos", requirement: "Acceso al código fuente", guidance: "El acceso de lectura y escritura al código fuente, las herramientas de desarrollo y las bibliotecas de software deben gestionarse adecuadamente." },
    { code: "8.5", domain: "Controles Tecnológicos", requirement: "Autenticación segura", guidance: "Se deben establecer e implementar tecnologías y procedimientos de autenticación segura basados en las restricciones de acceso a la información y en la política específica de control de acceso." },
    { code: "8.6", domain: "Controles Tecnológicos", requirement: "Gestión de la capacidad", guidance: "El uso de los recursos se debe monitorear y ajustar de acuerdo con los requisitos de capacidad actuales y esperados." },
    { code: "8.7", domain: "Controles Tecnológicos", requirement: "Protección contra malware", guidance: "La protección contra el malware se debe implementar y apoyar mediante la concientización adecuada del usuario." },
    { code: "8.8", domain: "Controles Tecnológicos", requirement: "Gestión de vulnerabilidades técnicas", guidance: "Se debe obtener información sobre las vulnerabilidades técnicas de los sistemas de información en uso, evaluar la exposición de la organización a tales vulnerabilidades y tomar las medidas adecuadas." },
    { code: "8.9", domain: "Controles Tecnológicos", requirement: "Gestión de la configuración", guidance: "Las configuraciones, incluidas las de seguridad, del hardware, el software, los servicios y las redes se deben establecer, documentar, implementar, monitorear y revisar." },
    { code: "8.10", domain: "Controles Tecnológicos", requirement: "Eliminación de información", guidance: "La información almacenada en los sistemas de información, los dispositivos o en cualquier otro medio de almacenamiento se debe eliminar cuando ya no sea necesaria." },
    { code: "8.11", domain: "Controles Tecnológicos", requirement: "Enmascaramiento de datos", guidance: "El enmascaramiento de datos se debe utilizar de acuerdo con la política específica de control de acceso de la organización y otras políticas específicas relacionadas, así como con los requisitos de negocio, teniendo en cuenta la legislación aplicable." },
    { code: "8.12", domain: "Controles Tecnológicos", requirement: "Prevención de fuga de datos", guidance: "Se deben aplicar medidas de prevención de fuga de datos a los sistemas, redes y cualquier otro dispositivo que procese, almacene o transmita información sensible." },
    { code: "8.13", domain: "Controles Tecnológicos", requirement: "Respaldo de información", guidance: "Se deben mantener copias de respaldo de la información, el software y los sistemas, y probarse regularmente de acuerdo con la política de respaldo específica acordada." },
    { code: "8.14", domain: "Controles Tecnológicos", requirement: "Redundancia de las instalaciones de procesamiento de información", guidance: "Las instalaciones de procesamiento de información deben implementarse con la redundancia suficiente para cumplir con los requisitos de disponibilidad." },
    { code: "8.15", domain: "Controles Tecnológicos", requirement: "Registro de eventos (Logging)", guidance: "Se deben producir, almacenar, proteger y analizar registros que recojan las actividades, excepciones, fallas y otros eventos pertinentes." },
    { code: "8.16", domain: "Controles Tecnológicos", requirement: "Actividades de monitoreo", guidance: "Se deben monitorear las redes, los sistemas y las aplicaciones para detectar comportamientos anómalos y tomar las medidas adecuadas para evaluar posibles incidentes de seguridad de la información." },
    { code: "8.17", domain: "Controles Tecnológicos", requirement: "Sincronización de relojes", guidance: "Los relojes de los sistemas de procesamiento de información utilizados por la organización deben sincronizarse con fuentes de tiempo aprobadas." },
    { code: "8.18", domain: "Controles Tecnológicos", requirement: "Uso de programas de utilidad privilegiados", guidance: "El uso de programas de utilidad que podrían ser capaces de anular los controles del sistema y de las aplicaciones debe restringirse y controlarse estrictamente." },
    { code: "8.19", domain: "Controles Tecnológicos", requirement: "Instalación de software en sistemas operativos", guidance: "Se deben implementar procedimientos y medidas para gestionar de forma segura la instalación de software en sistemas operativos." },
    { code: "8.20", domain: "Controles Tecnológicos", requirement: "Seguridad de las redes", guidance: "Las redes y los dispositivos de red deben estar asegurados, gestionados y controlados para proteger la información en los sistemas y las aplicaciones." },
    { code: "8.21", domain: "Controles Tecnológicos", requirement: "Seguridad de los servicios de red", guidance: "Se deben identificar, implementar y monitorear los mecanismos de seguridad, los niveles de servicio y los requisitos de servicio de los servicios de red." },
    { code: "8.22", domain: "Controles Tecnológicos", requirement: "Segregación de redes", guidance: "Los grupos de servicios de información, los usuarios y los sistemas de información deben estar segregados en las redes de la organización." },
    { code: "8.23", domain: "Controles Tecnológicos", requirement: "Filtrado web", guidance: "Se debe gestionar el acceso a sitios web externos para reducir la exposición a contenidos maliciosos." },
    { code: "8.24", domain: "Controles Tecnológicos", requirement: "Uso de criptografía", guidance: "Se deben definir e implementar reglas para el uso eficaz de la criptografía, incluida la gestión de claves criptográficas." },
    { code: "8.25", domain: "Controles Tecnológicos", requirement: "Ciclo de vida de desarrollo seguro", guidance: "Se deben establecer y aplicar reglas para el desarrollo seguro de software y sistemas." },
    { code: "8.26", domain: "Controles Tecnológicos", requirement: "Requisitos de seguridad de las aplicaciones", guidance: "Se deben identificar, especificar y aprobar los requisitos de seguridad de la información al desarrollar o adquirir aplicaciones." },
    { code: "8.27", domain: "Controles Tecnológicos", requirement: "Principios de ingeniería y arquitectura de sistemas seguros", guidance: "Deben establecerse, documentarse, mantenerse y aplicarse principios para la ingeniería de sistemas seguros en cualquier actividad de desarrollo de sistemas de información." },
    { code: "8.28", domain: "Controles Tecnológicos", requirement: "Codificación segura", guidance: "Se deben aplicar principios de codificación segura al desarrollo de software." },
    { code: "8.29", domain: "Controles Tecnológicos", requirement: "Pruebas de seguridad en el desarrollo y la aceptación", guidance: "Se deben definir e implementar procesos de pruebas de seguridad en el ciclo de vida del desarrollo." },
    { code: "8.30", domain: "Controles Tecnológicos", requirement: "Desarrollo tercerizado", guidance: "La organización debe dirigir, monitorear y revisar las actividades relacionadas con el desarrollo de sistemas tercerizados." },
    { code: "8.31", domain: "Controles Tecnológicos", requirement: "Separación de entornos de desarrollo, prueba y producción", guidance: "Los entornos de desarrollo, prueba y producción deben estar separados y asegurados." },
    { code: "8.32", domain: "Controles Tecnológicos", requirement: "Gestión de cambios", guidance: "Los cambios en las instalaciones de procesamiento de información y los sistemas de información deben estar sujetos a procedimientos de gestión de cambios." },
    { code: "8.33", domain: "Controles Tecnológicos", requirement: "Información de prueba", guidance: "La información de prueba se debe seleccionar, proteger y gestionar adecuadamente." },
    { code: "8.34", domain: "Controles Tecnológicos", requirement: "Protección de los sistemas de información durante las pruebas de auditoría", guidance: "Las pruebas de auditoría y otras actividades de aseguramiento que impliquen la evaluación de los sistemas operativos deben planearse y acordarse entre el evaluador y la dirección correspondiente." },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para seeding de ISO 27001...");

        // Find existing ISO 27001 framework
        let framework = await Framework.findOne({ name: /ISO 27001/i });

        if (!framework) {
            framework = new Framework({
                name: "ISO 27001:2022",
                description: "Estándar internacional para sistemas de gestión de seguridad de la información (SGSI). Incluye los 93 controles del Anexo A.",
                version: "2022",
                industry: "General"
            });
            await framework.save();
            console.log("Marco ISO 27001:2022 creado.");
        } else {
            // Update description
            framework.description = "Estándar internacional para sistemas de gestión de seguridad de la información (SGSI). Incluye los 93 controles del Anexo A.";
            await framework.save();
            console.log(`Marco existente encontrado: ${framework.name} (${framework._id})`);
        }

        // Delete existing ISO 27001 requirements and re-insert
        const deleted = await FrameworkRequirement.deleteMany({ framework_id: framework._id });
        console.log(`Requisitos anteriores eliminados: ${deleted.deletedCount}`);

        const reqsToSave = isoRequirements.map(r => ({
            ...r,
            framework_id: framework._id
        }));

        await FrameworkRequirement.insertMany(reqsToSave);
        console.log(`✅ ${reqsToSave.length} requisitos ISO 27001:2022 insertados correctamente.`);

        // Verify
        const count = await FrameworkRequirement.countDocuments({ framework_id: framework._id });
        console.log(`Verificación: ${count} requisitos en base de datos para ISO 27001.`);

        process.exit(0);
    } catch (err) {
        console.error("Error durante el seeding:", err);
        process.exit(1);
    }
}

seed();
