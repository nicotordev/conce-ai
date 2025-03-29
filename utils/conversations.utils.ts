"use server";

import prisma from "@/lib/prisma/index.prisma";
import {
  generateConversationTitle,
  getBasicAiConversationResponse,
} from "./openai.utils";
import conversationsConstants from "@/constants/conversations.constants";
import { auth } from "@/auth";

const createConversation = async (
  message: string,
  modelId: string,
  userId: string
) => {
  const session = await auth();
  if (
    typeof message !== "string" ||
    message.trim() === "" ||
    typeof modelId !== "string" ||
    modelId.trim() === ""
  ) {
    return {
      error: conversationsConstants.ERROR_MESSAGES_CODES.MESSAGE_IS_NOT_VALID,
    };
  }

  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });

  if (!model) {
    return {
      error: conversationsConstants.ERROR_MESSAGES_CODES.MODEL_IS_NOT_VALID,
    };
  }
  const title = await generateConversationTitle(message);

  const aiResponse = await getBasicAiConversationResponse(
    [],
    model.name,
    message,
    session!,
    title
  );

  const newConversation = await prisma.conversation.create({
    data: {
      title: title,
      userId: userId,
      messages: {
        create: [
          {
            content: message,
            sender: "USER",
          },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      content: aiResponse,
      sender: "ASSISTANT",
      conversationId: newConversation.id,
    },
  });

  return {
    error: null,
    id: newConversation.id,
  };
};

export { createConversation };
