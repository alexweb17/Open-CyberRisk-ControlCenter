const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Framework = require('../models/Framework');
const FrameworkRequirement = require('../models/FrameworkRequirement');

dotenv.config();

const frameworkInfo = {
    name: "PCI DSS v4.0",
    description: "Estándar de seguridad de datos para la industria de tarjetas de pago. Versión completa con 205 requisitos técnicos y operativos.",
    version: "4.0",
    industry: "Fintech / Retail / Banca"
};

const requirements = [
    {
        "code": "1.1.1",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.1.1",
        "guidance": "Todas las políticas de seguridad y los 1.1.1 Evalúe la documentación y entreviste al procedimientos especificados en el requisito 1. Si procedimientos operativos que se identifican en el personal para verificar que las políticas de bien es importante definir las políticas o Requisito 1 son: seguridad y los procedimientos operativos procedimientos específicos mencionados en el acuerdo con todos los elementos especificados en que se documenten, mantengan y difundan"
    },
    {
        "code": "1.1.2",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 1.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que actividades del Requisito 1 están documentadas, las descripciones de los roles y las las actividades críticas no ocurran. asignadas y comprendidas. responsabilidades para realizar las actividades del Buenas prácticas Requisito 1 están documentadas y asignadas. Los roles y responsabilidades pueden realizar las actividades del Requisito 1 para separados. verificar que los roles y responsabilidades son asignados como documentadas y entendidas. Como parte de los roles de comunicación y de las"
    },
    {
        "code": "1.2.1",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.1",
        "guidance": "Los estándares de configuración para el 1.2.1.a Evalúe los estándares de configuración estén configurados y gestionados para realizar conjunto de reglas de los NSC son: para los conjuntos de reglas NSC a fin de verificar correctamente su función de seguridad (a elementos especificados en este requisito. set). conjunto de reglas de los NSC para verificar que el Estas os estándares suelen definir los requisitos conjunto de reglas se implementen de acuerdo con de los protocolos aceptables, los puertos que se"
    },
    {
        "code": "1.2.2",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.2",
        "guidance": "Todos los cambios en las conexiones de red y 1.2.2.a Evalúe los procedimientos documentados adecuados para comprender el impacto del en las configuraciones de los NSC se aprueban y para verificar que los cambios en las conexiones cambio. La verificación debe proporcionar una gestionan de acuerdo con el proceso de control de de red y las configuraciones de los NSC estén garantía razonable de que el cambio no tuvo un cambios definido en el Requisito 6.5.1. impacto adverso en la seguridad de la red y de incluidos en el proceso formal de control de cambios de acuerdo con el Requisito 6.5.1. que el cambio funciona como se esperaba. red para identificar los cambios realizados en las conexiones de red. Entreviste al personal responsable y Evalúe los registros de control de verificado, la documentación de la red debe ser cambios para verificar que los cambios actualizada para incluir los cambios evitando que identificados en las conexiones de red fueron se presenten inconsistencias entre la aprobados y gestionados de acuerdo con el documentación de la red y la configuración en el Requisito 6.5.1. ambiente de producción. la red para identificar los cambios realizados en las"
    },
    {
        "code": "1.2.3",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.3",
        "guidance": "Se mantienen los diagramas de red precisos 1.2.3.a Evalúe los diagramas de red y observe las por alto las conexiones y los dispositivos de la red que muestran todas las conexiones entre el CDE y configuraciones de la red para verificar que existan y que, sin darse cuenta, queden inseguros y otras redes, incluyendo las redes inalámbricas. diagrama(s) de red precisos y acordes con todos vulnerables a los ataques. los elementos especificados en este requisito. Los diagramas de red propiamente mantenidos personal responsable para verificar que los conectan hacia y desde el CDE."
    },
    {
        "code": "1.2.4",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.4",
        "guidance": "Se mantienen diagramas de flujo de datos 1.2.4.a Evalúe los diagramas de flujo de datos y comprender y realizar un seguimiento del alcance precisos que cumplen con lo siguiente: entreviste al personal para verificar que los de su entorno al mostrar cómo fluyen los datos de a través de los sistemas y las redes cuenta de acuerdo con todos los elementos sistemas y dispositivos individuales. involucradas. especificados en este requisito. Mantener diagrama(s) de flujo de datos cambios en el ambiente. personal responsable para verificar que los sin la seguridad requerida. diagramas de flujo de datos sean precisos y estén Buenas prácticas"
    },
    {
        "code": "1.2.5",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.5",
        "guidance": "Todos los servicios, protocolos y puertos 1.2.5.a Evalúe la documentación para verificar que inseguros (por ejemplo, telnet y FTP), ya que permitidos están identificados, aprobados y tienen existe una lista de todos los servicios, protocolos y estos pueden llevar a que se abran puntos de una necesidad de negocio definida. puertos permitidos, incluyendo la justificación de acceso innecesarios dentro o en el entorno del negocio y la aprobación para cada uno. CDE. Además, los servicios, protocolos y puertos los NSC para verificar que sólo se utilizan los asegurar y sin parchar. Al identificar los servicios,"
    },
    {
        "code": "1.2.6",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.6",
        "guidance": "Las configuraciones de seguridad son 1.2.6.a Evalúe la documentación que identifica Buenas prácticas definidas e implementadas para todos los servicios, todos los servicios, protocolos y puertos inseguros protocolos y puertos que están en uso y que son en uso para verificar que para cada uno de ellos Si los servicios, protocolos o puertos inseguros considerados inseguros, de tal manera que el se definen configuraciones de seguridad para son necesarios para el negocio, el riesgo que riesgo es mitigado. mitigar el riesgo. suponen estos servicios, protocolos y puertos NSC para verificar que las configuraciones de puerto debe estar justificado, y las seguridad definidas hayan sido implementadas configuraciones de seguridad que mitigan el para cada servicio, protocolo y puerto inseguro riesgo de usar estos servicios, protocolos y identificado. puertos deben ser definidas e implementadas por"
    },
    {
        "code": "1.2.7",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.7",
        "guidance": "Las configuraciones de los NSC se revisan al 1.2.7.a Evalúe la documentación para verificar que o incorrecta y configuraciones que podrían ser menos una vez cada seis meses para confirmar que se han definido procedimientos para revisar las utilizadas por personas no autorizadas. Además, son pertinentes y eficientes. configuraciones de los NSC al menos una vez garantiza que todas las reglas y configuraciones cada seis meses. permitan solamente los servicios, protocolos y de las configuraciones de los NSC y entreviste al personal responsable para verificar que las revisiones se realizan al menos una vez cada seis Esta revisión, que puede implementarse meses. mediante métodos manuales, automatizados o para verificar que las configuraciones identificadas tráfico, solo permiten la entrada y salida del"
    },
    {
        "code": "1.2.8",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.2.8",
        "guidance": "Los archivos de configuración de los NSC 1.2.8 Evalúe los archivos de configuración de los con las configuraciones para controles de red están: NSC para verificar que cumplen con todos los deben mantenerse actualizados y protegidos configuraciones de red activas. actualizada y segura garantiza que se apliquen"
    },
    {
        "code": "1.3.1",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.3.1",
        "guidance": "El tráfico de entrada al CDE está restringido 1.3.1.a Evalúe los estándares de configuración de la entidad a través de direcciones IP no de la siguiente manera: los NSC para verificar que definen las restricciones autorizadas o que utilicen servicios, protocolos o todos los elementos especificados en este Buenas prácticas denegado. Todo el tráfico entrante al CDE, para verificar que el tráfico de entrada al CDE es evaluado para garantizar que sigue las reglas"
    },
    {
        "code": "1.3.2",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.3.2",
        "guidance": "El tráfico saliente del CDE se restringe de la 1.3.2.a Evalúe los estándares de configuración de sistema comprometidos dentro de la red de la siguiente manera: los NSC para verificar que definen las restricciones entidad se comuniquen con un host externo no todos los elementos especificados en este Buenas prácticas denegado. Todo el tráfico que sale del CDE, para verificar que el tráfico saliente desde el CDE evaluado para asegurarse de que siguen reglas"
    },
    {
        "code": "1.3.3",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.3.3",
        "guidance": "Los NSC se implementan entre todas las 1.3.3 Evalúe los parámetros de configuración y los dentro de una red es una vía común para que los redes inalámbricas y el CDE; esto es diagramas de red para verificar que los NSC son individuos malintencionados obtengan acceso a independientemente de que la red inalámbrica sea implementados entre todas las redes inalámbricas la red y a los datos del tarjetahabiente. Si se parte CDE o no, de manera que: y el CDE, de acuerdo con todos los elementos instala un dispositivo o una red inalámbrica sin el inalámbricas hacia el CDE es denegado de malintencionadas podría entrar fácilmente y de forma explícita. forma \"invisible\" en la red. Si los NSC no que tenga un propósito de negocio autorizado. acceso no autorizado a la red inalámbrica pueden"
    },
    {
        "code": "1.4.1",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.4.1",
        "guidance": "Los NSC se implementan entre redes de 1.4.1.a Evalúe los estándares de configuración y la entidad monitorear y controlar el acceso y confiables y no confiables. los diagramas de red para verificar que los CDE minimiza las posibilidades de que individuos están definidos entre las redes confiables y no malintencionados logren ingresar a la red interna confiables. a través de una conexión no protegida. verificar que los NSC están en implementados Una entidad podría implementar una DMZ, que"
    },
    {
        "code": "1.4.2",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.4.2",
        "guidance": "El tráfico entrante de redes que no son 1.4.2. Evalúe la documentación del proveedor y las autorizado reduce el riesgo de que los confiables a redes confiables está restringido a: configuraciones de los NSC para verificar que el componentes del sistema queden expuestos sistema autorizados para proveer servicios de confiables está restringido de acuerdo con todos Buenas prácticas acceso público, protocolos y puertos. los elementos especificados en este requisito. iniciadas por componentes del sistema en una servidores de correo electrónico, web y DNS, son red confiable, esto para protocolos con dicho los más vulnerables a las amenazas procedentes comportamiento. de redes no confiables."
    },
    {
        "code": "1.4.3",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.4.3",
        "guidance": "Se implementan medidas Antispoofing para 1.4.3 Evalúe la documentación del fabricante y las que los paquetes no sean \"falsificados\" y que detectar y bloquear la entrada a la red confiable de configuraciones en los NSC para verificar que se aparenten provenir de la propia red interna de direcciones IP origen falsas o suplantadas. implementen medidas antispoofing para detectar y una organización. Por ejemplo, las medidas bloquear la entrada la entrada a la red confiable de antispoofing impiden que las direcciones internas"
    },
    {
        "code": "1.4.4",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.4.4",
        "guidance": "Los componentes del sistema que almacenan 1.4.4.a Evalúe los diagramas de flujo y de red para confiable, por ejemplo, debido a que están datos de titulares de tarjetas no son accesibles verificar que esté documentado que los almacenados en un sistema dentro de la DMZ o directamente desde redes no confiables. componentes del sistema que almacenan datos de en un servicio de base de datos en la nube, son los titulares de tarjetas no puedan accederse más fáciles de acceder para un atacante externo directamente desde redes no confiables. porque hay menos capas defensivas que para verificar que se implementen controles de datos de titulares de tarjetas (como una base de"
    },
    {
        "code": "1.4.5",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.4.5",
        "guidance": "La divulgación de las direcciones IP internas y 1.4.5.a Evalúe las configuraciones de los NSC que hackers obtengan esas direcciones IP y la información de enrutamiento se limita sólo a las para verificar que la divulgación de las direcciones utilicen esa información para acceder a la red. partes autorizadas. IP internas y la información de enrutamiento se Buenas prácticas limita sólo a las partes autorizadas. documentación para verificar que se implementen dependiendo de la tecnología de red específica"
    },
    {
        "code": "1.5.1",
        "domain": "Requisito 1 - Instalar y Mantener Controles de Seguridad de la Red",
        "requirement": "Requisito 1.5.1",
        "guidance": "Los controles de seguridad se implementan 1.5.1.a Evalúe las políticas y estándares de corporativo, por ejemplo, computadoras de en cualquier dispositivo informático, incluyendo los configuración y entreviste al personal para verificar escritorio, portátiles, tabletas, teléfonos dispositivos propiedad de la empresa y de los que los controles de seguridad de los dispositivos inteligentes y otros dispositivos informáticos empleados, que se conectan tanto a redes no informáticos que se conectan a redes no fiables y móviles utilizados por los empleados, son más confiables (incluida Internet) como al CDE manera al CDE estén implementados de acuerdo con vulnerables a las amenazas basadas en Internet. siguiente: todos los elementos descritos en este requisito. El uso de controles de seguridad, tales como específicos para impedir que se introduzcan software de firewalls personal o soluciones de los dispositivos informáticos que se conectan a amenazas en la red de la entidad. protección tipo end point), controles de seguridad redes no confiables y al CDE para verificar que los parámetros o configuraciones se implementen de activamente. basadas en inspecciones heurísticas y acuerdo con todos los elementos especificados en pueden alterar los controles de seguridad a basados en Internet, los cuales podrían utilizar menos que estén específicamente los dispositivos para obtener acceso a los documentados y autorizados por el nivel sistemas y datos de la organización cuando el gerencial, caso por caso, durante un período dispositivo se vuelva a conectar a la red. limitado."
    },
    {
        "code": "2.1.1",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.1.1",
        "guidance": "Todas las políticas de seguridad y los 2.1.1 Evalúe la documentación y entreviste al procedimientos especificados en el Requisito 2. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 2 están: seguridad y los procedimientos operativos procedimientos específicos indicados en el acuerdo con todos los elementos especificados en de que estén debidamente documentados,"
    },
    {
        "code": "2.1.2",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 2.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que actividades del Requisito 2 son documentadas, las descripciones de las funciones y las las actividades críticas no se realicen. asignadas y comprendidas. responsabilidades para realizar las actividades del Buenas prácticas Requisito 2 están documentadas y asignadas. realizar las actividades del Requisito 2 para procedimientos o mantenerse en documentos"
    },
    {
        "code": "2.2.1",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.1",
        "guidance": "Los estándares de configuración se 2.2.1.a Evalúe los estándares de configuración de red, softwares, aplicaciones, imágenes de desarrollan, implementan y mantienen para: del sistema para verificar que definen procesos contenedores y otros dispositivos utilizados por este requisito. formas conocidas de configurar esos conocidas. 2.2.1.b Evalúe las políticas y procedimientos y vulnerabilidades de seguridad. Corregir las del sistema aceptadas por el sector o con las estándares de configuración del sistema se oportunidades disponibles para un atacante. recomendaciones de hardening del proveedor. actualizan a medida que se identifican nuevos problemas de vulnerabilidad, como se define en el Requisito 6.3.1. nuevos problemas de vulnerabilidad, como se de sus sistemas se configuren de forma define en el requisito 6.3.1. coherente y segura, y abordan la protección de entreviste al personal para verificar que los configurados y verificadas como establecidas estándares de configuración del sistema se estricto de las medidas puede ser más difícil. antes o inmediatamente después de que un aplican cuando se configuran nuevos sistemas y Buenas prácticas componente del sistema se conecte a un se verifica que están instalados antes o Mantenerse al día con las orientaciones actuales entorno de producción. inmediatamente después de que un componente del sector ayudará a la entidad a mantener del sistema se conecte a un entorno de configuraciones seguras."
    },
    {
        "code": "2.2.2",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.2",
        "guidance": "Las cuentas predeterminadas del proveedor 2.2.2.a Evalúe los estándares de configuración del predeterminadas del proveedor para poner en se gestionan de la siguiente manera: sistema para comprobar que incluyen la gestión de peligro los sistemas operativos, las aplicaciones y proveedor, la contraseña predeterminada se acuerdo con todos los elementos especificados en a que estas configuraciones predeterminadas a cambia según el requisito 8.3.6. este requisito. menudo se publican y son bien conocidas, su predeterminadas del proveedor, la cuenta se observe al administrador del sistema iniciando elimina o se desactiva. Buenas prácticas sesión utilizando las cuentas predeterminadas del proveedor para verificar que las cuentas se Deben identificarse todas las cuentas implementan de acuerdo con todos los elementos predeterminadas de los proveedores, y especificados en este requisito. entenderse su propósito y uso. Es importante entreviste al personal para verificar que todas las desplegar y mantener los servicios en la nube, de"
    },
    {
        "code": "2.2.3",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.3",
        "guidance": "Las funciones principales que requieren 2.2.3.a Evalúe los estándares de configuración del función principal tendrán un perfil de seguridad distintos niveles de seguridad se administran de la sistema para verificar que incluyan la gestión de apropiado que permita que esa función opere siguiente manera: funciones principales que requieran distintos eficientemente. Por ejemplo, los sistemas que componente del sistema, requisito. O comercio electrónico. A la inversa, otros de seguridad que existen en el mismo requieren distintos niveles de seguridad se distinto de servicios, protocolos y «demonios» componente del sistema están aisladas entre sí, administren de acuerdo con una de las formas que realizan funciones que la entidad prefiere no O especificadas en este requisito. exponer a internet”. Este requisito tiene como de seguridad en el mismo componente del 2.2.3.c Cuando se utilizan tecnologías de afecten los perfiles de seguridad de otros sistema están todas aseguradas al nivel virtualización, Evalúe las configuraciones del servicios de una manera que pueda hacerlos requerido por la función que requiera un nivel sistema para verificar que aquellas funciones que operar a un nivel de seguridad mayor o menor. mayor de seguridad. requieran distintos niveles de seguridad se Buenas prácticas gestionen en una de las siguientes maneras:"
    },
    {
        "code": "2.2.4",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.4",
        "guidance": "Solo se habilitan los servicios, protocolos, 2.2.4.a Evalúe los estándares de configuración del individuos malintencionados obtengan acceso a «demonios» y funciones necesarias, y se eliminan o sistema para verificar que los servicios, protocolos un sistema. Al eliminar o deshabilitar todos los deshabilitan todas las funciones innecesarias. y «demonios» requeridos por el sistema estén servicios, protocolos, «demonios» y funciones identificados y documentados. innecesarias, las organizaciones pueden para verificar lo siguiente: funciones desconocidas o innecesarias."
    },
    {
        "code": "2.2.5",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.5",
        "guidance": "Si existen servicios, protocolos o «demonios» 2.2.5.a Si existen servicios, protocolos o protegidos con características de seguridad inseguros: \"demonios\" inseguros, Evalúe los estándares de apropiadas que dificulten a las personas para verificar que estén administrados e debilidades dentro de una red. de seguridad adicionales que reducen el riesgo Buenas prácticas elementos especificados en este requisito. de utilizar servicios, protocolos o \"demonios\" Habilitar las funciones de seguridad antes de que inseguros. 2.2.5.b Si existen servicios, protocolos o se implementen los nuevos componentes del \"demonios\" inseguros, Evalúe los valores de sistema impedirá que se introduzcan configuración para verificar que se hayan configuraciones inseguras en el entorno. Algunas"
    },
    {
        "code": "2.2.6",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.6",
        "guidance": "Los parámetros de seguridad del sistema 2.2.6.a Evalúe los estándares de configuración del del sistema aprovecha las capacidades del están configurados para impedir su uso indebido. sistema para comprobar que incluyen la componente del sistema para frustrar los ataques configuración de los parámetros de seguridad del malintencionados. sistema a fin de impedir su uso indebido. Buenas prácticas sistema y/o gerentes de seguridad para verificar procesos relacionados deben abordar que tienen conocimiento de la configuración de los específicamente los ajustes y parámetros de parámetros de seguridad comunes para los seguridad que tienen implicaciones de seguridad componentes del sistema. conocidas para cada tipo de sistema en uso. verificar que los parámetros comunes de configuración y/o administración de los sistemas seguridad están configurados adecuadamente y debe conocer los parámetros y ajustes de"
    },
    {
        "code": "2.2.7",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.2.7",
        "guidance": "Todo el acceso administrativo sin consola está 2.2.7.a Evalúe los estándares de configuración del factores de autorización administrativa (tales cifrado utilizando criptografía sólida. sistema para verificar que incluyan el cifrado de como IDs y contraseñas) pueden ser revelados a todos los accesos administrativos sin consola espías. Un individuo malintencionado podría mediante una criptografía sólida. utilizar esta información para acceder a la red, sesión en los componentes del sistema y examine las configuraciones del sistema para verificar que Cualquiera que sea el protocolo de seguridad el acceso administrativo sin consola se administre utilizado, este debe ser configurado para utilizar de acuerdo con este requisito. sólo versiones y configuraciones seguras a fin de componentes del sistema y los servicios de no respaldando auxiliares de protocolos o autenticación para verificar que los servicios de métodos más débiles e inseguros. inicio de sesión remota inseguros no estén Ejemplos disponibles para el acceso administrativo sin consola. Los protocolos de texto en claro (como HTTP, entreviste al personal para verificar que se intercepten esta información. El acceso sin"
    },
    {
        "code": "2.3.1",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.3.1",
        "guidance": "Para entornos inalámbricos conectados al 2.3.1.a Evalúe las políticas y los procedimientos y el cambio de la configuración predeterminada), CDE o que transmiten datos de la cuenta, todos los entreviste al personal responsable para verificar los rastreadores inalámbricos pueden espiar el valores predeterminados de los proveedores que los procesos estén definidos para los valores tráfico, capturar fácilmente datos y contraseñas, inalámbricos se cambian en la instalación o se predeterminados de los proveedores inalámbricos, entrar y atacar fácilmente la red. confirma que son seguros, incluidos, entre otros: sea para cambiarlos en el momento de la Buenas prácticas acuerdo con todos los elementos de este requisito. Las contraseñas inalámbricas deben construirse observe cómo un administrador del sistema inicia sesión en los dispositivos inalámbricos para predeterminado relacionado con la seguridad. verificar que: SNMP. contraseña predeterminadas en los puntos de acceso. los ajustes de configuración inalámbrica para"
    },
    {
        "code": "2.3.2",
        "domain": "Requisito 2 - Aplicar Configuraciones Seguras a Todos los Componentes del Sistema",
        "requirement": "Requisito 2.3.2",
        "guidance": "Para los entornos inalámbricos conectados al 2.3.2 Entreviste al personal responsable y examine conocimiento de la clave abandona la CDE o que transmitan datos de cuentas, las claves la documentación de gestión de claves para organización o se traslada a un puesto para el cifradas inalámbricas se cambian como sigue: verificar que las claves de cifrado inalámbricas se cual ya no requiere la clave, ayuda a mantener el clave deje la empresa o la función para la que especificados en este requisito. aquellos que lo requieran por motivos de era necesario el conocimiento. negocios. clave está comprometida. inalámbricas cada vez que se sospeche o se"
    },
    {
        "code": "3.1.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.1.1",
        "guidance": "Todas las políticas de seguridad y 3.1.1 Evalúe la documentación y entreviste al y procedimientos especificados en el Requisito 3. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 3 son: seguridad y los procedimientos operativos procedimientos específicos indicados en el acuerdo con todos los elementos especificados en de que estén debidamente documentados,"
    },
    {
        "code": "3.1.2",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 3.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que actividades del Requisito 3 están documentados, las descripciones de los roles y responsabilidades las actividades críticas no se desarrollen. asignados y comprendidos. que realizan las actividades del Requisito 3 estén Buenas prácticas documentadas y asignadas. desarrollar las actividades del Requisito 3 para separados."
    },
    {
        "code": "3.2.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.2.1",
        "guidance": "El almacenamiento de datos de cuentas se 3.2.1.a Evalúe las políticas y procedimientos de cuánto tiempo, y dónde residen esos datos, de mantiene al mínimo mediante la implementación de retención y eliminación de datos, y entreviste al manera que puedan destruirse o eliminarse de políticas y procedimientos de retención y personal para verificar que los procesos estén forma segura tan pronto como ya no se eliminación de datos que incluyan al menos lo definidos para incluir todos los elementos necesiten. Los únicos datos de la cuenta que siguiente: especificados en este requisito. podrían almacenarse después de la autorización de cuentas almacenados. Cubren todo dato de 3.2.1.b Evalúe los archivos y registros de los vuelve ilegible), la fecha de caducidad, el nombre autenticación confidencial (SAD) almacenado componentes del sistema en los que se del titular de la tarjeta y el código de servicio. antes de completar la autorización. Este punto almacenan los datos de cuentas, para verificar que El almacenamiento de datos de SAD antes de es una de las mejores prácticas hasta su fecha la cantidad de datos almacenados y el tiempo de finalizado el proceso de autorización también es de vigencia; refiérase a las Notas de retención no excedan los requisitos definidos en la parte de la política de retención y eliminación de Aplicabilidad que aparecen a continuación para política de retención de datos. datos; de manera que se mantenga al mínimo el obtener más detalles. almacenamiento de esos datos confidenciales y tiempo de retención a lo requerido por los definido. irrecuperables para verificar que no se puedan requisitos legales o reglamentarios y/o de recuperar. Buenas prácticas negocios. Al identificar las ubicaciones de los datos de datos de cuentas almacenados que definen la procesos y el personal con acceso a los datos, ya duración del período de retención e incluyen una que los datos podrían haberse movido y justificación de negocio documentada. almacenado en ubicaciones diferentes a las que que los datos del tarjetahabiente sean irrecuperables cuando ya no se necesitan según la política de retención. cada tres meses, que los datos de cuentas almacenados que excedan el período de retención definido se han eliminado de forma segura o se han vuelto irrecuperables. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 84 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "3.3.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.3.1",
        "guidance": "Los SAD no se retienen después de la 3.3.1.a Si se reciben datos SAD, examine las tarjetas de pago falsificadas y realizar autorización, incluso si están cifrados. Todos los políticas, los procedimientos y las configuraciones transacciones fraudulentas. Por lo tanto, se datos confidenciales de autenticación recibidos se del sistema documentados para verificar que no se prohíbe el almacenamiento de los SAD una vez vuelven irrecuperables una vez finalizado el conserven después de la autorización. finalizado el proceso de autorización. proceso de autorización. Definiciones procedimientos documentados y observe los un comerciante recibe una respuesta de"
    },
    {
        "code": "3.3.2",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.3.2",
        "guidance": "Los SAD que se almacenan electrónicamente 3.3.2 Evalúe los repositorios de datos, las de generar transacciones fraudulentas con éxito antes de completar la autorización se cifran configuraciones del sistema y/o la documentación utilizando tarjetas de pago falsificadas. mediante criptografía sólida. del proveedor para verificar que todos los SAD que Buenas prácticas se almacenan electrónicamente antes de completar la autorización estén cifrados mediante Las entidades deben considerar cifrar los SAD"
    },
    {
        "code": "3.3.3",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.3.3",
        "guidance": "Requisito adicional para emisores y 3.3.3.a Procedimientos de prueba adicionales de generar con éxito tarjetas de pago falsificadas empresas que soportan servicios de emisión y para emisores y empresas que respaldan y realizar transacciones fraudulentas. que almacenan datos confidenciales de servicios de emisión y que almacenan datos Buenas prácticas autenticación: Cualquier almacenamiento de datos confidenciales de autenticación: Evalúe las confidenciales de autenticación está: políticas documentadas y entreviste al personal Las entidades deben considerar cifrar los SAD para verificar que existe una justificación de con una clave criptográfica diferente a la que se necesidad legítima de negocio de emisión y negocio documentada para el almacenamiento de datos confidenciales de autenticación. que esto no significa que los datos PAN está asegurado. presentes en los SAD (como parte de los datos una de las mejores prácticas hasta su fecha de empresas que respaldan servicios de emisión y Definiciones"
    },
    {
        "code": "3.4.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.4.1",
        "guidance": "Los datos PAN están enmascarados cuando 3.4.1.a Evalúe las políticas y procedimientos tarjetas de pago, los informes en papel, etc., se muestra (el BIN y los últimos cuatro dígitos documentados para enmascarar la visualización de puede dar lugar a que estos datos sean constituyen el número máximo de dígitos que se los datos PAN a fin de verificar: obtenidos por personas no autorizadas y muestran), de manera que sólo el personal con una • Se documenta una lista de funciones que utilizados de forma fraudulenta. Garantizar que la necesidad legítima de negocios pueda ver más que necesitan acceso a más que el BIN y los información completa de los datos del PAN se el BIN y los últimos cuatro dígitos de los datos PAN. últimos cuatro dígitos de los datos PAN muestre sólo para aquellos con una necesidad"
    },
    {
        "code": "3.4.2",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.4.2",
        "guidance": "Cuando se utilicen tecnologías de acceso 3.4.2.a Evalúe las políticas y los procedimientos común de obtener y utilizar esta información de remoto, los controles técnicos impiden la copia y/o documentados y las pruebas documentadas de los manera fraudulenta. la reubicación de los datos PAN para todo el controles técnicos que impiden la copia y/o la Los métodos para garantizar que sólo aquellos personal, excepto para aquellos con autorización reubicación de los datos PAN cuando se utilizan con autorización explícita y una razón comercial explícita y documentada y una necesidad legítima tecnologías de acceso remoto en discos duros legítima puedan copiar o reubicar los datos PAN de negocio y definida. locales o medios electrónicos extraíbles para minimizan el riesgo de que personas no verificar lo siguiente: autorizadas obtengan acceso a los datos PAN."
    },
    {
        "code": "3.5.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.5.1",
        "guidance": "Los datos PAN se hacen ilegibles en cualquier 3.5.1.a Evalúe la documentación del sistema defensa a fondo diseñado para proteger los datos lugar donde se almacenen utilizando cualquiera de utilizado para hacer ilegibles los datos del PAN, almacenados por si una persona no autorizada los siguientes enfoques: incluido el proveedor, el tipo de sistema/proceso y obtiene acceso a ellos aprovechando una sólida del PAN completo. que los datos del PAN se hacen ilegibles utilizando control de acceso primario de una entidad. cualquiera de los métodos especificados en este Los sistemas de control secundarios para reemplazar el segmento truncado de la independientes (por ejemplo, que rigen el acceso PAN). y el uso de claves de cifrado y descifrado) – Si en un entorno hay versiones truncadas y los registros de auditoría para verificar que los con hash del mismo PAN, o diferentes PAN se hace ilegibles utilizando cualquiera de los formatos de truncamiento del mismo PAN, métodos especificados en este requisito. se establecen controles adicionales de datos PAN de texto sin cifrar almacenados, al manera que las diferentes versiones no 3.5.1.c Si hay versiones truncadas y con hash de los mismos datos PAN en el entorno, examine los correlacionar versiones de hash y truncadas de puedan correlacionarse para reconstruir el datos PAN determinados, individuos PAN original. controles implementados para verificar que las versiones truncadas y con hash no pueden malintencionados pueden derivar fácilmente el correlacionarse para reconstruir los datos PAN procedimientos de gestión de claves asociados. ayudarán a garantizar que el PAN original Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 96 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "3.6.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.6.1",
        "guidance": "Los procedimientos se definen e implementan 3.6.1 Evalúe las políticas y los procedimientos obtengan tengan acceso a ellas podrán descifrar para proteger las claves cifradas utilizadas para documentados de administración de claves para los datos. proteger los datos almacenados de la cuenta contra verificar que los procesos para proteger las claves Buenas Prácticas la divulgación y el uso indebido que incluyen: cifradas utilizadas para proteger los datos almacenados de la cuenta contra la divulgación y Se recomienda tener un sistema de número de custodios necesarios. el uso indebido estén definidos para incluir todos los elementos especificados en este requisito. los estándares de la industria para administrar las tan seguras como las claves de cifrado de datos Información Adicional que estas protegen. por separado de las claves de cifrado de datos. con los requisitos de la industria. Las fuentes de menor número posible de formas y ubicaciones. de claves cifradas incluyen:"
    },
    {
        "code": "3.7.1",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.1",
        "guidance": "Las políticas y procedimientos de 3.7.1.a Evalúe las políticas y procedimientos datos de cuentas cifrados. administración de claves se implementan para documentados de gestión de claves utilizados para Información Adicional incluir la generación de claves criptográficas fuertes la protección de los datos de cuentas utilizadas para proteger los datos de cuentas almacenados a fin de verificar que definan la Consulte las fuentes a las que se hace referencia almacenados. generación de claves criptográficas fuertes. en \"Generación de Claves Criptográficas en para verificar que se generen claves fuertes."
    },
    {
        "code": "3.7.2",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.2",
        "guidance": "Las políticas y los procedimientos de 3.7.2.a Evalúe las políticas y procedimientos las claves sólo son distribuidas a los custodios administración de claves son implementados para documentados de administración de claves para autorizados, como se identifica en el Requisito incluir la distribución segura de las claves las claves de protección de los datos de cuentas 3.6.1.2, y nunca se distribuyen de forma insegura. criptográficas utilizadas para proteger los datos almacenados a fin de verificar que definen la almacenados de la cuenta. distribución segura de claves criptográficas. fin de verificar que las claves se distribuyan de"
    },
    {
        "code": "3.7.3",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.3",
        "guidance": "Se implementan políticas y procedimientos de 3.7.3.a Evalúe las políticas y procedimientos provocaría el descifrado y la exposición de los gestión de claves para incluir el almacenamiento documentados de administración de claves datos de la cuenta. seguro de las claves criptográficas utilizadas para utilizados para las claves de protección de los Buenas Prácticas proteger los datos de cuentas almacenados. datos de cuentas almacenados a fin de verificar que definen el almacenamiento seguro de claves Las claves de cifrado de datos pueden protegerse criptográficas. cifrándolas con una clave de cifrado de clave. claves para verificar que las claves se almacenan Las claves secretas o privadas que pueden de forma segura."
    },
    {
        "code": "3.7.4",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.4",
        "guidance": "Se implementan políticas y procedimientos de 3.7.4.a Evalúe las políticas y los procedimientos minimizar el riesgo de que alguien obtenga las gestión de claves para los cambios de claves documentados de gestión de claves utilizados para claves de cifrado y las utilice para descifrar datos. criptográficas de para aquellas claves que han la protección de los datos de cuentas Definiciones llegado al final de su criptoperíodo, según lo almacenados a fin de verificar que definen los definido por el proveedor de la aplicación asociada cambios de las claves criptográficas que han Un criptoperíodo es el lapso de tiempo durante el o el propietario de la clave, y basado en las mejores llegado al final de su criptoperíodo e incluyen cual una clave criptográfica puede ser utilizada prácticas y directrices de la industria, incluyendo lo todos los elementos especificados en este para su propósito definido. Los criptoperíodos siguiente: requisito. suelen definirse en términos del periodo durante clave en uso. consideraciones para definir el criptoperíodo documentación y observe las ubicaciones de criptoperíodo definido. claves se cambian al final de los criptoperíodos algoritmo subyacente, el tamaño o la longitud de definidos. la clave, el riesgo de compromiso de la clave y la Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 109 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "3.7.5",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.5",
        "guidance": "Los procedimientos de políticas de gestión de 3.7.5.a Evalúe las políticas y los procedimientos o se sospecha que están comprometidas, deben claves se implementan para incluir el retiro, documentados de gestión de claves utilizados para ser archivadas, revocadas y/o destruidas para sustitución o destrucción de las claves utilizadas la protección de los datos de cuentas asegurarse de ya no puedan ser utilizadas. para proteger los datos de cuentas almacenados, almacenadas y verifique que definen el retiro, el Si es necesario conservar dichas claves (por según se considere necesario cuando: reemplazo o la destrucción de las claves de ejemplo, para respaldar los datos cifrados), estas definido. este requisito. incluso cuando el personal con conocimiento de procesos son implementados de acuerdo con utilizarse únicamente para fines de un componente de la clave en texto no cifrado todos los elementos especificados en este descifrado/verificación. abandone la empresa, o la función por la que requisito. conocía la clave. La solución de cifrado debe proveer y facilitar un están comprometidas. están, comprometidas. Además, cualquier clave Las claves retiradas o reemplazadas no se que se sepa o se sospeche que está utilizan para operaciones de cifrado. comprometida, debe gestionarse de acuerdo con"
    },
    {
        "code": "3.7.6",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.6",
        "guidance": "Cuando el personal realiza operaciones 3.7.6.a Evalúe las políticas y procedimientos que una sola persona tenga acceso a toda la manuales de gestión de claves criptográficas en documentados de administración de claves para clave, y por ende pueda obtener accesos no texto no cifrado, se implementan políticas y las claves utilizadas para la protección de datos de autorizado a los datos. procedimientos de gestión de claves que incluyen la cuentas almacenados y verifique que se definan Definiciones gestión de estas operaciones utilizando utilizando conocimiento dividido y control dual. conocimiento dividido y control dual. El conocimiento dividido es un método en el que procesos para verificar que las claves manuales componentes de la clave, en el que cada persona de texto no cifrado se manejen con conocimiento sólo conoce su propio componente de la clave, y"
    },
    {
        "code": "3.7.7",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.7",
        "guidance": "Se implementan políticas y procedimientos de 3.7.7.a Evalúe las políticas y procedimientos atacante podrá descifrar todos los datos cifrados administración de claves para incluir la prevención documentados de administración de claves para con esa clave. de la sustitución no autorizada de claves las claves utilizadas para la protección de datos de Buenas Prácticas criptográficas. cuenta almacenados y verifique que definan la prevención de la sustitución no autorizada de La solución de cifrado no debe permitir ni aceptar claves criptográficas. la sustitución de claves de fuentes no autorizadas"
    },
    {
        "code": "3.7.8",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.8",
        "guidance": "Las políticas y los procedimientos de 3.7.8.a Evalúe las políticas y procedimientos se comprometan con el rol de custodios de claves administración de claves se implementan para documentados de administración de claves para y comprendan y acepten sus responsabilidades. incluir que los custodios de claves criptográficas las claves utilizadas en la protección de datos de Una reafirmación anual puede ayudar a recordar reconozcan formalmente (por escrito o cuentas almacenados y verifique que definen el a los custodios de claves sus responsabilidades. electrónicamente) que comprenden y aceptan sus reconocimiento por parte de los custodios de las Información Adicional responsabilidades como custodios de claves. claves de acuerdo con todos los elementos especificados en este requisito. La guía de la industria para los custodios de que demuestre que los custodios de claves han Sistemas de Administración de Claves expresado su conocimiento de acuerdo con todos Criptográficas [5. Funciones y"
    },
    {
        "code": "3.7.9",
        "domain": "Requisito 3 - Proteja los Datos Almacenados de las Cuentas",
        "requirement": "Requisito 3.7.9",
        "guidance": "Requisito adicional sólo para proveedores 3.7.9 Procedimiento de prueba adicional solo criptográficas de manera segura puede contribuir de servicios: Cuando un proveedor de servicios para evaluaciones de proveedores de a impedir que las claves se administren comparte claves criptográficas con sus clientes para servicios: Si el proveedor de servicios comparte incorrectamente o se divulguen a entidades no la transmisión o el almacenamiento de datos del claves criptográficas con sus clientes para la autorizadas. tarjetahabiente, se documenta y distribuye a los transmisión o almacenamiento de datos de la Información Adicional clientes de los proveedores de servicios orientación cuenta, examínelos documentos que el proveedor sobre la transmisión, el almacenamiento y la de servicios proporciona a sus clientes para En la Guía para los Requisitos 3.7.1-3.7.8. se actualización segura de dichas claves. verificar que incluya orientación sobre cómo citan diversas os estándares de la industria para transmitir, almacenar y actualizar de forma segura la gestión de claves."
    },
    {
        "code": "4.1.1",
        "domain": "Requisito 4 - Proteja los Datos de los Titulares de Tarjetas con Criptografía Sólida Durante la Transmisión a",
        "requirement": "Requisito 4.1.1",
        "guidance": "Todas las políticas de seguridad y 4.1.1 Evalúe la documentación y entreviste al y procedimientos especificados en el Requisito 4. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 4 son: seguridad y los procedimientos operativos procedimientos específicos mencionados en el acuerdo con todos los elementos especificados en de que estén debidamente documentados,"
    },
    {
        "code": "4.1.2",
        "domain": "Requisito 4 - Proteja los Datos de los Titulares de Tarjetas con Criptografía Sólida Durante la Transmisión a",
        "requirement": "Requisito 4.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 4.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que actividades del Requisito 4 están documentados, las descripciones de las funciones y las las actividades críticas no se realicen. asignados y comprendidos. responsabilidades para realizar las actividades del Buenas Prácticas Requisito 4 están documentadas y asignadas. 4.1.2.b Entreviste al personal responsable de documentarse dentro de políticas y desarrollar las actividades del Requisito 4 para procedimientos o mantenerse en documentos verificar que los roles y responsabilidades se separados. asignen según se documenten y sean entendidos. Como parte de los roles de comunicación y de las"
    },
    {
        "code": "4.2.1",
        "domain": "Requisito 4 - Proteja los Datos de los Titulares de Tarjetas con Criptografía Sólida Durante la Transmisión a",
        "requirement": "Requisito 4.2.1",
        "guidance": "Se implementan fuertes protocolos de 4.2.1.a Evalúe las políticas y procedimientos es fácil y común que individuos malintencionados seguridad y criptografía de la siguiente manera para documentados y entreviste al personal para intercepten y/o desvíen datos en tránsito. proteger los datos PAN durante la transmisión a verificar que los procesos estén definidos para Buenas Prácticas través de redes públicas abiertas: incluir todos los elementos especificados en este requisito. Los diagramas de flujo de datos y de red datos PAN durante la transmisión a través de para verificar que se implementen protocolos de conexión donde se transmite o reciben datos de redes públicas abiertas se confirman como seguridad y criptografía sólida de acuerdo con cuentas a través de redes públicas abiertas. válidos y no están vencidos ni revocados. Este todos los elementos especificados en este Si bien no es obligatorio, se considera una buena punto es una de las mejores prácticas hasta su requisito. práctica que las entidades también cifren los fecha de vigencia; consulte las notas de datos PAN en sus redes internas y que aplicabilidad a continuación para obtener más 4.2.1.c Evalúe las transmisiones de datos de establezcan nuevas implementaciones de red con detalles. titulares de tarjetas para verificar que todos los comunicaciones cifradas. configuraciones seguras y no admite el apoyo ni cuando se transmiten a través de redes públicas el uso de versiones, algoritmos, tamaños de abiertas. clave o implementaciones inseguras. datos, o ambos. Si bien no es necesario que se 4.2.1.d Evalúe las configuraciones del sistema metodología de cifrado en uso. certificados que no se puedan verificar como datos como a nivel de sesión, es altamente confiables. recomendado. Si se realiza un cifrado a nivel de"
    },
    {
        "code": "4.2.2",
        "domain": "Requisito 4 - Proteja los Datos de los Titulares de Tarjetas con Criptografía Sólida Durante la Transmisión a",
        "requirement": "Requisito 4.2.2",
        "guidance": "Los datos PAN están protegidos con 4.2.2.a Evalúe las políticas y procedimientos fácilmente mediante la detección de paquetes criptografía sólida siempre que se envíen a través documentados para verificar que los procesos durante la entrega a través de redes internas y de tecnologías de mensajería para el usuario final. estén definidos para asegurar os datos PAN con públicas. criptografía sólida siempre que se envíen a través Buenas Prácticas de tecnologías de mensajería de usuario final. 4.2.2.b Evalúe las configuraciones del sistema y la final para enviar datos PAN solo debe documentación del proveedor para verificar que considerarse cuando existe una necesidad de"
    },
    {
        "code": "5.1.1",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.1.1",
        "guidance": "Todas las políticas de seguridad y 5.1.1 Evalúe la documentación y entreviste al procedimientos especificados a lo largo del procedimientos operativos que se identifican en el personal para verificar que las políticas de Requisito 5. Si bien es importante definir las Requisito 5 son: seguridad y los procedimientos operativos políticas o procedimientos específicos de acuerdo con todos los elementos especificados importante garantizar que se documenten, se"
    },
    {
        "code": "5.1.2",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 5.1.2.a Evalúe la documentación para verificar que sistemas no estén adecuadamente protegidos actividades del Requisito 5 están documentados, las descripciones de las funciones y las contra el malware. asignados y comprendidos. responsabilidades para realizar las actividades del Buenas Prácticas Requisito 5 están documentadas y asignadas. 5.1.2.b Entreviste al personal responsable de documentarse dentro de políticas y desarrollar las actividades del Requisito 5 para procedimientos o mantenerse en documentos verificar que los roles y responsabilidades se separados. asignen según sean documentadas y entendidas. Como parte de los roles de comunicación y de las"
    },
    {
        "code": "5.2.1",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.2.1",
        "guidance": "Una solución antimalware se aplicará a todos 5.2.1.a Evalúe los componentes del sistema para que antes se consideraban seguros. Sin una los componentes del sistema, excepto a aquellos verificar que se implemente una solución solución antimalware que se actualice componentes del sistema identificados en antimalware en todos ellos, excepto aquellos en regularmente, pueden aparecer nuevas formas evaluaciones periódicas según el Requisito 5.2.3 los que se determine que no están en riesgo de de malware para atacar los sistemas, deshabilitar que concluye que los componentes del sistema no malware según las evaluaciones periódicas del una red o comprometer datos. están en riesgo de malware. Requisito 5.2.3. Buenas Prácticas 5.2.1.b Para cualquier componente del sistema Es beneficioso para las entidades estar al tanto que no cuente con una solución antimalware, de los ataques de \"día cero\" (aquellos que analice las evaluaciones periódicas para verificar explotan una vulnerabilidad previamente"
    },
    {
        "code": "5.2.2",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.2.2",
        "guidance": "Las soluciones antimalware implementadas: 5.2.2 Evalúe la documentación del proveedor y las autorizado. para verificar que la solución: conocidos de malware. • Detecta todos los tipos conocidos de malware. combinación de controles basados en la red, conocidos de malware. seguridad para terminales. Además de las"
    },
    {
        "code": "5.2.3",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.2.3",
        "guidance": "Todos los componentes del sistema que no se 5.2.3.a Evalúe las políticas y los procedimientos por malware. Sin embargo, las tendencias de la encuentren en riesgo de malware se evalúan documentados para verificar que se haya definido industria en materia de malware pueden cambiar periódicamente para incluir lo siguiente: un proceso para las evaluaciones periódicas de rápidamente, por lo que es importante que las componentes del sistema que no están en riesgo de malware que incluya todos los elementos programas maliciosos que podrían afectar sus riesgo de malware. especificados en este requisito. sistemas, por ejemplo, monitoreando los avisos malware en evolución para los componentes evaluaciones incluyen todos los elementos podrían estar fallando. del sistema. especificados en este requisito. sistema continúan sin requerir protección 5.2.3.c Evalúe la lista de componentes del sistema Si una entidad determina que un sistema en antimalware. identificados como sin riesgo de malware y particular no es susceptible a ningún malware, compararlos con los componentes del sistema sin dicha determinación debe estar respaldada por una solución antimalware implementada según el evidencia de la industria, recursos de Requisito 5.2.1 para verificar que los componentes proveedores y mejores prácticas."
    },
    {
        "code": "5.3.1",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.3.1",
        "guidance": "Las soluciones antimalware se mantienen 5.3.1.a Evalúe las configuraciones de las actualizaciones de seguridad, firmas, motores de actualizadas a través de procesos de actualización soluciones antimalware, incluyendo cualquier análisis de amenazas y cualquier otra protección automáticos. instalación maestra del software, para verificar que contra malware en la que se base la solución. la solución esté configurada para realizar Tener un proceso de actualización automatizado actualizaciones automáticas. evita sobrecargar a los usuarios finales con la 5.3.1.b Evalúe los componentes y los registros del sistema para verificar que las soluciones y las definiciones antimalware estén actualizadas y se"
    },
    {
        "code": "5.3.2",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.3.2",
        "guidance": "Soluciones antimalware: 5.3.2.a Evalúe las configuraciones de las temporalmente inactivo. Algunos programas activos o en tiempo real. instalación maestra del software, para comprobar ingresar a un entorno antes de que la solución de que la solución o soluciones están configuradas escaneo sea capaz de detectarlos. Realizar O para realizar al menos uno de los elementos escaneos periódicos regulares o análisis de comportamiento de los sistemas o procesos. procesos ayuda a garantizar que el malware 5.3.2.b Evalúe los componentes del sistema, previamente indetectable, se pueda identificar, incluyendo todos los tipos de sistemas operativos eliminar e investigar para determinar cómo identificados como riesgo de malware, para obtuvo acceso al entorno. verificar que las soluciones están habilitadas de acuerdo con al menos uno de los elementos especificados en este requisito. El uso de una combinación de escaneos 5.3.2.c Evalúe los registros y los resultados de lo activos en tiempo real (al momento del acceso), escaneo para verificar que las soluciones están ayuda a garantizar que se aborde el malware que habilitadas de acuerdo con al menos uno de los reside en los elementos estáticos y dinámicos del elementos especificados en este requisito. CDE. Los usuarios también deberían poder Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 133 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "5.3.3",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.3.3",
        "guidance": "Para los medios electrónicos extraíbles, la 5.3.3.a Evalúe las configuraciones de las malware. Los atacantes suelen precargar el solución antimalware: soluciones antimalware para verificar que, en el malware en dispositivos portátiles como USB y es insertado, conectado o montado lógicamente, solución está configurada para realizar al menos infectado a un ordenador se activa el malware, uno de los elementos especificados en este introduciendo nuevas amenazas en el entorno. O requisito. de los sistemas o procesos cuando el medio 5.3.3.b Evalúe los componentes del sistema con está insertado, conectado o montado medios electrónicos extraíbles conectados para lógicamente. verificar que la solución o soluciones están habilitadas de acuerdo con al menos uno de los elementos especificados en este requisito. 5.3.3.c Evalúe los registros y resultados de los escaneos para verificar que las soluciones están"
    },
    {
        "code": "5.3.4",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.3.4",
        "guidance": "Los registros de auditoría de la solución 5.3.4 Evalúe las configuraciones de la solución confirmando que las actualizaciones y los antimalware están habilitados y se conservan de antimalware para comprobar que los registros escaneos se realizan como esperado, y que el acuerdo con el requisito 10.5.1. están activados y se conservan de acuerdo con el malware se identifica y es abordado. Los Requisito 10.5.1. registros de auditoría también permiten a una"
    },
    {
        "code": "5.3.5",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.3.5",
        "guidance": "Los mecanismos antimalware no pueden ser 5.3.5.a Evalúe las configuraciones antimalware, malware se detecte en tiempo real. La activación desactivados o alterados por los usuarios, a menos para verificar que los mecanismos antimalware no y desactivación ad hoc de las soluciones que esté específicamente documentado y pueden ser deshabilitados o alterados por los antimalware podrían permitir que los programas autorizado por la administración en cada caso, por usuarios. maliciosos se propaguen sin control y sin ser un período de tiempo limitado. detectados."
    },
    {
        "code": "5.4.1",
        "domain": "Requisito 5 - Proteja Todos los Sistemas y Redes de Software Malintencionado",
        "requirement": "Requisito 5.4.1",
        "guidance": "Existen procesos y mecanismos 5.4.1 Observe los procesos y mecanismos la veracidad de una comunicación y también automatizados para detectar y proteger al personal implementados para verificar que se hayan pueden limitar los efectos de las respuestas contra ataques de phishing. instalado controles para detectar y proteger al individuales al phishing. personal contra ataques de phishing. Buenas Prácticas"
    },
    {
        "code": "6.1.1",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.1.1",
        "guidance": "Todas las políticas de seguridad y 6.1.1 Evalúe la documentación y entreviste al y procedimientos especificados en el Requisito 6. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 6 son: seguridad y los procedimientos operativos procedimientos específicos mencionados en el de acuerdo con todos los elementos especificados que se documenten, se mantengan y se difundan"
    },
    {
        "code": "6.1.2",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 6.1.2.a Evalúe la documentación para verificar que manera segura y su nivel de seguridad se actividades del Requisito 6 están documentadas, las descripciones de los roles y responsabilidades reducirá. asignadas y comprendidas. para realizar las actividades del Requisito 6 estén Buenas Prácticas documentadas y asignadas. 6.1.2.b Entreviste al personal responsable de documentarse dentro de políticas y realizar las actividades del Requisito 6 para procedimientos o mantenerse en documentos"
    },
    {
        "code": "6.2.1",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.2.1",
        "guidance": "El software a medida y personalizado se 6.2.1 Evalúe los procedimientos de desarrollo de requisitos del desarrollo de software, las desarrolla de forma segura, de la siguiente manera: software documentados para verificar que los vulnerabilidades de seguridad pueden mejores prácticas para un desarrollo seguro. elementos especificados en este requisito. el entorno de producción. autenticación segura y registro). Comprender cómo la aplicación maneja los datos de problemas de seguridad durante cada etapa transmiten y están en la memoria, puede ayudar del ciclo de vida del desarrollo de software. a identificar dónde se deben proteger los datos."
    },
    {
        "code": "6.2.2",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.2.2",
        "guidance": "El personal de desarrollo de software que 6.2.2.a Evalúe los procedimientos de desarrollo de definidas en el Requisito 6.2.4, ayudará a trabaja en software a medida y personalizado recibe software para verificar que los procesos estén minimizar el número de vulnerabilidades de capacitación al menos una vez cada 12 meses de la definidos para capacitar al personal de desarrollo seguridad introducidas a través de prácticas de siguiente manera: de software para que desarrolle software a medida codificación deficientes. su función laboral y lenguajes de desarrollo. especificados en este requisito. de codificación segura. entreviste al personal para verificar que el personal La capacitación debe incluir, entre otros, prueba de seguridad, cómo utilizar las a medida y personalizado haya recibido software seguro, técnicas de codificación segura, herramientas para detectar vulnerabilidades en capacitación en seguridad de software que sea uso de técnicas/métodos para encontrar el software. relevante para su función laboral y lenguajes de vulnerabilidades en los códigos, procesos para desarrollo de acuerdo con todos los elementos impedir la reintroducción de vulnerabilidades"
    },
    {
        "code": "6.2.3",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.2.3",
        "guidance": "El software a medida y personalizado es 6.2.3.a Evalúe los procedimientos de desarrollo de explotadas por personas malintencionadas para revisado antes de ser lanzado a producción o para software documentados y entreviste al personal obtener acceso a una red y comprometer los los clientes, a fin de identificar y corregir posibles responsable para verificar que los procesos están datos del tarjetahabiente. vulnerabilidades de codificación, de la siguiente definidos y requieren que todo el software El código vulnerable es mucho más difícil y manera: personalizado y personalizado sea revisado de costoso de abordar una vez que se ha código se desarrolle de acuerdo con las pautas este requisito. producción. Exigir una revisión formal y la de codificación segura. aprobación por parte de la gerencia antes de la 6.2.3.b Evalúe la evidencia de los cambios en el software a medida y personalizado para verificar vulnerabilidades de software tanto existente se apruebe y se desarrolle de acuerdo con las que los cambios en el código se revisaron de como emergente. políticas y procedimientos. acuerdo con todos los elementos especificados en antes de la publicación. Los siguientes elementos deben considerarse"
    },
    {
        "code": "6.2.4",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.2.4",
        "guidance": "Las técnicas de ingeniería de software u otros 6.2.4 Evalúe los procedimientos documentados y posible dentro del proceso de desarrollo del métodos están definidos y en uso para el software a entreviste al personal responsable del desarrollo software, reduce la probabilidad de que dichos medida y personalizado por el personal de de software para verificar que las técnicas de errores lleguen a producción y den lugar a un desarrollo de software a fin de impedir o mitigar los ingeniería de software u otros métodos están riesgo de seguridad. Contar con técnicas y ataques de software comunes y las vulnerabilidades definidos y en uso por los desarrolladores de herramientas de ingeniería formal integradas en relacionadas, incluyendo, pero no limitado a lo software a medida y personalizado para impedir o el proceso de desarrollo permitirá detectar estos siguiente: mitigar todos los ataques de software comunes errores en una fase temprana. Esta filosofía se XPath u otros fallos de flujo de tipo comando, izquierda\". parámetro, objeto, defecto o de inyección. Buenas Prácticas incluyendo intentos de manipulación de buffers, personalizado, la entidad debe asegurarse de punteros, datos de entrada o datos compartidos. que el código se desarrolla centrándose en intentos de explotar implementaciones comunes, incluyendo: criptográficas débiles, inseguras o inapropiadas, • Intentos de explotar vulnerabilidades de algoritmos, suites de cifrado o modos de codificación comunes (bugs). operación. • Intentos de explotar los defectos de diseño del intentos de abusar o eludir las características y • Intentos de explotar fallos de funcionalidades de la aplicación a través de la implementación/configuración. manipulación de las APIs, los protocolos y canales de comunicación, la funcionalidad del • Ataques de enumeración: ataques lado del cliente, u otras funciones y recursos del automatizados que se explotan activamente sistema/aplicación. Esto incluye los scripts entre en los pagos y abusan de los mecanismos de sitios (XSS) y la falsificación de petición entre identificación, autenticación o autorización. sitios (CSRF). Véase el artículo del blog Perspectivas PCI acceso, incluidos los intentos de eludir o abusar de los mecanismos de identificación, autenticación o autorización, o los intentos de aprovechar las debilidades en la implementación (continúa en la página siguiente) de dichos mecanismos. (continúa en la página siguiente) Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 148 Requisitos y Procedimientos de Prueba Guía \"alto riesgo\" identificada en el proceso de ingeniería de software u otros métodos ayuda a identificación de vulnerabilidades, tal como se definir cómo los desarrolladores de software define en el Requisito 6.3.1. impiden o mitigan varios ataques de software"
    },
    {
        "code": "6.3.1",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.3.1",
        "guidance": "Las vulnerabilidades de seguridad se 6.3.1.a Evalúe las políticas y procedimientos para organizaciones identificar, priorizar y abordar los identifican y gestionan de la siguiente manera: identificar y gestionar las vulnerabilidades de elementos de mayor riesgo más rápidamente y identifican utilizando fuentes reconocidas por la sido definidos de acuerdo con todos los elementos vulnerabilidades que presentan el mayor riesgo. industria de información de vulnerabilidades de especificados en este requisito. Buenas Prácticas seguridad, incluyendo alertas de equipos Los métodos para examinar las vulnerabilidades 6.3.1.b Entreviste al personal responsable, internacionales y nacionales de respuesta a y asignar las clasificaciones de riesgo variarán en examine la documentación y observe los procesos emergencias informáticas (CERTs). función del entorno y de la estrategia de a fin de verificar que las vulnerabilidades de clasificación de riesgo basada en las mejores con todos los elementos especificados en este Cuando una entidad está asignando sus prácticas de la industria y considerando su requisito. clasificaciones de riesgo, debe considerar el uso impacto potencial. de una metodología formal, objetiva y justificable mínimo, todas las vulnerabilidades consideradas vulnerabilidades pertinentes a la organización, y de alto riesgo o críticas para el entorno. que traduzca esas consideraciones en la informáticos a medida y de terceros (por ejemplo, sistemas operativos y bases de datos). Los procesos de una organización para gestionar"
    },
    {
        "code": "6.3.2",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.3.2",
        "guidance": "A fin de facilitar la gestión de vulnerabilidades 6.3.2.a Evalúe la documentación y entreviste al cualquier software de terceros que se incorpore al y parches se mantiene un inventario del software a personal para verificar que se mantenga un software personalizado y a medida de la entidad, medida y personalizado y de los componentes del inventario del software a medida y personalizado y permite gestionar vulnerabilidades y parches. software de terceros incorporados en el software a de los componentes del software de terceros Las vulnerabilidades en componentes de terceros medida y personalizado. incorporados a ese software, y que el inventario se (incluidas bibliotecas, API, etc.) integradas en el utilice para identificar y abordar las software de una entidad también hacen que esas vulnerabilidades. aplicaciones sean vulnerables a los ataques. A fin 6.3.2.b Evalúe la documentación del software, incluido el software a medida y personalizado que"
    },
    {
        "code": "6.3.3",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.3.3",
        "guidance": "Todos los componentes del sistema están 6.3.3.a Evalúe las políticas y procedimientos para contra sistemas que anteriormente se protegidos contra vulnerabilidades conocidas verificar que los procesos estén definidos para consideraban seguros. Si los mediante la instalación de parches/actualizaciones abordar vulnerabilidades mediante la instalación parches/actualizaciones de seguridad más de seguridad aplicables de la siguiente manera: de parches/actualizaciones de seguridad recientes no se implementan en los sistemas seguridad (identificados de acuerdo con el especificados en este requisito. malintencionados pueden utilizar esas proceso de clasificación de riesgos del Requisito vulnerabilidades para atacar o deshabilitar un 6.3.3.b Evalúe los componentes del sistema y el sistema u obtener acceso a datos confidenciales. 6.3.1) se instalan dentro del período de un mes software relacionado y comparar la lista de de su emisión. Buenas Prácticas parches/actualizaciones de seguridad instaladas seguridad aplicables se instalan dentro de un seguridad más reciente a fin de verificar que las seguridad para la infraestructura crítica garantiza período de tiempo apropiado según lo determine vulnerabilidades se aborden de acuerdo con todos que los sistemas y dispositivos altamente la entidad (por ejemplo, dentro de los tres meses los elementos especificados en este requisito. prioritarios estén protegidos contra posteriores al lanzamiento). vulnerabilidades tan pronto como sea posible"
    },
    {
        "code": "6.4.1",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.4.1",
        "guidance": "Para las aplicaciones web de cara al público, 6.4.1 Para las aplicaciones web de cara al público, sólo para uso interno). Dichas aplicaciones son las nuevas amenazas y vulnerabilidades se asegúrese de que cada uno de los métodos los objetivos principales de los atacantes, y las abordan de forma continua y están protegidas requeridos está ubicado en su lugar como sigue: aplicaciones web mal codificadas proporcionan contra los ataques conocidos de la siguiente manera: datos y sistemas confidenciales. manuales o automatizados de evaluación de la público mediante herramientas o métodos de procesos documentados, entreviste al personal Las herramientas o métodos de evaluación de la evaluación de la seguridad de las y examine los registros de las evaluaciones de seguridad de las vulnerabilidades, sean manuales vulnerabilidades de las aplicaciones, sean la seguridad de las aplicaciones para verificar o automatizados, revisan y/o ponen a prueba la manuales o automatizadas, como sigue: que las aplicaciones web de cara al público se aplicación en busca de vulnerabilidades. – Al menos una vez cada 12 meses y después revisan de acuerdo con todos los elementos de de cambios significativos. Las herramientas de evaluación más comunes este requisito específicos a la – Por una entidad especializada en seguridad incluyen escáneres web especializados que herramienta/método. de aplicaciones. realizan un análisis automático de la protección O de las aplicaciones web. – Incluyendo, como mínimo, todos los ataques de software comunes descritos en el • Si se instala una solución técnica automatizada Cuando se utilicen soluciones técnicas Requisito 6.2.4. que detecte e impida continuamente los automatizadas, es importante incluir procesos – Todas las vulnerabilidades se clasifican de ataques basados en la web, examine los que faciliten una respuesta oportuna a las alertas acuerdo con el Requisito 6.3.1. ajustes de configuración del sistema y los generadas por las soluciones, a fin de poder registros de auditoría, y entreviste al personal mitigar cualquier ataque que haya sido detectado. – Se corrigen todas las vulnerabilidades. responsable para verificar que la solución – La aplicación se vuelve a examinar después Ejemplos técnica automatizada está instalada de de las correcciones. Firewalls de aplicaciones web (WAF) instalado acuerdo con todos los elementos de este O requisito específicos de la solución o delante de las aplicaciones web de cara al automatizadas que detecten e impidan ejemplo de solución técnica automatizada que continuamente los ataques basados en la web detecta e impide los ataques basados en la web de la siguiente manera: (por ejemplo, los ataques incluidos en el – Instaladas frente a las aplicaciones web de Requisito 6.2.4). Los WAF filtran y bloquean el cara al público para detectar e impedir los tráfico no esencial en la capa de aplicación. Un ataques basados en la web. WAF correctamente configurado ayuda a impedir – Generando registros de auditoría. los ataques en la capa de aplicación de las (continúa en la página siguiente) configuradas de forma indebida. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 155 Requisitos y Procedimientos de Prueba Guía – Configurados ya sea para bloquear los Otro ejemplo de solución técnica automatizada ataques basados en la web o para generar son las tecnologías de Autoprotección de una alerta que se investigue Aplicaciones en Tiempo de Ejecución (RASP). inmediatamente. Cuando se implementan correctamente, las"
    },
    {
        "code": "6.4.2",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.4.2",
        "guidance": "Para aplicaciones web de cara al público se 6.4.2 Para las aplicaciones web de cara al público, aplicaciones web mal codificadas proporcionan implementa una solución técnica automatizada que examine los ajustes de configuración del sistema y una vía fácil para que los atacantes accedan a detecta e impide continuamente ataques basados los registros de auditoría, y entreviste al personal datos y sistemas confidenciales. en la web, con al menos lo siguiente: responsable para verificar que se haya Buenas Prácticas que detecte e impida los ataques basados en la Cuando se utilicen soluciones técnicas público y está configurado para detectar e automatizadas, es importante incluir procesos impedir ataques basados en la web. web de acuerdo con todos los elementos especificados en este requisito. que faciliten una respuesta oportuna a las alertas según corresponda. mitigar cualquier ataque que haya sido detectado. basados en la web o para generar una alerta aplicarse para mitigar los ataques de fuerza bruta que se investigue inmediatamente. y los ataques de enumeración."
    },
    {
        "code": "6.4.3",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.4.3",
        "guidance": "Todos los scripts de las páginas de pago que 6.4.3.a Evalúe las políticas y los procedimientos el conocimiento de la entidad y también pueden se cargan y ejecutan en el navegador del para verificar que los procesos están definidos tener la funcionalidad de cargar scripts externos consumidor se gestionan de la siguiente manera: para gestionar todos los scripts de las páginas de adicionales (por ejemplo, publicidad y cada script está autorizado. del consumidor, de acuerdo con todos los etiquetas). elementos especificados en este requisito. Los atacantes potenciales pueden utilizar estos integridad de cada script. scripts aparentemente inofensivos para cargar 6.4.3.b Entreviste al personal responsable y con una justificación por escrito que explique su configuraciones del sistema para verificar que necesidad. todos los scripts de páginas de pago que se cargan y ejecutan en el navegador del consumidor Asegurarse de que se entienda que la se gestionan de acuerdo con todos los elementos funcionalidad de todos estos scripts es necesaria especificados en este requisito. para el funcionamiento de la página de pago"
    },
    {
        "code": "6.5.1",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.5.1",
        "guidance": "Los cambios en todos los componentes del 6.5.1.a Evalúe los procedimientos documentados adición, eliminación o modificación de cualquier sistema en el entorno de producción se realizan de de control de cambios para verificar que los componente del sistema- en el entorno de acuerdo con los procedimientos establecidos que procedimientos para los cambios en todos los producción. Es importante documentar la razón incluyen: componentes del sistema del entorno de de un cambio y la descripción del mismo, de los elementos especificados en este requisito. estén de acuerdo en que el cambio es necesario. partes autorizadas. componentes del sistema y rastrear esos cambios planificar adecuadamente cualquier cambio en el hasta la documentación de control de cambios proceso. relacionada. Para cada cambio evaluado, verifique negativamente la seguridad del sistema. Buenas Prácticas que el cambio se aplica de acuerdo con todos los medida y personalizados, todas las que el cambio es legítimo y aprobado por la actualizaciones se comprueban para determinar organización. Los cambios deben ser aprobados que cumplen con el requisito 6.2.4 antes de ser por personas con la autoridad y los instalados para producción. conocimientos adecuados para comprender el volver a un estado seguro. La realización de pruebas exhaustivas por parte"
    },
    {
        "code": "6.5.2",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.5.2",
        "guidance": "Al completar un cambio significativo, se 6.5.2 Evalúe la documentación en busca de controles apropiados PCI DSS se apliquen a confirma que todos los requisitos PCI DSS están cambios significativos, entreviste al personal y cualquier sistema o red agregado o cambiado vigentes en todos los sistemas y redes nuevas o observe los sistemas/redes afectados para dentro del entorno y alcance, y que se sigan modificadas, y la documentación se actualiza según verificar que la entidad confirmó que los requisitos cumpliendo los requisitos PCI DSS para proteger corresponda. PCI DSS estaban vigentes en todos los sistemas y ese entorno. redes nuevas o modificadas, y que la Buenas Prácticas documentación fue actualizada según"
    },
    {
        "code": "6.5.3",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.5.3",
        "guidance": "Los entornos de preproducción se separan de 6.5.3.a Evalúe las políticas y los procedimientos menos seguros que el entorno de producción. los entornos de producción y la separación se para verificar que los procesos estén definidos Buenas Prácticas aplica con controles de acceso. para separar el entorno de pre-producción del entorno de producción a través de controles de Las organizaciones deben comprender acceso que refuerzan la separación. claramente qué entornos son entornos de prueba 6.5.3.b Evalúe la documentación de la red y las interactúan a nivel de redes y aplicaciones. configuraciones de los controles de seguridad de Definiciones la red a fin de asegurarse de que el entorno de Los entornos de preproducción incluyen pre-producción esté separado de los entornos de desarrollo, pruebas, pruebas de aceptación del producción. usuario (UAT), etc. Incluso cuando la 6.5.3.c Evalúe la configuración del control de acceso para confirmar que los controles de acceso"
    },
    {
        "code": "6.5.4",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.5.4",
        "guidance": "Los roles y las funciones se separan entre los 6.5.4.a Evalúe las políticas y procedimientos para reducir la cantidad de personal con acceso al entornos de producción y pre-producción para verificar que los procesos están definidos para entorno de producción y datos de cuentas y, por asignar responsabilidades de manera tal que sólo separar los roles y las funciones para asignar lo tanto, minimizar el riesgo de acceso no se desplieguen los cambios revisados y aprobados. responsabilidad de manera tal que sólo se autorizado, no intencional o inadecuado a los desplieguen los cambios revisados y aprobados. datos. y componentes del sistema y ayudar a 6.5.4.b Observe los procesos y entreviste al personas con una necesidad de negocio de dicho personal para verificar que los controles acceso."
    },
    {
        "code": "6.5.5",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.5.5",
        "guidance": "Los datos PAN activos no se utilizan en 6.5.5.a Evalúe las políticas y procedimientos para oportunidad de obtener acceso no autorizado a entornos de pre-producción, excepto cuando esos verificar que los procesos estén definidos para no los datos de los titulares de tarjetas. entornos están incluidos en el CDE y protegidos de usar datos PAN activos en entornos de pre- Buenas Prácticas acuerdo con todos los requisitos PCI DSS producción, excepto cuando esos entornos están aplicables. incluidos en el CDE y protegidos de acuerdo con Las entidades pueden minimizar su todos los requisitos PCI DSS aplicables. almacenamiento de datos PAN activos 6.5.5.b Observe los procedimientos de prueba y sea estrictamente necesario para un propósito de entreviste al personal para verificar que se han prueba específico y definido y eliminando de establecido procedimientos para garantizar que no forma segura esos datos después de su uso. se utilicen PAN vivos en entornos de Si una entidad requiere datos PAN preproducción, excepto cuando dichos entornos se específicamente diseñados para fines de prueba, encuentren en un CDE y estén protegidos de éstos pueden obtenerse de los adquirientes. acuerdo con todos los requisitos PCI DSS Definiciones aplicables. 6.5.5.c Evalúe los datos de prueba de válidos (no datos PAN de prueba) que tienen el preproducción para verificar que las PAN activos potencial de utilizarse para realizar transacciones no se utilicen en entornos de preproducción, de pago. Además, cuando las tarjetas de pago"
    },
    {
        "code": "6.5.6",
        "domain": "Requisito 6 - Desarrollar y Mantener Sistemas y Software Seguros",
        "requirement": "Requisito 6.5.6",
        "guidance": "Los datos de prueba y las cuentas de pruebas 6.5.6.a Evalúe las políticas y los procedimientos un blanco fácil de explotar para que personas no se eliminan de los componentes del sistema antes para verificar que los procesos estén definidos autorizadas obtengan acceso a los sistemas. La de que el sistema entre en producción. para la eliminación de datos de prueba y cuentas posesión de dicha información podría facilitar el de prueba de los componentes del sistema, antes compromiso del sistema y los datos de cuentas de que el sistema entre en producción. relacionados. 6.5.6.b Observe los procesos de prueba tanto para el software estándar como para las aplicaciones internas, y entreviste al personal para verificar que los datos de prueba y las cuentas de prueba se eliminen antes de que un sistema entre en producción. 6.5.6.c Observe los datos y las cuentas del software estándar y las aplicaciones internas"
    },
    {
        "code": "7.1.1",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.1.1",
        "guidance": "Todas las políticas de seguridad y 7.1.1 Evalúe la documentación y entreviste al y procedimientos especificados en el Requisito 7. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 7 son: seguridad y los procedimientos operativos procedimientos específicos mencionados en el de acuerdo con todos los elementos especificados que se documenten, se mantengan y se difundan"
    },
    {
        "code": "7.1.2",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 7.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que actividades del Requisito 7 están documentadas, las descripciones de los roles y responsabilidades las actividades críticas no se desarrollen. asignadas y son comprendidos. para realizar las actividades del Requisito 7 estén Buenas Prácticas documentadas y asignadas. 7.1.2.b Entreviste al personal responsable de documentarse dentro de políticas y desarrollar las actividades del Requisito 7 para procedimientos o mantenerse en documentos verificar que los roles y responsabilidades se separados. asignen según sean documentadas y entendidas. Como parte de los roles de comunicación y de las"
    },
    {
        "code": "7.2.1",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.2.1",
        "guidance": "Se define un modelo de control de acceso que 7.2.1.a Evalúe las políticas y procedimientos entidad y la filosofía de control de acceso incluye la autorización de acceso como sigue: documentados y entreviste al personal para respalda una forma consistente y uniforme de la entidad y las necesidades de acceso. definido con todos los elementos especificados en errores como la concesión de derechos este requisito. excesivos. recursos de datos basados en la clasificación y Buenas Prácticas 7.2.1.b Evalúe la configuración del modelo de las funciones del trabajo de los usuarios. control de acceso y verificar que las necesidades Un factor a considerar al definir las necesidades usuario, administrador) para realizar una función en concordancia con todos los elementos funciones. El objetivo de este principio es impedir laboral. especificados en este requisito. el fraude y el uso inapropiado o robo de los"
    },
    {
        "code": "7.2.2",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.2.2",
        "guidance": "El acceso se asigna a los usuarios, incluidos 7.2.2.a Evalúe las políticas y procedimientos para conocimiento de la aplicación cambien de forma los privilegiados, en función de: verificar que cubren la asignación de acceso a los incorrecta o accidental su configuración o alteren especificados en este requisito. privilegios mínimos también ayuda a minimizar el las responsabilidades del trabajo. 7.2.2.b Evalúe las configuraciones de acceso de autorizada obtiene acceso a la ID de un usuario. los usuarios, incluidos los usuarios con privilegios, y entreviste al personal de gestión responsable de verificar que los privilegios asignados se ajustan a Los derechos de acceso se conceden a un todos los elementos especificados en este usuario mediante la asignación de una o varias requisito. funciones. La evaluación se asigna dependiendo 7.2.2.c Entreviste al personal responsable de alcance mínimo requerido para el trabajo. asignar el acceso para verificar que el acceso de Al asignar un acceso privilegiado, es importante"
    },
    {
        "code": "7.2.3",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.2.3",
        "guidance": "Los privilegios requeridos son aprobados por 7.2.3.a Evalúe las políticas y procedimientos para personas con acceso y privilegios son conocidas el personal autorizado. verificar que definen los procesos para la y están autorizadas por la dirección, y que su aprobación de todos los privilegios por parte del acceso es necesario para su función laboral. personal autorizado. 7.2.3.b Evalúe las identificaciones de los usuarios y los privilegios asignados, y compararlos con las"
    },
    {
        "code": "7.2.4",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.2.4",
        "guidance": "Todas las cuentas de usuario y los privilegios 7.2.4.a Evalúe las políticas y los procedimientos excesivos que quedan después de que cambian de acceso relacionados, incluyendo las cuentas de para verificar que definen los procesos de revisión las responsabilidades laborales de los usuarios, terceros/proveedores, se revisan de la siguiente de todas las cuentas de usuario y los privilegios de las funciones del sistema u otras modificaciones. manera: acceso relacionados, incluidas las cuentas de Si los derechos de acceso de un usuario son elementos especificados en este requisito. pueden ser utilizados por usuarios y el acceso sigan siendo apropiados según la 7.2.4.b Entreviste al personal responsable y función del trabajo. Esta revisión ofrece otra oportunidad para examine los resultados documentados de las para verificar que todos los resultados estén de acuerdo con todos los elementos especificados en siendo apropiado. como también para asegurarse de que se haya este requisito."
    },
    {
        "code": "7.2.5",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.2.5",
        "guidance": "Todas las aplicaciones y cuentas del sistema 7.2.5.a Evalúe las políticas y los procedimientos sistema. Si dichas cuentas se ven y los privilegios de acceso relacionados se asignan para verificar que definen los procesos de comprometidas, usuarios malintencionados y administran de la siguiente manera: administración y asignación de las cuentas de recibirán el mismo nivel de acceso que el para la operatividad del sistema o aplicación. relacionados, de acuerdo con todos los elementos es importante asegurarse de que se otorgue un especificados en este requisito. acceso limitado a las cuentas del sistema y de la aplicaciones o procesos que específicamente 7.2.5.b Evalúe los privilegios relacionados con las de los usuarios. requieren su uso. cuentas del sistema y de aplicaciones y entreviste al personal responsable para verificar que las cuentas del sistema y de aplicaciones, y los Es posible que las entidades consideren"
    },
    {
        "code": "7.2.6",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.2.6",
        "guidance": "Todo acceso por parte de los usuarios a las 7.2.6.a Evalúe las políticas y los procedimientos y común de filtración de datos. Limitar dicho acceso bases de datos de los titulares de la tarjeta está entreviste al personal para verificar que los a los administradores reduce el riesgo de que restringido de la siguiente manera: procesos estén definidos para otorgar acceso de usuarios no autorizados abusen de dicho acceso. programáticos, con acceso y acciones titulares de tarjetas, de acuerdo con todos los elementos especificados en este requisito. \"Métodos programáticos\" significa otorgar acceso permitidas basadas en las funciones y privilegios a través de medios tales como procedimientos mínimos del usuario. almacenados en la base de datos, lo que 7.2.6.b Evalúe la configuración para consultar las acceder directamente o consultar las bases de verificar que cumplen con todos los elementos controladas a los datos en una tabla, en lugar de datos de CHD almacenados. especificados en este requerimiento. a través del acceso directo y sin filtrar el acceso a"
    },
    {
        "code": "7.3.1",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.3.1",
        "guidance": "Existen sistemas de control de acceso que 7.3.1 Evalúe la documentación del proveedor y la usuario, el usuario puede erróneamente obtener restringen el acceso según la necesidad del usuario configuración del sistema para verificar que el acceso a los datos de titulares de la tarjeta. Los y cubre todos los componentes del sistema. acceso se administre, para cada componente del sistemas de control de acceso automatizan el sistema, a través de controles de acceso que proceso de restringir el acceso y asignar restringen el acceso según la necesidad del privilegios."
    },
    {
        "code": "7.3.2",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.3.2",
        "guidance": "Los sistemas de control de acceso están 7.3.2 Evalúe la documentación del proveedor y la errores en la asignación de los permisos a configurados para aplicar los permisos asignados a configuración del sistema para verificar que los individuos, aplicaciones y sistemas. individuos, aplicaciones, y sistemas basados en la sistemas de control de acceso están configurados clasificación y función del trabajo. para aplicar los permisos asignados a individuos, aplicaciones y sistemas basados en la clasificación y función del trabajo."
    },
    {
        "code": "7.3.3",
        "domain": "Requisito 7 - Restringir el Acceso a los Componentes del Sistema y a los Datos de Titulares de Tarjetas Según",
        "requirement": "Requisito 7.3.3",
        "guidance": "El sistema de control de acceso está 7.3.3 Evalúe la documentación del proveedor y la nadie a menos que se establezca una regla configurado para \"denegar todo\" configuración del sistema para verificar que el específica que conceda dicho acceso. predeterminadamente. sistema de control de acceso está configurado Buenas Prácticas predeterminadamente para \"denegar todo\"."
    },
    {
        "code": "8.1.1",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.1.1",
        "guidance": "Todas las políticas de seguridad y 8.1.1 Evalúe la documentación y entreviste al y procedimientos descritos en el Requisito 8. Si procedimientos operativos que se identifican en el personal para verificar que las políticas de bien es importante definir las políticas o Requisito 8 están: seguridad y los procedimientos operativos procedimientos específicos mencionados en el de acuerdo con todos los elementos especificados que se documenten, se mantengan y se difundan"
    },
    {
        "code": "8.1.2",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 8.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que, actividades del Requisito 8 están documentados, las descripciones de los roles y responsabilidades por lo tanto, las actividades críticas no se asignados y son comprendidos. para realizar las actividades del Requisito 8 estén realicen. documentadas y asignadas. Buenas Prácticas 8.1.2.b Entreviste al personal responsable de Los roles y responsabilidades pueden desarrollar las actividades del Requisito 8 para documentarse dentro de políticas y verificar que los roles y responsabilidades son procedimientos o mantenerse en documentos"
    },
    {
        "code": "8.2.1",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.1",
        "guidance": "A todos los usuarios se les asigna un ID único 8.2.1.a Entreviste al personal responsable para establece la responsabilidad y la trazabilidad, y antes de permitirles el acceso a los componentes verificar que a todos los usuarios se les asigna un es fundamental para establecer controles de del sistema o a los datos del titular de la tarjeta. ID único para acceder a los componentes del acceso eficientes. sistema y a los datos del titular de la tarjeta. Al garantizar que cada usuario se identifique de 8.2.1.b Evalúe los registros de auditoría y otras pruebas para verificar que el acceso a los"
    },
    {
        "code": "8.2.2",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.2",
        "guidance": "Las cuentas grupales, compartidas o 8.2.2.a Evalúe las listas de cuentas de usuario en programas informáticos o los sistemas genéricas, u otras credenciales de autenticación los componentes del sistema y la documentación operativos, por ejemplo, como root o con compartidas sólo se usan cuando es necesario, de aplicable para verificar que las credenciales de privilegios asociados a una función específica, manera excepcional, y se administran de la autenticación compartidas solo se utilicen cuando como la de administrador. siguiente manera: sea necesario, de manera excepcional, y se Si varios usuarios comparten las mismas requiera por una circunstancia excepcional. especificados en este requisito. cuenta de usuario y contraseña), resulta 8.2.2.b Evalúe las políticas y los procedimientos circunstancia excepcional. sistema a un individuo. A su vez, esto impide que de autenticación para verificar que los procesos documentada. compartidas estén definidos, de modo que solo se utilicen cuando sea necesario, de forma excepcional, y se gestionen de acuerdo con todos dirección. grupo con conocimiento del ID de usuario y los los elementos especificados en este requisito. antes de que se conceda el acceso a una 8.2.2.c Entreviste a los administradores del La capacidad de asociar personas a las acciones cuenta. sistema para verificar que las credenciales de realizadas con una cuenta es esencial para autenticación compartidas sólo se usan cuando es proporcionar responsabilidad individual y necesario, de manera excepcional, y se trazabilidad con respecto a quién realizó una individual. administran de acuerdo con todos los elementos acción, qué acción se realizó y cuándo ocurrió especificados en este requisito. esa acción."
    },
    {
        "code": "8.2.3",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.3",
        "guidance": "Requisito adicional solo para proveedores 8.2.3 Procedimiento de prueba adicional solo acceso para respaldar los sistemas POS POI o de servicios: Los proveedores de servicios con para evaluaciones de proveedores de para proporcionar otros servicios remotos. acceso remoto a las instalaciones del cliente deben servicios: Evalúe las políticas y los Si un proveedor de servicios utiliza los mismos utilizar factores de autenticación únicos para las procedimientos de autenticación y entreviste al factores de autenticación para acceder a varios instalaciones de cada cliente. personal para verificar que los proveedores de clientes, todos los clientes del proveedor de servicios con acceso remoto a las instalaciones del servicios pueden verse fácilmente comprometidos"
    },
    {
        "code": "8.2.4",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.4",
        "guidance": "La creación, eliminación y modificación de IDs 8.2.4 Evalúe las autorizaciones documentadas en modificaciones) sea controlado, de manera que de usuario, factores de autenticación y otros objetos varias fases del ciclo de vida de la cuenta sólo las cuentas autorizadas puedan realizar de identificación se gestiona de la siguiente (creaciones, modificaciones y eliminaciones) y funciones, que las acciones sean auditables y manera: examine la configuración del sistema para verificar que los privilegios se limiten solamente a lo con todos los elementos especificados en este Los atacantes a menudo ponen en peligro una especificados en la aprobación documentada. cuenta existente y luego escalan los privilegios de"
    },
    {
        "code": "8.2.5",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.5",
        "guidance": "El acceso para los usuarios que cesan se 8.2.5.a Evalúe las fuentes de información para los través de su cuenta de usuario, podría ocurrir un revoca inmediatamente. usuarios cesantes y revise las listas de acceso de acceso innecesario o malicioso a los datos de los usuarios actuales, tanto para el acceso local titulares de tarjetas, ya sea por parte del ex- como para el remoto, a fin de verificar que las empleado o por parte de usuarios identificaciones de los usuarios cesantes se hayan malintencionados valiéndose de la cuenta antigua desactivado o eliminado de las listas de acceso. y/o no utilizada. 8.2.5.b Entreviste al personal responsable para verificar que todos los factores de autenticación físicos – tales como tarjetas inteligentes, tokens, etc., se hayan devuelto o desactivado para los usuarios deshabilitados."
    },
    {
        "code": "8.2.6",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.6",
        "guidance": "Las cuentas de usuario inactivas se eliminan o 8.2.6 Evalúe las cuentas de usuario y la menos probable que se noten cambios, como, inhabilitan dentro de los 90 días de inactividad. información del último inicio de sesión, y entreviste por ejemplo, un cambio de contraseña. De esta al personal para verificar que las cuentas de forma, estas cuentas pueden explotarse más usuario inactivas se eliminen o deshabiliten dentro fácilmente y usarse para acceder a los datos del"
    },
    {
        "code": "8.2.7",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.7",
        "guidance": "Las cuentas utilizadas por terceros para 8.2.7 Entreviste al personal, examine la redes de una entidad con el propósito de brindar acceder, respaldar o mantener componentes del documentación para administrar las cuentas y soporte, aumenta las posibilidades de acceso no sistema a través de acceso remoto se administran examine las evidencias necesarias para verificar autorizado. Este acceso podría llevar a que un de la siguiente manera: que las cuentas utilizadas por terceros para el usuario no autorizado en el entorno del tercero, o tiempo necesario y son deshabilitadas cuando todos los elementos especificados en este de entrada externo siempre disponible en la red no están en uso. requisito. de una entidad. Cuando terceros necesitan actividad inesperada. monitorizarse y vincularse a razones específicas"
    },
    {
        "code": "8.2.8",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.2.8",
        "guidance": "Si una sesión de usuario ha estado inactiva 8.2.8 Evalúe los ajustes de configuración del del sistema o a los datos de titulares de tarjetas, durante más de 15 minutos, se requiere que el sistema para verificar que las características de existe el riesgo de que la máquina sea utilizada usuario vuelva a autenticarse para reactivar el tiempo máximo de inactividad del sistema/sesión por otros en ausencia del usuario, lo que terminal o la sesión. para las sesiones de usuario se han establecido resultaría en un acceso no autorizado a la cuenta en 15 minutos o menos. y/o su uso indebido."
    },
    {
        "code": "8.3.1",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.1",
        "guidance": "Todo acceso por parte de los usuarios y 8.3.1.a Evalúe la documentación que describa el IDs de ser comprometidos, ya que el atacante administradores a componentes del sistema se factor o factores de autenticación utilizados para necesita tener el ID único y poner en riesgo los autentifica utilizando al menos uno de los siguientes verificar que el acceso del usuario a los factores de autenticación asociados. factores de autenticación: componentes del sistema se autentifica mediante Buenas Prácticas en este requisito. Un enfoque común que individuos maliciosos frase de paso. emplean para comprometer un sistema es una tarjeta inteligente. utilizado con cada tipo de componente del sistema, inexistentes (como, por ejemplo, que la autenticación funciona de forma coherente autenticación fuertes ayuda a protegerse contra con el factor o factores de autenticación este tipo de ataque."
    },
    {
        "code": "8.3.2",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.2",
        "guidance": "Se utiliza criptografía sólida para que todos 8.3.2.a Evalúe documentación de fabricante así legibles y desencriptados (como contraseñas y los factores de autenticación sean ilegibles durante como los ajustes de configuración del sistema para frases de paso) a través de la red y/o almacenan la transmisión y el almacenamiento en todos los verificar que los factores de autenticación se estos valores sin cifrar. Como resultado, componentes del sistema. vuelven ilegibles mediante criptografía sólida individuos malintencionados pueden interceptar durante la transmisión y el almacenamiento. fácilmente esta información durante la 8.3.2.b Evalúe los repositorios de los factores de directamente a los factores de autenticación no autenticación para verificar que son ilegibles cifrados en los archivos donde estén durante el almacenamiento. almacenados, y así utilizar los datos para obtener 8.3.2.c Evalúe transmisiones de datos para verificar que los factores de autenticación son"
    },
    {
        "code": "8.3.3",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.3",
        "guidance": "La identidad del usuario se verifica antes de 8.3.3 Evalúe los procedimientos para modificar los usuarios del sistema -por ejemplo, llamando a un modificar cualquier factor de autenticación. factores de autenticación y observe al personal de servicio de asistencia y actuando como un seguridad para verificar que cuando un usuario usuario legítimo- para que se cambie un factor de solicita la modificación de un factor de autenticación y así poder utilizar un ID de usuario autenticación, se verifica la identidad del usuario válido. antes de modificar el factor de autenticación. Exigir la identificación positiva de un usuario"
    },
    {
        "code": "8.3.4",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.4",
        "guidance": "Los intentos de autenticación inválidos se 8.3.4.a Evalúe los ajustes de configuración del una contraseña a través de herramientas limitan mediante: sistema para verificar que los parámetros de manuales o automáticas (como, por ejemplo, el de 10 intentos. las cuentas del usuario se bloqueen después de tenga éxito y obtenga acceso a la cuenta de un no más de 10 intentos de inicio de sesión usuario. un mínimo de 30 minutos o hasta que se Si una cuenta se bloquea debido a que alguien confirme la identidad del usuario. intenta continuamente adivinar la contraseña, los 8.3.4.b Evalúe los ajustes de configuración del sistema para verificar que los parámetros de contraseña están establecidos para requerir que,"
    },
    {
        "code": "8.3.5",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.5",
        "guidance": "Si las contraseñas/frases de paso se utilizan 8.3.5 Evalúe los procedimientos para establecer y antiguo empleado o individuos malintencionados como factores de autenticación para cumplir con el restablecer las contraseñas/frases de paso (si se pueden conocer o descubrir fácilmente el valor y requisito 8.3.1, estas se establecen y restablecen utilizan como factores de autenticación para utilizarlo para obtener acceso a la cuenta antes para cada usuario tal y como sigue: cumplir con el Requisito 8.3.1) y observe al de que el usuario autorizado intente utilizar la vez que se utilizan y al restablecerse. contraseñas/frases de paso se establecen y restablecen de acuerdo con todos los elementos inmediatamente después del primer uso."
    },
    {
        "code": "8.3.6",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.6",
        "guidance": "Si las contraseñas/frases de paso se utilizan 8.3.6 Evalúe los ajustes de configuración de los que individuos maliciosos a menudo tratarán como factores de autenticación para cumplir el sistemas para verificar que los parámetros de primero de encontrar cuentas con contraseñas requisito 8.3.1, estas deberán cumplir el siguiente complejidad de las contraseñas/frase de paso de débiles, estáticas o inexistentes. Si las nivel mínimo de complejidad: los usuarios estén establecidos de acuerdo con contraseñas son cortas o fáciles de adivinar, sistema no admite 12 caracteres, una longitud requisito. malintencionados encontrar esas cuentas débiles mínima de ocho caracteres). y comprometer una red bajo la apariencia de una alfabéticos. Buenas Prácticas"
    },
    {
        "code": "8.3.7",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.7",
        "guidance": "Las personas no pueden enviar una nueva 8.3.7 Evalúe los ajustes de configuración de los ya que las contraseñas anteriores se pueden contraseña / frase de paso que sea igual a sistemas para verificar que los parámetros de reutilizar una y otra vez. Exigir que las cualquiera de las últimas cuatro contraseñas / contraseñas estén configurados para requerir que contraseñas no se puedan reutilizar durante un frases de paso utilizadas. las nuevas contraseñas/frases de paso no puedan período reduce la probabilidad de que las ser las mismas que las cuatro contraseñas/frases contraseñas adivinadas, u obtenidas mediante"
    },
    {
        "code": "8.3.8",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.8",
        "guidance": "Las políticas y los procedimientos de 8.3.8.a Evalúe los procedimientos y entreviste al comprender y cumplir las políticas. autenticación están documentados y son personal para verificar que las políticas y los Buenas Prácticas comunicados a todos los usuarios, incluyendo: procedimientos de autenticación se distribuyan a todos los usuarios. La orientación sobre la selección de contraseñas autenticación robustos. personal a seleccionar contraseñas difíciles de 8.3.8.b Revise las políticas y los procedimientos proteger sus factores de autenticación. y verifique que incluyan los elementos diccionario o información sobre el usuario, como contraseñas/frases de paso utilizadas de la familia, la fecha de nacimiento, etc. anteriormente. 8.3.8.c Entreviste a los usuarios para verificar que La guía para proteger los factores de están familiarizados con las políticas y los autenticación puede incluir el no anotar de paso si existe alguna sospecha o conocimiento de que la contraseña/frase de paso se ha visto comprometida y cómo reportar el incidente."
    },
    {
        "code": "8.3.9",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.9",
        "guidance": "Si las contraseñas/frases de paso se utilizan 8.3.9 Si las contraseñas/frases de paso se utilizan proporcionar mediante un solo factor de como el único factor de autenticación para el como el único factor de autenticación para el autenticación, tal como una contraseña/frase de acceso del usuario (es decir, en cualquier acceso de los usuarios, inspeccione los ajustes de paso, un dispositivo token o tarjeta inteligente, o implementación de autenticación de factor único), configuración de los sistemas para verificar que las un atributo biométrico. Cuando se emplean entonces: contraseñas/frases de paso se administran de contraseñas/frases de paso como el único factor menos una vez cada 90 días, en este requisito. controles adicionales para proteger la integridad O analiza dinámicamente y el acceso a los Las contraseñas/frases de paso que son válidas recursos en tiempo real se determina durante mucho tiempo sin cambios brindan a automáticamente de acuerdo a dicha postura de individuos malintencionados más tiempo para seguridad. violarlas. Cambiar las contraseñas"
    },
    {
        "code": "8.3.10",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.10",
        "guidance": "Requisito adicional solo para 8.3.10 Procedimiento de prueba adicional sólo único punto de fallo si esta se ve comprometida. proveedores de servicios: Si las contraseñas / para evaluaciones de proveedores de Por lo tanto, en estas implementaciones, se frases de paso contraseña se utilizan como el único servicios: Si se utilizan contraseñas/frases de necesitan controles para minimizar la duración de factor de autenticación para el acceso del usuario paso como el único factor de autenticación para el la actividad maliciosa a través de una del cliente a los datos del titular de la tarjeta (es acceso del usuario del cliente a los datos del titular contraseña/frase de paso que esté decir, en cualquier implementación de autenticación de la tarjeta, examine la guía proporcionada a los comprometida. de factor único), entonces se brinda orientación a usuarios del cliente para verificar que la guía Buenas Prácticas los usuarios del cliente, que incluye: incluye todos los elementos especificados en este requisito. Las contraseñas/frases de paso que son válidas contraseñas/frases de paso periódicamente. individuos malintencionados más tiempo para circunstancias se cambian las contraseñas periódicamente ofrece menos tiempo contraseñas/frases de paso. para que individuos malintencionados averigüen (continúa en la página siguiente) Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 200 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "8.3.11",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.3.11",
        "guidance": "Cuando se utilizan factores de autenticación 8.3.11.a Evalúe las políticas y los procedimientos certificados, puede resultar imposible identificar al como tokens de seguridad físicos o lógicos, tarjetas de autenticación para verificar que los individuo que utiliza el mecanismo de inteligentes o certificados: procedimientos para utilizar factores de autenticación. no se comparten entre varios usuarios. físicos, tarjetas inteligentes y certificados están definidos e incluyen todos los elementos Disponer de controles físicos y/o lógicos (por sólo el usuario previsto pueda utilizar ese factor contraseña) para autenticar de forma única al para acceder. 8.3.11.b Entreviste al personal de seguridad para usuario de la cuenta impedirá que usuarios no verificar que los factores de autenticación se autorizados puedan ganar acceso a la cuenta del asignan a un usuario individual y no se comparten usuario mediante el uso de un factor de entre varios usuarios. autenticación compartido. 8.3.11.c Evalúe los ajustes de configuración de los sistemas y/o observe los controles físicos, según"
    },
    {
        "code": "8.4.1",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.4.1",
        "guidance": "Los MFA se implementan para todos los 8.4.1.a Evalúe las configuraciones de la red y/o del ingresar a un sistema haciéndose pasar por un accesos al CDE sin consola, para el personal con sistema para verificar que se requieren MFA para usuario legítimo, ya que el atacante necesitaría acceso administrativo. todos los accesos al CDE sin consola, para el comprometer varios factores de autenticación. personal con acceso administrativo. Esto es especialmente cierto en entornos en los 8.4.1.b Observe al personal administrador que autenticación empleado era algo que el usuario ingresa al CDE y verifique que los MFA son conoce, como una contraseña o una frase de"
    },
    {
        "code": "8.4.2",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.4.2",
        "guidance": "Los MFA se implementan para todos los 8.4.2.a Evalúe la red yo las configuraciones del ingresar a un sistema haciéndose pasar por un accesos al CDE. sistema para verificar que los MFA estén usuario legítimo, ya que el atacante necesitaría"
    },
    {
        "code": "8.4.3",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.4.3",
        "guidance": "Los MFA se implementan para todos los 8.4.3.a Evalúe la red y/o las configuraciones del atacante pueda obtener acceso a un sistema accesos a redes remotas que se originan fuera de sistema para los servidores y sistemas de acceso haciéndose pasar por un usuario legítimo, porque la red de la entidad y que podrían ingresar o remoto para verificar que se requieran MFA de el atacante necesitaría comprometer múltiples impactar el CDE de la siguiente manera: acuerdo con todos los elementos especificados en factores de autenticación. Esto es especialmente personal, tanto usuarios como administradores, factor de autenticación único empleado era algo 8.4.3.b Observe al personal (por ejemplo, usuarios que el usuario conoce, como una contraseña o originados fuera de la red de la entidad. y administradores) que se conectan de forma una frase de contraseña. autenticación multifactorial."
    },
    {
        "code": "8.5.1",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.5.1",
        "guidance": "Los sistemas MFA se implementan de la 8.5.1.a Evalúe la documentación del sistema del aborda la configuración de los sistemas MFA que siguiente manera: proveedor para verificar que el sistema MFA no brindan los MFA a los usuarios que acceden a los repetición. Definiciones 8.5.1.b Evalúe las configuraciones del sistema ningún usuario, incluyendo los usuarios verificar que está configurado de acuerdo con usar dos contraseñas separadas) no se considera administrativos, a menos que esté todos los elementos especificados en este autenticación multifactorial. específicamente documentado y autorizado por requisito. Información Adicional la administración de manera excepcional durante un período de tiempo limitado. Para obtener más información sobre los sistemas 8.5.1.c Entreviste al personal responsable y solicitud de evadir los MFA sea específicamente Información Complementaria PCI SCC: factores de autenticación. documentada y autorizada por la dirección, como Autenticación Multi-Factorial autenticación antes de que se otorgue el limitado. tema. acceso. 8.5.1.d Observe al personal que inicia sesión en los componentes del sistema en el CDE para verificar que el acceso se otorgue sólo después de que todos los factores de autenticación sean exitosos. 8.5.1.e Observe al personal que se conecta de forma remota desde fuera de la red de la entidad"
    },
    {
        "code": "8.6.1",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.6.1",
        "guidance": "Si las cuentas utilizadas por los sistemas o 8.6.1 Evalúe las cuentas de la aplicación y del requieren responsabilidad y una gestión estricta aplicaciones pueden ser utilizadas para el inicio de sistema que pueden ser usadas de forma para garantizar que se utilicen solo para el sesión interactivo, se gestionan de la siguiente interactiva y entreviste al personal administrativo propósito previsto y no se utilicen de forma manera: para verificar que las cuentas de la aplicación y del indebida. requiera por una circunstancia excepcional. los elementos especificados en este requisito. cuentas del sistema o de las aplicaciones para circunstancia excepcional. tarjetas. documentada. Siempre que sea posible, configure las cuentas por la dirección. inicio de sesión interactivo y así evitar que antes de que se conceda el acceso a una y para limitar las máquinas y dispositivos en los cuenta. que se puede usar la cuenta. individual"
    },
    {
        "code": "8.6.2",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.6.2",
        "guidance": "Las contraseñas/frases de paso para 8.6.2.a Entreviste al personal y examine los cuentas de aplicaciones y sistemas, cualquier aplicación y cuentas de sistema que procedimientos de desarrollo del sistema para especialmente si esas cuentas pueden utilizarse puedan ser utilizadas para el inicio de sesión verificar que los procesos están definidos para las para el inicio de sesión interactivo, aumenta el interactivo no están codificadas en scripts, archivos cuentas de la aplicación y del sistema que pueden riesgo y el éxito del uso no autorizado de esas de configuración/propiedades, o código fuente a la utilizarse para iniciar sesiones interactivas, cuentas privilegiadas. medida y personalizado. especificando que las contraseñas/frases de paso Buenas Prácticas no están codificadas en scripts, archivos de configuración/propiedades o código fuente a la La modificación de estos valores por sospecha o medida y personalizado. confirmación de divulgación puede ser 8.6.2.b Evalúe los scripts, archivos de Las herramientas pueden facilitar tanto la gestión configuración/propiedades, y el código fuente como la seguridad de los factores de"
    },
    {
        "code": "8.6.3",
        "domain": "Requisito 8 - Identificar a los Usuarios y Autenticar el Acceso a los Componentes del Sistema",
        "requirement": "Requisito 8.6.3",
        "guidance": "Las contraseñas/frases de paso para 8.6.3.a Evalúe las políticas y los procedimientos cuentas de usuario, ya que a menudo se ejecutan cualquier cuenta de aplicación y de sistema están para verificar que estén definidos para proteger las en un contexto de alta seguridad, con acceso a protegidas contra el uso indebido de la siguiente contraseñas/frases de paso de las cuentas de sistemas que no suelen concederse a las cuentas manera: aplicaciones o sistemas contra el uso indebido de de usuario, como el acceso programático a las cambian periódicamente, (a una frecuencia este requisito. especial atención a la protección de las definida en el análisis de riesgos específico de la contraseñas/frases de paso utilizadas para las 8.6.3.b Evalúe el análisis de riesgo específico de cuentas de aplicaciones y sistemas. entidad, el cual se desarrolla de acuerdo a todos la entidad para el cambio, frecuencia y los elementos especificados en el Requisito Buenas Prácticas complejidad de las contraseñas/frases de paso 12.3.1.) y ante la sospecha o la confirmación de Las entidades deben tener en cuenta los utilizadas para conexiones interactivas a las que estén comprometidas. siguientes factores de riesgo a la hora de cuentas de aplicaciones o sistemas para verificar con la complejidad necesaria y apropiada para elementos especificados en el Requisito 12.3.1 y contraseñas/frases de paso de las aplicaciones y la frecuencia con la que la entidad cambia las direcciones: sistemas: contraseñas/frases de acceso. • 8.6.3.c Entreviste al personal responsable y sesiones interactivas."
    },
    {
        "code": "9.1.1",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.1.1",
        "guidance": "Todas las políticas de seguridad y 9.1.1 Evalúe la documentación y entreviste al y procedimientos especificados en el Requisito 9. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 9 están: seguridad y los procedimientos operativos procedimientos específicos mencionados en el de acuerdo con todos los elementos especificados que se documenten, se mantengan y se difundan"
    },
    {
        "code": "9.1.2",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.1.2",
        "guidance": "Los roles y responsabilidades para realizar las 9.1.2.a Evalúe la documentación para verificar que al tanto de sus responsabilidades diarias y que, actividades del Requisito 9 están documentadas, las descripciones de los roles y responsabilidades por lo tanto, las actividades críticas no se asignadas y comprendidas. para realizar las actividades del Requisito 9 estén realicen. documentadas y asignadas. Buenas Prácticas 9.1.2.b Entreviste al personal responsable de Los roles y responsabilidades pueden desarrollar las actividades del Requisito 9 para documentarse dentro de políticas y verificar que los roles y responsabilidades son procedimientos o mantenerse en documentos"
    },
    {
        "code": "9.2.1",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.2.1",
        "guidance": "Existen controles de entrada a las 9.2.1 Observe los controles de entrada y entreviste acceso al CDE e información sensible, o podrían instalaciones apropiados para restringir el acceso al personal responsable para verificar que existen alterar configuraciones de los sistemas, introducir físico a los sistemas en el CDE. controles de seguridad física para restringir el vulnerabilidades en la red o destruir o robar acceso a los sistemas en el CDE. equipos. Por lo tanto, el objetivo de este requisito"
    },
    {
        "code": "9.2.2",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.2.2",
        "guidance": "Se implementan controles físicos y/o lógicos 9.2.2 Entreviste al personal responsable y observe conecten a tomas de red fácilmente disponibles y para restringir el uso de tomas (o puertos) de red de las ubicaciones de la toma (o puertos) de red de obtengan acceso al CDE o a los sistemas acceso público dentro de la instalación. acceso público para verificar que existen controles conectados al CDE. físicos y/o lógicos para restringir el acceso a la Buenas Prácticas"
    },
    {
        "code": "9.2.3",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.2.3",
        "guidance": "El acceso físico a los puntos de acceso 9.2.3 Entreviste al personal responsable y observe equipamiento y las líneas de redes y inalámbricos, puertas de enlace (gateways), la ubicación del hardware y de las líneas para telecomunicaciones, usuarios malintencionados hardware de redes y de comunicaciones y líneas de verificar que el acceso físico a los puntos de podrían obtener acceso a los recursos de la red telecomunicaciones dentro de la instalación está acceso inalámbrico, puertas de enlace (gateway), de la entidad. Adicionalmente, podrían conectar restringido. hardware de redes y de comunicaciones y líneas sus propios dispositivos a la red para obtener de telecomunicaciones dentro de la instalación acceso no autorizado al CDE o a sistemas"
    },
    {
        "code": "9.2.4",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.2.4",
        "guidance": "El acceso a las consolas en áreas sensibles 9.2.4 Observe el intento de un administrador del accedan a información sensible, alteren las está restringido mediante bloqueo cuando no están sistema de iniciar sesión en consolas en áreas configuraciones del sistema, introduzcan en uso. sensibles y verifique que estén \"bloqueadas\" para vulnerabilidades en la red o destruyan registros. evitar el uso no autorizado."
    },
    {
        "code": "9.3.1",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.3.1",
        "guidance": "Se implementan procedimientos para 9.3.1.a Evalúe los procedimientos documentados ya no es necesario, garantiza que se impida a autorizar y administrar el acceso físico del personal para verificar que los procedimientos para personas no autorizadas ingresar a las áreas que al CDE, que incluyen: autorizar y administrar el acceso físico del contienen datos de titulares de tarjetas. Además, todos los elementos especificados en este gafetes y a los materiales de producción de físico de una persona. autorizado haga sus propios gafetes y/o personal. tales como lasos los gafetes tarjetas de identificación, y los procesos para verificar que el personal en del CDE esté claramente identificado. identificación al personal autorizado. que está físicamente presente y determinar si el 9.3.1.c Observe que el acceso al proceso de individuo es un visitante o un empleado. identificación, como un sistema de gafetes, esté Ejemplos limitado al personal autorizado."
    },
    {
        "code": "9.3.2",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.3.2",
        "guidance": "Se implementan procedimientos para 9.3.2.a Evalúe los procedimientos documentados y autorizadas y malintencionadas puedan ingresar autorizar y administrar el acceso de visitantes al entreviste al personal para verificar que los a las instalaciones y, potencialmente, a los datos CDE, que incluyen: procedimientos estén definidos para autorizar y de los titulares de tarjetas. acuerdo con todos los elementos especificados en identificables como visitas de manera que el momento. personal pueda monitorear sus actividades y que reciben un gafete u otra identificación con fecha están presentes en el CDE y entreviste al personal de caducidad. para verificar que los visitantes: distinguen visiblemente a los visitantes del al CDE. personal. • Son escoltados en todo momento dentro del 9.3.2.c Observe el uso de gafetes de visitante u otra identificación para verificar que la credencial u otra identificación no permita el acceso sin escolta al CDE. 9.3.2.d Observe a los visitantes en el CDE para verificar que: 9.3.2.e Evalúe los gafetes de visitantes u otra identificación y observe la evidencia en el sistema"
    },
    {
        "code": "9.3.3",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.3.3",
        "guidance": "Los gafetes de visitante o la identificación se 9.3.3 Observe a los visitantes que salen de la caducidad o finalización de la visita evita que devuelven o desactivan antes de que los visitantes instalación y entreviste al personal para verificar personas malintencionadas utilicen un pase abandonen las instalaciones, o en su fecha de que los gafetes de visitantes u otra identificación previamente autorizado para obtener acceso caducidad. se devuelvan o se desactiven antes de que los físico al edificio una vez finalizada la visita. visitantes abandonen las instalaciones o en la"
    },
    {
        "code": "9.3.4",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.3.4",
        "guidance": "Se utiliza un registro de visitantes para 9.3.4.a Evalúe el registro de visitantes y entreviste económico de mantener. Ayudará a identificar el mantener un registro físico de las actividades de los al personal responsable para verificar que se acceso físico histórico a un edificio o a una sala y visitantes dentro de la instalación y dentro de las utilice un registro de visitantes para registrar el el potencial acceso a los datos del titular de la áreas sensibles, que incluye: acceso físico a las instalaciones y las áreas tarjeta. representada. Cuando se registra la fecha y la hora de la visita, 9.3.4.b Evalúe el registro de visitantes y verificar El nombre del personal que autoriza el acceso • El nombre del visitante y la organización físico. información de seguimiento útil y aseguran que menos tres meses, a menos que la ley lo físico. identificaciones de los visitantes (licencia de restrinja. 9.3.4.c Evalúe las ubicaciones de almacenamiento de registros de visitantes y entreviste al personal"
    },
    {
        "code": "9.4.1",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.1",
        "guidance": "Todos los medios que contienen datos de 9.4.1. Evalúe la documentación para verificar que no autorizadas obtengan acceso a los datos de tarjetahabientes están protegidos físicamente. los procedimientos definidos para proteger los titulares de tarjetas en cualquier formato. Los datos de tarjetahabientes incluyen controles para datos de titulares de tarjetas son susceptibles de asegurar físicamente todos los esos medios. ser visualizados, copiados o escaneos sin"
    },
    {
        "code": "9.4.2",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.2",
        "guidance": "Todos los datos de titulares de tarjetas se 9.4.2.a Evalúe la documentación para verificar que pueden perderse o ser robados. clasifican de acuerdo con la confidencialidad de los procedimientos estén definidos para clasificar Buenas Prácticas esos datos. los datos de titulares de tarjetas de acuerdo con el nivel de confidencialidad de esos datos. Es importante que los datos se identifiquen de 9.4.2.b Evalúe los registros de medios u otra evidente. Sin embargo, esto no significa que los documentación para verificar que todos los datos datos necesiten llevar una etiqueta de"
    },
    {
        "code": "9.4.3",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.3",
        "guidance": "Los apoyos con datos de titulares de tarjetas 9.4.3.a Evalúe la documentación para verificar que como el correo postal ordinario. El uso de enviados fuera de las instalaciones se protegen de los procedimientos están definidos a fin de mensajería segura para entregar cualquier medio la siguiente manera: asegurar los datos enviados fuera de la instalación que contenga datos de titulares de tarjetas registran. en este requisito. de seguimiento para mantener el inventario y la otro método de entrega que pueda ser rastreado registros para verificar que todos los datos con precisión. enviados fuera de la instalación se registran y se instalaciones incluyen detalles sobre la seguro u otro método de entrega que pueda ubicación de los datos. rastrearse. 9.4.3.c Evalúe los registros de seguimiento de todos los datos enviados fuera de las instalaciones"
    },
    {
        "code": "9.4.4",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.4",
        "guidance": "La gerencia aprueba todos los movimientos 9.4.4.a Evalúe la documentación para verificar se sean retirados de zonas seguras, estos no de apoyos con datos de titulares de tarjetas que se han definido los procedimientos para garantizar podrían ser rastreados ni protegidos trasladan fuera de las instalaciones (incluso cuando que los apoyos que se trasladan fuera de las adecuadamente, y su ubicación sería son distribuidos a particulares). instalaciones son aprobados por la gerencia. desconocida, lo que llevaría a su robo o pérdida. 9.4.4.b Evalúe los registros de seguimiento de los apoyos fuera de las instalaciones y entreviste al"
    },
    {
        "code": "9.4.5",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.5",
        "guidance": "Se mantienen registros de inventario de todos 9.4.5.a Evalúe la documentación para verificar que electrónicos robados o perdidos podrían pasar los apoyos electrónicos con datos de titulares de se definen los procedimientos para mantener los desapercibidos durante un tiempo indefinido. tarjetas. registros de inventario de los apoyos electrónicos. 9.4.5.b Evalúe los registros de inventario de apoyos electrónicos y entreviste al personal"
    },
    {
        "code": "9.4.6",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.6",
        "guidance": "Los materiales impresos con datos de titulares 9.4.6.a Evalúe la política de destrucción periódica impresos antes de su eliminación, personas de tarjetas se destruyen cuando ya no se necesitan de materiales impresos para comprobar que se malintencionadas pueden recuperar la por razones de negocios o legales, de la siguiente han definido procedimientos para destruir los información de los materiales desechados, lo que manera: materiales impresos con datos de los titulares de puede poner en peligro los datos. Por ejemplo, incineran o se pulverizan de forma que los datos de negocio o legales, de acuerdo con todos los técnica conocida como \"búsqueda en el de los titulares de tarjetas no puedan elementos especificados en este requisito. contenedor\", en la que buscan en los cubos de reconstruirse. basura y en los basureros de reciclaje, materiales 9.4.6.b Observe los procesos y entreviste al impresos con información que puedan utilizar almacenamiento seguro antes de su se trituran, incineran o pulverizan de manera que destrucción. Proteger los contenedores de almacenamiento los datos de titulares de tarjetas no puedan reconstruirse. 9.4.6.c Observe los contenedores de durante la recolección de esos materiales. almacenamiento utilizados para los materiales que Buenas Prácticas contienen información que debe ser destruida a fin Considere la posibilidad de que los contenedores"
    },
    {
        "code": "9.4.7",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.4.7",
        "guidance": "Los medios de almacenamiento electrónicos 9.4.7.a Evalúe la política de destrucción periódica almacenamiento electrónicos cuando ya no se con datos de titulares de la tarjeta se destruyen de medios de almacenamiento para comprobar necesiten, personas malintencionadas pueden cuando ya no se necesitan por razones de negocio que se definen procedimientos para destruir los recuperar información de los medios de o legales mediante una de las siguientes opciones: medios de almacenamiento electrónicos cuando almacenamiento desechados, lo que puede poner destruye. legales de acuerdo con todos los elementos malintencionados pueden utilizar una técnica especificados en este requisito. conocida como \"búsqueda en el contenedor\", en irrecuperables, de modo que no pueden 9.4.7.b Observe el proceso de destrucción de contenedores de reciclaje información que reconstruirse. medios de almacenamiento y entreviste al puedan utilizar para lanzar un ataque. personal responsable para verificar que los medios"
    },
    {
        "code": "9.5.1",
        "domain": "Requisito 9 - Restringir el Acceso Físico a los Datos del Titular de la Tarjeta",
        "requirement": "Requisito 9.5.1",
        "guidance": "Los dispositivos POI que capturan los datos 9.5.1 Evalúe las políticas y procedimientos dispositivos y terminales de lectura de tarjetas. de las tarjetas de pago a través de la interacción documentados para verificar que los procesos Los delincuentes intentan robar los dispositivos física directa con el factor de forma de la tarjeta de estén definidos e incluyan todos los elementos para aprender a entrar en ellos, y a menudo pago están protegidos contra la manipulación y la especificados en este requisito. intentan sustituir los dispositivos legítimos por sustitución no autorizada, incluyendo lo siguiente: dispositivos fraudulentos que les envían los datos POI en busca de manipulaciones o “skimming” en el exterior de los dispositivos, sustituciones no autorizadas. diseñados para capturar los datos de las tarjetas comportamientos sospechosos y denuncie las ejemplo, colocando un lector de tarjetas adicional manipulaciones o sustituciones no autorizadas sobre el lector de tarjetas legítimo, de modo que de los dispositivos. los datos de las tarjetas de pago sean capturados"
    },
    {
        "code": "10.1.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.1.1",
        "guidance": "Todas las políticas de seguridad y 10.1.1 Evalúe la documentación y entreviste al procedimientos especificados en el Requisito 10. procedimientos operativos que se identifican en el personal para verificar que las políticas de Si bien es importante definir las políticas o Requisito 10 están: seguridad y los procedimientos operativos procedimientos específicos mencionados en el de acuerdo con todos los elementos especificados que se documenten, se mantengan y se difundan"
    },
    {
        "code": "10.1.2",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.1.2",
        "guidance": "Los roles y responsabilidades para realizar 10.1.2.a Evalúe la documentación para verificar al tanto de sus responsabilidades diarias y que las actividades del Requisito 10 están que las descripciones de los roles y las actividades críticas no ocurran. documentadas, asignadas y comprendidas. responsabilidades para realizar las actividades del Buenas Prácticas Requisito 10 estén documentadas y asignadas. 10.1.2.b Entreviste al personal responsable de documentarse dentro de políticas y desarrollar las actividades del Requisito 10 para procedimientos o mantenerse en documentos"
    },
    {
        "code": "10.2.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.2.1",
        "guidance": "Los registros de auditoría están habilitados y 10.2.1 Entreviste al administrador del sistema y auditoría envían alertas al administrador del activos para todos los componentes del sistema y examine las configuraciones del sistema para sistema, proporcionan datos a otros mecanismos los datos de titulares de tarjetas. verificar que los registros de auditoría estén de supervisión, como los sistemas de detección habilitados y activos para todos los componentes de intrusiones (IDS) y las herramientas de del sistema. sistemas de supervisión de eventos e información"
    },
    {
        "code": "10.2.2",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.2.2",
        "guidance": "Los registros de auditoría guardan los 10.2.2 Entreviste al personal y examine las identificar rápidamente una falla de seguridad siguientes detalles para cada evento auditable: configuraciones del registro de auditoría para potencial con suficientes detalles para facilitar el este requisito estén incluidos en las entradas del del sistema, recursos o servicios afectados (por ejemplo, nombre y protocolo). Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 243 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "10.3.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.3.1",
        "guidance": "El acceso de lectura a los archivos de 10.3.1 Entreviste a los administradores del sistema los archivos de registro debe limitarse solo a registros de auditoría está limitado a aquellos con y examine las configuraciones y los privilegios del aquellos con una necesidad de negocio válida. una necesidad relacionada con sus funciones. sistema para verificar que solo las personas con Este acceso incluye archivos de registro de una necesidad relacionada con sus funciones auditoría en los sistemas de origen, así como en tengan acceso de lectura a los archivos de registro cualquier otro lugar donde estén almacenados."
    },
    {
        "code": "10.3.2",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.3.2",
        "guidance": "Los archivos de registros de auditoría están 10.3.2 Evalúe las configuraciones y privilegios del auditoría para ocultar su actividad. Sin la protegidos para evitar modificaciones por parte de sistema y entreviste a los administradores para protección adecuada no se puede garantizar la terceros. verificar que los archivos de registro de auditoría totalidad, precisión e integridad de los registros actuales estén protegidos contra modificaciones de auditoría, y estos pueden volverse inútiles por parte de terceros a través de mecanismos de como herramienta de investigación después de"
    },
    {
        "code": "10.3.3",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.3.3",
        "guidance": "Los archivos de registros de auditoría, 10.3.3 Evalúe las configuraciones de apoyo o los centralizado o en un medio que sea difícil de incluidos los de tecnologías externas, se respaldan archivos de registro para verificar que los archivos alterar mantiene los registros protegidos, incluso de inmediato en un servidor de registro interno de registro de auditoría actuales, incluyendo los de si el sistema que genera los registros se ve seguro, central o sobre otro medio que sea difícil de tecnologías externas, se respalden de inmediato comprometido. modificar. en un servidor de registros interno seguro u otro La escritura de registros de tecnologías externas, medio que sea difícil de modificar. como inalámbricas, controles de seguridad de"
    },
    {
        "code": "10.3.4",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.3.4",
        "guidance": "Los mecanismos de detección de cambios o 10.3.4 Evalúe la configuración del sistema, los cambios en archivos críticos y notifican cuando supervisión de la integridad de los archivos se archivos monitoreados y los resultados de las se identifican dichos cambios. La entidad utilizan en registros de auditoría para garantizar que actividades de monitoreo, para verificar el uso del generalmente monitorea los archivos que no los datos de registros existentes no se puedan software de supervisión de integridad de los cambian regularmente con propósitos de modificar sin generar alertas. archivos o de detección de cambios en los monitoreo de su integridad; pero cuando se registros de auditoría. reflejan cambios, indican un posible evento"
    },
    {
        "code": "10.4.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.4.1",
        "guidance": "Los siguientes registros de auditoría se 10.4.1.a Evalúe las políticas y los procedimientos registros significan que los incidentes se pueden revisan al menos una vez al día: de seguridad para verificar que los procesos estén identificar rápidamente y abordar de manera especificados en este requisito al menos una vez Buenas Prácticas que almacenan, procesan o transmiten CHD y/o La verificación de los registros a diario (los 7 días SAD. 10.4.1.b Observe los procesos y entreviste al de la semana, los 365 días del año, incluidos los sistema. especificados en este requisito se revisen al una posible infracción. Las herramientas de menos una vez al día. recolección, análisis y alerta de registros, los componentes del sistema que realizan funciones centralizados, los analizadores de registros de de seguridad (por ejemplo, controles de eventos y las soluciones de administración de seguridad de red, sistemas de detección de eventos e información de seguridad (SIEM) son intrusiones/sistemas de prevención de ejemplos de herramientas automatizadas que se intrusiones (IDS / IPS), servidores de pueden utilizar para cumplir con este requisito. autenticación). Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 247 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "10.4.2",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.4.2",
        "guidance": "Los registros de todos los demás 10.4.2.a Evalúe las políticas y los procedimientos especificados en el Requisito 10.4.1) ayuda a componentes del sistema (aquellos no de seguridad para verificar que los procesos estén identificar indicaciones de posibles problemas o especificados en el Requisito 10.4.1) se revisan definidos para la revisión de los registros de todos intentos de acceso a sistemas críticos a través de periódicamente. los demás componentes del sistema sistemas menos críticos. periódicamente. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 248 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "10.4.3",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.4.3",
        "guidance": "Se abordan las excepciones y anomalías 10.4.3.a Evalúe las políticas y los procedimientos registros, es posible que la entidad no tenga identificadas durante el proceso de revisión. de seguridad para verificar que se definen los conocimiento de actividades no autorizadas y procesos que abordan las excepciones y las potencialmente peligrosas que ocurren dentro de anomalías identificadas durante el proceso de su red. revisión. Buenas Prácticas 10.4.3.b Observe los procesos y entreviste al Las entidades deben considerar cómo abordar lo personal para verificar que, cuando se identifican siguiente al desarrollar sus procesos para definir"
    },
    {
        "code": "10.5.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.5.1",
        "guidance": "Conserve el historial de los registros de 10.5.1.a Evalúe la documentación para verificar meses, ya que las infracciones suelen pasar auditoría durante 12 meses como mínimo, teniendo que se ha definido lo siguiente: desapercibidas durante mucho tiempo. Disponer al menos los tres últimos meses inmediatamente • Políticas de retención de registros de auditoría. de un historial de registros almacenado de forma disponibles para su análisis. centralizada facilita a los investigadores 10.5.1.b Evalúe las configuraciones del historial de registros de auditoría, entreviste al personal y analizar los registros de auditoría para verificar Ejemplos que el historial de registros de auditoría se Los métodos que permiten que los registros estén conserva durante al menos 12 meses. disponibles inmediatamente incluyen el 10.5.1.c Entreviste al personal y observe los de registros o la restauración rápida de registros procesos para verificar que el historial de registros a partir de copias de apoyo."
    },
    {
        "code": "10.6.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.6.1",
        "guidance": "Los relojes del sistema y la hora están 10.6.1 Evalúe los ajustes de configuración para Cuando los relojes no están correctamente sincronizados usando tecnología de sincronización verificar que la tecnología de sincronización de sincronizados, puede ser difícil, si no imposible, de tiempo. tiempo está implementada y se mantiene comparar los archivos de registro de diferentes actualizada. sistemas y establecer una secuencia exacta de"
    },
    {
        "code": "10.6.2",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.6.2",
        "guidance": "Los sistemas están configurados con la hora 10.6.2 Evalúe los ajustes de configuración del de sincronización de tiempo. correcta y consistente como sigue: sistema para adquirir, distribuir y almacenar la Aceptar las actualizaciones horarias de fuentes están en uso. estén configurados de acuerdo con todos los ayuda a evitar que individuos malintencionados elementos especificados en este requisito. cambien la configuración horaria de los sistemas. reciben la hora de fuentes externas. Buenas Prácticas la Hora Atómica Internacional u Hora Universal los servidores de hora internos es cifrar las Coordinada (UTC). actualizaciones con una clave simétrica y crear actualizaciones de tiempo solo de fuentes direcciones IP de los equipos del cliente a los externas específicas aceptadas por la industria. cuales se les proporcionarán las actualizaciones designado, los servidores de tiempo se emparejan entre sí para mantener la hora exacta. hora solo de los servidores de hora central designados."
    },
    {
        "code": "10.6.3",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.6.3",
        "guidance": "La configuración de sincronización de la hora 10.6.3.a Evalúe las configuraciones del sistema y actividades. Por lo tanto, restringir la capacidad y los datos están protegidos de la siguiente manera: los ajustes de sincronización de tiempo para de cambiar o modificar las configuraciones de solo al personal con una necesidad de negocio. restringido solo al personal con una necesidad de administradores reducirá la probabilidad de que negocio. un atacante cambie con éxito las configuraciones en sistemas críticos se registra, monitorea y verifica. 10.6.3.b Evalúe las configuraciones del sistema y los ajustes y registros de sincronización de la hora"
    },
    {
        "code": "10.7.1",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.7.1",
        "guidance": "Requisito Adicional solo para 10.7.1.a Procedimiento de prueba adicional críticos, las fallas pueden pasar desapercibidas proveedores de servicios: Las fallas de los sólo para las evaluaciones de los proveedores durante períodos prolongados y brindar a los sistemas de control de seguridad críticos se de servicios: Evalúe la documentación para atacantes tiempo suficiente para comprometer los detectan, alertan y abordan de inmediato, verificar que los procesos estén definidos para la componentes del sistema y robar datos de incluyendo entre otras, las fallas de los siguientes rápida detección y el tratamiento de fallas de los cuentas del CDE. sistemas de control de seguridad críticos: sistemas críticos de control de seguridad, Buenas Prácticas elementos especificados en este requisito. Los tipos específicos de fallas pueden variar sólo para las evaluaciones de los proveedores fallas típicas incluyen que el sistema cese de de servicios: Observe los procesos de detección críticos son detectados y notificados, y que la falla desconecta. de un control de seguridad crítico genere una"
    },
    {
        "code": "10.7.2",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.7.2",
        "guidance": "Las fallas de los sistemas de control de 10.7.2.a Evalúe la documentación para verificar críticos, las fallas pueden pasar desapercibidas seguridad críticos se detectan, alertan y abordan de que los procesos estén definidos para la detección durante períodos prolongados y brindar a los inmediato, incluidas, entre otras, las fallas de los rápida y el tratamiento de fallas de los sistemas de atacantes tiempo suficiente para comprometer los siguientes sistemas de control de seguridad críticos: control de seguridad críticos, incluyendo, pero no componentes del sistema y robar datos de especificados en este requisito. Buenas Prácticas alerta y entreviste al personal para verificar que las dependiendo de la función del componente del fallas de los sistemas de control de seguridad la generación de una alerta. no funciona de la manera prevista, por ejemplo, auditoría. automatizadas (si se utilizan)"
    },
    {
        "code": "10.7.3",
        "domain": "Requisito 10 - Registre y Controle Todos los Accesos a los Componentes del Sistema y a los Datos de Titulares",
        "requirement": "Requisito 10.7.3",
        "guidance": "Las fallas de cualquier sistema de control de 10.7.3.a Evalúe la documentación y entreviste al rápida y efectiva, los atacantes pueden usar este seguridad crítico se responden con prontitud, personal para verificar que los procesos estén tiempo para insertar software malicioso, obtener incluidas, entre otras, las siguientes: definidos e implementados para responder a fallas el control de un sistema, o robar datos del y hora de principio a fin) de la falla de seguridad. La evidencia documentada (por ejemplo, los fallas y documentando el remedio requerido. fallas en los sistemas críticos de control de problemas) debe proporcionar el apoyo de que seguridad que surgió durante la falla. • Identificación de las causas del fallo. resultado de la falla de seguridad. del fallo de seguridad. fallas deben capturarse en la evidencia la causa de la falla. abordar raíz del problema. seguridad."
    },
    {
        "code": "11.1.1",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.1.1",
        "guidance": "Todas las políticas de seguridad y 11.1.1 Evalúe la documentación y entreviste al y procedimientos especificados en el Requisito procedimientos operativos que se identifican en el personal para verificar que las políticas de 11. Si bien es importante definir las políticas o Requisito 11 son: seguridad y los procedimientos operativos procedimientos específicos mencionados en el de acuerdo con todos los elementos especificados que se documenten, se mantengan y se difundan"
    },
    {
        "code": "11.1.2",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.1.2",
        "guidance": "Los roles y responsabilidades para realizar 11.1.2.a Evalúe la documentación para verificar al tanto de sus responsabilidades diarias y que las actividades del Requisito 11 son documentadas, que las descripciones de los roles y las actividades críticas no ocurran. asignadas y entendidas. responsabilidades para realizar las actividades del Buenas Prácticas Requisito 11 estén documentadas y asignadas. 11.1.2.b Entreviste al personal responsable de documentarse dentro de políticas y desarrollar las actividades del Requisito 11 para procedimientos o mantenerse en documentos"
    },
    {
        "code": "11.2.1",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.2.1",
        "guidance": "Los puntos de acceso inalámbricos 11.2.1.a Evalúe las políticas y los procedimientos vía común para que individuos malintencionados autorizados y no autorizados se gestionan de la para verificar que los procesos están definidos ingresen a la red y a los datos de titulares de siguiente manera: para gestionar los puntos de acceso inalámbricos tarjetas. Los dispositivos inalámbricos no acceso inalámbricos (Wi-Fi) para, elementos especificados en este requisito. ordenador u otro componente del sistema, o inalámbricos autorizados y no autorizados, documentación resultante, y entreviste al personal puerto de red, a un dispositivo de red como un ocurre al menos cada tres meses. para detectar e identificar tanto los puntos de forma de tarjeta de interfaz inalámbrica dentro de acceso inalámbricos autorizados como los no un componente del sistema. autorizados, de acuerdo con todos los elementos notifica al personal mediante la generación de Si un dispositivo o red inalámbrica se instala sin especificados en este requisito. alertas. el conocimiento de la empresa, esto puede 11.2.1.c Evalúe los resultados de la evaluación permitir a un atacante entrar en la red de forma inalámbrica y entreviste al personal para verificar fácil e \"invisible\". Detectar y eliminar estos puntos que las evaluaciones inalámbricas se realizaron de de acceso no autorizados reduce la duración y la acuerdo con todos los elementos especificados en probabilidad de que estos dispositivos sean este requisito. aprovechados para un ataque. 11.2.1.d Si se utiliza el monitoreo automatizado, El tamaño y la complejidad de un entorno examine los ajustes de configuración para verificar dictarán las herramientas y los procesos"
    },
    {
        "code": "11.2.2",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.2.2",
        "guidance": "Se mantiene un inventario de los puntos de 11.2.2 Evalúe la documentación para verificar que responder rápidamente cuando se detectan acceso inalámbricos autorizados, incluyendo una se mantenga un inventario de puntos de acceso puntos de acceso inalámbricos no autorizados. justificación de negocio documentada. inalámbricos autorizados y que se documente una Esto ayuda a minimizar de forma proactiva la justificación de negocio para todos los puntos de exposición del CDE a individuos acceso inalámbricos autorizados. malintencionados."
    },
    {
        "code": "11.3.1",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.3.1",
        "guidance": "Los escaneos de vulnerabilidades internas 11.3.1.a Evalúe los resultados del informe de explote una vulnerabilidad al igual que el riesgo se realizan de la siguiente manera: escaneo interno de los últimos 12 meses para potencial de un componente del sistema o de los realizado al menos una vez cada tres meses en el vulnerabilidades realizados al menos cada tres alto riesgo (según las clasificaciones de riesgo identificación. de vulnerabilidad de la entidad definidas en el 11.3.1.b Evalúe los resultados del informe de Requisito 6.3.1). Buenas Prácticas escaneo interno de cada escaneo y vuelva a han resuelto todas las vulnerabilidades críticas verificar que se hayan resuelto todas las riesgo para el entorno (por ejemplo, clasificadas y de alto riesgo (como se indicó anteriormente). vulnerabilidades críticas y de alto riesgo como altas o críticas según el Requisito 6.3.1) (identificadas en el Requisito 6.3.1 PCI DSS). deben resolverse con máxima prioridad. actualizada con la información más reciente 11.3.1.c Evalúe las configuraciones de la para el proceso de escaneo trimestral, a fin de sobre vulnerabilidades. herramienta de escaneo y entreviste al personal demostrar que todos los sistemas fueron calificado con la independencia organizacional mantenga actualizada con la información de fueron resueltas como parte del ciclo de escaneo del probador. vulnerabilidad más reciente. de vulnerabilidades de tres meses. Sin embargo, 11.3.1.d Entreviste al personal responsable para adicional para verificar que las vulnerabilidades verificar que el escaneo fue realizado por un no reparadas estén en proceso de resolución. recurso interno calificado o un tercero externo calificado y que existe independencia organizacional del asesor. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 265 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "11.3.2",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.3.2",
        "guidance": "Los escaneos de vulnerabilidad externos se 11.3.2.a Evalúe los informes de escaneo del ASV ser aprovechados para lanzar un ataque dirigido. realizan de la siguiente manera: de los últimos 12 meses para verificar que se Las organizaciones deben asegurarse de que menos una vez cada tres meses en el período de regularmente en busca de debilidades y que las Aprobado por PCI SSC (ASV). proteger a la entidad. con los requisitos de la Guía del Programa escaneo del ASV de cada escaneo y re-escaneo ASV. realizado en los últimos 12 meses, para verificar que las vulnerabilidades se han resuelto y que se cumplen los requisitos de la Guía del Programa necesario para confirmar que las Proveedor de Escaneo Aprobado por PCI SSC ASV para aprobar el escaneo. vulnerabilidades se han resuelto de acuerdo (ASV). con los requisitos de la Guía del Programa ASV 11.3.2.c Evalúe los informes de escaneo ASV para Buenas Prácticas escaneos aprobados. verificar que los escaneos fueron realizados por un Si bien se requieren escaneos al menos una vez Proveedor de Escaneo Aprobado por PCI SSC cada tres meses, se recomienda realizar"
    },
    {
        "code": "11.4.1",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.1",
        "guidance": "La entidad define, documenta e implementa 11.4.1 Evalúe la documentación y entreviste al aprovechar para obtener acceso a los datos de una metodología de prueba de penetración, que personal para verificar que la metodología de los titulares de tarjetas y luego exfiltrarlos. Como incluye: prueba de penetración definida, documentada e tal, las entidades necesitan probar sus redes por la industria. elementos especificados en este requisito. Esta prueba permite a la entidad identificar y sistemas críticos. datos de la entidad, y luego tomar las acciones segmentación y reducción del alcance. Buenas Prácticas para identificar, como mínimo, las según las necesidades y la estructura de una vulnerabilidades enumeradas en el Requisito organización, y deberían ser adecuadas para el 6.2.4. entorno probado; por ejemplo, las pruebas de abarcan todos los componentes que admiten las funciones de red y los sistemas operativos. vulnerabilidades experimentadas en los últimos 12 meses. riesgo que plantean las vulnerabilidades explotables y las debilidades de seguridad encontradas durante las pruebas de penetración. proporcionada al evaluador. Esto permite a la Retención de los resultados de las pruebas de entidad mayor comprensión de su exposición penetración y los resultados de las actividades potencial y cómo desarrollar una estrategia para de remediación durante al menos 12 meses. defenderse de los ataques. Una prueba de (continúa en la página siguiente) generalmente incluye la explotación de las Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 274 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "11.4.2",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.2",
        "guidance": "Se realizan pruebas de penetración interna: 11.4.2.a Evalúe el alcance del trabajo y los prueba de penetración externa, descubre más reciente para verificar que la prueba de que podrían ser utilizadas por un atacante que significativo de infraestructura o aplicación usuario autorizado que realiza actividades no 11.4.2.b Entreviste al personal para verificar que la prueba de penetración interna fue realizada por un logrado penetrar el perímetro de la entidad. externo calificado recurso interno calificado o un tercero externo organizacional (no se requiere que sea un QSA del evaluador (no es necesario que sea un QSA o internas también ayudan a las entidades a o ASV). ASV). descubrir dónde falló su proceso de control de"
    },
    {
        "code": "11.4.3",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.3",
        "guidance": "Se realizan pruebas de penetración externa: 11.4.3.a Evalúe el alcance del trabajo y los más reciente para verificar que la prueba de significativo de infraestructura o aplicación externo calificado prueba de penetración externa fue realizada por un recurso interno calificado o un tercero externo calificado y que existe independencia organizacional (no se requiere que sea un QSA organizacional del evaluador (no se requiere que o ASV). sea un QSA o ASV)."
    },
    {
        "code": "11.4.4",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.4",
        "guidance": "Las vulnerabilidades explotables y las 11.4.4 Evalúe los resultados de las pruebas de descubiertas por el ejercicio. A menudo, un debilidades de seguridad encontradas durante las penetración para verificar que las vulnerabilidades evaluador habrá encadenado una serie de pruebas de penetración se corrigen de la siguiente explotables y las debilidades de seguridad vulnerabilidades para comprometer un manera: observadas se corrigieron de acuerdo con todos componente del sistema. La reparación de las riesgo que representa el problema de seguridad prueba de penetración reduce significativamente según se define en el Requisito 6.3.1. la probabilidad de que un atacante las correcciones."
    },
    {
        "code": "11.4.5",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.5",
        "guidance": "Si la segmentación se utiliza para aislar el 11.4.5.a Evalúe los controles de segmentación y internas que no son de confianza, la seguridad CDE de otras redes, las pruebas de penetración se revisar la metodología de prueba de penetración del CDE depende del funcionamiento de esa realizan en los controles de segmentación de la para verificar que los procedimientos de prueba de segmentación. Muchos ataques han involucrado siguiente manera: penetración estén definidos para probar todos los a un atacante moviéndose lateralmente desde lo cualquier cambio en los controles/métodos de los elementos especificados en este requisito. hacia el CDE. El uso de técnicas y herramientas segmentación. de prueba de penetración para validar que una 11.4.5.b Evalúe los resultados de las pruebas de red que no es de confianza está de hecho aislada segmentación en uso. y aborde todos los elementos especificados en falla o mala configuración de los controles de penetración definida por la entidad. Buenas Prácticas 11.4.5.c Entreviste al personal para verificar que la segmentación son operativos y eficientes, y calificado o un tercero externo calificado y que descubrimiento de host y el escaneo de puertos aislar al CDE de todos los sistemas fuera del existe independencia organizacional del evaluador para verificar que los segmentos fuera del ámbito. (no se requiere que sea un QSA o ASV). alcance no tengan acceso al CDE. aislamiento para separar sistemas con diferentes niveles de seguridad (ver Requisito tercero externo calificado. organizacional (no se requiere que sea un QSA o ASV)."
    },
    {
        "code": "11.4.6",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.6",
        "guidance": "Requisito Adicional Solo para 11.4.6.a Procedimiento de prueba adicional titulares de tarjetas o pueden proporcionar un Proveedores de Servicios: Si la segmentación se sólo para las evaluaciones de los proveedores punto de entrada que se puede explotar para utiliza para aislar el CDE de otras redes, las de servicios: Evalúe los resultados de la prueba luego comprometer a muchas otras entidades. pruebas de penetración se realizan en los controles de penetración más reciente para verificar que la Los proveedores de servicios también suelen de segmentación de la siguiente manera: penetración cubra y aborde todos los elementos tener redes más amplias y complejas que están de cualquier cambio en los controles/métodos probabilidad de que fallen los controles de 11.4.6.b Procedimiento de prueba adicional segmentación en redes complejas y dinámicas es de segmentación. sólo para las evaluaciones de los proveedores mayor en entornos de proveedores de servicios. segmentación en uso. Es probable que la validación de los controles de que la prueba fue realizada por un recurso interno penetración definida por la entidad. existe independencia organizacional del evaluador (no se requiere que sea un QSA o ASV). segmentación son operativos y eficientes, y CDE. aislar al CDE de todos los sistemas fuera del Buenas Prácticas ámbito. aislamiento para separar sistemas con meses y después de un cambio significativo, este diferentes niveles de seguridad (ver Requisito ejercicio debe realizarse con la mayor frecuencia tercero externo calificado. organizacional (no se requiere que sea un QSA o ASV)."
    },
    {
        "code": "11.4.7",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.4.7",
        "guidance": "Requisito adicional sólo para los 11.4.7 Procedimiento de prueba adicional sólo simular el comportamiento de los atacantes y proveedores de servicios multi-arrendamiento: para los proveedores de servicios multi- descubrir vulnerabilidades en su entorno. En Los proveedores de servicios multi-arrendamiento arrendamiento: Evalúe las pruebas para verificar entornos compartidos y en la nube, el proveedor apoyan a sus clientes para las pruebas de que los proveedores de servicios multi- de servicios de terceros puede estar preocupado penetración externas según los Requisitos 11.4.3 y arrendamiento apoyan a sus clientes en las por las actividades de un evaluador de 11.4.4. pruebas de penetración externas según los penetración que afecta los sistemas de otros requisitos 11.4.3 y 11.4.4. clientes."
    },
    {
        "code": "11.5.1",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.5.1",
        "guidance": "Las técnicas de detección y/o prevención de 11.5.1.a Evalúe las configuraciones del sistema y tráfico que llega a la red con \"firmas\" conocidas intrusiones se utilizan para detectar y/o impedir los diagramas de la red para verificar que las y/o comportamientos de miles de tipos de intrusiones en la red de la siguiente manera: técnicas de detección y/o prevención de intrusos situaciones comprometidas (herramientas de CDE. tráfico: y luego envían alertas y/o detienen el intento a críticos del CDE. • En los puntos críticos del CDE. ataques a los recursos informáticos (o su uso 11.5.1.b Evalúe las configuraciones de los sospechas de situaciones comprometidas. largos periodos de tiempo. El impacto de una sistemas y entreviste al personal responsable para comprobar que las técnicas de detección y/o intrusiones, las líneas de base y las firmas se factor del tiempo que un atacante tiene en el prevención de intrusiones alertan al personal de mantienen actualizadas. entorno antes de ser detectado. los posibles riesgos. 11.5.1.c Evalúe las configuraciones del sistema y Las alertas de seguridad generadas por estas la documentación del proveedor para verificar que técnicas deben ser supervisadas continuamente"
    },
    {
        "code": "11.5.2",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.5.2",
        "guidance": "Un mecanismo de detección de cambios (por 11.5.2.a Evalúe la configuración del sistema, los indicador de que un atacante ha ingresado al ejemplo, herramientas de monitoreo de integridad archivos monitoreados y los resultados de las sistema de la organización. Dichos cambios de archivos) se despliega como sigue: actividades de monitoreo para verificar el uso de pueden permitir a un atacante realizar acciones no autorizadas (incluyendo cambios, adiciones titulares de las tarjetas y/o llevar a cabo 11.5.2.b Evalúe las configuraciones del actividades sin ser detectadas o registradas. y eliminaciones) de archivos críticos. mecanismo de detección de cambios para verificar que está configurado de acuerdo con todos los críticos al menos una vez por semana. elementos especificados en este requisito. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 287 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "11.6.1",
        "domain": "Requisito 11 - Ponga a Prueba Regularmente la Seguridad de los Sistemas y de las Redes",
        "requirement": "Requisito 11.6.1",
        "guidance": "El mecanismo de detección de cambios y 11.6.1.a Evalúe la configuración del sistema, las activo (principalmente JavaScript), desde manipulaciones se despliega de la siguiente páginas de pago monitoreadas y los resultados de múltiples ubicaciones de Internet. Además, el manera: las actividades de monitoreo para verificar el uso contenido de muchas páginas web se define modificaciones no autorizadas (incluyendo alteraciones. etiquetas que podrían no ser monitoreadas indicadores de situaciones comprometidas, utilizando mecanismos tradicionales de detección 11.6.1.b Evalúe los parámetros de configuración de cambios. cambios, adiciones y supresiones) en los para verificar que el mecanismo esté configurado encabezados HTTP y en el contenido de las Por lo tanto, el único lugar para detectar cambios de acuerdo con todos los elementos especificados páginas de pago tal y como las recibe el o indicadores de actividad maliciosa es en el en este requisito. navegador del consumidor. navegador del consumidor mientras se construye encabezamiento HTTP y la página de pago desempeñan con una frecuencia definida por la Comparando la versión actual del encabezado recibidas. entidad, evalúe el análisis de riesgo específico de HTTP y el contenido activo de las páginas de siguiente manera: verificar que el análisis de riesgo se realizó de versiones anteriores o conocidas, es posible acuerdo con todos los elementos especificados en detectar cambios no autorizados que puedan – Al menos una vez cada siete días indicar un ataque de skimming. el Requisito 12.3 .1. O Además, al buscar indicadores conocidos de – Periódicamente, (a una frecuencia definida 11.6.1.d Evalúe los ajustes de configuración y amenazas y elementos de script o en el análisis de riesgos específico de la entreviste al personal para verificar que las comportamientos típicos de los ladrones de entidad, el cual se desarrolla de acuerdo a funciones del mecanismo se realicen: información, se pueden levantar alertas todos los elementos especificados en el • Al menos una vez cada siete días sospechosas. Requisito 12.3.1.) O"
    },
    {
        "code": "12.1.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.1.1",
        "guidance": "Una política general de seguridad de la 12.1.1 Evalúe las políticas de uso aceptable de las las demás políticas y procedimientos que definen información es: tecnologías de usuario final y entreviste al la protección de los datos de titulares de tarjetas. procesos están documentados y se aplican de comunica la intención y los objetivos de la a los proveedores y socios de negocios Sin una política de seguridad de la información, relevantes. las personas tomarán sus propias decisiones"
    },
    {
        "code": "12.1.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.1.2",
        "guidance": "La política de seguridad de la información es: 12.1.2 Evalúe la política de seguridad de la Si no se actualiza la política de seguridad de la para verificar que la política se administre de es posible que no se aborden las nuevas los cambios en los objetivos de negocios o los este requisito. riesgos para el entorno."
    },
    {
        "code": "12.1.3",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.1.3",
        "guidance": "La política de seguridad define claramente 12.1.3.a Evalúe las políticas de seguridad de la un mal uso de los activos de información de la los roles y responsabilidades de seguridad de la información para verificar que definan claramente organización o una interacción inconsistente con información para todo el personal, y todo el los roles y responsabilidades de seguridad de la el personal de seguridad de la información, lo que personal conoce y reconoce sus responsabilidades información para todo el personal. podría llevar a una implementación insegura de en materia de seguridad de la información. tecnologías o al uso de tecnologías obsoletas o 12.1.3.b Entrevistar al personal en varias inseguras. funciones para verificar que comprenden sus responsabilidades en materia de seguridad de la información. 12.1.3.c Evalúela evidencia documentada para verificar que el personal reconozca sus"
    },
    {
        "code": "12.1.4",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.1.4",
        "guidance": "La responsabilidad de la seguridad de la 12.1.4 Evalúe las políticas de seguridad de la defendiendo activamente el programa de información se asigna formalmente a un director de información para verificar que esté asignada seguridad de la información de la organización, la seguridad de la información o a otro miembro de la formalmente a un Director de Seguridad de la responsabilidad y la rendición de cuentas por la dirección ejecutiva con conocimientos de seguridad Información o a otro miembro de la dirección seguridad de la información deben asignarse a de la información. ejecutiva con conocimientos de seguridad de la nivel ejecutivo dentro de una organización. información."
    },
    {
        "code": "12.2.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.2.1",
        "guidance": "Se documentan e implementan políticas de 12.2.1 Evalúe las políticas de uso aceptable para un riesgo significativo para la organización si no uso aceptable para tecnologías orientadas al las tecnologías de usuario final y entreviste al se administran adecuadamente. Las políticas de usuario final, que incluyen: personal responsable para verificar que los uso aceptable describen el comportamiento de acuerdo con todos los elementos especificados informáticas pertenecientes a la organización y para uso de los empleados, incluidos hardware y pueden y no pueden hacer con equipos de la software. empresa e instruyen al personal sobre los usos"
    },
    {
        "code": "12.3.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.3.1",
        "guidance": "Cada requisito PCI DSS que proporciona 12.3.1 Evalúe las políticas y los procedimientos una actividad en función del riesgo para su flexibilidad sobre la frecuencia con la que se documentados para verificar que un proceso esté entorno. La realización de este análisis de riesgos realizan (por ejemplo, los requisitos que deben definido para realizar análisis de riesgo específicos de acuerdo con una metodología asegura la realizarse periódicamente) está respaldado por un para cada requisito PCI DSS que brinde validez y coherencia con las políticas y análisis de riesgo específico que está documentado flexibilidad sobre la frecuencia con la que se procedimientos. e incluye: realiza el requisito y que el proceso incluya todos Este análisis de riesgo dirigido (a diferencia de la protege el requisito. que permiten a una entidad flexibilidad sobre la probabilidad y/o impacto de que se materialice la entidad evalúa cuidadosamente cada requisito una amenaza. PCI DSS que proporcionan esta flexibilidad y justificación de la frecuencia con la que se debe adecuada para la entidad, y el nivel de riesgo que realizar el requisito para minimizar la la entidad está dispuesta a aceptar. probabilidad de que se materialice la amenaza. El análisis de riesgo identifica los activos menos una vez cada 12 meses para determinar sistema y los datos, por ejemplo, archivos de si los resultados siguen siendo válidos o si se registro o credenciales que el requisito pretende necesita un análisis de riesgo actualizado. proteger, así como las amenazas o los resultados cuando sea necesario, según lo determinado por malware, un intruso no detectado o el uso la revisión anual. indebido de credenciales. Los ejemplos de"
    },
    {
        "code": "12.3.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.3.2",
        "guidance": "Se realiza un análisis de riesgo específico 12.3.2 Evalúe el análisis de riesgo personalizado con el objetivo del enfoque personalizado. para cada requisito PCI DSS que la entidad cumple documentado para cada requisito PCI DSS que la Definiciones con el enfoque personalizado, que incluye: entidad cumple, con el enfoque personalizado, para verificar que la documentación para cada El enfoque personalizado para cumplir con un elemento especificado en el Anexo D: Enfoque requisito existe y está de acuerdo con todos los elementos especificados en este requisito. los controles utilizados para cumplir con el"
    },
    {
        "code": "12.3.3",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.3.3",
        "guidance": "Los protocolos y conjuntos de cifrado 12.3.3 Evalúe la documentación de los protocolos a la identificación de vulnerabilidades o fallas de criptográfico en uso se documentan y revisan al y conjuntos criptográficos en uso y entreviste al diseño. Para respaldar las necesidades de personal para verificar que la documentación y la seguridad de datos actuales y futuros, las menos una vez cada 12 meses, incluyendo al revisión estén de acuerdo con todos los elementos entidades deben saber dónde se usa la menos lo siguiente: especificados en este requisito. criptografía y comprender cómo podría responder protocolos y conjuntos de cifrado criptográfico fortaleza de sus implementaciones criptográficas. en uso, incluyendo su propósito y dónde se utilizan. industria con respecto a la viabilidad continua de cifrado original o primitiva criptográfica, con todos los protocolos y conjuntos de cifrado planes para actualizar a la alternativa sin cambios criptográfico en uso. significativos en la infraestructura del sistema. los cambios anticipados en las vulnerabilidades Organismos de Estandarización desaprobarán criptográficas. protocolos o algoritmos, puede realizar planes"
    },
    {
        "code": "12.3.4",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.3.4",
        "guidance": "Las tecnologías de hardware y software en 12.3.4 Evalúe la documentación de las tecnologías estar al tanto de los cambios en las tecnologías uso se revisan al menos una vez cada 12 meses, de software y hardware en uso y entreviste al que utilizan, así como de las amenazas en incluyendo al menos lo siguiente: personal para verificar que las evaluaciones se evolución a esas tecnologías, a fin de asegurarse recibiendo correcciones de seguridad por parte especificados en este requisito. vulnerabilidades en hardware y software que no de los proveedores con prontitud. serán remediadas por el proveedor o apoyando (y no imposibilitan) el cumplimiento Buenas Prácticas PCI DSS de la entidad. Las organizaciones deben revisar las versiones tendencia de la industria relacionada con una actualizadas y sean respaldadas por los tecnología, como cuando un proveedor ha proveedores. Las organizaciones también deben anunciado planes para el \"fin de la vida útil\" de conocer los cambios realizados por los una tecnología. proveedores de tecnología en sus productos o gerencia, para remediar tecnologías obsoletas, tecnología por parte de la organización. incluidas aquellas para las que los proveedores han anunciado planes de \"fin de vida útil\"."
    },
    {
        "code": "12.4.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.4.1",
        "guidance": "Requisito adicional solo para 12.4.1 Procedimiento de prueba adicional solo garantiza la visibilidad, a nivel ejecutivo, del proveedores de servicios: La responsabilidad es para evaluaciones de proveedores de programa de cumplimiento PCI DSS y brinda la establecida por la gerencia ejecutiva para la servicios: Evalúe la documentación para verificar oportunidad de generar las preguntas adecuadas protección de datos de titulares de tarjetas y un que la gerencia ejecutiva haya establecido la para determinar la eficacia del programa e influir programa de cumplimiento con PCI DSS que responsabilidad de la protección de los datos de en las prioridades estratégicas. incluye: titulares de tarjeta y un programa de cumplimiento cumplimiento PCI DSS. especificados en este requisito. cumplimiento PCI DSS y reporte a la dirección ejecutiva."
    },
    {
        "code": "12.4.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.4.2",
        "guidance": "Requisito adicional solo para 12.4.2.a Procedimiento de prueba adicional seguridad garantiza que los controles esperados proveedores de servicios: Las revisiones se solo para evaluaciones de proveedores de estén activos y funcionando según lo previsto. realizan al menos una vez cada tres meses para servicios: Evalúe las políticas y los Este requisito es distinto de otros requisitos que confirmar que el personal está realizando sus procedimientos para verificar que los procesos especifican una tarea a realizar. El objetivo de tareas de acuerdo con todas las políticas de Las estén definidos para conducir revisiones a fin de estas revisiones no es volver a desempeñar con revisiones son realizadas por personal distinto al confirmar que el personal está desarrollando sus otros requisitos PCI DSS, sino confirmar que las responsable de realizar la tarea en cuestión e tareas de acuerdo con todas las políticas de actividades de seguridad se realizan de manera incluyen, entre otras, las siguientes tareas: seguridad y todos los procedimientos operativos, continua. en este requisito. seguridad de la red. 12.4.2.b Procedimiento de prueba adicional verificar que se mantenga la evidencia adecuada, nuevos sistemas. servicios: Entreviste al personal responsable y exploración de vulnerabilidades, revisiones de Evalúe los registros de las revisiones para verificar conjuntos de reglas de control de seguridad de la que se realicen de la siguiente manera:"
    },
    {
        "code": "12.5.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.5.1",
        "guidance": "Se mantiene y actualiza un inventario de los 12.5.1.a Evalúe el inventario para verificar que organización definir el alcance de su entorno e componentes del sistema que están dentro del incluya todos los componentes del sistema que implementar los requisitos PCI DSS de manera alcance PCI DSS, incluyendo una descripción de su son parte del alcance y una descripción de la precisa y eficiente. Sin un inventario, algunos función/uso. función/uso de cada uno. componentes del sistema podrían pasarse por 12.5.1.b Entreviste al personal para verificar que el estándares de configuración de la organización. inventario se mantenga actualizado."
    },
    {
        "code": "12.5.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.5.2",
        "guidance": "El alcance PCI DSS es documentado y 12.5.2.a Evalúe los resultados documentados de permanezca actualizado y alineado con los confirmado por la entidad al menos una vez cada las revisiones del alcance y entreviste al personal objetivos de negocios cambiantes y, por lo tanto, 12 meses y ante cambios significativos en el para verificar que se realicen las revisiones: que los controles de seguridad protejan todos los entorno dentro del alcance. Como mínimo, la • Al menos una vez cada 12 meses. componentes apropiados del sistema. validación del alcance incluye: Buenas Prácticas diversas etapas de pago (por ejemplo, CDE y todos los componentes del sistema autorización, captura de la liquidación, 12.5.2.b Evalúe los resultados documentados de conectado para determinar la cobertura necesaria devoluciones y reembolsos) y canales de las revisiones del alcance realizadas por la entidad para los requisitos PCI DSS. Las actividades de aceptación (por ejemplo, tarjeta física, tarjeta para verificar que la actividad de confirmación del alcance, incluido el análisis detallado y el virtual y comercio electrónico). alcance PCI DSS incluye todos los elementos monitoreo continuo, ayudan a garantizar que los según el Requisito 1.2.4. protegidos. Al documentar las ubicaciones de los almacenan, procesan y transmiten datos de crear una tabla u hoja de cálculo que incluya la cuenta, incluidos, entre otros: 1) cualquier siguiente información: ubicación fuera del CDE definida actualmente, • Almacenamiento de datos (bases de datos, 2) aplicaciones que procesan CHD, 3) archivos, nube, etc.), incluyendo el propósito transmisiones entre sistemas y redes, y 4) del almacenamiento de datos y el período de copias de seguridad de archivos. retención, el CDE, conectados al CDE o que podrían PAN, fecha de caducidad, nombre del titular afectar la seguridad del CDE. de la tarjeta y/o cualquier elemento de SAD en uso y los entornos desde los que se • Cómo se protegen los datos (tipo de cifrado y segmenta el CDE, incluida la justificación de los robustez, algoritmo hash y solidez, entornos que están fuera del alcance. truncamiento, tokenización), terceros con acceso al CDE. datos, incluyendo una descripción de los identificados, datos de cuentas, componentes empresarial, nivel de aplicación, nivel de del sistema, controles de segmentación y sistema operativo, etc.). conexiones de terceros con acceso al CDE (continúa en la página siguiente) están incluidos en el alcance. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 307 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "12.5.3",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.5.3",
        "guidance": "Requisito adicional solo para 12.5.3.a Procedimiento de prueba adicional operaciones eficientes y seguras. Los cambios en proveedores de servicios: Los cambios solo para evaluaciones de proveedores de esta estructura podrían tener efectos negativos significativos en la estructura organizativa dan como servicios: Evalúe las políticas y los en los controles y marcos existentes al reasignar resultado una revisión documentada (interna) del procedimientos para verificar que los procesos o eliminar recursos que alguna vez respaldaron impacto en el alcance PCI DSS y la aplicabilidad de estén definidos de tal manera que un cambio los controles PCI DSS o al heredar nuevas los controles; los resultados se comunican a la significativo en la estructura organizacional resulte responsabilidades que pueden no tener controles dirección ejecutiva. en una revisión documentada del impacto en el establecidos. Por lo tanto, es importante revisar el alcance y la aplicabilidad de los controles PCI alcance y los controles PCI DSS cuando haya DSS. cambios en la estructura y administración de una 12.5.3.b Procedimiento de prueba adicional estén implementados y activos. solo para evaluaciones de proveedores de"
    },
    {
        "code": "12.6.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.6.1",
        "guidance": "Se implementa un programa formal de 12.6.1 Evalúe el programa de concientización información de su empresa y de sus propias concientización sobre seguridad para que todo el sobre seguridad para verificar que brinda responsabilidades en materia de seguridad, las personal conozca la política y los procedimientos de conocimiento a toda la personal acera de las garantías y los procesos de seguridad que se han seguridad de la información a de la entidad, y el rol políticas y procedimientos de seguridad de la implementado pueden volverse ineficientes del personal en la protección de los datos de información de la entidad, y el rol del personal en debido a errores no intencionales o acciones titulares de tarjetas. la protección de los datos de titulares de tarjetas. intencionales."
    },
    {
        "code": "12.6.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.6.2",
        "guidance": "El programa de concientización sobre 12.6.2 Evalúe el contenido del programa de del programa de concientización sobre seguridad seguridad es: concientización sobre seguridad, la evidencia de deben actualizarse con la frecuencia necesaria que el programa de concientización sobre personal esté actualizada y represente el entorno cualquier nueva amenaza y vulnerabilidad que especificados en este requisito. pueda impactar la seguridad del CDE de la entidad, o la información proporcionada al personal sobre sus funciones en lo concerniente a la protección de los datos de titulares de tarjetas."
    },
    {
        "code": "12.6.3",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.6.3",
        "guidance": "El personal recibe capacitación sobre 12.6.3.a Evalúe los registros del programa de seguridad de la información y que comprendan el seguridad de la siguiente manera: concientización sobre seguridad para verificar que papel que juega en la protección de la vez cada 12 meses. concientización sobre seguridad al momento de la Solicitar el reconocimiento por parte del personal contratación y al menos una vez cada 12 meses. ayuda a garantizar que hayan leído y meses que ha leído y comprendido las políticas concientización sobre seguridad para verificar que y los procedimientos de seguridad de la este incluya múltiples métodos para comunicar la información. concientización y educar al personal. 12.6.3.c Entreviste al personal para verificar que Las entidades pueden incorporar capacitación hayan completado la capacitación de para nuevos empleados como parte del proceso concientización y que sean conscientes de su de incorporación de Recursos Humanos. La función en la protección de los datos de titulares capacitación debe describir los \"hacer\" y \"no de tarjetas. hacer\" relacionados con la seguridad. La 12.6.3.d Evalúe los materiales del programa de los procesos y procedimientos de seguridad concientización sobre seguridad y los esenciales que pueden olvidarse o pasarse por reconocimientos del personal para verificar que alto. reconocen, al menos una vez cada 12 meses, que han leído y entendido la política y los procedimientos de seguridad de la información. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 313 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "12.7.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.7.1",
        "guidance": "El personal potencial que tendrá acceso al 12.7.1 Entreviste a la gerencia responsable del acceso al CDE, proporciona a las entidades la CDE es investigado, en el marco de las limitaciones Departamento de Recursos Humanos para información necesaria para tomar decisiones de que establecen las leyes locales, antes de su verificar que se realice una evaluación, el marco riesgo informadas con respecto al personal que contratación, a fin de minimizar el riesgo de ataques de las limitaciones que establecen las leyes contratan y que tendrá acceso al CDE. provenientes de fuentes internas. locales, antes de contratar al personal potencial Otros beneficios de la evaluación de personal que tendrá acceso al CDE. potencial incluyen ayudar a garantizar la"
    },
    {
        "code": "12.8.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.8.1",
        "guidance": "Se mantiene una lista de todos los 12.8.1.a Evalúe las políticas y procedimientos para organización y define la superficie de ataque proveedores de servicios de terceros (TPSP) con comprobar que se han definido procesos para extendida de la organización. los que se comparten datos de cuentas o que mantener una lista de TPSPS incluyendo una Ejemplos podrían afectar a la seguridad de los datos de descripción de cada uno de los servicios cuentas, incluyendo una descripción para cada uno suministrados, para todos los TPSP con los que se Los diferentes tipos de TPSP incluyen aquellos de los servicios prestados. comparten datos de cuentas o que podrían afectar que: la seguridad de los datos del tarjetahabiente. • Almacenan, procesan o transmiten datos de 12.8.1.b Evalúe la documentación para verificar pasarelas de pago, procesadores de pago, que se mantiene una lista de todos los TPSP que proveedores de servicios de pago (PSP) y"
    },
    {
        "code": "12.8.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.8.2",
        "guidance": "Se mantienen acuerdos escritos con los 12.8.2.a Evalúe las políticas y los procedimientos seguridad adecuada para los datos de cuentas TPSP de la siguiente manera: para verificar que los procesos están definidos que se obtienen de los clientes y que el TPSP es TPSP con los que se comparten datos de TPSP de acuerdo con todos los elementos podrían verse afectados durante el suministro del cuentas o que podrían afectar la seguridad del especificados en este requisito. servicio del TPSP. La medida en que un TPSP CDE. específico es responsable de la seguridad de los 12.8.2.b Evalúe los acuerdos escritos con los datos de cuentas, dependerá del servicio reconocimiento por parte de los TPSP de que con todos los elementos especificados en este entidad evaluada (el cliente). son responsables por la seguridad de los datos requisito. de cuentas que los TPSP poseen o almacenan, Junto con el Requisito 12.9.1, este requisito tiene procesan o transmiten en nombre de la entidad, por objeto promover un nivel de comprensión o en la medida en que puedan afectar a la coherente entre las partes, en relación con sus seguridad del CDE de la entidad. responsabilidades aplicables en el marco PCI"
    },
    {
        "code": "12.8.3",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.8.3",
        "guidance": "Se implementa un proceso establecido para 12.8.3.a Evalúe las políticas y los procedimientos examen antes de la contratación, ayuda a contratar a los TPSP, incluyendo la debida para verificar que se han definido los procesos garantizar que un TPSP sea examinado a fondo diligencia antes de la contratación. para la contratación de TPSP, incluyendo la internamente por una entidad antes de establecer debida diligencia antes de la contratación. una relación formal y que se comprenda el riesgo 12.8.3.b Evalúe las evidencias y entreviste al la contratación de un TPSP. personal responsable para verificar que el proceso de contratación de TPSP incluye la debida"
    },
    {
        "code": "12.8.4",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.8.4",
        "guidance": "Se implementa un programa para monitorear 12.8.4.a Evalúe las políticas y los procedimientos seguridad y conocimiento sobre si se está el estado de cumplimiento PCI DSS de los TPSP al para verificar que los procesos para monitorear el cumpliendo con los requisitos aplicables a los menos una vez cada 12 meses. estado de cumplimiento PCI DSS de los TPSP al servicios que ofrecen a la organización. menos una vez cada 12 meses, estén definidos. Buenas Prácticas 12.8.4.b Evalúe la documentación y entreviste al Si el TPSP ofrece una variedad de servicios, el personal responsable de verificar que el estado de estado de cumplimiento que la entidad supervisa cumplimiento PCI DSS de cada TPSP sea debe ser específico para los servicios prestados a"
    },
    {
        "code": "12.8.5",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.8.5",
        "guidance": "Se mantiene información sobre qué 12.8.5.a Evalúe las políticas y los procedimientos acordado cumplir sus TPSP, qué requisitos se requisitos PCI DSS gestiona cada TPSP, cuáles para verificar que los procesos estén definidos comparten entre el TPSP y la entidad, y para gestiona la entidad y cualquiera que se comparta para mantener información sobre qué requisitos aquellos que se comparten, brindar detalles sobre entre el TPSP y la entidad. PCI DSS administra cada TPSP, cuáles administra cómo se comparten los requisitos y qué entidad la entidad y cualquiera que se comparta entre es responsable de cumplir con cada sub- ambos, el TPSP y la entidad. requisito. 12.8.5.b Evalúe la documentación y entreviste al personal para verificar que la entidad mantenga"
    },
    {
        "code": "12.9.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.9.1",
        "guidance": "Requisito adicional solo para 12.9.1 Procedimiento de prueba adicional solo coherente entre los TPSP y sus clientes acerca proveedores de servicios: Los TPSP reconocen para evaluaciones de proveedores de de sus responsabilidades aplicables en el marco por escrito a los clientes que son responsables por servicios: Evalúe las políticas, los procedimientos PCI DSS. El reconocimiento de los TPSP la seguridad de los datos de cuentas que el TPSP y las plantillas de TPSP que se utilizan para los evidencia su compromiso de mantener la posee o almacena, procesa o transmite en nombre acuerdos escritos a fin de verificar que los seguridad adecuada de los datos de cuenta que del cliente, o en la medida en que puedan afectar la procesos estén definidos, de manera que el TPSP obtiene de sus clientes. seguridad del CDE del cliente. proporcione un reconocimiento por escrito a los El método por el cual los TPSP proporcionan un clientes, de acuerdo con todos los elementos reconocimiento por escrito debe ser acordado especificados en este requisito. entre el proveedor y sus clientes."
    },
    {
        "code": "12.9.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.9.2",
        "guidance": "Requisito adicional solo para 12.9.2 Procedimiento de prueba adicional solo con sus requisitos de seguridad y cumplimiento, proveedores de servicios: Los TPSP respaldan para evaluaciones de proveedores de los clientes no podrán proteger los datos de las solicitudes de información de sus clientes para servicios: Evalúe las políticas y los titulares de tarjetas ni podrán cumplir con sus cumplir con los Requisitos 12.8.4 y 12.8.5 procedimientos para verificar que los procesos propias obligaciones contractuales. proporcionando lo siguiente a pedido del cliente: estén definidos para que los TPSP respalden la Buenas Prácticas cumplir con los Requisitos 12.8.4 y 12.8.5 de Si un TPSP tiene un certificado de cumplimiento DSS para cualquier servicio que el TPSP realice PCI DSS (AOC), se espera que el TPSP lo en nombre de los clientes (Requisito 12.8.4). acuerdo con todos los elementos especificados en este requisito. proporcione a los clientes que lo soliciten para responsabilidad del TPSP y cuáles son DSS. responsabilidad del cliente, incluyendo las Si el TPSP no se ha sometido a una evaluación responsabilidades compartidas (Requisito PCI DSS, estos pueden proporcionar otras 12.8.5). evidencias para demostrar que se ha cumplido"
    },
    {
        "code": "12.10.1",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.1",
        "guidance": "Existe un plan de respuesta a incidentes y 12.10.1.a Evalúe el plan de respuesta a incidentes entiendan adecuadamente, la confusión y la falta está listo para activarse en caso de sospecha o para verificar que exista e incluya al menos los de respuestas conjuntas podrían incrementar el confirmación de un incidente de seguridad. El plan elementos especificados en este requisito. tiempo de inactividad del negocio, exposición incluye, pero no se limita a: innecesaria a los medios públicos, así como 12.10.1.b Entreviste al personal y Evalúela riesgos financieros y/o de pérdida de reputación, documentación de incidentes o alertas reportados y responsabilidades legales. comunicación y contacto en caso de sospecha o previamente para verificar si se siguieron los confirmación de un incidente de seguridad, Buenas Prácticas procedimientos y el plan de respuesta a incidentes incluyendo la notificación de marcas de pago y El plan de respuesta a incidentes debe ser documentados. adquirentes, como mínimo. minucioso y contener todos los elementos clave actividades específicas de contención y comunicaciones) permitiendo a la entidad mitigación para diferentes tipos de incidentes. responder de manera eficiente en caso de una del negocio. Es importante mantener el plan actualizado con la situaciones comprometidas. relevantes al momento de enviar notificaciones componentes críticos del sistema. respuesta a incidentes de las marcas de pago. Payment Card Industry Estándar de Seguridad de Datos: Requisitos y Procedimientos de Evaluación, v4.0 Marzo de 2022 © 2006 - 2022 PCI Security Standards Council, LLC. Todos los Derechos Reservados. Página 327 Requisitos y Procedimientos de Prueba Guía"
    },
    {
        "code": "12.10.2",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.2",
        "guidance": "Al menos una vez cada 12 meses, el plan 12.10.2 Entreviste al personal y revise la procesos de negocios defectuosos y garantizar de respuesta a incidentes de seguridad es: documentación para verificar que, al menos una que no se pierdan pasos esenciales, lo que necesario. incidentes de seguridad es: un incidente. Las pruebas periódicas del plan enumerados en el Requisito 12.10.1. • Probado, incluyendo todos los elementos relevante de la organización esté familiarizado enumerados en el Requisito 12.10.1. con el plan."
    },
    {
        "code": "12.10.3",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.3",
        "guidance": "Se designa personal específico para estar 12.10.3 Evalúe la documentación y entreviste al en respuesta a incidentes y que está familiarizada disponible las 24 horas del día, los 7 días de la personal responsable que ocupe los roles con el plan de la entidad está disponible cuando semana a fin de responder a incidentes de designados para verificar que el personal se detecta el incidente, la capacidad de la entidad seguridad sospechosos o confirmados. específico esté disponible las 24 horas del día, los para responder correctamente aumenta. 7 días de la semana para responder a incidentes Buenas Prácticas"
    },
    {
        "code": "12.10.4",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.4",
        "guidance": "El personal responsable de responder a 12.10.4 Evalúe la documentación de capacitación un daño extenso a la red, y los datos y sistemas incidentes de seguridad sospechados y y entreviste al personal de respuesta a incidentes críticos podrían “contaminarse” por el manejo confirmados recibe capacitación adecuada y para verificar que esté capacitado de manera inadecuado de los sistemas objetivo. Esto puede periódica sobre sus responsabilidades en la adecuada y periódica acerca de sus dificultar el éxito de una investigación posterior al respuesta a incidentes. responsabilidades de respuesta a incidentes. incidente."
    },
    {
        "code": "12.10.5",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.5",
        "guidance": "El plan de respuesta a incidentes de 12.10.5 Evalúe la documentación y observe los que están diseñados explícitamente para seguridad incluye el monitoreo y la respuesta a las procesos de respuesta a incidentes para verificar centrarse en el riesgo potencial para los datos a alertas de los sistemas de monitoreo de seguridad, que el monitoreo y la respuesta a las alertas de los fin de impedir una infracción y, por lo tanto, esto incluyendo, pero no limitado a: sistemas de monitoreo de seguridad están debe incluirse en los procesos de respuesta a intrusiones. seguridad, incluyendo, pero no limitado a los sistemas especificados en este requerimiento. archivos críticos. manipulaciones en las páginas de pago. Este punto es una de las mejores prácticas hasta su fecha de vigencia; consulte las Notas de Aplicabilidad que aparecen a continuación para obtener más detalles. autorizados."
    },
    {
        "code": "12.10.6",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.6",
        "guidance": "El plan de respuesta a incidentes de 12.10.6.a Evalúe las políticas y procedimientos produzca un incidente y al ritmo de la evolución seguridad se modifica y evoluciona de acuerdo con para verificar que los procesos están definidos a del sector, ayuda a mantener el plan actualizado las lecciones aprendidas y para incorporar los fin de modificar y evolucionar el plan de respuesta y con la capacidad de reaccionar ante las nuevas desarrollos de la industria. a incidentes de seguridad de acuerdo con las amenazas y tendencias de seguridad. lecciones aprendidas e incorporar elementos de Buenas Prácticas desarrollo de la industria. 12.10.6.b Evalúe el plan de respuesta a incidentes todos los niveles del personal. Aunque a menudo de seguridad y entreviste al personal responsable se incluye como parte de la revisión de todo el"
    },
    {
        "code": "12.10.7",
        "domain": "Requisito 12 - Respalde la Seguridad de la Información con Políticas y Programas Organizacionales",
        "requirement": "Requisito 12.10.7",
        "guidance": "Existen procedimientos de respuesta a 12.10.7.a Evalúe los procedimientos de respuesta de que se encuentren datos de PAN incidentes que se iniciarán cuando se detecten a incidentes documentados para verificar que los almacenados en algún lugar donde no deberían datos de PAN almacenados en un lugar inesperado, procedimientos para responder a la detección de estar, ayuda a identificar las acciones de e incluyen: datos de PAN almacenados en cualquier lugar remediación necesarias y a impedir fugas futuras. PAN fuera del CDE, incluyendo su recuperación, todos los elementos especificados en este requisito. Si se encuentran datos de PAN fuera del CDE, se eliminación segura y/o migración al CDE debe realizar un análisis para 1) determinar si se actualmente definido, según corresponda. guardaron independientemente de otros datos o 12.10.7.b Entreviste al personal y estudiar los autenticación se almacenan con datos de PAN. verificar los procedimientos de respuesta, ante la identificar la fuente de los datos, y 3) identificar tarjetahabiente y cómo han llegaron donde no se ubicación inapropiada. datos estuvieran fuera del CDE. esperaba. Las entidades deben considerar si existen proceso que llevaron a que los datos del empresariales, comportamiento de los usuarios, tarjetahabiente llegaran a una ubicación configuraciones inadecuadas del sistema, etc., inesperada. que hayan provocado que los datos de PAN se"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ccc_system');
        console.log("Conectado a MongoDB para seeding de PCI DSS v4.0...");

        // Eliminar el marco PCI DSS y sus requisitos previos si existen
        const existingFramework = await Framework.findOne({ name: frameworkInfo.name });
        if (existingFramework) {
            await FrameworkRequirement.deleteMany({ framework_id: existingFramework._id });
            await Framework.deleteOne({ _id: existingFramework._id });
            console.log("Marco anterior PCI DSS eliminado.");
        }

        const framework = new Framework(frameworkInfo);
        await framework.save();
        console.log(`Marco guardado: ${framework.name}`);

        const reqsToSave = requirements.map(r => ({
            ...r,
            framework_id: framework._id
        }));
        await FrameworkRequirement.insertMany(reqsToSave);
        console.log(`  Requisitos guardados para ${framework.name}: ${reqsToSave.length}`);

        console.log("Seeding de PCI DSS completado satisfactoriamente.");
        process.exit(0);
    } catch (err) {
        console.error("Error durante el seeding:", err);
        process.exit(1);
    }
}

seed();
