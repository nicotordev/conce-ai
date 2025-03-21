"use server";
import googleGenerativeAI from "@/lib/@google-generative-ai";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { Message, MessageSender, Model } from "@prisma/client";

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
  newMessage: string
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

  const result = await chat.sendMessage(newMessage);
  const responseText = result.response.text();

  return responseText;
}

export {
  getGoogleGenerativeAIModels,
  generateConversationTitle,
  getBasicAiConversationResponse,
};
