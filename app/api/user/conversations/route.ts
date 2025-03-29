import aiConstants from "@/constants/ai.constants";
import logger from "@/lib/consola/logger";
import openAIClient from "@/lib/open-ai";
import prisma from "@/lib/prisma/index.prisma";
import { AuthenticatedNextRequest, CustomApiHandler } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { generateConversationTitle } from "@/utils/openai.utils";
import { MessageSender } from "@prisma/client";
import {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions.mjs";

const userGetConversationsHandler = async (req: AuthenticatedNextRequest) => {
  try {
    const session = req.session;

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return ApiResponse.ok(conversations);
  } catch (err) {
    logger.error(`[ERROR-USER-CONVERSATIONS-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const userCreateConversationHandler = async (req: AuthenticatedNextRequest) => {
  try {
    const session = req.session;

    const body = await req.json();

    const { message, modelId } = body;

    if (!session.user.id) {
      return ApiResponse.unauthorized();
    }

    const model = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!model) {
      return ApiResponse.badRequest("Invalid model id");
    }
    const conversationTitle = await generateConversationTitle(message);

    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        title: conversationTitle,
        messages: {
          create: {
            content: message,
            sender: MessageSender.USER,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    const escapedMessage = message.replace(/"/g, "'").replace(/\n/g, " ");
    const userName = session.user.name || "Usuario Anónimo";
    const userEmail = session.user.email || "";
    const convTitle = conversationTitle || "Sin título";

    const prompt = aiConstants.promptsConstants.mainPrompt
      .replaceAll("{{userName}}", userName)
      .replaceAll("{{userEmail}}", userEmail)
      .replaceAll("{{conversation.id}}", conversation.id)
      .replaceAll("{{convTitle}}", convTitle)
      .replaceAll("{{escapedMessage}}", escapedMessage);

    const openAiUsername = userName.replace(/[^a-zA-Z0-9_-]/g, "");

    const baseMessages: ChatCompletionMessageParam[] =
      conversation.messages.map((conversation) => ({
        role: conversation.sender === MessageSender.USER ? "user" : "assistant",
        content: conversation.content,
        name: openAiUsername,
      }));

    const completitionsBody: ChatCompletionCreateParams = {
      model: model.name,
      messages: [
        ...baseMessages,
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
      response_format: { type: "text" },
    };

    // 🚀 Iniciamos el stream desde OpenAI
    const aiStream = await openAIClient.chat.completions.create(
      completitionsBody
    );

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encodeSSE("start"));

        try {
          let fullText = "";

          // ✅ Utilizamos `for await...of` para procesar el stream correctamente
          for await (const chunk of aiStream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              controller.enqueue(encodeSSE(delta));
              fullText += delta;
            }
          }

          // ✅ Cuando el stream finaliza
          controller.enqueue(encodeSSE("done"));
          controller.close();

          // 📝 Guardamos el mensaje completo al final
          if (fullText) {
            await prisma.message.create({
              data: {
                content: fullText,
                sender: MessageSender.ASSISTANT,
                conversationId: conversation.id,
              },
            });
          }
        } catch (err) {
          console.error("[ERROR-STREAM]", err);
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
    logger.error(`[ERROR-USER-CONVERSATIONS-HANDLER]`, err);
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

const userGetConversationsHandlerAuthenticated = withApiAuthRequired(
  userGetConversationsHandler as unknown as CustomApiHandler
);
const userCreateConversationHandlerAuthenticated = withApiAuthRequired(
  userCreateConversationHandler as unknown as CustomApiHandler
);

export {
  userGetConversationsHandlerAuthenticated as GET,
  userCreateConversationHandlerAuthenticated as POST,
};
