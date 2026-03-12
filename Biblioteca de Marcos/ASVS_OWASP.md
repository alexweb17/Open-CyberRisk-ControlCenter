# OWASP ASVS v4.0.3 - Resumen de Controles (Nivel 1, 2 y 3)

El estándar OWASP ASVS (Application Security Verification Standard) proporciona una base técnica para verificar los controles de seguridad técnica de las aplicaciones web.

## V1 Arquitectura, diseño y modelado de amenazas

- **V1.1 – Ciclo de vida de desarrollo de software seguro**
  - **1.1.2:** Verificar que todos los componentes de la aplicación (incluyendo bibliotecas y marcos) sean conocidos y estén actualizados.
  - **1.2.1:** Verificar que el modelado de amenazas se aplique a todas las funciones comerciales críticas y a los cambios que las afecten.

## V2 Autenticación

- **V2.1 – Seguridad de las contraseñas**
  - **2.1.1:** Verificar que las contraseñas tengan al menos 12 caracteres (L1) o 14 caracteres (L2-L3).
  - **2.1.4:** Requerir MFA para todas las cuentas con acceso administrativo o a datos sensibles.

## V3 Gestión de sesiones

- **V3.2 – Atributos de las cookies de sesión**
  - **3.2.1:** Verificar que la cookie de sesión tenga configurado el atributo `HttpOnly`.
  - **3.2.2:** Verificar que la cookie de sesión tenga configurado el atributo `Secure`.
  - **3.2.3:** Verificar que la cookie de sesión tenga configurado el atributo `SameSite=Lax` o `SameSite=Strict`.

## V4 Control de acceso

- **V4.1 – Principios de control de acceso**
  - **4.1.1:** Aplicar el principio de "mínimo privilegio" en todas las capas.
  - **4.1.3:** Asegurar que los controles de acceso se apliquen de forma centralizada en el servidor, no solo en el cliente.

## V5 Validación de entrada, desinfección y codificación

- **V5.1 – Codificación de datos**
  - **5.1.3:** Codificar todos los datos proporcionados por el usuario antes de insertarlos en el HTML para evitar XSS.
  - **5.1.4:** Utilizar consultas parametrizadas para evitar la inyección de SQL.

## V6 Criptografía en reposo

- **V6.2 – Algoritmos criptográficos**
  - **6.2.1:** Utilizar algoritmos de cifrado fuertes (ej. AES-256) y modos de operación seguros.
  - **6.2.2:** Utilizar funciones de hash resistentes a ataques de fuerza bruta para las contraseñas (ej. Argon2 o bcrypt).

## V7 Manejo de errores y registro

- **V7.1 – Manejo de errores**
  - **7.1.1:** No mostrar información detallada del sistema (stack traces, rutas) en los mensajes de error al usuario.
- **V7.2 – Registro de auditoría**
  - **7.2.1:** Registrar todos los intentos de inicio de sesión, fallidos y exitosos.

## V8 Seguridad de los datos

- **V8.1 – Privacidad de los datos**
  - **8.1.1:** Identificar y proteger los datos personales (PII) según las leyes locales.

## V9 Comunicaciones seguras

- **V9.1 – Seguridad de la capa de transporte**
  - **9.1.1:** Utilizar TLS 1.2 o superior para todas las comunicaciones.

## V10 Configuración maliciosa y de seguridad

- **V10.1 – Configuración de seguridad**
  - **10.1.1:** Deshabilitar todas las funciones y servicios innecesarios del servidor.

## V11 Seguridad de la lógica de negocios

- **V11.1 – Lógica de negocios**
  - **11.1.1:** Validar que se respeten los límites de los procesos de negocio (ej. no saltar pasos en una compra).

## V12 Archivos y recursos

- **V12.1 – Subida de archivos**
  - **12.1.1:** Validar el tipo de archivo y escanear en busca de virus antes de permitir la subida.

## V13 Seguridad de la API y servicios web

- **V13.1 – Seguridad genérica de servicios web**
  - **13.1.2:** Validar todos los datos de entrada según un esquema (ej. JSON Schema).

## V14 Configuración de seguridad

- **V14.1 – Encabezados de seguridad de la red**
  - **14.1.1:** Implementar Content Security Policy (CSP).

---
*Nota: Este es un resumen simplificado de los controles ASVS para el CyberRisk Control Center.*
