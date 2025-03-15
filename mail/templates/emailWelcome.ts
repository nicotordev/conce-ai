export default function emailWelcome(verificationUrl: string) {
  return `
<x-main>
  <table class="w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg" role="presentation">
    <tr>
      <td class="bg-gray-900 text-center p-6 rounded-t-lg">
        <img src="/api/placeholder/180/90" alt="Cóndor-AI Logo" class="mx-auto w-36" />
        <h1 class="text-white text-lg font-semibold mt-2">¡Bienvenido a Cóndor-AI!</h1>
      </td>
    </tr>
    <tr>
      <td class="p-6">
        <p class="text-blue-600 text-lg font-semibold">¡Hola! Qué gusto tenerte con nosotros</p>
        <p class="text-gray-600">Es un verdadero placer darte la bienvenida a <strong>Cóndor-AI</strong>. Como el cóndor que recorre los Andes, estamos aquí para ayudarte a alcanzar nuevas alturas en tus proyectos personales y profesionales.</p>
        <div class="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg italic text-gray-700">
          <p>"Desde las alturas de los Andes hasta la profundidad del Pacífico, comprendo nuestra cultura, nuestra forma de comunicarnos y nuestras necesidades únicas."</p>
        </div>
        <p class="text-gray-600">Tu cuenta ha sido creada exitosamente y ahora debes verificar tu cuenta. ¡Estamos esperándote para comenzar!</p>
        <div class="bg-gray-50 p-4 border border-gray-300 rounded-lg text-center my-4">
          <p class="text-gray-600">Haz clic en el botón de abajo para comenzar:</p>
          <a href="${verificationUrl}" class="inline-block mt-3 px-6 py-2 bg-gray-900 text-white rounded text-sm font-semibold">Verificar mi cuenta</a>
        </div>
        <h3 class="text-gray-900 text-lg font-semibold">¿Qué puedo hacer por ti?</h3>
        <ul class="list-disc pl-5 text-gray-600">
          <li><strong>Entiendo el español chileno</strong> con todas sus expresiones y modismos locales.</li>
          <li><strong>Redacto documentos profesionales</strong> adaptados a estándares y formatos chilenos.</li>
          <li><strong>Desarrollo código optimizado</strong> para las necesidades específicas de empresas latinoamericanas.</li>
          <li><strong>Analizo datos</strong> considerando el contexto económico y social de Chile.</li>
          <li><strong>Respondo consultas</strong> teniendo en cuenta las leyes y regulaciones chilenas.</li>
        </ul>
        <p class="text-gray-600 mt-4">Si tienes alguna pregunta o necesitas ayuda, responde a este correo y nuestro equipo estará encantado de asistirte.</p>
        <p class="text-gray-900 font-semibold">El equipo de Cóndor-AI</p>
      </td>
    </tr>
    <tr>
      <td class="text-center text-gray-500 text-xs p-4 bg-gray-100 rounded-b-lg">
        <p>&copy; 2025 Cóndor-AI | Todos los derechos reservados</p>
        <p>Av. Providencia 1234, Santiago, Chile</p>
        <p class="text-xs mt-2">Si prefieres no recibir más comunicaciones, <a href="#" class="text-blue-600">haz clic aquí</a> para administrar tus preferencias.</p>
      </td>
    </tr>
  </table>
</body>
</x-main>

    `;
}
