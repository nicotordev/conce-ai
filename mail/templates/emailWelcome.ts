export default function emailWelcome() {
  return `
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Cóndor-AI</title>
   </head>
   <body>
      <div class="container" style="max-width: 600px;margin: 0 auto;padding: 0;background-color: #ffffff;">
         <div class="header" style="text-align: center;padding: 30px 0;background: linear-gradient(135deg, #007bff, #42b584);">
            <img src="/api/placeholder/180/90" alt="Cóndor-AI Logo" style="max-width: 180px;">
            <h1 style="font-family: 'Space Grotesk', sans-serif;color: #ffffff;margin: 0;font-size: 28px;font-weight: 700;letter-spacing: -0.02em;">¡Bienvenido a Cóndor-AI!</h1>
         </div>
         <div class="content" style="padding: 32px 40px;">
            <p class="greeting" style="font-family: 'Inter', sans-serif;color: #007bff;font-size: 18px;margin-bottom: 16px;font-weight: 600;">¡Hola! Qué gusto tenerte con nosotros</p>
            <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">Es un verdadero placer darte la bienvenida a <strong>Cóndor-AI</strong>, la primera inteligencia artificial para chilenos y latinoamericanos. Como el cóndor que recorre los Andes, estoy aquí para ayudarte a alcanzar nuevas alturas en tus proyectos personales y profesionales.</p>
            <div class="quote" style="background-color: #e8f5f0;border-left: 4px solid #42b584;padding: 16px 20px;margin: 24px 0;font-family: 'Lora', serif;font-style: italic;color: #236248;border-radius: 0 8px 8px 0;">
               <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">"Desde las alturas de los Andes hasta la profundidad del Pacífico, comprendo nuestra cultura, nuestra forma de comunicarnos y nuestras necesidades únicas."</p>
            </div>
            <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">Tu cuenta ha sido crada exitosamente y ahora tienes que verificar tu cuenta. ¡Estamos esperandote para comenzar!</p>
            <div class="features" style="background-color: #edfaff;padding: 20px 24px;border-radius: 8px;margin: 24px 0;">
               <h3 style="font-family: 'Space Grotesk', sans-serif;color: #1e293b;margin-top: 0;font-size: 18px;">¿Qué puedo hacer por ti?</h3>
               <div class="feature-item" style="margin-bottom: 12px;display: flex;align-items: flex-start;">
                  <span class="feature-icon" style="color: #38a175;margin-right: 10px;font-weight: bold;">✓</span>
                  <span class="feature-text" style="font-family: 'Inter', sans-serif;color: #334155;"><strong>Entiendo el español chileno</strong> con todas sus expresiones y modismos locales.</span>
               </div>
               <div class="feature-item" style="margin-bottom: 12px;display: flex;align-items: flex-start;">
                  <span class="feature-icon" style="color: #38a175;margin-right: 10px;font-weight: bold;">✓</span>
                  <span class="feature-text" style="font-family: 'Inter', sans-serif;color: #334155;"><strong>Redacto documentos profesionales</strong> adaptados a estándares y formatos chilenos.</span>
               </div>
               <div class="feature-item" style="margin-bottom: 12px;display: flex;align-items: flex-start;">
                  <span class="feature-icon" style="color: #38a175;margin-right: 10px;font-weight: bold;">✓</span>
                  <span class="feature-text" style="font-family: 'Inter', sans-serif;color: #334155;"><strong>Desarrollo código optimizado</strong> para las necesidades específicas de empresas latinoamericanas.</span>
               </div>
               <div class="feature-item" style="margin-bottom: 12px;display: flex;align-items: flex-start;">
                  <span class="feature-icon" style="color: #38a175;margin-right: 10px;font-weight: bold;">✓</span>
                  <span class="feature-text" style="font-family: 'Inter', sans-serif;color: #334155;"><strong>Analizo datos</strong> considerando el contexto económico y social de Chile.</span>
               </div>
               <div class="feature-item" style="margin-bottom: 12px;display: flex;align-items: flex-start;">
                  <span class="feature-icon" style="color: #38a175;margin-right: 10px;font-weight: bold;">✓</span>
                  <span class="feature-text" style="font-family: 'Inter', sans-serif;color: #334155;"><strong>Respondo consultas</strong> teniendo en cuenta las leyes y regulaciones chilenas.</span>
               </div>
            </div>
            <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">Para comenzar a usar Cóndor-AI, simplemente haz clic en el botón de abajo:</p>
            <div style="text-align: center;">
               <a href="#" class="button" style="display: inline-block;padding: 12px 24px;background-color: #007bff;color: #ffffff;text-decoration: none;border-radius: 6px;margin-top: 24px;font-weight: 600;font-family: 'Poppins', sans-serif;font-size: 14px;transition: all 0.2s ease;">COMENZAR AHORA</a>
            </div>
            <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">Te enviaremos algunos consejos prácticos en los próximos días para ayudarte a aprovechar al máximo todas mis capacidades. Si tienes alguna pregunta o necesitas ayuda inmediata, responde a este correo y nuestro equipo estará encantado de asistirte.</p>
            <div class="signature" style="margin-top: 32px;font-family: 'Space Grotesk', sans-serif;">
               <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">¡Un cordial saludo desde los Andes digitales!<br>
                  <strong>Cóndor-AI</strong><br>
                  <span style="font-size: 14px; color: #64748b;">La inteligencia artificial chilena</span>
               </p>
            </div>
            <div class="social" style="margin-top: 32px;padding-top: 20px;border-top: 1px solid #e3e3e3;">
               <a href="#" style="margin: 0 10px;text-decoration: none;color: #007bff;font-family: 'Lato', sans-serif;font-size: 14px;">Facebook</a> |
               <a href="#" style="margin: 0 10px;text-decoration: none;color: #007bff;font-family: 'Lato', sans-serif;font-size: 14px;">Twitter</a> |
               <a href="#" style="margin: 0 10px;text-decoration: none;color: #007bff;font-family: 'Lato', sans-serif;font-size: 14px;">LinkedIn</a> |
               <a href="#" style="margin: 0 10px;text-decoration: none;color: #007bff;font-family: 'Lato', sans-serif;font-size: 14px;">Instagram</a>
            </div>
         </div>
         <div class="footer" style="text-align: center;padding: 24px;font-size: 13px;color: #64748b;background-color: #f8fafc;font-family: 'Lato', sans-serif;">
            <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">© 2025 Cóndor-AI | Todos los derechos reservados</p>
            <p style="font-family: 'Inter', sans-serif;color: #334155;font-size: 15px;margin-bottom: 16px;">Av. Providencia 1234, Santiago, Chile</p>
            <p style="margin-top: 12px;font-size: 12px;font-family: 'Inter', sans-serif;color: #334155;margin-bottom: 16px;">Si prefieres no recibir más comunicaciones, <a href="#" style="color: #007bff;">haz clic aquí</a> para administrar tus preferencias.</p>
         </div>
      </div>
   </body>
</html>
    `;
}
