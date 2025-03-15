export default function emailPasswordReset(resetUrl: string, resetToken: string) {
    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restablece tu contraseña - Cóndor-AI</title>
  </head>
  <body>
    <div
      class="container"
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 0;
        background-color: #ffffff;
      "
    >
      <div
        class="header"
        style="
          text-align: center;
          padding: 30px 0;
          background: linear-gradient(135deg, #007bff, #42b584);
        "
      >
        <img
          src="/api/placeholder/180/90"
          alt="Cóndor-AI Logo"
          style="max-width: 180px"
        />
        <h1
          style="
            font-family: 'Space Grotesk', sans-serif;
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.02em;
          "
        >
          Restablecimiento de contraseña
        </h1>
      </div>
  
      <div class="content" style="padding: 32px 40px">
        <h2
          style="
            font-family: 'Space Grotesk', sans-serif;
            color: #1e293b;
            margin-top: 0;
            font-size: 24px;
            letter-spacing: -0.01em;
          "
        >
          Restablece tu contraseña
        </h2>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Hola,
        </p>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Cóndor-AI</strong>. Para continuar con este proceso y garantizar la seguridad de tus datos,<br /><strong>
          por favor sigue el enlace a continuación.</strong>
        </p>
  
        <div
          class="verification-box"
          style="
            background-color: #edfaff;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
            text-align: center;
            border: 1px solid #d6f2ff;
          "
        >
          <p
            style="
              font-family: 'Inter', sans-serif;
              color: #334155;
              font-size: 15px;
              margin-bottom: 16px;
            "
          >
            Haz clic en el botón de abajo para restablecer tu contraseña:
          </p>
  
          <a
            href="${resetUrl}"
            class="button"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 24px;
              font-weight: 600;
              font-family: 'Poppins', sans-serif;
              font-size: 14px;
              transition: all 0.2s ease;
            "
          >RESTABLECER MI CONTRASEÑA</a>
  
          <p
            class="time-warning"
            style="
              font-family: 'Lato', sans-serif;
              color: #64748b;
              font-size: 14px;
              margin-bottom: 16px;
              font-style: italic;
            "
          >
            Este enlace expira en 1 hora por seguridad.
          </p>
        </div>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Si el botón no funciona, también puedes usar este código de restablecimiento:
        </p>
  
        <div
          class="verification-code"
          style="
            font-family: 'Space Grotesk', sans-serif;
            font-size: 32px;
            letter-spacing: 4px;
            color: #0e315d;
            font-weight: 700;
            padding: 16px 0;
            margin: 16px 0;
          "
        >
          ${resetToken}
        </div>
  
        <div
          class="info-box"
          style="
            background-color: #e8f5f0;
            border-left: 4px solid #42b584;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
          "
        >
          <p
            style="
              font-family: 'Inter', sans-serif;
              color: #334155;
              font-size: 15px;
              margin-bottom: 16px;
              margin: 8px 0;
            "
          >
            <strong>¿Cómo usar el código?</strong>
          </p>
  
          <ol class="steps" style="padding-left: 20px">
            <li style="margin-bottom: 8px; color: #334155">
              Ingresa a la página de restablecimiento de contraseña de Cóndor-AI
            </li>
            <li style="margin-bottom: 8px; color: #334155">
              Introduce el código de 6 dígitos mostrado arriba
            </li>
            <li style="margin-bottom: 8px; color: #334155">
              Crea una nueva contraseña segura
            </li>
          </ol>
        </div>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Si no solicitaste este restablecimiento de contraseña, por favor ignora este correo o contáctanos inmediatamente, ya que alguien podría estar intentando acceder a tu cuenta.
        </p>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Te recordamos que nunca debes compartir tu contraseña con nadie ni responder a correos solicitando tus credenciales.
        </p>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Saludos cordiales,<br />
          <strong>El equipo de Cóndor-AI</strong>
        </p>
  
        <div
          class="social"
          style="
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid #e3e3e3;
          "
        >
          <a
            href="#"
            style="
              margin: 0 10px;
              text-decoration: none;
              color: #007bff;
              font-family: 'Lato', sans-serif;
              font-size: 14px;
            "
          >Facebook</a>
          |
          <a
            href="#"
            style="
              margin: 0 10px;
              text-decoration: none;
              color: #007bff;
              font-family: 'Lato', sans-serif;
              font-size: 14px;
            "
          >Twitter</a>
          |
          <a
            href="#"
            style="
              margin: 0 10px;
              text-decoration: none;
              color: #007bff;
              font-family: 'Lato', sans-serif;
              font-size: 14px;
            "
          >LinkedIn</a>
          |
          <a
            href="#"
            style="
              margin: 0 10px;
              text-decoration: none;
              color: #007bff;
              font-family: 'Lato', sans-serif;
              font-size: 14px;
            "
          >Instagram</a>
        </div>
      </div>
  
      <div
        class="footer"
        style="
          text-align: center;
          padding: 24px;
          font-size: 13px;
          color: #64748b;
          background-color: #f8fafc;
          font-family: 'Lato', sans-serif;
        "
      >
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          © 2025 Cóndor-AI | Todos los derechos reservados
        </p>
  
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Av. Providencia 1234, Santiago, Chile
        </p>
  
        <p
          style="
            margin-top: 12px;
            font-size: 12px;
            font-family: 'Inter', sans-serif;
            color: #334155;
            margin-bottom: 16px;
          "
        >
          Si no solicitaste este restablecimiento de contraseña, puedes ignorar este correo electrónico.
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
  }