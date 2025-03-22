import { auth } from "@/auth";
import promptsConstants from "@/constants/prompts.constants";
import googleGenerativeAI from "@/lib/@google-generative-ai";
import { fetchGoogleViaBrightDataWithQueryEvaluation } from "@/lib/brightDataClient";
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

    const searchResults = await fetchGoogleViaBrightDataWithQueryEvaluation(
      message.replace(/"/g, "'").replace(/\n/g, " "),
      model.name
    );

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encodeSSE("start"));

        try {
          const escapedMessage = message.replace(/"/g, "'").replace(/\n/g, " ");
          const userName = session.user.name || "Usuario Anónimo";
          const userEmail = session.user.email;
          const convTitle = conversation.title || "Sin título";

          const prompt = promptsConstants.mainPrompt
            .replaceAll("{{userName}}", userName)
            .replaceAll("{{userEmail}}", userEmail || "")
            .replaceAll("{{conversation.id}}", conversation.id)
            .replaceAll("{{convTitle}}", convTitle)
            .replaceAll("{{escapedMessage}}", escapedMessage)
            .replaceAll("{{searchResults}}", searchResults || "");

          // 🔥 Obtenemos todo el mensaje de la IA de una sola vez
          const aiMessage = await chat.sendMessage(prompt);
          const fullText = aiMessage.response.text();

          // ✂️ Simulamos un stream por partes (puede ser letra a letra, palabra por palabra, etc.)
          const chunks = fullText.split(/(?<=[.?!])\s+/); // Divide después de punto, signo de pregunta o exclamación
          
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log("enviando chunk:", chunk);
            controller.enqueue(encodeSSE(chunk));
            controller.enqueue(encodeSSE(chunk));
            await new Promise((res) => setTimeout(res, 50)); // 🕐 Delay de 50ms entre chunks
          }

          controller.enqueue(encodeSSE("done"));
          controller.close();

          // 💾 Guardamos en la BD al final
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
              content: fullText,
              sender: MessageSender.ASSISTANT,
              conversationId: id,
            },
          });
        } catch (streamErr) {
          console.error("[STREAM-ERROR]", streamErr);
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

function encodeSSE(data: string): Uint8Array {
  return new TextEncoder().encode(`data: ${data}\n\n`);
}

const GET = withApiAuthRequired(
  getUserConversationHandler as unknown as CustomApiHandler
);

export { GET, PATCH };
