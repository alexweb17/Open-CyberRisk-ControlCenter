
# ASVS OWASP - Lista de controles

## V1 Codificación y Sanitización

- **V1.1 – Arquitectura de codificación y saneamiento**
  - **1.1.1:** Verificar que la entrada se decodifique o se desescapé a un formato canónico solo una vez, que solo se decodifique cuando se esperan datos codificados en ese formato y que esto se realice antes de seguir procesando la entrada; por ejemplo, no se realiza después de la validación o el saneamiento de la entrada.
  - **1.1.2:** Verificar que la aplicación realice la codificación y el escape de la salida, ya sea como paso final antes de que la utilice el intérprete para el que está diseñada o el propio intérprete.
- **V1.2 – Prevención de Inyecciones**
  - **1.2.1:** Verificar que la codificación de salida para una respuesta HTTP, documento HTML o documento XML sea relevante para el contexto requerido, como la codificación de caracteres relevantes para elementos HTML, atributos HTML, comentarios HTML, CSS o campos de encabezado HTTP, para evitar cambios en la estructura del mensaje o del documento.
  - **1.2.2:** Verificar que, al crear URL dinámicamente, los datos no confiables se codifiquen según su contexto (por ejemplo, codificación URL o codificación base64URL para parámetros de consulta o ruta). Asegurarse de que solo se permitan protocolos de URL seguros (por ejemplo, prohibir javascript: o data:).
  - **1.2.3:** Verificar que se utilice codificación o escape de salida al crear contenido JavaScript dinámicamente (incluido JSON), para evitar cambios en la estructura del mensaje o del documento (para evitar la inyección de JavaScript y JSON).
  - **1.2.4:** Verificar que la selección de datos o las consultas a bases de datos (p. ej., SQL, HQL, NoSQL, Cypher) utilicen consultas parametrizadas, ORM, marcos de entidades o estén protegidas contra la inyección de SQL y otros ataques de inyección de bases de datos. Esto también es relevante al escribir procedimientos almacenados.
  - **1.2.5:** Verificar que la aplicación esté protegida contra la inyección de comandos del sistema operativo y que las llamadas al sistema operativo utilicen consultas parametrizadas del sistema operativo o codificación de salida de línea de comandos contextual.
  - **1.2.6:** Verificar que la aplicación esté protegida contra vulnerabilidades de inyección LDAP o que se hayan implementado controles de seguridad específicos para prevenir la inyección LDAP.
  - **1.2.7:** Verificar que la aplicación esté protegida contra ataques de inyección XPath mediante la parametrización de consultas o consultas precompiladas.
  - **1.2.8:** Verificar que los procesadores LaTeX estén configurados de forma segura (por ejemplo, sin usar el indicador "–shell-escape") y que se utilice una lista de comandos permitidos para prevenir ataques de inyección LaTeX.+
  - **1.2.9:** Verifique que la aplicación escape los caracteres especiales en expresiones regulares (normalmente mediante una barra invertida) para evitar que se malinterpreten como metacaracteres.
  - **1.2.10:** Verifique que la aplicación esté protegida contra CSV e inyección de fórmulas. La aplicación debe seguir las reglas de escape definidas en las secciones 2.6 y 2.7 de RFC 4180 al exportar contenido CSV. Además, al exportar a CSV u otros formatos de hoja de cálculo (como XLS, XLSX u ODF), los caracteres especiales (incluidos «=», «+», «-», «@», «\t» (tabulador) y «\0» (carácter nulo)) deben escaparse con una comilla simple si aparecen como el primer carácter de un valor de campo.
- **V1.3 – Sanitización**
  - **1.3.1:** Verificar que toda la entrada HTML no confiable proveniente de editores WYSIWYG o similares se sanee mediante una biblioteca o función de marco de sanitización HTML reconocida y segura.
  - **1.3.2:** Verificar que la aplicación evite el uso de eval() u otras funciones de ejecución dinámica de código como Spring Expression Language (SpEL). Si no hay alternativa, cualquier entrada del usuario que se incluya debe sanearse antes de su ejecución.
  - **1.3.3:** Verificar que los datos que se pasan a un contexto potencialmente peligroso se saneen previamente para implementar medidas de seguridad, como permitir solo caracteres seguros para este contexto y recortar la entrada demasiado larga.
  - **1.3.4:** Verificar que el contenido de gráficos vectoriales escalables (SVG) proporcionado por el usuario, que se pueda usar como script, se valide o sanee para que contenga únicamente etiquetas y atributos (como gráficos de dibujo) seguros para la aplicación; por ejemplo, que no contengan scripts ni objetos externos.
  - **1.3.5:** Verificar que la aplicación desinfecte o deshabilite el contenido de lenguajes de plantillas de expresión o scripts proporcionados por el usuario, como Markdown, hojas de estilo CSS o XSL, BBCode o similares.
  - **1.3.6:** Verificar que la aplicación proteja contra ataques de falsificación de solicitudes del lado del servidor (SSRF) mediante la validación de datos no confiables con una lista de protocolos, dominios, rutas y puertos permitidos, y la desinfectación de caracteres potencialmente peligrosos antes de usar los datos para llamar a otro servicio.
  - **1.3.7:** Verificar que la aplicación proteja contra ataques de inyección de plantillas al no permitir la creación de plantillas basadas en entradas no confiables. Si no hay alternativa, cualquier entrada no confiable que se incluya dinámicamente durante la creación de plantillas debe desinfectarse o validarse estrictamente.
  - **1.3.8:** Verificar que la aplicación desinfecte adecuadamente las entradas no confiables antes de usarlas en consultas de la Interfaz de Nombres y Directorio de Java (JNDI) y que JNDI esté configurado de forma segura para evitar ataques de inyección JNDI. 1.3.9 Verificar que la aplicación desinfecte el contenido antes de enviarlo a memcache para evitar ataques de inyección.
  - **1.3.10:** Verificar que las cadenas de formato que podrían resolverse de forma inesperada o maliciosa al usarse se desinfecten antes de ser procesadas.
  - **1.3.11:** Verificar que la aplicación desinfecte la entrada del usuario antes de pasarla a los sistemas de correo para protegerse contra la inyección de SMTP o IMAP.
  - **1.3.12:** Verificar que las expresiones regulares estén libres de elementos que provoquen retroceso exponencial y asegurar que la entrada no confiable se desinfecte para mitigar ataques ReDoS o Runaway Regex.
- **V1.4 – Memoria, cadenas y código no administrado**
  - **1.4.1:** Verificar que la aplicación utilice cadenas seguras para memoria, copia de memoria más segura y aritmética de punteros para detectar o prevenir desbordamientos de pila, búfer o montón.
  - **1.4.2:** Verificar que se utilicen técnicas de validación de signo, rango y entrada para prevenir desbordamientos de enteros.
  - **1.4.3:** Verificar que la memoria y los recursos asignados dinámicamente se liberen, y que las referencias o punteros a la memoria liberada se eliminen o se establezcan en nulo para evitar punteros colgantes y vulnerabilidades de uso después de la liberación.

- **V1.5 – Deserialización segura**
  - **1.5.1:** Verificar que la aplicación configure los analizadores XML para usar una configuración restrictiva y que las funciones inseguras, como la resolución de entidades externas, estén deshabilitadas para prevenir ataques de Entidad Externa XML (XXE).
  - **1.5.2:** Verificar que la deserialización de datos no confiables implemente un manejo seguro de la entrada, como el uso de una lista de permitidos de tipos de objetos o la restricción de los tipos de objetos definidos por el cliente, para prevenir ataques de deserialización. Los mecanismos de deserialización definidos explícitamente como inseguros no deben utilizarse con entradas no confiables.
  - **1.5.3:** Verificar que los diferentes analizadores utilizados en la aplicación para el mismo tipo de datos (p. ej., analizadores JSON, XML, URL) realicen el análisis de forma consistente y utilicen el mismo mecanismo de codificación de caracteres para evitar problemas como vulnerabilidades de interoperabilidad de JSON o que diferentes comportamientos de análisis de URI o archivos se aprovechen en ataques de Inclusión Remota de Archivos (RFI) o Falsificación de Solicitud del Lado del Servidor (SSRF).

## V2 Validación y Lógica de Negocio

- **V2.1 Validación y Lógica de Negocio**
  - **2.1.1:** Verificar que la documentación de la aplicación defina las reglas de validación de entrada para comprobar la validez de los elementos de datos con respecto a una estructura esperada. Estos podrían ser formatos de datos comunes, como números de tarjetas de crédito, direcciones de correo electrónico, números de teléfono, o un formato de datos interno.
  - **2.1.2:** Verificar que la documentación de la aplicación defina cómo validar la coherencia lógica y contextual de los elementos de datos combinados, como comprobar que el barrio y el código postal coincidan.
  - **2.1.3:** Verificar que las expectativas sobre los límites y las validaciones de la lógica de negocio estén documentadas, tanto por usuario como a nivel global en toda la aplicación.

- **V2.2 – Validación de Entrada**
  - **2.2.1:** Verificar que la entrada esté validada para cumplir con las expectativas empresariales o funcionales. Esto debe basarse en la validación positiva con una lista de valores permitidos, patrones y rangos, o en la comparación de la entrada con una estructura esperada y límites lógicos según reglas predefinidas. Para L1, esto puede centrarse en la entrada utilizada para tomar decisiones empresariales o de seguridad específicas. Para L2 y superiores, esto debe aplicarse a todas las entradas.

  - **2.2.2:** Verificar que la aplicación esté diseñada para aplicar la validación de entrada en una capa de servicio de confianza. Si bien la validación del lado del cliente mejora la usabilidad y debe fomentarse, no debe considerarse un control de seguridad.

  - **2.2.3:** Verificar que la aplicación garantice que las combinaciones de datos relacionados sean razonables según las reglas predefinidas.

- **V2.3 – Seguridad de la lógica de negocio**
  - **2.3.1:** Verificar que la aplicación solo procese flujos de lógica de negocio para el mismo usuario en el orden secuencial previsto y sin omitir pasos.
  - **2.3.2:** Verificar que los límites de la lógica de negocio se implementen según la documentación de la aplicación para evitar la explotación de fallos de lógica de negocio.
  - **2.3.3:** Verificar que las transacciones se utilicen a nivel de lógica de negocio de forma que una operación de lógica de negocio se complete correctamente o se revierta al estado correcto anterior.
  - **2.3.4:** Verificar que se utilicen mecanismos de bloqueo a nivel de lógica de negocio para garantizar que los recursos limitados (como asientos de teatro o franjas horarias de entrega) no se reserven dos veces mediante la manipulación de la lógica de la aplicación.
  - **2.3.5:** Verificar que los flujos de lógica de negocio de alto valor requieran la aprobación de múltiples usuarios para evitar acciones no autorizadas o accidentales. Esto podría incluir, entre otras cosas, grandes transferencias monetarias, aprobaciones de contratos, acceso a información clasificada o anulaciones de seguridad en la fabricación.

- **V2.4 – Antiautomatización**
  - **2.4.1:** Verificar que existan controles antiautomatización para proteger contra llamadas excesivas a las funciones de la aplicación que podrían provocar la exfiltración de datos, la creación de datos basura, el agotamiento de cuotas, el incumplimiento de los límites de velocidad, la denegación de servicio o el uso excesivo de recursos costosos.
  - **2.4.2:** Verificar que los flujos de lógica de negocio requieran una sincronización humana realista, evitando el envío de transacciones excesivamente rápido.

## V3 Seguridad del Frontend Web

- **V3.1 – Documentación de Seguridad del Frontend Web**
  - **3.1.1:** Verificar que la documentación de la aplicación indique las características de seguridad esperadas que los navegadores que la utilizan deben soportar (como HTTPS, Seguridad de Transporte Estricta HTTP (HSTS), Política de Seguridad de Contenido (CSP) y otros mecanismos de seguridad HTTP relevantes). También debe definir cómo debe comportarse la aplicación cuando algunas de estas características no estén disponibles (como advertir al usuario o bloquear el acceso).

- **V3.2 – Interpretación de Contenido No Deseada**
  - **3.2.1:** Verificar que existan controles de seguridad para evitar que los navegadores representen contenido o funcionalidades en respuestas HTTP en un contexto incorrecto (por ejemplo, cuando se solicita directamente una API, un archivo subido por el usuario u otro recurso). Los posibles controles podrían incluir: no servir el contenido a menos que los campos del encabezado de la solicitud HTTP (como Sec‑Fetch‑*) indiquen que se trata del contexto correcto, usar la directiva sandbox del campo de encabezado Content‑Security‑Policy o usar el tipo de disposición de adjuntos en el campo de encabezado Content‑Disposition.

  - **3.2.2:** Verificar que el contenido que se va a mostrar como texto, en lugar de renderizarse como HTML, se gestione mediante funciones de renderizado seguro (como createTextNode o textContent) para evitar la ejecución no intencionada de contenido como HTML o JavaScript.

  - **3.2.3:** Verificar que la aplicación evite la sobrecarga del DOM al usar JavaScript del lado del cliente mediante declaraciones explícitas de variables, una comprobación de tipos estricta, evitar el almacenamiento de variables globales en el objeto del documento e implementar el aislamiento del espacio de nombres.

- **V3.3 – Configuración de Cookies**
  - **3.3.1:** Verifique que las cookies tengan configurado el atributo "Secure" y, si no se utiliza el prefijo "__Host" para el nombre de la cookie, se debe utilizar el prefijo "__Secure".
  - **3.3.2:** Verifique que el valor del atributo "SameSite" de cada cookie se configure según su propósito para limitar la exposición a ataques de corrección de la interfaz de usuario y ataques de falsificación de solicitud basados ​​en el navegador, comúnmente conocidos como falsificación de solicitud entre sitios (CSRF).
  - **3.3.3:** Verifique que las cookies tengan el prefijo "__Host" para el nombre de la cookie, a menos que estén diseñadas explícitamente para ser compartidas con otros hosts.
  - **3.3.4:** Verificar que si el valor de una cookie no está destinado a ser accesible para scripts del lado del cliente (como un token de sesión), la cookie debe tener el atributo "HttpOnly" establecido y el mismo valor (por ejemplo, el token de sesión) solo debe transferirse al cliente a través del campo de encabezado "Set-Cookie".
  - **3.3.5:** Verificar que, cuando la aplicación escribe una cookie, la longitud combinada del nombre y el valor de la cookie no supere los 4096 bytes. El navegador no almacenará cookies demasiado grandes y, por lo tanto, no se enviarán con las solicitudes, lo que impedirá que el usuario utilice las funciones de la aplicación que dependen de esa cookie.

- **V3.4 – Encabezados del mecanismo de seguridad del navegador**
  - **3.4.1:** Verifique que se incluya un campo de encabezado de Seguridad de Transporte Estricta en todas las respuestas para aplicar una política de Seguridad de Transporte Estricta HTTP (HSTS). Se debe definir una antigüedad máxima de al menos 1 año y, para L2 y superiores, la política también debe aplicarse a todos los subdominios.
  - **3.4.2:** Verifique que el campo de encabezado "Acceso - Control - Permitir - Origen" de Intercambio de Recursos entre Orígenes (CORS) tenga un valor fijo de la aplicación o, si se usa el valor del campo de encabezado de la solicitud HTTP "Origen", se valide con una lista de orígenes de confianza permitidos. Cuando se deba usar " Acceso - Control - Permitir - Origen: * " , verifique que la respuesta no incluya información confidencial.
  - **3.4.3:** Verificar que las respuestas HTTP incluyan un campo de encabezado de respuesta "Contenido - Seguridad - Política", que define directivas para garantizar que el navegador solo cargue y ejecute contenido o recursos confiables, a fin de limitar la ejecución de JavaScript malicioso. Como mínimo, se debe utilizar una política global que incluya las directivas object - src ' none ' y base - uri ' none ' , y que defina una lista de permitidos o utilice nonces o hashes. Para una aplicación L3, se debe definir una política por respuesta con nonces o hashes.
  - **3.4.4:** Verificar que todas las respuestas HTTP contengan el campo de encabezado "X ‑ Contenido ‑ Tipo ‑ Opciones: nosniff " . Esto indica a los navegadores que no utilicen el rastreo de contenido ni la determinación del tipo MIME para la respuesta dada, y que exijan que el valor del campo de encabezado " Contenido ‑ Tipo" de la respuesta coincida con el recurso de destino. Por ejemplo, la respuesta a una solicitud de estilo solo se acepta si el " Contenido ‑ Tipo" de la respuesta es " text /css " . Esto también permite que el navegador utilice la función de Bloqueo de Lectura de Origen Cruzado ( CORB).
  - **3.4.5:** Verifique que la aplicación establezca una política de referencia para evitar la fuga de datos técnicamente sensibles a servicios de terceros mediante el campo de encabezado de la solicitud HTTP " Referer " . Esto se puede realizar mediante el campo de encabezado de respuesta HTTP "Referrer - Policy" o mediante atributos de elementos HTML. Los datos sensibles pueden incluir la ruta y los datos de consulta en la URL, y para aplicaciones internas no públicas , también el nombre de host.
  - **3.4.6:** Verifique que la aplicación web utilice la directiva frame - ancestros del campo de encabezado Content - Security - Política para cada respuesta HTTP, a fin de garantizar que no se pueda incrustar por defecto y que la incrustación de recursos específicos solo se permita cuando sea necesario. Tenga en cuenta que el campo de encabezado X - Frame - Options, aunque compatible con los navegadores, está obsoleto y no se puede confiar en él.
  - **3.4.7:** Verifique que el campo de encabezado Contenido ‑ Seguridad ‑ Política especifique una ubicación para informar violaciones
  - **3.4.8:** Verifique que todas las respuestas HTTP que inician la representación de un documento (como las respuestas con Contenido - Tipo text/html) incluyan el campo de encabezado Cross - Origin - Opener - Policy con la misma directiva - origin o la misma directiva - origin - allow - popups, según sea necesario. Esto evita ataques que abusan del acceso compartido a objetos de ventana, como el tabnabbing y el conteo de fotogramas.

- **V3.5 – Separación del origen del navegador**
  - **3.5.1:** Verificar que, si la aplicación no utiliza el mecanismo de verificación previa CORS para evitar que las solicitudes de origen cruzado no permitidas utilicen funcionalidad sensible, estas solicitudes se validen para garantizar que provengan de la propia aplicación. Esto puede lograrse mediante el uso y la validación de tokens antifalsificación o la exigencia de campos de encabezado HTTP adicionales que no estén incluidos en la lista segura de CORS . Esto se hace para protegerse contra ataques de falsificación de solicitudes basados en el navegador , comúnmente conocidos como falsificación de solicitudes entre sitios (CSRF).
  - **3.5.2:** Verificar que, si la aplicación utiliza el mecanismo de verificación previa CORS para evitar el uso no permitido de funcionalidad sensible entre orígenes , no sea posible llamar a la funcionalidad con una solicitud que no active una solicitud de verificación previa CORS . Esto puede requerir la comprobación de los valores de los campos de encabezado de solicitud " Origen " y " Tipo de contenido " o el uso de un campo de encabezado adicional que no esté incluido en la lista segura de CORS .
  - **3.5.3:** Verificar que las solicitudes HTTP a funcionalidades sensibles utilicen métodos HTTP adecuados, como POST, PUT, PATCH o DELETE, y no métodos definidos por la especificación HTTP como "seguros", como HEAD, OPTIONS o GET. Como alternativa, se puede usar una validación estricta de los campos del encabezado de la solicitud Sec ‑ Fetch‑ * para garantizar que la solicitud no se originó a partir de una llamada inapropiada de origen cruzado , una solicitud de navegación o una carga de recursos (como una fuente de imagen) donde esto no se espera.
  - **3.5.4:** Verifique que las aplicaciones independientes estén alojadas en diferentes nombres de host para aprovechar las restricciones proporcionadas por la política del mismo origen , incluido el modo en que los documentos o scripts cargados por un origen pueden interactuar con recursos de otro origen y las restricciones basadas en el nombre de host en las cookies.
  - **3.5.5:** Verifique que los mensajes recibidos por la interfaz postMessage se descarten si el origen del mensaje no es confiable o si la sintaxis del mensaje no es válida.
  - **3.5.6:** Verifique que la funcionalidad JSONP no esté habilitada en ninguna parte de la aplicación para evitar ataques de inclusión de scripts entre sitios (XSSI)
  - **3.5.7:** Verificar que los datos que requieren autorización no estén incluidos en las respuestas de recursos de script, como archivos JavaScript, para evitar ataques de inclusión de scripts entre sitios (XSSI )
  - **3.5.8:** Verificar que los recursos autenticados (como imágenes, vídeos, scripts y otros documentos) se puedan cargar o incrustar en nombre del usuario solo cuando sea necesario. Esto se puede lograr mediante la validación estricta de los campos del encabezado de la solicitud HTTP Sec ‑ Fetch‑ * para garantizar que la solicitud no se originó a partir de una llamada inapropiada entre orígenes , o mediante la configuración de un campo restrictivo en el encabezado de respuesta HTTP Cross ‑ Origin ‑ Resource ‑ Política para indicar al navegador que bloquee el contenido devuelto.

- **V3.6 – Integridad de recursos externos**
  - **3.6.1:** Verificar que los recursos del lado del cliente , como bibliotecas JavaScript, CSS o fuentes web, solo se alojen externamente (p. ej., en una Red de Entrega de Contenido) si el recurso es estático y versionado, y se utiliza la Integridad de Subrecursos (SRI) para validar la integridad del recurso. Si esto no es posible, debe existir una decisión de seguridad documentada que lo justifique para cada recurso.

- **V3.7 – Otras consideraciones de seguridad del navegador**
  - **3.7.1:** Verifique que la aplicación solo utilice tecnologías del lado del cliente que aún sean compatibles y se consideren seguras. Entre las tecnologías que no cumplen este requisito se incluyen los complementos NSAPI, Flash, Shockwave, ActiveX, Silverlight, NACL o los applets Java del lado del cliente.
  - **3.7.2:** Verifique que la aplicación solo redirija automáticamente al usuario a un nombre de host o dominio diferente (que no esté controlado por la aplicación) donde el destino aparezca en una lista de permitidos.
  - **3.7.3:** Verificar que la aplicación muestre una notificación cuando el usuario sea redirigido a una URL fuera del control de la aplicación, con una opción para cancelar la navegación
  - **3.7.4:** Verificar que el dominio de nivel superior de la aplicación (p. ej., site.tld) esté incluido en la lista de precarga pública para la Seguridad de Transporte Estricto HTTP (HSTS). Esto garantiza que el uso de TLS para la aplicación se integre directamente en los navegadores principales, en lugar de depender únicamente del campo del encabezado de respuesta de Seguridad de Transporte Estricto .
  - **3.7.5:** Verificar que la aplicación se comporte como se documenta (por ejemplo, advertir al usuario o bloquear el acceso) si el navegador utilizado para acceder a la aplicación no admite las funciones de seguridad esperadas

## V4 API y Servicios Web

- **V4.1 – Seguridad genérica de servicios web**
  - **4.1.1:** Verifique que cada respuesta HTTP con un cuerpo de mensaje contenga un campo de encabezado Content ‑ Type que coincida con el contenido real de la respuesta, incluido el parámetro charset para especificar la codificación de caracteres segura (por ejemplo, UTF ‑ 8, ISO ‑ 8859‑1 ) de acuerdo con los tipos de medios de IANA, como “ text/ ” , “ /+xml ” y “ /xml ” .
  - **4.1.2:** Verificar que solo los endpoints de usuario (destinados al acceso manual desde el navegador web) redirijan automáticamente de HTTP a HTTPS, mientras que otros servicios o endpoints no implementan redirecciones transparentes. Esto evita que un cliente envíe erróneamente solicitudes HTTP sin cifrar, pero al redirigirse automáticamente a HTTPS, la fuga de datos confidenciales no se detecte.
  - **4.1.3:** usuario final no pueda sobrescribir ningún campo de encabezado HTTP utilizado por la aplicación y configurado por una capa intermedia, como un balanceador de carga, un proxy web o un servicio de backend para frontend . Algunos ejemplos de encabezados podrían ser X - IP real , X - Reenviado * o X - ID de usuario .
  - **4.1.4:** Verificar que solo se puedan usar los métodos HTTP que sean explícitamente compatibles con la aplicación o su API (incluidas las OPCIONES durante las solicitudes de verificación previa) y que se bloqueen los métodos no utilizados.
  - **4.1.5:** Verificar que se utilicen firmas digitales por mensaje para brindar seguridad adicional además de las protecciones de transporte para solicitudes o transacciones que sean altamente sensibles o que atraviesen varios sistemas.

- **V4.2 – Validación de la estructura del mensaje HTTP**
  - **4.2.1:** Verificar que todos los componentes de la aplicación (incluidos balanceadores de carga, firewalls y servidores de aplicaciones) determinen los límites de los mensajes HTTP entrantes mediante el mecanismo adecuado para la versión HTTP, a fin de evitar el contrabando de solicitudes HTTP. En HTTP/1.x, si existe un campo de encabezado Transfer - Encoding, se debe ignorar el encabezado Content - Longitud, según RFC 2616. Al usar HTTP/2 o HTTP/3, si existe un campo de encabezado Content - Longitud, el receptor debe asegurarse de que sea coherente con la longitud de las tramas de DATOS.
  - **4.2.2:** Verificar que al generar mensajes HTTP, el campo de encabezado Contenido - Longitud no entre en conflicto con la longitud del contenido según lo determinado por el encuadre del protocolo HTTP, con el fin de evitar ataques de contrabando de solicitudes.
  - **4.2.3:** Verifique que la aplicación no envíe ni acepte mensajes HTTP/2 o HTTP/3 con campos de encabezado específicos de la conexión , como Transferencia - Codificación, para evitar la división de la respuesta y los ataques de inyección de encabezado.
  - **4.2.4:** Verifique que la aplicación solo acepte solicitudes HTTP/2 y HTTP/3 donde los campos y valores del encabezado no contengan secuencias CR (\r), LF (\n) o CRLF (\r\n), para evitar ataques de inyección de encabezado.
  - **4.2.5:** Verificar que, si la aplicación (backend o frontend) compila y envía solicitudes, utilice validación, sanitización u otros mecanismos para evitar la creación de URI (por ejemplo, para llamadas a la API) o campos de encabezado de solicitud HTTP (como Autorización o Cookie) demasiado largos para ser aceptados por el componente receptor. Esto podría causar una denegación de servicio, como al enviar una solicitud demasiado larga (por ejemplo, un campo de encabezado de cookie demasiado largo), lo que hace que el servidor siempre responda con un estado de error.

- **V4.3 – GraphQL**
  - **4.3.1:** Verifique que se utilice una lista de consultas permitidas, una limitación de profundidad, una limitación de cantidad o un análisis de costos de consulta para evitar la denegación de servicio (DoS) de GraphQL o de expresiones de la capa de datos como resultado de consultas anidadas y costosas.
  - **4.3.2:** Verifique que las consultas de introspección de GraphQL estén deshabilitadas en el entorno de producción a menos que la API de GraphQL esté destinada a ser utilizada por otras partes.

- **V4.4 – WebSocket**
  - **4.4.1:** Verifique que se utilice WebSocket sobre TLS (WSS) para todas las conexiones WebSocket.
  - **4.4.2:** Verifique que, durante el protocolo de enlace HTTP WebSocket inicial, el campo de encabezado Origen se compare con una lista de orígenes permitidos para la aplicación.
  - **4.4.3:** Verificar que, si no se puede utilizar la gestión de sesiones estándar de la aplicación, se estén utilizando tokens dedicados para ello, que cumplan con los requisitos de seguridad de Gestión de sesiones pertinentes.
  - **4.4.4:** Verifique que los tokens de administración de sesiones WebSocket dedicados se obtengan o validen inicialmente a través de la sesión HTTPS previamente autenticada al realizar la transición de una sesión HTTPS existente a un canal WebSocket.
    
## V5 Manejo de Archivos

- **V5.1 – Documentación de manejo de archivos**
  - **5.1.1:** Verifique que la documentación defina los tipos de archivo permitidos, las extensiones de archivo esperadas y el tamaño máximo (incluido el tamaño descomprimido) para cada función de carga. Además, asegúrese de que la documentación especifique cómo se garantiza la seguridad de los archivos para que los usuarios finales los descarguen y procesen, por ejemplo, cómo se comporta la aplicación cuando se detecta un archivo malicioso.

- **V5.2 – Carga de archivos y contenido**
  - **5.2.1:** Verifique que la aplicación solo acepte archivos de un tamaño que pueda procesar sin causar una pérdida de rendimiento o un ataque de denegación de servicio.
  - **5.2.2:** Verificar que, al aceptar un archivo, ya sea solo o dentro de un archivo comprimido (como un archivo zip), la aplicación compruebe si la extensión coincide con la esperada y valide que el contenido corresponda al tipo representado por la extensión. Esto incluye, entre otras cosas, la comprobación de los "bytes mágicos" iniciales, la reescritura de imágenes y el uso de bibliotecas especializadas para la validación del contenido de los archivos. Para L1, esto puede centrarse únicamente en los archivos utilizados para tomar decisiones comerciales o de seguridad específicas. Para L2 y superiores, esto debe aplicarse a todos los archivos aceptados.
  - **5.2.3:** Verifique que la aplicación compare los archivos comprimidos (por ejemplo, zip, gz, docx, odt) con el tamaño máximo permitido sin comprimir y con la cantidad máxima de archivos antes de descomprimir el archivo.
  - **5.2.4:** Verifique que se aplique una cuota de tamaño de archivo y una cantidad máxima de archivos por usuario para garantizar que un solo usuario no pueda llenar el almacenamiento con demasiados archivos o archivos excesivamente grandes.
  - **5.2.5:** Verificar que la aplicación no permita cargar archivos comprimidos que contengan enlaces simbólicos a menos que esto sea específicamente requerido (en cuyo caso será necesario implementar una lista blanca de los archivos a los que se pueden enlazar simbólicamente)
     **5.2.6:** Verificar que la aplicación rechace las imágenes cargadas con un tamaño de píxel mayor al máximo permitido, para evitar ataques de inundación de píxeles.

- **V5.3 – Almacenamiento de archivos**
  - **5.3.1:** Verificar que los archivos cargados o generados por entradas no confiables y almacenados en una carpeta pública no se ejecuten como código de programa del lado del servidor cuando se accede a ellos directamente con una solicitud HTTP
  - **5.3.2:** utilice datos generados internamente o confiables, en lugar de nombres de archivo proporcionados por el usuario. Si se deben usar nombres de archivo o metadatos proporcionados por el usuario , se aplique una validación y un saneamiento estrictos. Esto protege contra ataques de cruce de rutas, inclusión de archivos local o remota (LFI, RFI) y falsificación de solicitud del lado del servidor ( SSRF).
  - **5.3.3:** Verifique que el procesamiento de archivos del lado del servidor , como la descompresión de archivos, ignore la información de ruta proporcionada por el usuario para evitar vulnerabilidades como el error zip.

- **V5.4 – Descarga de archivos**
  - **5.4.1:** Verifique que la aplicación valide o ignore los nombres de archivos enviados por el usuario , incluso en un parámetro JSON, JSONP o URL, y especifique un nombre de archivo en el campo de encabezado Contenido - Disposición en la respuesta.
  - **5.4.2:** Verificar que los nombres de archivos servidos (por ejemplo, en los campos de encabezado de respuesta HTTP o archivos adjuntos de correo electrónico) estén codificados o desinfectados (por ejemplo, siguiendo RFC 6266) para preservar la estructura del documento y evitar ataques de inyección.
  - **5.4.3:** Verificar que los archivos obtenidos de fuentes no confiables sean analizados por escáneres antivirus para evitar la distribución de contenido malicioso conocido.

## V6 Autenticación

- **V6.1 – Documentación de autenticación**
  - **6.1.1:** Verificar que la documentación de la aplicación defina cómo se utilizan controles como la limitación de velocidad, la antiautomatización y la respuesta adaptativa para defenderse de ataques como el robo de credenciales y el robo de contraseñas por fuerza bruta. La documentación debe aclarar cómo se configuran estos controles y cómo se previene el bloqueo malicioso de cuentas.
  - **6.1.2:** Verificar que se documente una lista de palabras específicas del contexto para evitar su uso en contraseñas. La lista podría incluir combinaciones de nombres de organizaciones, productos, identificadores de sistema, nombres en clave de proyectos, departamentos o roles, etc.
  - **6.1.3:** Verificar que, si la aplicación incluye múltiples rutas de autenticación, todas ellas estén documentadas junto con los controles de seguridad y la fortaleza de la autenticación que deben aplicarse de manera consistente en todas ellas.

- **V6.2 – Seguridad de contraseña**
  - **6.2.1:** Verifique que las contraseñas establecidas por el usuario tengan al menos 8 caracteres de longitud, aunque se recomienda enfáticamente un mínimo de 15 caracteres.
  - **6.2.2:** Verificar que los usuarios puedan cambiar su contraseña.
  - **6.2.3:** Verificar que la funcionalidad de cambio de contraseña requiera la contraseña actual y la nueva del usuario.
  - **6.2.4:** Verificar que las contraseñas enviadas durante el registro de la cuenta o el cambio de contraseña se comparen con un conjunto disponible de, al menos, las 3000 contraseñas principales que coincidan con la política de contraseñas de la aplicación, por ejemplo, la longitud mínima.
  - **6.2.5:** Verificar que se puedan usar contraseñas de cualquier composición, sin reglas que limiten el tipo de caracteres permitidos. No debe haber un requisito de un número mínimo de mayúsculas o minúsculas, números ni caracteres especiales.
  - **6.2.6:** Verifique que los campos de entrada de contraseña usen "type=password" para enmascarar la entrada. Las aplicaciones pueden permitir al usuario ver temporalmente la contraseña enmascarada completa o el último carácter ingresado.
  - **6.2.7:** Verifique que la funcionalidad de “pegar”, los asistentes de contraseña del navegador y los administradores de contraseñas externos estén permitidos.
  - **6.2.8:** Verificar que la aplicación verifique la contraseña del usuario exactamente como la recibió del usuario, sin ninguna modificación como truncamiento o transformación de mayúsculas y minúsculas.
  - **6.2.9:** Verificar que se permitan contraseñas de al menos 64 caracteres.
  - **6.2.10:** Verificar que la contraseña de un usuario siga siendo válida hasta que se descubra que está comprometida o el usuario la cambie. La aplicación no debe requerir la rotación periódica de credenciales.
  - **6.2.11:** Verifique que se utilice la lista documentada de palabras específicas del contexto para evitar la creación de contraseñas fáciles de adivinar.
  - **6.2.12:** Verificar que las contraseñas enviadas durante el registro de la cuenta o los cambios de contraseña se comparen con un conjunto de contraseñas violadas.

- **V6.3 – Seguridad de autenticación general**
  - **6.3.1:** Verificar que los controles para prevenir ataques como el robo de credenciales y el robo de contraseñas por fuerza bruta se implementen de acuerdo con la documentación de seguridad de la aplicación.
  - **6.3.2:** Verifique que las cuentas de usuario predeterminadas (por ejemplo, “root”, “admin” o “sa”) no estén presentes en la aplicación o estén deshabilitadas.
  - **6.3.3:** Verificar que se utilice un mecanismo de autenticación multifactor o una combinación de mecanismos de autenticación de un solo factor para acceder a la aplicación. Para la capa 3, uno de los factores debe ser un mecanismo de autenticación basado en hardware que ofrezca resistencia a ataques de phishing, a la vez que verifica la intención de autenticarse mediante una acción iniciada por el usuario ( como pulsar un botón en una llave de hardware FIDO o un teléfono móvil). La flexibilización de cualquiera de las consideraciones de este requisito requiere una justificación completamente documentada y un conjunto integral de controles de mitigación.
  - **6.3.4:** Verificar que, si la aplicación incluye múltiples rutas de autenticación, no haya rutas no documentadas y que los controles de seguridad y la fortaleza de la autenticación se apliquen de manera consistente.
  - **6.3.5:** Verificar que se notifique a los usuarios sobre intentos de autenticación sospechosos (exitosos o fallidos). Esto puede incluir intentos de autenticación desde una ubicación o cliente inusual, autenticación parcialmente exitosa (solo uno de varios factores), un intento de autenticación tras un largo periodo de inactividad o una autenticación exitosa tras varios intentos fallidos.
  - **6.3.6:** Verificar que el correo electrónico no se utilice como mecanismo de autenticación de un solo factor o de múltiples factores
  - **6.3.7:** Verificar que los usuarios sean notificados después de las actualizaciones de los detalles de autenticación, como restablecimientos de credenciales o modificación del nombre de usuario o dirección de correo electrónico.
  - **6.3.8:** Verificar que no se puedan deducir usuarios válidos a partir de intentos de autenticación fallidos, como por ejemplo, basándose en mensajes de error, códigos de respuesta HTTP o tiempos de respuesta diferentes. Las funciones de registro y de olvido de contraseña también deben contar con esta protección.

- **V6.4 – Ciclo de vida y recuperación del factor de autenticación**
  - **6.4.1:** Verificar que las contraseñas iniciales o los códigos de activación generados por el sistema se generen de forma aleatoria y segura, cumplan con la política de contraseñas vigente y caduquen al cabo de un corto periodo o tras su primer uso. No se debe permitir que estas contraseñas iniciales se conviertan en la contraseña permanente.
  - **6.4.2:** no existan sugerencias de contraseñas o autenticación basada en conocimiento ( las llamadas “ preguntas secretas ” ).
  - **6.4.3:** Verificar que se implemente un proceso seguro para restablecer una contraseña olvidada, que no omita ningún mecanismo de autenticación multifactor habilitado .
  - **6.4.4:** Verificar que si se pierde un factor de autenticación multifactor , la evidencia de verificación de identidad se realice al mismo nivel que durante la inscripción.
  - **6.4.5:** Verificar que las instrucciones de renovación de los mecanismos de autenticación que expiran se envíen con tiempo suficiente para que se lleven a cabo antes de que expire el antiguo mecanismo de autenticación, configurando recordatorios automáticos si es necesario.
  - **6.4.6:** Verificar que los usuarios administrativos puedan iniciar el proceso de restablecimiento de contraseña, pero que esto no les permita cambiar ni elegir la contraseña del usuario. Esto evita que conozcan la contraseña del usuario.

- **V6.5 – Multifactor general**
  - **6.5.1:** Verificar que los secretos de búsqueda, las solicitudes o códigos de autenticación fuera de banda y las contraseñas de un solo uso basadas en el tiempo (TOTP) solo se puedan usar con éxito una vez.
  - **6.5.2:** Verificar que, al almacenarse en el backend de la aplicación, los secretos de búsqueda con menos de 112 bits de entropía (19 caracteres alfanuméricos aleatorios o 34 dígitos aleatorios) se hayan hashizado con un algoritmo de hash de almacenamiento de contraseñas aprobado que incorpore una sal aleatoria de 32 bits . Se puede usar una función hash estándar si el secreto tiene 112 bits de entropía o más.
  - **6.5.3:** Verifique que los secretos de búsqueda, el código de autenticación fuera de banda y las semillas de contraseñas de un solo uso basadas en el tiempo se generen utilizando un generador de números pseudoaleatorios criptográficamente seguro (CSPRNG) para evitar valores predecibles.
  - **6.5.4:** Verifique que los secretos de búsqueda y los códigos de autenticación fuera de banda tengan un mínimo de 20 bits de entropía (normalmente, 4 caracteres alfanuméricos aleatorios o 6 dígitos aleatorios son suficientes).
  - **6.5.5:** Verificar que las solicitudes, códigos o tokens de autenticación fuera de banda , así como las contraseñas de un solo uso basadas en tiempo (TOTP), tengan una duración definida. Las solicitudes fuera de banda deben tener una duración máxima de 10 minutos y las TOTP, de 30 segundos.
  - **6.5.6:** Verificar que cualquier factor de autenticación (incluidos los dispositivos físicos) pueda revocarse en caso de robo u otra pérdida
  - **6.5.7:** Verificar que los mecanismos de autenticación biométrica solo se utilicen como factores secundarios junto con algo que usted tiene o algo que usted sabe
  - **6.5.8:** Verifique que las contraseñas de un solo uso basadas en tiempo (TOTP) se verifiquen en función de una fuente de tiempo de un servicio confiable y no de un tiempo no confiable o proporcionado por el cliente.

- **V6.6 – Mecanismos de autenticación fuera de banda**
  - **6.6.1:** Verificar que los mecanismos de autenticación que utilizan la Red Telefónica Pública Conmutada (RTPC) para enviar contraseñas de un solo uso (OTP) por teléfono o SMS solo se ofrezcan cuando el número de teléfono se haya validado previamente, que también se ofrezcan métodos alternativos más seguros (como las contraseñas de un solo uso basadas en tiempo ) y que el servicio proporcione información sobre sus riesgos de seguridad para los usuarios. Para las aplicaciones L3, el teléfono y los SMS no deben estar disponibles como opciones.
  - **6.6.2:** Verificar que las solicitudes de autenticación fuera de banda , los códigos o tokens estén vinculados a la solicitud de autenticación original para la que se generaron y no sean utilizables para una anterior o posterior.
  - **6.6.3:** Verificar que un mecanismo de autenticación fuera de banda basado en código esté protegido contra ataques de fuerza bruta mediante limitación de velocidad. Considere también usar un código con al menos 64 bits de entropía.
  - **6.6.4:** Verificar que, cuando se utilicen notificaciones push para la autenticación multifactor , se aplique una limitación de velocidad para evitar ataques de push bombing. La coincidencia de números también puede mitigar este riesgo.
- **V6.7 – Mecanismo de autenticación criptográfica**
  - **6.7.1:** Verificar que los certificados utilizados para verificar las afirmaciones de autenticación criptográfica se almacenen de manera que estén protegidos contra modificaciones.
  - **6.7.2:** Verifique que el nonce de desafío tenga al menos 64 bits de longitud y sea estadísticamente único o único durante la vida útil del dispositivo criptográfico.

- **V6.8 – Autenticación con un proveedor de identidad**
  - **6.8.1:** Verificar que, si la aplicación admite varios proveedores de identidad (IdP), la identidad del usuario no pueda suplantarse mediante otro proveedor compatible (por ejemplo, utilizando el mismo identificador de usuario). La mitigación estándar sería que la aplicación registre e identifique al usuario mediante una combinación del ID del IdP (que actúa como espacio de nombres) y el ID del usuario en el IdP.
  - **6.8.2:** Verificar que la presencia e integridad de las firmas digitales en las afirmaciones de autenticación (por ejemplo en JWT o afirmaciones SAML) estén siempre validadas, rechazando cualquier afirmación que no esté firmada o que tenga firmas no válidas.
  - **6.8.3:** Verifique que las afirmaciones SAML se procesen de manera única y se utilicen solo una vez dentro del período de validez para evitar ataques de repetición.
  - **6.8.4:** Verificar que, si una aplicación utiliza un Proveedor de Identidad (IdP) independiente y espera una fuerza de autenticación, métodos o antigüedad específicos para funciones específicas, la aplicación lo verifique utilizando la información devuelta por el IdP. Por ejemplo, si se utiliza OIDC, esto podría lograrse validando las declaraciones de token de identificación como 'acr', 'amr' y 'auth_time' (si existen). Si el IdP no proporciona esta información, la aplicación debe contar con un enfoque de respaldo documentado que asuma que se utilizó el mecanismo de autenticación de fuerza mínima (por ejemplo, autenticación de un solo factor con nombre de usuario y contraseña).

## V7 Gestión de sesiones

- **V7.1 – Documentación de gestión de sesiones**
  - **7.1.1:** Verificar que el tiempo de inactividad de la sesión del usuario y la duración máxima absoluta de la sesión estén documentados, sean apropiados en combinación con otros controles y que la documentación incluya una justificación para cualquier desviación de los requisitos de reautenticación de NIST SP 800-63B .
  - **7.1.2:** Verifique que la documentación defina cuántas sesiones simultáneas (paralelas) están permitidas para una cuenta, así como los comportamientos y acciones previstos que se deben tomar cuando se alcanza el número máximo de sesiones activas.
  - **7.1.3:** Verificar que todos los sistemas que crean y administran sesiones de usuario como parte de un ecosistema de gestión de identidad federada (como los sistemas SSO) estén documentados junto con los controles para coordinar la duración de las sesiones, la finalización y cualquier otra condición que requiera una nueva autenticación .

- **V7.2 – Seguridad fundamental en la gestión de sesiones**
  - **7.2.1:** Verifique que la aplicación realice toda la verificación del token de sesión utilizando un servicio backend confiable.
  - **7.2.2:** Verifique que la aplicación utilice tokens autónomos o de referencia que se generen dinámicamente para la gestión de sesiones, es decir, que no utilicen claves y secretos de API estáticos.
  - **7.2.3:** Verificar que si se utilizan tokens de referencia para representar sesiones de usuario, sean únicos y generados utilizando un generador de números pseudoaleatorios criptográficamente seguro ( CSPRNG) y posean al menos 128 bits de entropía.
  - **7.2.4:** Verificar que la aplicación genere un nuevo token de sesión durante la autenticación del usuario, incluida la nueva autenticación , y finalice el token de sesión actual.

- **V7.3 – Tiempo de espera de sesión**
  - **7.3.1:** Verificar que exista un tiempo de espera de inactividad tal que se aplique la nueva autenticación de acuerdo con el análisis de riesgos y las decisiones de seguridad documentadas .
  - **7.3.2:** Verificar que exista una duración máxima absoluta de sesión tal que la nueva autenticación se aplique de acuerdo con el análisis de riesgos y las decisiones de seguridad documentadas.

- **V7.4 – Terminación de sesión**
  - **7.4.1:** Verificar que, al activarse la finalización de la sesión (como el cierre de sesión o la expiración), la aplicación desactive cualquier uso posterior de la sesión. Para tokens de referencia o sesiones con estado, esto implica invalidar los datos de la sesión en el backend de la aplicación. Las aplicaciones que utilizan tokens autocontenidos necesitarán una solución, como mantener una lista de tokens finalizados, deshabilitar los tokens generados antes de una fecha y hora por usuario o rotar una clave de firma por usuario .
  - **7.4.2:** Verificar que la aplicación finalice todas las sesiones activas cuando se deshabilita o elimina una cuenta de usuario (por ejemplo, cuando un empleado abandona la empresa).
  - **7.4.3:** Verifique que la aplicación brinde la opción de finalizar todas las demás sesiones activas después de un cambio o eliminación exitoso de cualquier factor de autenticación (incluido el cambio de contraseña mediante restablecimiento o recuperación y, si está presente, una actualización de la configuración de MFA).
  - **7.4.4:** Verificar que todas las páginas que requieren autenticación tengan acceso fácil y visible a la funcionalidad de cierre de sesión.
  - **7.4.5:** Verificar que los administradores de aplicaciones puedan finalizar sesiones activas para un usuario individual o para todos los usuarios.

- **V7.5 – Defensas contra el abuso de sesiones**
  - **7.5.1:** Verifique que la aplicación requiera una nueva autenticación completa antes de permitir modificaciones en atributos de cuenta sensibles que puedan afectar la autenticación, como dirección de correo electrónico, número de teléfono, configuración de MFA u otra información utilizada en la recuperación de la cuenta.
  - **7.5.2:** Verificar que los usuarios puedan ver y (habiéndose autenticado nuevamente con al menos un factor) finalizar cualquiera o todas las sesiones actualmente activas.
  - **7.5.3:** Verificar que la aplicación requiera autenticación adicional con al menos un factor o verificación secundaria antes de realizar transacciones u operaciones altamente sensibles.
    
- **V7.6 – Reautenticación Federada**
  - **7.6.1:** Verificar que la duración y la finalización de la sesión entre las partes confiables (RP) y los proveedores de identidad (IdP) se comporten según lo documentado, requiriendo una nueva autenticación según sea necesario, como cuando se alcanza el tiempo máximo entre eventos de autenticación de IdP.
  - **7.6.2:** Verificar que la creación de una sesión requiera el consentimiento del usuario o una acción explícita, evitando la creación de nuevas sesiones de aplicación sin interacción del usuario.

## V8 Autorización

- **V8.1 – Documentación de autorización**
  - **8.1.1:** Verificar que la documentación de autorización defina reglas para restringir el acceso a nivel de función y a datos específicos según los permisos del consumidor y los atributos de los recursos.
  - **8.1.2:** Verifique que la documentación de autorización defina reglas para las restricciones de acceso a nivel de campo (tanto de lectura como de escritura) según los permisos del consumidor y los atributos del recurso. Tenga en cuenta que estas reglas pueden depender de otros valores de atributo del objeto de datos relevante, como el estado.
  - **8.1.3:** Verificar que la documentación de la aplicación defina los atributos ambientales y contextuales (incluidos, entre otros, la hora del día, la ubicación del usuario, la dirección IP o el dispositivo) que se utilizan en la aplicación para tomar decisiones de seguridad, incluidas las relacionadas con la autenticación y la autorización.
  - **8.1.4:** Verificar que la documentación de autenticación y autorización defina cómo se utilizan los factores ambientales y contextuales en la toma de decisiones , además de la autorización a nivel de función , específica de datos y de campo . Esto debe incluir los atributos evaluados, los umbrales de riesgo y las medidas adoptadas (p. ej., permitir, cuestionar, denegar, autenticación reforzada) .

- **V8.2 – Diseño de autorización general**
  - **8.2.1:** Verifique que la aplicación garantice que el acceso a nivel de función esté restringido a los consumidores con permisos explícitos.
  - **8.2.2:** Verifique que la aplicación garantice que el acceso específico a los datos esté restringido a los consumidores con permisos explícitos a elementos de datos específicos para mitigar la referencia directa a objetos insegura (IDOR) y la autorización a nivel de objeto rota (BOLA).
  - **8.2.3:** Verifique que la aplicación garantice que el acceso a nivel de campo esté restringido a consumidores con permisos explícitos para campos específicos para mitigar la autorización a nivel de propiedad de objeto rota (BOPLA).
  - **8.2.4:** Verificar que se implementen controles de seguridad adaptativos basados en los atributos ambientales y contextuales del consumidor (como la hora del día, la ubicación, la dirección IP o el dispositivo) para las decisiones de autenticación y autorización, según se define en la documentación de la aplicación. Estos controles deben aplicarse cuando el consumidor intenta iniciar una nueva sesión y también durante una sesión existente.

- **V8.3 – Autorización de nivel de operación**
  - **8.3.1:** Verifique que la aplicación aplique reglas de autorización en una capa de servicio confiable y no dependa de controles que un consumidor no confiable podría manipular, como JavaScript del lado del cliente.
  - **8.3.2:** Verificar que los cambios en los valores que rigen las decisiones de autorización se apliquen de inmediato. Cuando los cambios no se puedan aplicar de inmediato (por ejemplo, al depender de datos en tokens autocontenidos ) , deben existir controles de mitigación para alertar cuando un consumidor realiza una acción sin estar autorizado y revertir el cambio. Cabe destacar que esta alternativa no mitigaría la fuga de información.
  - **8.3.3:** Verificar que el acceso a un objeto se base en los permisos del sujeto de origen (p. ej., del consumidor), no en los permisos de ningún intermediario o servicio que actúe en su nombre. Por ejemplo, si un consumidor llama a un servicio web utilizando un token autónomo para la autenticación, y el servicio solicita datos de otro servicio, este último utilizará el token del consumidor , en lugar del token de máquina a máquina del primer servicio, para tomar decisiones sobre los permisos.

- **V8.4 – Otras consideraciones de autorización**
  - **8.4.1:** Verificar que las aplicaciones multiinquilino utilicen controles entre inquilinos para garantizar que las operaciones de los consumidores nunca afecten a los inquilinos con los que no tienen permisos para interactuar.
  - **8.4.2:** Verificar que el acceso a las interfaces administrativas incorpore múltiples capas de seguridad, incluida la verificación continua de la identidad del consumidor, la evaluación de la postura de seguridad del dispositivo y el análisis de riesgo contextual, asegurando que la ubicación de la red o los puntos finales confiables no sean los únicos factores para la autorización, aunque puedan reducir la probabilidad de acceso no autorizado.

## V9 Tokens autónomos

- **V9.1 – Origen e integridad del token**
  - **9.1.1:** Verifique que los tokens autónomos estén validados mediante su firma digital o MAC para protegerlos contra manipulaciones antes de aceptar el contenido del token.
  - **9.1.2:** Verificar que solo los algoritmos de una lista de permitidos puedan usarse para crear y verificar tokens autónomos en un contexto determinado. La lista de permitidos debe incluir los algoritmos permitidos, idealmente solo algoritmos simétricos o asimétricos, y no debe incluir el algoritmo " Ninguno " . Si se deben admitir tanto algoritmos simétricos como asimétricos, se necesitarán controles adicionales para evitar la confusión de claves.
  - **9.1.3:** Verificar que el material de claves utilizado para validar tokens autónomos provenga de fuentes confiables preconfiguradas para el emisor del token, lo que evita que los atacantes especifiquen fuentes y claves no confiables. Para JWT y otras estructuras JWS, los encabezados como « jku » , « x5u » y « jwk » deben validarse con una lista de fuentes confiables permitidas.

- **V9.2 – Contenido del token**
  - **9.2.1:** Verificar que, si existe un período de validez en los datos del token, este y su contenido solo se acepten si el tiempo de verificación se encuentra dentro de dicho período. Por ejemplo, para los JWT, las declaraciones «nbf» y «exp» deben verificarse.
  - **9.2.2:** Verificar que el servicio que recibe un token lo valide como del tipo correcto y esté destinado al propósito previsto antes de aceptar su contenido. Por ejemplo, solo se aceptan tokens de acceso para decisiones de autorización y solo se pueden usar tokens de identificación para comprobar la autenticación del usuario.
  - **9.2.3:** Verificar que el servicio solo acepte tokens destinados a ese servicio (audiencia). Para los JWT, esto se puede lograr validando la declaración "aud" con una lista de permitidos definida en el servicio.
  - **9.2.4:** Verificar que, si un emisor de tokens utiliza la misma clave privada para emitir tokens a diferentes audiencias, los tokens emitidos contengan una restricción de audiencia que identifique de forma única a las audiencias previstas. Esto evitará que un token se reutilice con una audiencia no prevista. Si el identificador de audiencia se aprovisiona dinámicamente, el emisor de tokens debe validar estas audiencias para garantizar que no resulten en suplantación de la identidad de la audiencia.

## V10 OAuth y OIDC

- **V10.1 – Seguridad genérica de OAuth y OIDC**
  - **10.1.1:** Verificar que los tokens solo se envíen a los componentes que estrictamente los necesitan. Por ejemplo, al usar un patrón de backend a frontend para aplicaciones JavaScript basadas en navegador , los tokens de acceso y actualización solo serán accesibles para el backend.
  - **10.1.2:** Verificar que el cliente solo acepte valores del servidor de autorización (como el código de autorización o el token de identificación) si estos provienen de un flujo de autorización iniciado por la misma sesión del agente de usuario y transacción. Esto requiere que los secretos generados por el cliente , como la clave de prueba para el intercambio de código (PKCE) " code_verifier " , " state " o el " nonce " de OIDC , sean indescifrables, específicos de la transacción y estén vinculados de forma segura tanto al cliente como a la sesión del agente de usuario en la que se inició la transacción.

- **V10.2 – Cliente OAuth**
  - **10.2.1:** Verificar que, si se utiliza el flujo de código, el cliente OAuth tenga protección contra ataques de falsificación de solicitud basados en el navegador, comúnmente conocidos como falsificación de solicitud entre sitios ( CSRF), que activan solicitudes de token, ya sea mediante el uso de la funcionalidad de clave de prueba para intercambio de código (PKCE) o verificando el parámetro " estado " que se envió en la solicitud de autorización.
  - **10.2.2:** Verificar que, si el cliente OAuth puede interactuar con más de un servidor de autorización, cuente con una protección contra ataques de confusión . Por ejemplo, podría requerir que el servidor de autorización devuelva el valor del parámetro " iss " y lo valide en la respuesta de autorización y en la respuesta del token.
  - **10.2.3:** Verifique que el cliente OAuth solo solicite los alcances requeridos (u otros parámetros de autorización) en las solicitudes al servidor de autorización.

- **V10.3 – Servidor de recursos OAuth**
  - **10.3.1:** Verifique que el servidor de recursos solo acepte tokens de acceso destinados a ese servicio (audiencia). La audiencia puede estar incluida en un token de acceso estructurado (como la declaración "aud" en JWT) o puede verificarse mediante el punto final de introspección de tokens.
  - **10.3.2:** Verifique que el servidor de recursos aplique las decisiones de autorización según las solicitudes del token de acceso que definen la autorización delegada. Si existen solicitudes como "sub", "scope" y "authorization_details", deben formar parte de la decisión.
  - **10.3.3:** Verificar que, si una decisión de control de acceso requiere la identificación de un usuario único a partir de un token de acceso (JWT o respuesta de introspección de token relacionado), el servidor de recursos identifique al usuario a partir de reclamaciones que no se puedan reasignar a otros usuarios. Normalmente, esto implica usar una combinación de reclamaciones "iss" y "sub".
  - **10.3.4:** Verificar que, si el servidor de recursos requiere una fuerza de autenticación, métodos o fecha de actualización específicos, verifique que el token de acceso presentado cumpla con estas restricciones. Por ejemplo, si está presente, mediante las declaraciones OIDC 'acr', 'amr' y 'auth_time', respectivamente.
  - **10.3.5:** Verifique que el servidor de recursos evite el uso de tokens de acceso robados o la reproducción de tokens de acceso (de partes no autorizadas) al requerir tokens de acceso restringidos por el remitente , ya sea Mutual TLS para OAuth 2 o OAuth 2 Demonstration of Proof of Possession (DPoP).

- **V10.4 – Servidor de autorización OAuth**
  - **10.4.1:** Verificar que el servidor de autorización valide los URI de redireccionamiento basándose en una lista blanca específica del cliente de URI previamente registrados mediante una comparación de cadenas exacta.
  - **10.4.2:** Verificar que, si el servidor de autorización devuelve el código de autorización en la respuesta de autorización, este solo se pueda usar una vez para una solicitud de token. Para la segunda solicitud válida con un código de autorización que ya se haya utilizado para emitir un token de acceso, el servidor de autorización debe rechazar la solicitud de token y revocar cualquier token emitido relacionado con el código de autorización.
  - **10.4.3:** Verifique que el código de autorización sea de corta duración . La duración máxima puede ser de hasta 10 minutos para aplicaciones L1 y L2, y de hasta 1 minuto para aplicaciones L3.
  - **10.4.4:** Verifique que, para un cliente determinado, el servidor de autorización solo permita el uso de las concesiones que este cliente necesita. Tenga en cuenta que las concesiones «token» (flujo implícito) y «password» (flujo de credenciales de contraseña del propietario del recurso) ya no deben utilizarse.
  - **10.4.5:** Verificar que el servidor de autorización mitigue los ataques de repetición de tokens de actualización para clientes públicos, preferiblemente utilizando tokens de actualización restringidos por el remitente, como la Prueba de Posesión (DPoP) o tokens de acceso vinculados al certificado mediante TLS mutuo (mTLS). Para aplicaciones L1 y L2, se puede utilizar la rotación de tokens de actualización. Si se utiliza la rotación de tokens de actualización, el servidor de autorización debe invalidar el token de actualización después de su uso y revocar todos los tokens de actualización para esa autorización si se proporciona un token de actualización ya utilizado e invalidado.
  - **10.4.6:** Verificar que, si se utiliza la concesión de código, el servidor de autorización mitiga los ataques de interceptación de código de autorización mediante la exigencia de una clave de prueba para el intercambio de código (PKCE). Para las solicitudes de autorización, el servidor de autorización debe exigir un valor válido de "code_challenge" y no debe aceptar un valor "plain" de "code_challenge_method". Para una solicitud de token, debe exigir la validación del parámetro "code_verifier".
  - **10.4.7:** Verificar que, si el servidor de autorización admite el registro dinámico de clientes no autenticados, mitiga el riesgo de aplicaciones cliente maliciosas. Debe validar los metadatos del cliente, como cualquier URI registrado, garantizar el consentimiento del usuario y advertirle antes de procesar una solicitud de autorización con una aplicación cliente no confiable.
  - **10.4.8:** Verificar que los tokens de actualización tengan una caducidad absoluta, incluso si se aplica una caducidad de token de actualización deslizante.
  - **10.4.9:** Verificar que los tokens de actualización y los tokens de acceso de referencia puedan ser revocados por un usuario autorizado mediante la interfaz de usuario del servidor de autorización, para mitigar el riesgo de clientes maliciosos o tokens robados.
  - **10.4.10:** Verifique que el cliente confidencial esté autenticado para las solicitudes de canal de retorno del cliente al servidor autorizado , como solicitudes de token, solicitudes de autorización enviadas (PAR) y solicitudes de revocación de token.
  - **10.4.11:** Verifique que la configuración del servidor de autorización solo asigne los alcances requeridos al cliente OAuth.
  - **10.4.12:** Verificar que, para un cliente determinado, el servidor de autorización solo permita el valor 'response_mode' que este cliente necesita usar. Por ejemplo, haciendo que el servidor de autorización valide este valor comparándolo con los valores esperados o utilizando una solicitud de autorización enviada (PAR) o una solicitud de autorización protegida por JWT (JAR).
  - **10.4.13:** Verificar que el tipo de concesión 'código' siempre se utilice junto con las solicitudes de autorización enviadas (PAR)
10.4.14:** Verificar que el servidor de autorización emita únicamente tokens de acceso restringidos por el remitente ( prueba de posesión ) , ya sea con tokens de acceso vinculados a certificado mediante TLS mutuo (mTLS) o tokens de acceso vinculados a DPoP ( demostración de prueba de posesión).
  - **10.4.15:** Verificar que, para un cliente del lado del servidor ( que no se ejecuta en el dispositivo del usuario final), el servidor de autorización garantice que el valor del parámetro " authorization_details " provenga del backend del cliente y que el usuario no lo haya manipulado. Por ejemplo, exigiendo el uso de una solicitud de autorización enviada (PAR) o una solicitud de autorización protegida por JWT (JAR).
  - **10.4.16:** Verificar que el cliente sea confidencial y que el servidor de autorización requiera el uso de métodos de autenticación de cliente fuertes (basados en criptografía de clave pública y resistentes a ataques de repetición), como TLS mutuo ( ' tls_client_auth ' , ' self_signed_tls_client_auth ' ) o JWT de clave privada ( ' private_key_jwt ' ).

- **V10.5 – Cliente OIDC**
  - **10.5.1:** Verificar que el cliente (como parte de confianza) mitigue los ataques de repetición del token de identificación. Por ejemplo, asegurándose de que la declaración "nonce" del token de identificación coincida con el valor "nonce" enviado en la solicitud de autenticación al proveedor de OpenID (en OAuth2, se denomina solicitud de autorización enviada al servidor de autorización).
  - **10.5.2:** Verificar que el cliente identifique de forma única al usuario a partir de las reclamaciones de token de identificación, generalmente la reclamación "sub", que no se puede reasignar a otros usuarios (para el alcance de un proveedor de identidad).
  - **10.5.3:** Verifique que el cliente rechace los intentos de un servidor de autorización malicioso de suplantar la identidad de otro servidor de autorización mediante sus metadatos. El cliente debe rechazar los metadatos si la URL del emisor en dichos metadatos no coincide exactamente con la URL del emisor preconfigurada que espera el cliente.
  - **10.5.4:** Verifique que el cliente valide que el token de identificación esté destinado a ser utilizado para ese cliente (audiencia) verificando que la declaración 'aud' del token sea igual al valor 'client_id' para el cliente.
  - **10.5.5:** Verificar que, al usar el cierre de sesión del canal de retorno de OIDC , el usuario de confianza mitigue la denegación de servicio mediante el cierre de sesión forzado y la confusión entre JWT en el flujo de cierre de sesión. El cliente debe verificar que el token de cierre de sesión esté correctamente escrito con el valor ' logout+jwt ' , contenga la notificación ' evento ' con el nombre de miembro correcto y no contenga una notificación ' nonce ' . Tenga en cuenta que también se recomienda un tiempo de expiración corto (p. ej., 2 minutos).

- **V10.6 – Proveedor OpenID**
  - **10.6.1:** Verifique que el proveedor de OpenID solo permita los valores "code", "ciba", "id_token" o "id_token code" como modo de respuesta. Tenga en cuenta que se prefiere "code" a "id_token code" (flujo híbrido de OIDC) y no se debe usar "token" (ningún flujo implícito).
  - **10.6.2:** Verificar que el proveedor de OpenID mitigue la denegación de servicio mediante el cierre de sesión forzado. Para ello, se debe obtener la confirmación explícita del usuario final o , si la hay, validar los parámetros en la solicitud de cierre de sesión (iniciada por el usuario de confianza), como el id_token_hint .

- **V10.7 – Gestión del consentimiento**
  - **10.7.1:** Verificar que el servidor de autorización garantice el consentimiento del usuario a cada solicitud de autorización. Si no se puede verificar la identidad del cliente, el servidor de autorización siempre debe solicitar explícitamente el consentimiento del usuario.
  - **10.7.2:** Verificar que, cuando el servidor de autorización solicita el consentimiento del usuario, presente información suficiente y clara sobre el consentimiento. Cuando corresponda, esto debe incluir la naturaleza de las autorizaciones solicitadas (normalmente basadas en el alcance, el servidor de recursos, los detalles de autorización de las Solicitudes de Autorización Enriquecidas (RAR)), la identidad de la aplicación autorizada y la vigencia de estas autorizaciones.
  - **10.7.3:** Verificar que el usuario pueda revisar, modificar y revocar los consentimientos que haya otorgado a través del servidor de autorización.

## V11 Criptografía

- **V11.1 – Inventario criptográfico y documentación**
  - **11.1.1:** Verificar que exista una política documentada para la gestión de claves criptográficas y un ciclo de vida de claves criptográficas que siga un estándar de gestión de claves como NIST SP 800-57 . Esto debe incluir garantizar que las claves no se compartan en exceso (por ejemplo, con más de dos entidades para secretos compartidos y más de una entidad para claves privadas).
  - **11.1.2:** Verificar que se realice, mantenga y actualice periódicamente un inventario criptográfico que incluya todas las claves, algoritmos y certificados criptográficos utilizados por la aplicación. También debe documentar dónde se pueden usar las claves en el sistema y qué tipos de datos se pueden proteger con ellas.
  - **11.1.3:** Verificar que se empleen mecanismos de descubrimiento criptográfico para identificar todas las instancias de criptografía en el sistema, incluidas las operaciones de cifrado, hash y firma.
  - **11.1.4:** Verificar que se mantenga un inventario criptográfico. Este debe incluir un plan documentado que describa la ruta de migración a nuevos estándares criptográficos, como la criptografía poscuántica , para responder a futuras amenazas.

- **V11.2 – Implementación de criptografía segura**
  - **11.2.1:** Verificar que se utilicen implementaciones validadas por la industria (incluidas bibliotecas e implementaciones aceleradas por hardware) para las operaciones criptográficas.
  - **11.2.2:** Verificar que la aplicación esté diseñada con agilidad criptográfica, de modo que los algoritmos de números aleatorios, cifrado autenticado, MAC o hash, longitudes de clave, rondas, cifrados y modos puedan reconfigurarse, actualizarse o intercambiarse en cualquier momento para proteger contra vulnerabilidades criptográficas. Asimismo, debe ser posible reemplazar claves y contraseñas, así como recifrar datos . Esto permitirá actualizaciones fluidas a la criptografía postcuántica ( PQC), una vez que las implementaciones de alta seguridad de los esquemas o estándares de PQC aprobados estén ampliamente disponibles.
  - **11.2.3:** Verificar que todas las primitivas criptográficas utilicen un mínimo de 128 bits de seguridad según el algoritmo, el tamaño de la clave y la configuración. Por ejemplo, una clave ECC de 256 bits proporciona aproximadamente 128 bits de seguridad, mientras que RSA requiere una clave de 3072 bits para lograr 128 bits de seguridad.
  - **11.2.4:** Verificar que todas las operaciones criptográficas sean en tiempo constante , sin operaciones de ' cortocircuito ' en comparaciones, cálculos o retornos, para evitar fugas de información .
  - **11.2.5:** Verificar que todos los módulos criptográficos fallen de manera segura y que los errores se manejen de manera que no permitan vulnerabilidades, como ataques Padding Oracle.

- **V11.3 – Algoritmos de cifrado**
  - **11.3.1:** Verifique que no se utilicen modos de bloque inseguros (por ejemplo, ECB) y esquemas de relleno débiles (por ejemplo, PKCS#1 v1.5).
  - **11.3.2:** Verifique que solo se utilicen cifrados y modos aprobados, como AES con GCM.
  - **11.3.3:** Verificar que los datos cifrados estén protegidos contra modificaciones no autorizadas, preferiblemente mediante un método de cifrado autenticado aprobado o combinando un método de cifrado aprobado con un algoritmo MAC aprobado.
  - **11.3.4:** Verificar que los nonces, vectores de inicialización y otros números de un solo uso no se utilicen para más de un par de claves de cifrado y elementos de datos . El método de generación debe ser adecuado para el algoritmo utilizado.
  - **11.3.5:** Verifique que cualquier combinación de un algoritmo de cifrado y un algoritmo MAC esté funcionando en modo de cifrado y luego MAC .

- **V11.4 – Hashing y funciones basadas en hash **
  - **11.4.1:** Verificar que solo se utilicen funciones hash aprobadas para casos de uso criptográfico general, incluyendo firmas digitales, HMAC, KDF y generación de bits aleatorios. Las funciones hash no permitidas, como MD5, no deben utilizarse para ningún propósito criptográfico.
  - **11.4.2:** Verificar que las contraseñas se almacenen mediante una función de derivación de claves aprobada y de alto consumo computacional (también conocida como "función de hash de contraseñas"), con parámetros configurados según las directrices actuales. La configuración debe equilibrar la seguridad y el rendimiento para que los ataques de fuerza bruta sean lo suficientemente difíciles como para cumplir con el nivel de seguridad requerido.
  - **11.4.3:** Verificar que las funciones hash utilizadas en las firmas digitales, como parte de la autenticación o la integridad de los datos, sean resistentes a colisiones y tengan longitudes de bits adecuadas . Si se requiere resistencia a colisiones, la longitud de salida debe ser de al menos 256 bits. Si solo se requiere resistencia a ataques de segunda preimagen , la longitud de salida debe ser de al menos 128 bits.
  - **11.4.4:** Verificar que la aplicación utilice funciones de derivación de claves aprobadas con parámetros de extensión de claves al derivar claves secretas de contraseñas. Los parámetros utilizados deben equilibrar la seguridad y el rendimiento para evitar que ataques de fuerza bruta comprometan la clave criptográfica resultante.

- **V11.5 – Valores aleatorios**
  - **11.5.1:** Verificar que todos los números y cadenas aleatorios que no se puedan adivinar se generen mediante un generador de números pseudoaleatorios criptográficamente seguro ( CSPRNG) y tengan al menos 128 bits de entropía. Tenga en cuenta que los UUID no cumplen esta condición.
  - **11.5.2:** Verificar que el mecanismo de generación de números aleatorios en uso esté diseñado para funcionar de forma segura, incluso bajo alta demanda.

- **V11.6 – Criptografía de clave pública**
  - **11.6.1:** Verificar que solo se utilicen algoritmos criptográficos y modos de operación aprobados para la generación y siembra de claves, así como para la generación y verificación de firmas digitales. Los algoritmos de generación de claves no deben generar claves inseguras vulnerables a ataques conocidos, por ejemplo, claves RSA vulnerables a la factorización de Fermat.
  - **11.6.2:** Verificar que se utilicen algoritmos criptográficos aprobados para el intercambio de claves (como Diffie - Hellman) , con especial atención a garantizar que los mecanismos de intercambio de claves utilicen parámetros seguros. Esto evitará ataques al proceso de establecimiento de claves que podrían derivar en ataques de intermediario o fallos criptográficos .

- **V11.7 – Criptografía de datos en uso**
  - **11.7.1:** Verificar que se utilice un cifrado de memoria completo que proteja los datos confidenciales mientras están en uso, evitando el acceso por parte de usuarios o procesos no autorizados.
  - **11.7.2:** Verificar que la minimización de datos garantice que se exponga la mínima cantidad de datos durante el procesamiento y garantizar que los datos se encripten inmediatamente después de su uso o tan pronto como sea posible.

## V12 Comunicación segura

- **V12.1 – Guía general de seguridad TLS**
  - **12.1.1:** Verifique que solo estén habilitadas las últimas versiones recomendadas del protocolo TLS, como TLS 1.2 y TLS 1.3. La última versión del protocolo TLS debe ser la opción preferida.
  - **12.1.2:** Verifique que solo estén habilitados los conjuntos de cifrado recomendados, y que los conjuntos de cifrado más robustos se configuren como preferidos. Las aplicaciones L3 solo deben admitir conjuntos de cifrado que proporcionen confidencialidad directa.
  - **12.1.3:** Verifique que la aplicación valide que los certificados de cliente mTLS sean confiables antes de usar la identidad del certificado para autenticación o autorización.
  - **12.1.4:** Verifique que la revocación de certificación adecuada, como el engrapado del Protocolo de estado de certificado en línea (OCSP), esté habilitada y configurada.
  - **12.1.5:** Verifique que Encrypted Client Hello (ECH) esté habilitado en la configuración TLS de la aplicación para evitar la exposición de metadatos confidenciales, como la indicación de nombre de servidor (SNI), durante los procesos de protocolo de enlace TLS.

- **V12.2 – Comunicación HTTPS con servicios externos**
  - **12.2.1:** Verificar que se utilice TLS para toda la conectividad entre un cliente y servicios externos basados en HTTP , y que no recurra a comunicaciones inseguras o no cifradas.
  - **12.2.2:** Verificar que los servicios externos utilicen certificados TLS de confianza pública.

- **V12.3 – Seguridad general de las comunicaciones entre servicios**
  - **12.3.1:** Verifique que se utilice un protocolo cifrado, como TLS, para todas las conexiones entrantes y salientes hacia y desde la aplicación, incluyendo sistemas de monitorización, herramientas de administración, acceso remoto y SSH, middleware, bases de datos, mainframes, sistemas de socios o API externas. El servidor no debe recurrir a protocolos inseguros o sin cifrar.
  - **12.3.2:** Verificar que los clientes TLS validen los certificados recibidos antes de comunicarse con un servidor TLS.
  - **12.3.3:** Verificar que se utilice TLS u otro mecanismo de cifrado de transporte adecuado para toda la conectividad entre servicios internos basados en HTTP dentro de la aplicación, y que no recurra a comunicaciones inseguras o no cifradas.
  - **12.3.4:** Verificar que las conexiones TLS entre servicios internos utilicen certificados de confianza. Si se utilizan certificados generados internamente o autofirmados , el servicio consumidor debe estar configurado para confiar únicamente en CA internas y certificados autofirmados específicos .
  - **12.3.5:** Verificar que los servicios que se comunican internamente dentro de un sistema (comunicaciones intraservicio ) utilicen autenticación robusta para garantizar la verificación de cada punto final. Se deben emplear métodos de autenticación robusta, como la autenticación de cliente TLS, para garantizar la identidad, utilizando una infraestructura de clave pública y mecanismos resistentes a ataques de repetición. Para arquitecturas de microservicios, considere el uso de una malla de servicios para simplificar la gestión de certificados y mejorar la seguridad.

## V13 Configuración

- **V13.1 – Documentación de configuración**
  - **13.1.1:** Verificar que todas las necesidades de comunicación de la aplicación estén documentadas. Esto debe incluir los servicios externos de los que depende la aplicación y los casos en los que un usuario final podría proporcionar una ubicación externa a la que la aplicación se conectará.
  - **13.1.2:** Verificar que para cada servicio que utiliza la aplicación, la documentación defina el número máximo de conexiones simultáneas (por ejemplo, límites del grupo de conexiones) y cómo se comporta la aplicación cuando se alcanza ese límite, incluidos los mecanismos de recuperación o respaldo, para evitar condiciones de denegación de servicio.
  - **13.1.3:** Verificar que la documentación de la aplicación defina las estrategias de gestión de recursos para cada sistema o servicio externo que utilice (p. ej., bases de datos, identificadores de archivos, subprocesos, conexiones HTTP). Esto debe incluir procedimientos de liberación de recursos , configuración de tiempos de espera, gestión de fallos y, si se implementa la lógica de reintento, especificar los límites de reintento, los retrasos y los algoritmos de interrupción. Para las operaciones síncronas de solicitud - respuesta HTTP, se deben exigir tiempos de espera cortos y deshabilitar o limitar estrictamente los reintentos para evitar retrasos en cascada y el agotamiento de recursos.
  - **13.1.4:** Verificar que la documentación de la aplicación defina los secretos que son críticos para la seguridad de la aplicación y un cronograma para rotarlos, según el modelo de amenazas de la organización y los requisitos comerciales.

- **V13.2 – Configuración de comunicación de backend**
  - **13.2.1:** Verificar que las comunicaciones entre los componentes de la aplicación backend que no son compatibles con el mecanismo de sesión de usuario estándar de la aplicación, incluyendo API, middleware y capas de datos, estén autenticadas. La autenticación debe utilizar cuentas de servicio individuales, tokens a corto plazo o autenticación basada en certificados , y no credenciales inmutables como contraseñas, claves de API o cuentas compartidas con acceso privilegiado.
  - **13.2.2:** Verificar que las comunicaciones entre los componentes de la aplicación backend, incluidos los servicios locales o del sistema operativo, las API, el middleware y las capas de datos, se realicen con cuentas asignadas con los privilegios mínimos necesarios.
  - **13.2.3:** Verificar que si se debe utilizar una credencial para la autenticación del servicio, la credencial que utiliza el consumidor no sea una credencial predeterminada (por ejemplo, root/root o admin/admin).
  - **13.2.4:** Verificar que se utilice una lista de permitidos para definir los recursos o sistemas externos con los que la aplicación puede comunicarse (p. ej., para solicitudes salientes, cargas de datos o acceso a archivos). Esta lista de permitidos puede implementarse en la capa de aplicación, el servidor web, el firewall o una combinación de diferentes capas.
  - **13.2.5:** Verifique que el servidor web o de aplicaciones esté configurado con una lista blanca de recursos o sistemas a los cuales el servidor puede enviar solicitudes o cargar datos o archivos.
  - **13.2.6:** Verifique que cuando la aplicación se conecta a servicios separados, siga la configuración documentada para cada conexión, como máximo de conexiones paralelas, comportamiento cuando se alcanza el máximo de conexiones permitidas, tiempos de espera de conexión y estrategias de reintento.

- **V13.3 – Gestión de secretos**
  - **13.3.1:** Verificar que se utilice una solución de gestión de secretos, como un almacén de claves, para crear, almacenar, controlar el acceso y destruir de forma segura los secretos del backend. Estos pueden incluir contraseñas, material de claves, integraciones con bases de datos y sistemas de terceros , claves y semillas para tokens temporales , otros secretos internos y claves API. Los secretos no deben incluirse en el código fuente de la aplicación ni en los artefactos de compilación. En una aplicación L3, esto debe implicar una solución basada en hardware, como un HSM.
  - **13.3.2:** Verificar que el acceso a los activos secretos se adhiera al principio del mínimo privilegio.
  - **13.3.3:** Verificar que todas las operaciones criptográficas se realicen utilizando un módulo de seguridad aislado (como una bóveda o un módulo de seguridad de hardware) para administrar y proteger de forma segura el material clave de la exposición fuera del módulo de seguridad.
  - **13.3.4:** Verifique que los secretos estén configurados para expirar y rotar según la documentación de la aplicación.

- **V13.4 – Fuga de información involuntaria**
  - **13.4.1:** Verifique que la aplicación se implemente sin ningún metadato de control de origen, incluidas las carpetas .git o .svn, o de una manera que estas carpetas sean inaccesibles tanto externamente como para la aplicación misma.
  - **13.4.2:** Verifique que los modos de depuración estén deshabilitados para todos los componentes en entornos de producción para evitar la exposición de funciones de depuración y la fuga de información.
  - **13.4.3:** Verificar que los servidores web no expongan listados de directorios a los clientes a menos que esté explícitamente previsto.
  - **13.4.4:** Verificar que el uso del método HTTP TRACE no sea compatible en entornos de producción, para evitar posibles fugas de información.
  - **13.4.5:** Verificar que la documentación (por ejemplo, para las API internas) y los puntos finales de monitoreo no estén expuestos a menos que esté previsto explícitamente.
  - **13.4.6:** Verificar que la aplicación no exponga información detallada de la versión de los componentes del backend
13.4.7:** Verifique que el nivel web esté configurado para servir únicamente archivos con extensiones de archivo específicas para evitar fugas involuntarias de información, configuración y código fuente.

## V14 Protección de datos

- **V14.1 – Documentación de protección de datos**
  - **14.1.1:** Verificar que todos los datos sensibles creados y procesados por la aplicación se hayan identificado y clasificado en niveles de protección. Esto incluye datos codificados y, por lo tanto, fáciles de decodificar, como cadenas Base64 o la carga de texto sin formato dentro de un JWT. Los niveles de protección deben tener en cuenta las normativas y estándares de protección de datos y privacidad que la aplicación debe cumplir.
  - **14.1.2:** Verificar que todos los niveles de protección de datos sensibles cuenten con un conjunto documentado de requisitos de protección. Esto debe incluir, entre otros, requisitos relacionados con el cifrado general, la verificación de la integridad, la retención, el registro de datos, los controles de acceso a los datos sensibles en los registros, el cifrado a nivel de base de datos , la privacidad y las tecnologías que la mejoran, y otros requisitos de confidencialidad.

- **V14.2 – Protección general de datos**
  - **14.2.1:** Verifique que los datos confidenciales solo se envíen al servidor en el cuerpo del mensaje HTTP o en los campos de encabezado, y que la URL y la cadena de consulta no contengan información confidencial, como una clave API o un token de sesión.
  - **14.2.2:** Verifique que la aplicación evite que datos confidenciales se almacenen en caché en los componentes del servidor, como balanceadores de carga y cachés de aplicaciones, o garantice que los datos se purguen de forma segura después de su uso.
  - **14.2.3:** Verificar que los datos confidenciales definidos no se envíen a partes no confiables (por ejemplo, rastreadores de usuarios) para evitar la recopilación no deseada de datos fuera del control de la aplicación.
  - **14.2.4:** Verificar que los controles en torno a datos sensibles relacionados con el cifrado, la verificación de integridad, la retención, cómo se deben registrar los datos, los controles de acceso a datos sensibles en los registros, la privacidad y las tecnologías que mejoran la privacidad , se implementen según lo definido en la documentación para el nivel de protección de los datos específicos.
  - **14.2.5:** Verifique que los mecanismos de almacenamiento en caché estén configurados para almacenar únicamente en caché las respuestas que tengan el tipo de contenido esperado para ese recurso y que no contengan contenido sensible ni dinámico. El servidor web debería devolver una respuesta 404 o 302 al acceder a un archivo inexistente, en lugar de devolver un archivo válido diferente. Esto debería evitar ataques de engaño de caché web.
  - **14.2.6:** Verificar que la aplicación solo devuelva los datos confidenciales mínimos necesarios para su funcionalidad. Por ejemplo, devolver solo algunos dígitos de un número de tarjeta de crédito y no el número completo. Si se requieren los datos completos, deben ocultarse en la interfaz de usuario a menos que el usuario los visualice específicamente.
  - **14.2.7:** Verificar que la información sensible esté sujeta a la clasificación de retención de datos, garantizando que los datos obsoletos o innecesarios se eliminen automáticamente, según un cronograma definido o según lo requiera la situación.
  - **14.2.8:** Verificar que se elimine la información confidencial de los metadatos de los archivos enviados por el usuario , a menos que el usuario consienta su almacenamiento.

- **V14.3 – Protección de datos del lado del cliente**
  - **14.3.1:** Verifique que los datos autenticados se borren del almacenamiento del cliente, como el DOM del navegador, tras finalizar el cliente o la sesión. El campo de encabezado de respuesta HTTP "Borrar - Sitio - Datos " puede ser útil, pero el cliente también debería poder borrarlos si la conexión al servidor no está disponible al finalizar la sesión.
  - **14.3.2:** Verifique que la aplicación configure suficientes campos de encabezado de respuesta HTTP anti - almacenamiento en caché (es decir, Cache - Control: no - store) para que los datos confidenciales no se almacenen en caché en los navegadores.
  - **14.3.3:** Verifique que los datos almacenados en el almacenamiento del navegador (como localStorage, sessionStorage, IndexedDB o cookies) no contengan datos confidenciales, con la excepción de los tokens de sesión.


## V15 Codificación y arquitectura seguras

- **V15.1 – Documentación de arquitectura y codificación segura**
  - **15.1.1:** Verificar que la documentación de la aplicación defina plazos de remediación basados en riesgos para versiones de componentes de terceros con vulnerabilidades y para la actualización de bibliotecas en general, a fin de minimizar el riesgo de estos componentes.
  - **15.1.2:** Verificar que se mantenga un catálogo de inventario, como una lista de materiales de software (SBOM), de todas las bibliotecas de terceros en uso, incluida la verificación de que los componentes provengan de repositorios predefinidos , confiables y mantenidos continuamente.
  - **15.1.3:** Verificar que la documentación de la aplicación identifique las funcionalidades que consumen mucho tiempo o recursos . Esto debe incluir cómo prevenir la pérdida de disponibilidad debido al uso excesivo de esta funcionalidad y cómo evitar que la generación de una respuesta tarde más que el tiempo de espera del consumidor . Las posibles defensas pueden incluir el procesamiento asíncrono, el uso de colas y la limitación de procesos paralelos por usuario y por aplicación.
  - **15.1.4:** Verificar que la documentación de la aplicación destaque las bibliotecas de terceros que se consideran " componentes de riesgo ".
  - **15.1.5:** Verificar que la documentación de la aplicación resalte las partes de la aplicación donde se utiliza “funcionalidad peligrosa”.

- **V15.2 – Arquitectura de seguridad y dependencias**
  - **15.2.1:** Verificar que la aplicación solo contenga componentes que no hayan incumplido los plazos de actualización y remediación documentados.
  - **15.2.2:** Verificar que la aplicación haya implementado defensas contra pérdida de disponibilidad debido a funcionalidades que consumen mucho tiempo o demandan muchos recursos , con base en las decisiones de seguridad y estrategias documentadas para esto.
  - **15.2.3:** Verifique que el entorno de producción solo incluya la funcionalidad necesaria para que la aplicación funcione y no exponga funcionalidades extrañas, como código de prueba, fragmentos de muestra y funcionalidad de desarrollo.
  - **15.2.4:** Verificar que los componentes de terceros y todas sus dependencias transitivas estén incluidos desde el repositorio esperado, ya sea de propiedad interna o de una fuente externa, y que no haya riesgo de un ataque de confusión de dependencias.
  - **15.2.5:** Verificar que la aplicación implemente protecciones adicionales en las partes documentadas que contienen "funcionalidad peligrosa" o que utilizan bibliotecas de terceros consideradas " componentes de riesgo " . Esto podría incluir técnicas como el sandboxing, la encapsulación, la contenedorización o el aislamiento a nivel de red para retrasar y disuadir a los atacantes que comprometen una parte de la aplicación de acceder a otras partes de la misma.

- **V15.3 – Codificación defensiva**
  - **15.3.1:** Verifique que la aplicación solo devuelva el subconjunto requerido de campos de un objeto de datos. Por ejemplo, no debe devolver un objeto de datos completo, ya que algunos campos individuales no deberían ser accesibles para los usuarios.
  - **15.3.2:** Verifique que cuando el backend de la aplicación realiza llamadas a URL externas, esté configurado para no seguir redirecciones a menos que sea una funcionalidad prevista.
  - **15.3.3:** Verificar que la aplicación tenga contramedidas para protegerse contra ataques de asignación masiva al limitar los campos permitidos por controlador y acción, por ejemplo, no es posible insertar o actualizar un valor de campo cuando no estaba destinado a ser parte de esa acción.
  - **15.3.4:** Verificar que todos los componentes de proxy y middleware transfieran correctamente la dirección IP original del usuario utilizando campos de datos confiables que no puedan ser manipulados por el usuario final, y que la aplicación y el servidor web utilicen este valor correcto para el registro y las decisiones de seguridad como la limitación de velocidad, teniendo en cuenta que incluso la dirección IP original puede no ser confiable debido a IP dinámicas, VPN o firewalls corporativos.
  - **15.3.5:** Verificar que la aplicación asegure explícitamente que las variables sean del tipo correcto y realice operaciones estrictas de igualdad y comparación. Esto evita la manipulación de tipos o las vulnerabilidades de confusión de tipos causadas por el código de la aplicación que asume el tipo de una variable.
  - **15.3.6:** Verifique que el código JavaScript esté escrito de una manera que evite la contaminación del prototipo, por ejemplo, utilizando Set() o Map() en lugar de literales de objeto.
  - **15.3.7:** Verifique que la aplicación tenga defensas contra ataques de contaminación de parámetros HTTP, particularmente si el marco de la aplicación no hace distinción sobre la fuente de los parámetros de la solicitud (cadena de consulta, parámetros del cuerpo, cookies o campos de encabezado).

- **V15.4 – Concurrencia segura**
  - **15.4.1:** Verificar que los objetos compartidos en código multiproceso ( como cachés, archivos u objetos en memoria a los que acceden varios subprocesos) se accedan de forma segura mediante el uso de tipos seguros para subprocesos y mecanismos de sincronización como bloqueos o semáforos para evitar condiciones de carrera y corrupción de datos.
  - **15.4.2:** Verificar que las comprobaciones del estado de un recurso, como su existencia o permisos, y las acciones que dependen de ellas se realicen como una sola operación atómica para evitar condiciones de carrera de tiempo de verificación a tiempo de uso ( TOCTOU). Por ejemplo, comprobar si un archivo existe antes de abrirlo o verificar el acceso de un usuario antes de otorgarlo.
  - **15.4.3:** Verificar que los bloqueos se usen de manera consistente para evitar que los subprocesos se atasquen, ya sea esperando unos a otros o reintentando sin fin, y que la lógica de bloqueo permanezca dentro del código responsable de administrar el recurso para garantizar que los bloqueos no puedan ser modificados de manera inadvertida o maliciosa por clases o códigos externos.
  - **15.4.4:** Verificar que las políticas de asignación de recursos eviten la inanición de subprocesos al garantizar un acceso justo a los recursos, por ejemplo, aprovechando los grupos de subprocesos y permitiendo que los subprocesos de menor prioridad procedan dentro de un plazo de tiempo razonable.

## V16 Registro de seguridad y gestión de errores

- **V16.1 – Documentación de registro de seguridad**
  - **16.1.1:** Verificar que exista un inventario que documente el registro realizado en cada capa de la pila de tecnología de la aplicación, qué eventos se registran, los formatos de registro, dónde se almacena ese registro, cómo se utiliza, cómo se controla el acceso a él y durante cuánto tiempo se conservan los registros.

- **V16.2 – Registro general**
  - **16.2.1:** Verificar que cada entrada de registro incluya los metadatos necesarios (como cuándo, dónde, quién, qué) que permitan una investigación detallada de la línea de tiempo cuando ocurre un evento.
  - **16.2.2:** Verifique que las fuentes horarias de todos los componentes de registro estén sincronizadas y que las marcas de tiempo en los metadatos de eventos de seguridad utilicen UTC o incluyan una diferencia horaria explícita. Se recomienda usar UTC para garantizar la coherencia entre los sistemas distribuidos y evitar confusiones durante las transiciones al horario de verano.
  - **16.2.3:** Verifique que la aplicación solo almacene o transmita registros a los archivos y servicios que están documentados en el inventario de registros.
  - **16.2.4:** Verificar que los registros puedan ser leídos y correlacionados por el procesador de registros que esté en uso, preferiblemente utilizando un formato de registro común.
  - **16.2.5:** Verificar que, al registrar datos confidenciales, la aplicación aplique el registro según el nivel de protección de los datos. Por ejemplo, es posible que no se permitan registrar ciertos datos, como credenciales o detalles de pago. Otros datos, como los tokens de sesión, solo se pueden registrar mediante hashes o enmascaramiento, ya sea total o parcial.

- **V16.3 – Eventos de seguridad**
  - **16.3.1:** Verificar que se registren todas las operaciones de autenticación, incluyendo los intentos exitosos y fallidos. También se deben recopilar metadatos adicionales, como el tipo de autenticación o los factores utilizados.
  - **16.3.2:** Verificar que se registren los intentos de autorización fallidos. Para L3, esto debe incluir el registro de todas las decisiones de autorización, incluyendo el registro del acceso a datos confidenciales (sin registrar los datos confidenciales en sí).
  - **16.3.3:** Verifique que la aplicación registre los eventos de seguridad que están definidos en la documentación y también registre los intentos de eludir los controles de seguridad, como la validación de entrada, la lógica empresarial y la antiautomatización .
  - **16.3.4:** Verifique que la aplicación registre errores inesperados y fallas de control de seguridad, como fallas de TLS de backend.

- **V16.4 – Protección de registros**
  - **16.4.1:** Verifique que todos los componentes de registro codifiquen adecuadamente los datos para evitar la inyección de registros.
  - **16.4.2:** Verificar que los registros estén protegidos contra accesos no autorizados y no puedan modificarse.
  - **16.4.3:** Verificar que los registros se transmitan de forma segura a un sistema lógicamente separado para su análisis, detección, alerta y escalamiento. El objetivo es garantizar que, en caso de una vulneración de la aplicación, los registros no se vean comprometidos.
- **V16.5 – Manejo de Errores**
  - **16.5.1:** Verificar que se devuelva un mensaje genérico al consumidor cuando se produzca un error inesperado o que afecte a la seguridad, garantizando así que no se expongan datos internos confidenciales del sistema, como seguimientos de pila, consultas, claves secretas y tokens.
  - **16.5.2:** Verificar que la aplicación siga funcionando de forma segura cuando falle el acceso a recursos externos, por ejemplo, mediante patrones como disyuntores o degradación elegante.
  - **16.5.3:** Verificar que la aplicación falle de forma elegante y segura, incluso cuando se produzca una excepción, evitando condiciones de apertura fallida, como el procesamiento de una transacción a pesar de los errores resultantes de la lógica de validación.
  - **16.5.4:** Verificar que se defina un manejador de errores de "último recurso" que capture todas las excepciones no gestionadas. Esto se hace para evitar la pérdida de detalles de errores que deben almacenarse en los archivos de registro y para garantizar que un error no detenga todo el proceso de la aplicación, lo que provocaría una pérdida de disponibilidad.

## WebRTC V17
- **V17.1 – Servidor TURN**
  - **17.1.1:** Verificar que el servicio de Traversal Using Relays around NAT (TURN) solo permita el acceso a direcciones IP que no estén reservadas para fines especiales (p. ej., redes internas, difusión, bucle invertido). Tenga en cuenta que esto aplica tanto a direcciones IPv4 como IPv6.
  - **17.1.2:** Verificar que el servicio de Traversal Using Relays around NAT (TURN) no sea susceptible al agotamiento de recursos cuando usuarios legítimos intenten abrir una gran cantidad de puertos en el servidor TURN.
- **V17.2 – Medios**
  - **17.2.1:** Verificar que la clave del certificado de Seguridad de la Capa de Transporte de Datagramas (DTLS) se administre y proteja según la política documentada para la administración de claves criptográficas.
  - **17.2.2:** Verificar que el servidor multimedia esté configurado para usar y admitir conjuntos de cifrado de Seguridad de la Capa de Transporte de Datagramas (DTLS) aprobados y un perfil de protección seguro para la Extensión DTLS para establecer claves para el Protocolo de Transporte Seguro en Tiempo Real (DTLS-SRTP).
  - **17.2.3:** Verificar que la autenticación del Protocolo de Transporte Seguro en Tiempo Real (SRTP) se active en el servidor multimedia para evitar que los ataques de inyección del Protocolo de Transporte en Tiempo Real (RTP) provoquen una condición de denegación de servicio o la inserción de audio o video en las transmisiones multimedia.
  - **17.2.4:** Verificar que el servidor multimedia pueda continuar procesando el tráfico multimedia entrante al detectar paquetes del Protocolo de Transporte Seguro en Tiempo Real (SRTP) malformados.
  - **17.2.5:** Verificar que el servidor multimedia pueda continuar procesando el tráfico multimedia entrante durante una avalancha de paquetes SRTP (Protocolo de Transporte Seguro en Tiempo Real) provenientes de usuarios legítimos.
  - **17.2.6:** Verificar que el servidor multimedia no sea susceptible a la vulnerabilidad de condición de carrera "ClientHello" en la Seguridad de la Capa de Transporte de Datagramas (DTLS). Para ello, se debe comprobar si su vulnerabilidad es públicamente conocida o realizar la prueba de condición de carrera.
  - **17.2.7:** Verificar que cualquier mecanismo de grabación de audio o video asociado con el servidor multimedia pueda continuar procesando el tráfico multimedia entrante durante una avalancha de paquetes SRTP (Protocolo de Transporte Seguro en Tiempo Real) provenientes de usuarios legítimos.
  - **17.2.8:** Verificar que el certificado de Seguridad de la Capa de Transporte de Datagramas (DTLS) se verifique con el atributo de huella digital del Protocolo de Descripción de Sesión (SDP), finalizando el flujo multimedia si la verificación falla, para garantizar su autenticidad.
- **V17.3 – Señalización**
  - **17.3.1:** Verificar que el servidor de señalización pueda continuar procesando mensajes de señalización entrantes legítimos durante un ataque de inundación. Esto se debe lograr implementando la limitación de velocidad a nivel de señalización.
  - **17.3.2:** Verificar que el servidor de señalización pueda continuar procesando mensajes de señalización legítimos al encontrar un mensaje de señalización malformado que pueda causar una denegación de servicio. Esto podría incluir la implementación de la validación de entrada, el manejo seguro de desbordamientos de enteros, la prevención de desbordamientos de búfer y el empleo de otras técnicas robustas de gestión de errores.
