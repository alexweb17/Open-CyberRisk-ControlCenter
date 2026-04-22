const fs = require('fs');
const path = require('path');

async function testUpload() {
  console.log('--- Iniciando Prueba de Subida de Archivos CSV y Prevención Múltiple ---');
  try {
    // 1. Iniciar sesión para obtener el JWT
    const loginResp = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@occc.local', password: 'OpenCyberRisk2026!' })
    });
    
    if (!loginResp.ok) throw new Error('Fallo al iniciar sesión: ' + await loginResp.text());
    const { token } = await loginResp.json();
    console.log('✅ Autenticación exitosa. Token obtenido.');

    // 2. Preparar datos del formulario con archivo adjunto
    const FormData = require('form-data');
    const formContext = new FormData();
    formContext.append('nombre', 'Test Project Auto-Validate');
    formContext.append('lider_proyecto', 'Admin Validator');
    formContext.append('ingeniero_asignado', 'Test Engineer');
    formContext.append('area', 'Auditoría');
    formContext.append('estado', 'Activo');
    
    // Adjuntar archivo CSV creado en /tmp
    const filePath = '/tmp/test_evidence.csv';
    formContext.append('archivos', fs.createReadStream(filePath));

    console.log('✅ Formulario preparado con archivo CSV.');

    // 3. Enviar petición POST a /api/projects
    const uploadResp = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formContext.getHeaders()
      },
      body: formContext
    });

    const responseData = await uploadResp.json();

    if (uploadResp.ok) {
      console.log('✅ PROYECTO CREADO EXITOSAMENTE CON ADJUNTO CSV:');
      console.log(JSON.stringify(responseData.data, null, 2));
    } else {
      console.error('❌ Error al crear el proyecto:');
      console.error(responseData);
    }

  } catch (error) {
    console.error('❌ Crash en la prueba:', error.message);
  }
}

testUpload();
