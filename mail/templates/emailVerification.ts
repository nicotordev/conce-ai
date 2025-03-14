export default function emailVerification(verificationUrl: string) {
  return `
  <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verifica tu correo electrónico - Cóndor-AI</title>
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
          Verificación de correo electrónico
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
          Confirma tu dirección de correo
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
          Estás a un paso de comenzar a usar <strong>Cóndor-AI</strong>, la
          inteligencia artificial de Chile. Para activar tu cuenta y garantizar
          la seguridad de tus datos,<br /><strong>
            necesitamos verificar tu dirección de correo electrónico.</strong
          >
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
            Haz clic en el botón de abajo para verificar tu correo:
          </p>
          <a
            href="${verificationUrl}"
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
            >VERIFICAR MI CORREO ELECTRÓNICO</a
          >
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
            Este enlace expira en 24 horas.
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
          Si el botón no funciona, también puedes usar este código de
          verificación:
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
          587249
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
              Ingresa a la página de verificación de Cóndor-AI
            </li>
            <li style="margin-bottom: 8px; color: #334155">
              Introduce el código de 6 dígitos mostrado arriba
            </li>
            <li style="margin-bottom: 8px; color: #334155">
              Haz clic en "Verificar"
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
          Una vez verificada tu cuenta, podrás acceder a todas las
          funcionalidades de Cóndor-AI diseñadas específicamente para usuarios
          chilenos y latinoamericanos.
        </p>
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          Si no solicitaste esta cuenta o tienes alguna pregunta, por favor
          ignora este correo o contáctanos directamente respondiendo a este
          mensaje.
        </p>
        <p
          style="
            font-family: 'Inter', sans-serif;
            color: #334155;
            font-size: 15px;
            margin-bottom: 16px;
          "
        >
          ¡Gracias por unirte a la revolución de la IA chilena!
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
            >Facebook</a
          >
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
            >Twitter</a
          >
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
            >LinkedIn</a
          >
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
            >Instagram</a
          >
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
          Si no solicitaste esta verificación, puedes ignorar este correo
          electrónico.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}
