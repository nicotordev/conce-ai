import googleGenerativeAI from "@/lib/@google-generative-ai";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { AuthenticatedNextRequest } from "@/types/api";
import { AppMessageDTO } from "@/types/app";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { MessageSender } from "@prisma/client";

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

const updateUserConversationHandler = async (
  req: AuthenticatedNextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const { message } = (await req.json()) as {
      message: AppMessageDTO;
    };

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
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
      where: {
        id: message.modelId,
      },
    });

    if (!model) {
      /**
       * [TODO] - Trigger get a new model flow
       */
      return ApiResponse.badRequest("Invalid model id");
    }

    const aiModel = await googleGenerativeAI.genAI.getGenerativeModel({
      model: model.name,
    });

    const chat = aiModel.startChat({
      history: conversation.messages.map((message) => ({
        role: message.sender === MessageSender.USER ? "user" : "model",
        parts: [{ text: message.content }],
      })),
    });

    const result = await chat.sendMessage(message.content);
    const responseText = result.response.text();

    await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        messages: {
          create: {
            content: message.content,
            sender: MessageSender.USER,
          },
        },
      },
    });

    const conversationUpdated = await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        messages: {
          create: {
            content: responseText,
            sender: MessageSender.ASSISTANT,
          },
        },
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

    return ApiResponse.ok(conversationUpdated);
  } catch (err) {
    logger.error(`[ERROR-CREATE-CONVERSATION-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const GET = withApiAuthRequired(getUserConversationHandler);
const PATCH = withApiAuthRequired(updateUserConversationHandler);

export { GET, PATCH };
