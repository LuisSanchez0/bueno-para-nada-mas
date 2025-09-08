const crypto = require('crypto');

const {
    setVerificationCode,
    getVerificationCode,
    deleteVerificationCode,
} = require('../helpers/db-redis-codes' );

const { transporter } = require('../config/mailer');
// Ya no necesitas importar redisClient aquí si usas los helpers
// const redisClient = require("../database/config-redis");

//!Generar código de verificación
async function sendVerificationCode(email, name, type) {
    //? Generar código de 8 dígitos aleatorio
    const code = crypto.randomInt(10000000, 99999999).toString();

    //? Guardar en Redis usando el helper
    await setVerificationCode(email, code, type);
    const typeForEmail = ( type === '2fa' ) ? 'Factor de Autenticación' : 'Recuperación de Contraseña';

    // Correo con plantilla simple
    const mailOptions = {
        from: '"ProWear" <no-reply@prowear.com>',
        to: email,
        subject: `[ProWear] Código para ${ typeForEmail }`,
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
              background-color: #f6f8fa;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #e1e4e8;
              border-radius: 6px;
              box-shadow: 0 1px 3px rgba(27, 31, 35, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #e1e4e8;
            }
            .header img {
              width: 40px; /* Ajusta el tamaño de tu logo */
              height: 40px;
              margin-bottom: 10px;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .code-box {
              background-color: #f6f8fa;
              border: 1px dashed #e1e4e8;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
            }
            .code {
              font-size: 32px;
              font-weight: 600;
              color: #0366d6;
              letter-spacing: 4px;
              margin: 0;
            }
            .info-text {
              font-size: 14px;
              color: #586069;
              line-height: 1.5;
            }
            .warning {
              color: #d73a49;
              font-weight: 600;
            }
            .signature {
              font-size: 14px;
              color: #586069;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              font-size: 12px;
              color: #959da5;
              border-top: 1px solid #e1e4e8;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
    
          <div class="container">
            <div class="header">
              <img src="URL_DE_TU_LOGO" alt="Logo de ProWear">
              <h2>Por favor, verifica tu identidad, ${ name }</h2>
            </div>
    
            <div class="content">
              <p class="info-text">Aquí está tu código de autenticación:</p>
              
              <div class="code-box">
                <p class="code">${ code }</p>
              </div>
    
              <p class="info-text">
                Este código es válido por <b>15 minutos</b> y solo puede usarse una vez.
              </p>
    
              <p class="info-text warning">
                Por favor, no compartas este código con nadie: nunca te lo pediremos por teléfono o correo.
              </p>
    
              <p class="signature">
                Gracias,<br>
                El equipo de ProWear
              </p>
            </div>
          </div>
    
          <div class="footer">
            <p>Estás recibiendo este correo porque se solicitó un código de verificación para tu cuenta de ProWear. Si no fuiste tú, por favor, ignora este correo.</p>
          </div>
    
        </body>
        </html>
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de verificación enviado a: ${email}`);
    } catch (error) {
        console.error(`Error al enviar el correo a ${email}:`, error);
    }
}


async function validateCode(email, code, type) {
    
    const storedCode = await getVerificationCode(email, type);

    if (!storedCode) {
        throw new Error('Código inválido o expirado');
    }

    if (storedCode !== code) {
        throw new Error('Código enviado es incorrecto');
    }

    await deleteVerificationCode(email, type);

    return true;
}

module.exports = {
  sendVerificationCode,
  validateCode
};