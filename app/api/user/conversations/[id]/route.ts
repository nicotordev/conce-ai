import { auth } from "@/auth";
import googleGenerativeAI from "@/lib/@google-generative-ai";
import { fetchGoogleViaBrightData } from "@/lib/brightDataClient";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { AuthenticatedNextRequest, CustomApiHandler } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { MessageSender } from "@prisma/client";
import { NextRequest } from "next/server";

const getUserConversationHandler = async (
  req: AuthenticatedNextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = req.session;
    const { id: conversationId } = await params;

    if (typeof conversationId !== "string") {
      return ApiResponse.badRequest("Invalid conversation id");
    }

    const conversations = await prisma.conversation.findUnique({
      where: {
        userId: session.user.id,
        id: conversationId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: true,
          },
        },
      },
    });

    return ApiResponse.ok(conversations);
  } catch (err) {
    logger.error(`[ERROR-USER-CONVERSATION-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = (await auth())!;
  try {
    const { id } = await params;
    const { message, modelId } = await req.json();

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            content: true,
            sender: true,
          },
        },
      },
    });

    if (!conversation) {
      return ApiResponse.badRequest("Invalid conversation id");
    }

    const model = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!model) {
      return ApiResponse.badRequest("Invalid model id");
    }

    const aiModel = await googleGenerativeAI.genAI.getGenerativeModel({
      model: model.name,
    });

    const chat = aiModel.startChat({
      history: conversation.messages.map((msg) => ({
        role: msg.sender === MessageSender.USER ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const preSearch = await chat.sendMessage(
      `Convierte la frase "${message}" en una búsqueda concreta para Google en lenguaje natural.`
    );
    const searchQuery = preSearch.response.text().trim();
    const searchResults = (await fetchGoogleViaBrightData(searchQuery)) ?? [];

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encodeSSE("start"));

        try {
          let finalText = "";
          const escapedMessage = message.replace(/"/g, "'").replace(/\n/g, " ");
          const userName = session.user.name || "Usuario Anónimo";
          const userEmail = session.user.email;
          const convTitle = conversation.title || "Sin título";

          const historyFormatted = conversation.messages
            .map((msg, index) => {
              const sender =
                msg.sender === MessageSender.USER ? "Usuario" : "Condor-ai";
              const content = msg.content
                .replace(/"/g, "'")
                .replace(/\n/g, " ");
              return `${index + 1}. [${sender}]: "${content}"`;
            })
            .join("\n");

          const searchFormatted = searchResults.length
            ? searchResults
                .map((r, i) => {
                  const resumen =
                    r.textPreview?.join(" ").slice(0, 300) ?? "(sin resumen)";
                  return `${i + 1}. [${r.title}]: ${
                    r.link
                  }\nResumen: ${resumen}`;
                })
                .join("\n\n")
            : "Sin resultados de búsqueda.";

          const prompt = `
                  ### Información del usuario
                  - Nombre: ${userName}
                  - Email: ${userEmail}

                  ### Conversación
                  - ID: ${conversation.id}
                  - Título: ${convTitle}
                  - Mensaje actual: "${escapedMessage}"
                  - Historial (${conversation.messages.length} mensajes):
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
          console.log(prompt);

          const { stream } = await chat.sendMessageStream(prompt);
          for await (const chunk of stream) {
            const text = chunk.text();
            finalText = `${finalText}${text}`;
            controller.enqueue(encodeSSE(text));
          }

          await prisma.conversation.update({
            where: { id },
            data: {
              messages: {
                create: {
                  content: message,
                  sender: MessageSender.USER,
                },
              },
            },
          });
          await prisma.message.create({
            data: {
              content: finalText,
              sender: MessageSender.ASSISTANT,
              conversationId: id,
            },
          });

          controller.enqueue(encodeSSE("done"));
          controller.close();
        } catch (streamErr) {
          logger.error("[STREAM-ERROR]", streamErr);
          controller.enqueue(encodeSSE("error"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    logger.error("[ERROR-UPDATE-CONVERSATION]", err);
    return new Response("data: error\n\n", {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      status: 500,
    });
  }
};

function encodeSSE(data: string) {
  return new TextEncoder().encode(`data: ${data}\n\n`);
}

const GET = withApiAuthRequired(
  getUserConversationHandler as unknown as CustomApiHandler
);

export { GET, PATCH };
