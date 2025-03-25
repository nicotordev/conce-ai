"use server";
import aiConstants from "@/constants/ai.constants";
import googleGenerativeAI from "@/lib/@google-generative-ai";
import { fetchGoogleViaBrightDataWithQueryEvaluation } from "@/lib/brightDataClient";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import {
  AppSuggestionIcon,
  Message,
  MessageSender,
  Model,
} from "@prisma/client";
import { Session } from "next-auth";
import { v4 } from "uuid";
import { extractValidJSON } from "./json.utils";
import { AppSuggestionAiItem } from "@/types/@google-generative-ai";

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

  const searchResults = await fetchGoogleViaBrightDataWithQueryEvaluation(
    newMessage.replace(/"/g, "'").replace(/\n/g, " "),
    modelName,
    messages
  );

  const escapedMessage = newMessage.replace(/"/g, "'").replace(/\n/g, " ");
  const userName = session.user.name || "Usuario Anónimo";
  const userEmail = session.user.email;
  const convTitle = title || "Sin título";

  const prompt = aiConstants.promptsConstants.mainPrompt
    .replaceAll("{{userName}}", userName)
    .replaceAll("{{userEmail}}", userEmail || "")
    .replaceAll("{{conversation.id}}", v4())
    .replaceAll("{{convTitle}}", convTitle)
    .replaceAll("{{escapedMessage}}", escapedMessage)
    .replaceAll(
      "{{searchResults}}",
      JSON.stringify(searchResults, null, 2) || ""
    );

  const result = await chat.sendMessage(prompt);
  const responseText = result.response.text();

  return responseText;
}

async function getAppSuggestionsForBar() {
  const appSuggestions = await prisma.appSuggestion.findMany({});

  const lastUpdatedDate =
    appSuggestions.length > 0
      ? appSuggestions.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )[0].updatedAt
      : new Date(0);

  /**
   *  Watch if the last updated date is older than 1 hour
   */

  if (
    appSuggestions.length > 0 ||
    lastUpdatedDate.getTime() > new Date().getTime() - 3600000
  ) {
    const prompt = aiConstants.promptsConstants.suggestions;
    const aiModel = googleGenerativeAI.genAI.getGenerativeModel({
      model: aiConstants.DEFAULT_AI,
    });

    const result = await aiModel.generateContent(prompt);
    const responseText = result.response.text();
    const responseObject =
      extractValidJSON<AppSuggestionAiItem[]>(responseText);

    if (responseObject && Array.isArray(responseObject)) {
      await prisma.appSuggestion.deleteMany();
      const createdSuggestions = await prisma.appSuggestion.createManyAndReturn(
        {
          data: responseObject.map((suggestion) => ({
            label: suggestion.label,
            icon:
              suggestion.icon.toLowerCase() === "pensando"
                ? AppSuggestionIcon.PENSANDO
                : suggestion.icon.toLowerCase() === "alegre"
                ? AppSuggestionIcon.ALEGRE
                : suggestion.icon.toLowerCase() === "misterioso"
                ? AppSuggestionIcon.MISTERIOSO
                : suggestion.icon.toLowerCase() === "tecnologico"
                ? AppSuggestionIcon.TECNOLOGICO
                : AppSuggestionIcon.CREATIVO,
          })),
        }
      );

      return createdSuggestions;
    }
  }

  return appSuggestions;
}

export {
  getGoogleGenerativeAIModels,
  generateConversationTitle,
  getBasicAiConversationResponse,
  getAppSuggestionsForBar,
};
