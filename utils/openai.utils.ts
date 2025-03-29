"use server";
import aiConstants from "@/constants/ai.constants";
import openAIClient from "@/lib/open-ai";
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
import { AppSuggestionAiItem } from "@/types/openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

async function getOpenAIModels(): Promise<Model[]> {
  const currentModels = await prisma.model.findMany();

  /**
   * If no models are found in the database, fetch models from OpenAI
   */
  if (currentModels.length === 0) {
    try {
      const response = await openAIClient.models.list();
      const newModels = response.data.map((model) => ({
        id: v4(),
        name: model.id,
        version: model.id.includes(":") ? model.id.split(":")[1] : "1",
        displayName: model.id,
        description: getModelDescription(model.id),
        inputTokenLimit: getModelTokenLimit(model.id).input,
        outputTokenLimit: getModelTokenLimit(model.id).output,
        supportedGenerationMethods: [
          "chat.completions",
          "completions",
          "embeddings",
        ],
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxTemperature: 2.0,
      }));

      if (newModels.length === 0) {
        return [];
      }

      const createdModels = await prisma.model.createManyAndReturn({
        data: newModels,
      });

      return createdModels;
    } catch (error) {
      logger.error("[ERROR-GET-OPENAI-MODELS]", error);
      return [];
    }
  }

  /**
   * If models are found in the database, check that the update date is not older than 1 day
   */

  const lastUpdatedDate = currentModels[0].updatedAt;
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - lastUpdatedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    try {
      await prisma.model.deleteMany();
      const response = await openAIClient.models.list();
      const newModels = response.data.map((model) => ({
        id: v4(),
        name: model.id,
        version: model.id.includes(":") ? model.id.split(":")[1] : "1",
        displayName: model.id,
        description: getModelDescription(model.id),
        inputTokenLimit: getModelTokenLimit(model.id).input,
        outputTokenLimit: getModelTokenLimit(model.id).output,
        supportedGenerationMethods: [
          "chat.completions",
          "completions",
          "embeddings",
        ],
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxTemperature: 2.0,
      }));

      if (newModels.length === 0) {
        return [];
      }

      const createdModels = await prisma.model.createManyAndReturn({
        data: newModels,
      });

      return createdModels;
    } catch (error) {
      logger.error("[ERROR-GET-OPENAI-MODELS]", error);
      return currentModels; // Return existing models in case of error
    }
  }

  return currentModels;
}

/**
 * Helper function to get token limits based on model ID
 */
function getModelTokenLimit(modelId: string): {
  input: number;
  output: number;
} {
  const modelIdLower = modelId.toLowerCase();

  if (
    modelIdLower.includes("gpt-4-turbo") ||
    modelIdLower.includes("gpt-4-1106")
  ) {
    return { input: 128000, output: 4096 };
  } else if (modelIdLower.includes("gpt-4-32k")) {
    return { input: 32768, output: 4096 };
  } else if (modelIdLower.includes("gpt-4")) {
    return { input: 8192, output: 4096 };
  } else if (modelIdLower.includes("gpt-3.5-turbo-16k")) {
    return { input: 16384, output: 4096 };
  } else if (modelIdLower.includes("gpt-3.5-turbo")) {
    return { input: 4096, output: 4096 };
  } else if (modelIdLower.includes("text-embedding")) {
    return { input: 8191, output: 1536 };
  } else {
    // Default for unknown models
    return { input: 4096, output: 4096 };
  }
}

/**
 * Helper function to generate model descriptions
 */
function getModelDescription(modelId: string): string {
  const modelIdLower = modelId.toLowerCase();

  if (modelIdLower.includes("gpt-4-turbo")) {
    return "Most capable GPT-4 model optimized for speed. Improved ability for task completion, JSON mode, etc.";
  } else if (modelIdLower.includes("gpt-4-32k")) {
    return "GPT-4 model with extended context window of 32k tokens.";
  } else if (modelIdLower.includes("gpt-4")) {
    return "Most capable GPT-4 model for complex tasks.";
  } else if (modelIdLower.includes("gpt-3.5-turbo-16k")) {
    return "GPT-3.5 Turbo model with extended context window of 16k tokens.";
  } else if (modelIdLower.includes("gpt-3.5-turbo")) {
    return "Most capable GPT-3.5 model optimized for chat at 1/10th the cost of GPT-4.";
  } else if (modelIdLower.includes("text-embedding")) {
    return "Model for generating text embeddings to measure relatedness between texts.";
  } else {
    return `OpenAI model: ${modelId}`;
  }
}

async function generateConversationTitle(message: string): Promise<string> {
  try {
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

    const completion = await openAIClient.chat.completions.create({
      model: "gpt-4-turbo", // Or your preferred model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates concise conversation titles.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 30,
    });

    const responseText = completion.choices[0].message.content || "";

    // Limpiar el título: eliminar comillas, puntos finales y espacios en blanco adicionales
    const cleanTitle = responseText
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\.$/, "");

    return cleanTitle ?? `Tu conversación del ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
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
  try {
    const escapedMessage = newMessage.replace(/"/g, "'").replace(/\n/g, " ");
    const userName = session.user.name || "Usuario Anónimo";
    const userEmail = session.user.email;
    const convTitle = title || "Sin título";

    const prompt = aiConstants.promptsConstants.mainPrompt
      .replaceAll("{{userName}}", userName)
      .replaceAll("{{userEmail}}", userEmail || "")
      .replaceAll("{{conversation.id}}", v4())
      .replaceAll("{{convTitle}}", convTitle)
      .replaceAll("{{escapedMessage}}", escapedMessage);

    // Map message history to OpenAI format
    const messageHistory: ChatCompletionMessageParam[] = messages.map(
      (message) => ({
        role: message.sender === MessageSender.USER ? "user" : "assistant",
        content: message.content,
        name: userName,
      })
    );

    // Add system prompt and new user message
    const chatMessages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: prompt,
      },
      ...messageHistory,
      {
        role: "user",
        content: newMessage,
        name: userName,
      },
    ];

    // Get model configuration
    const modelConfig = await prisma.model.findFirst({
      where: { name: modelName },
    });

    const completion = await openAIClient.chat.completions.create({
      model: modelName,
      messages: chatMessages,
      temperature: modelConfig?.temperature || 0.7,
      top_p: modelConfig?.topP || 0.95,
      max_tokens: modelConfig?.outputTokenLimit || 4096,
    });

    const responseText = completion.choices[0].message.content || "";
    return responseText;
  } catch (error) {
    logger.error(`[ERROR-GET-BASIC-AI-CONVERSATION-RESPONSE]`, error);
    return "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.";
  }
}

async function getAppSuggestionsForBar() {
  try {
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

    const shouldUpdate =
      appSuggestions.length === 0 ||
      lastUpdatedDate.getTime() < new Date().getTime() - 3600000;

    if (shouldUpdate) {
      const prompt = aiConstants.promptsConstants.suggestions;

      // Get the default model
      const defaultModel = await prisma.model.findFirst({
        where: { name: aiConstants.DEFAULT_AI || "gpt-4-turbo" },
      });

      const completion = await openAIClient.chat.completions.create({
        model: defaultModel?.name || "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates app suggestions in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: defaultModel?.temperature || 0.7,
        top_p: defaultModel?.topP || 0.95,
      });

      const responseText = completion.choices[0].message.content || "[]";
      const responseObject = extractValidJSON<{
        suggestions: AppSuggestionAiItem[];
      }>(responseText);

      if (
        responseObject &&
        responseObject.suggestions &&
        Array.isArray(responseObject.suggestions)
      ) {
        await prisma.appSuggestion.deleteMany();
        const createdSuggestions =
          await prisma.appSuggestion.createManyAndReturn({
            data: responseObject.suggestions.map((suggestion) => ({
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
          });

        return createdSuggestions;
      }
    }

    return appSuggestions;
  } catch (err) {
    logger.error(`[ERROR-GET-APP-SUGGESTIONS-FOR-BAR]`, err);
    return [];
  }
}

export {
  getOpenAIModels,
  generateConversationTitle,
  getBasicAiConversationResponse,
  getAppSuggestionsForBar,
};
