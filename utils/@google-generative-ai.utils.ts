"use server";
import googleGenerativeAI from "@/lib/@google-generative-ai";
import { fetchGoogleViaBrightData } from "@/lib/brightDataClient";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { Message, MessageSender, Model } from "@prisma/client";
import { Session } from "next-auth";

async function getGoogleGenerativeAIModels(): Promise<Model[]> {
  const currentModels = await prisma.model.findMany();

  /**
   * If no models are found in the database, fetch models from Google Generative AI
   */
  if (currentModels.length === 0) {
    const newModels = await googleGenerativeAI.getModels();

    if (newModels.length === 0) {
      return [];
    }

    const createdModels = await prisma.model.createManyAndReturn({
      data: newModels,
    });

    return createdModels;
  }

  /**
   * If models are found in the database, check that the update date is not older than 1 day
   */

  const lastUpdatedDate = currentModels[0].updatedAt;
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - lastUpdatedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    await prisma.model.deleteMany();
    const newModels = await googleGenerativeAI.getModels();

    if (newModels.length === 0) {
      return [];
    }

    const createdModels = await prisma.model.createManyAndReturn({
      data: newModels,
    });

    return createdModels;
  }

  return currentModels;
}

async function generateConversationTitle(message: string): Promise<string> {
  try {
    const aiModel = googleGenerativeAI.genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash-001", //  O el modelo que uses para generación de texto
    });

    const prompt = `
    Instrucciones:
    1. Genera un título corto y conciso para una conversación.
    2. El primer mensaje de la conversación es: "${message}".
    3. El título debe tener como máximo 5 palabras.
    4. El título debe ser relevante al tema principal del mensaje.
    5. El título debe estar en el mismo idioma que el mensaje.
    6. Evita generar títulos que contengan lenguaje ofensivo, inapropiado o controvertido. Si el mensaje contiene malas palabras, reformula el título para evitar incluirlas, pero manteniendo el tema principal.
    7. Si el mensaje no proporciona suficiente información para generar un título relevante, usa un título genérico como "Nueva Conversación" o "Tema General".
    8. Si el mensaje es incomprensible o contiene solo caracteres aleatorios, usa el título "Sin Tema Definido".
    9.  Elimina comillas o caracteres especiales al inicio o final del titulo generado.

    Ejemplos de buenos títulos:
    - Mensaje: "Cómo puedo configurar mi cuenta?" -> Título: Configuración de la cuenta
    - Mensaje: "Necesito ayuda para resolver un problema técnico." -> Título: Ayuda técnica
    - Mensaje: "Qué es la inteligencia artificial?" -> Título: Inteligencia Artificial

    Ejemplo de título INAPROPIADO (a evitar):
    - (Si el mensaje contiene groserías) NO generar un título que refleje o incluya esas groserías.

    Respuesta: (Solo el título, sin explicaciones adicionales)
  `;

    const result = await aiModel.generateContent(prompt);
    const responseText = result.response.text();

    // Limpiar el título: eliminar comillas, puntos finales y espacios en blanco adicionales
    const cleanTitle = responseText
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\.$/, "");

    return cleanTitle;
  } catch (error) {
    logger.error(`[ERROR-GENERATE-CONVERSATION-TITLE]`, error);
    // En caso de error, devolver un título genérico o lanzar el error, según tu preferencia
    return "Nueva Conversación"; // o throw error;
  }
}

async function getBasicAiConversationResponse(
  messages: Message[],
  modelName: string,
  newMessage: string,
  session: Session,
  title: string
) {
  const aiModel = googleGenerativeAI.genAI.getGenerativeModel({
    model: modelName,
  });

  const chat = aiModel.startChat({
    history: messages.map((message) => ({
      role: message.sender === MessageSender.USER ? "user" : "model",
      parts: [{ text: message.content }],
    })),
  });

  const preSearch = await chat.sendMessage(
    `Convierte la frase "${newMessage}" en una búsqueda concreta para Google en lenguaje natural, se corto y especifico, por favor.`
  );
  const searchQuery = preSearch.response.text().trim();
  const searchResults = (await fetchGoogleViaBrightData(searchQuery)) ?? [];

  const escapedMessage = newMessage.replace(/"/g, "'").replace(/\n/g, " ");
  const userName = session.user.name || "Usuario Anónimo";
  const userEmail = session.user.email;
  const convTitle = title || "Sin título";

  const historyFormatted = messages
    .map((msg, index) => {
      const sender =
        msg.sender === MessageSender.USER ? "Usuario" : "Condor-ai";
      const content = msg.content.replace(/"/g, "'").replace(/\n/g, " ");
      return `${index + 1}. [${sender}]: "${content}"`;
    })
    .join("\n");

  const searchFormatted = searchResults.length
    ? searchResults
        .map((r, i) => `${i + 1}. [${r.title}]: ${r.link}`)
        .join("\n")
    : "Sin resultados de búsqueda.";

  const prompt = `
### Información del usuario
- Nombre: ${userName}
- Email: ${userEmail}

### Conversación
- Título: ${convTitle}
- Mensaje actual: "${escapedMessage}"
- Historial (${messages.length} mensajes):
${historyFormatted}

### Instrucciones para Condor-ai
Ya se hizo una búsqueda en Google y se extrajo contenido de los resultados reales. Tu tarea es **responder usando solo esa información**, evitando suposiciones. Si no hay suficiente info, dilo claramente, pero sin inventar.
Debes responder de forma cercana y clara, como una IA chilena útil y aperrada.
${searchFormatted}

### Instrucciones para Condor-ai
Eres **Condor-ai**, una inteligencia artificial chilena, informada, confiable y aperrada. Tu misión es ayudar con respuestas claras, útiles y actualizadas, con un tono cercano y chileno. No eres un robot fome ni genérico: hablas como alguien que vive en Chile, entiende la cultura local y sabe adaptarse al tono del usuario, sin pasarte de confianzudo.

🔎 Siempre que puedas, busca información en línea para entregar datos actualizados al momento.  
📅 Si no puedes buscar, responde con lo más completo que sepas hasta tu última actualización.  
📌 Nunca digas "no tengo información". En vez de eso, explica lo que sabes, por ejemplo:  
- "Hasta la última vez que revisé..."  
- "Según lo que se sabía en ese momento..."  
- "No hay info nueva, pero esto es lo que se manejaba..."  

🎯 Usa expresiones chilenas de manera natural cuando ayuden a conectar, pero no abuses. Ejemplos: "al tiro", "bacán", "ojo con eso", "pucha", "buena onda", "cacha esto", etc.  
💬 Sé claro y directo. Si el tema lo permite, usa ejemplos locales, menciona datos de Chile y ten presente el contexto nacional.

Tu estilo es profesional, empático y ágil. No adornes demasiado, ve al grano, pero siempre con actitud de buena onda. Querís ayudar, no marear.

### Responde ahora como Condor-ai:
Mensaje del usuario: "${escapedMessage}"
`;

  const result = await chat.sendMessage(prompt);
  const responseText = result.response.text();

  return responseText;
}

export {
  getGoogleGenerativeAIModels,
  generateConversationTitle,
  getBasicAiConversationResponse,
};
