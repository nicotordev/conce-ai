export default function emailPasswordReset(
  resetUrl: string,
  resetToken: string
) {
  return `
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml"><head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Segoe UI", sans-serif;
          mso-line-height-rule: exactly;
        }
        .mso-break-all {
          word-break: break-all;
        }
      </style>
    <![endif]-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;display=swap" rel="stylesheet" media="screen">
    <style>.m-0 {
    margin: 0 !important
}
.mx-auto {
    margin-left: auto !important;
    margin-right: auto !important
}
.my-4 {
    margin-top: 16px !important;
    margin-bottom: 16px !important
}
.mb-6 {
    margin-bottom: 24px !important
}
.mt-2 {
    margin-top: 8px !important
}
.mt-3 {
    margin-top: 12px !important
}
.mt-4 {
    margin-top: 16px !important
}
.inline-block {
    display: inline-block !important
}
.table {
    display: table !important
}
.hidden {
    display: none !important
}
.w-36 {
    width: 144px !important
}
.w-552px {
    width: 552px !important
}
.w-full {
    width: 100% !important
}
.max-w-full {
    max-width: 100% !important
}
.max-w-xl {
    max-width: 288px !important
}
.list-disc {
    list-style-type: disc !important
}
.rounded {
    border-radius: 4px !important
}
.rounded-lg {
    border-radius: 8px !important
}
.rounded-b-lg {
    border-bottom-right-radius: 8px !important;
    border-bottom-left-radius: 8px !important
}
.rounded-t-lg {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important
}
.border {
    border-width: 1px !important
}
.border-l-4 {
    border-left-width: 4px !important
}
.border-blue-300 {
    border-color: #93c5fd !important
}
.border-gray-900 {
    border-color: #111827 !important
}
.bg-blue-100 {
    background-color: #dbeafe !important
}
.bg-gray-100 {
    background-color: #f3f4f6 !important
}
.bg-gray-50 {
    background-color: #f9fafb !important
}
.bg-gray-900 {
    background-color: #111827 !important
}
.bg-slate-50 {
    background-color: #f8fafc !important
}
.bg-slate-950 {
    background-color: #020617 !important
}
.bg-white {
    background-color: #fffffe !important
}
.p-0 {
    padding: 0 !important
}
.p-4 {
    padding: 16px !important
}
.p-6 {
    padding: 24px !important
}
.px-6 {
    padding-left: 24px !important;
    padding-right: 24px !important
}
.px-9 {
    padding-left: 36px !important;
    padding-right: 36px !important
}
.py-2 {
    padding-top: 8px !important;
    padding-bottom: 8px !important
}
.py-3 {
    padding-top: 12px !important;
    padding-bottom: 12px !important
}
.py-6 {
    padding-top: 24px !important;
    padding-bottom: 24px !important
}
.pl-5 {
    padding-left: 20px !important
}
.text-left {
    text-align: left !important
}
.text-center {
    text-align: center !important
}
.text-right {
    text-align: right !important
}
.font-inter {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif !important
}
.text-2xl {
    font-size: 24px !important
}
.text-2xl-8 {
    font-size: 24px !important;
    line-height: 32px !important
}
.text-base-6 {
    font-size: 16px !important;
    line-height: 24px !important
}
.text-lg {
    font-size: 18px !important
}
.text-sm {
    font-size: 14px !important
}
.text-xl {
    font-size: 20px !important
}
.text-xs {
    font-size: 12px !important
}
.text-xs-5 {
    font-size: 12px !important;
    line-height: 20px !important
}
.font-semibold {
    font-weight: 600 !important
}
.italic {
    font-style: italic !important
}
.text-gray-500 {
    color: #6b7280 !important
}
.text-gray-600 {
    color: #4b5563 !important
}
.text-gray-900 {
    color: #111827 !important
}
.text-slate-500 {
    color: #64748b !important
}
.text-slate-600 {
    color: #475569 !important
}
.text-slate-800 {
    color: #1e293b !important
}
.text-slate-900 {
    color: #0f172a !important
}
.text-white {
    color: #fffffe !important
}
.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important
}
.underline {
    text-decoration: underline !important
}
.mso-font-width-150pc {
    mso-font-width: 150%
}
.-webkit-font-smoothing-antialiased {
    -webkit-font-smoothing: antialiased !important
}
.border-1px_solid_themecolors_slate_200 {
    border: 1px solid #e2e8f0 !important
}
.word-break-break-word {
    word-break: break-word !important
}
      img {
    max-width: 100%;
    vertical-align: middle
}
      .hover-bg-slate-800:hover {
    background-color: #1e293b !important
}
      @media (max-width: 600px) {
    .sm-p-6 {
        padding: 24px !important
    }
    .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
    }
    .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
    }
}</style>
    <style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");
      * {
        font-family: "Inter", sans-serif;
      }</style>
    
  <script src="/hmr.js"></script></head>
  <body class="m-0 p-0 w-full word-break-break-word -webkit-font-smoothing-antialiased">
    <div role="article" aria-roledescription="email" aria-label="" lang="en">
      
  
    <table class="w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg" role="presentation" cellpadding="0" cellspacing="0">
      <tbody><tr>
        <td class="bg-gray-900 text-center p-6 rounded-t-lg">
          <img src="/api/placeholder/180/90" alt="Cóndor-AI Logo" class="mx-auto w-36">
          <h1 class="text-white text-lg font-semibold mt-2">
            Restablecimiento de contraseña
          </h1>
        </td>
      </tr>
      <tr>
        <td class="p-6">
          <h2 class="text-gray-900 text-xl font-semibold">
            Restablece tu contraseña
          </h2>
          <p class="text-gray-600">Hola,</p>
          <p class="text-gray-600">
            Hemos recibido una solicitud para restablecer la contraseña de tu
            cuenta en <strong>Cóndor-AI</strong>. Para continuar, sigue el
            enlace a continuación.
          </p>
          <div class="bg-gray-50 p-4 border border-blue-300 rounded-lg text-center my-4">
            <p class="text-gray-600">
              Haz clic en el botón de abajo para restablecer tu contraseña:
            </p>
            <a href="${resetUrl}" class="inline-block mt-3 px-6 py-2 bg-gray-900 text-white rounded text-sm font-semibold">Restablecer contraseña</a>
            <p class="text-gray-500 text-sm italic mt-2">
              Este enlace expira en 1 hora.
            </p>
          </div>
          <p class="text-gray-600">
            Si el botón no funciona, usa este código de restablecimiento:
          </p>
          <div class="text-gray-900 text-2xl font-semibold text-center py-3">
            ${resetToken}
          </div>
          <div class="bg-blue-100 border-l-4 border-gray-900 p-4 rounded-lg">
            <p class="text-gray-900 font-semibold">¿Cómo usar el código?</p>
            <ul class="list-disc pl-5 text-gray-600">
              <li>
                Ingresa a la página de restablecimiento de contraseña de
                Cóndor-AI
              </li>
              <li>Introduce el código de 6 dígitos mostrado arriba</li>
              <li>Crea una nueva contraseña segura</li>
            </ul>
          </div>
          <p class="text-gray-600 mt-4">
            Si no solicitaste este restablecimiento, ignora este correo o
            contáctenos.
          </p>
          <p class="text-gray-600">
            Nunca compartas tu contraseña ni respondas a correos solicitando tus
            credenciales.
          </p>
          <p class="text-gray-900 font-semibold">El equipo de Cóndor-AI</p>
        </td>
      </tr>
      <tr>
        <td class="text-center text-gray-500 text-xs p-4 bg-gray-100 rounded-b-lg">
          <p>© 2025 Cóndor-AI | Todos los derechos reservados</p>
          <p>Av. Providencia 1234, Santiago, Chile</p>
        </td>
      </tr>
    </tbody></table>
  

    </div>
  


</body></html>
  `;
}
