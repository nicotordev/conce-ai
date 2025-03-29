"use server";

import { auth } from "@/auth";
import conversationsConstants from "@/constants/conversations.constants";
import logger from "@/lib/consola/logger";
import { encryptData } from "@/lib/crypto";
import prisma from "@/lib/prisma/index.prisma";
import { createConversation } from "@/utils/conversations.utils";
import { generateConversationTitle } from "@/utils/openai.utils";

async function createConversationAction(formData: FormData) {
  const session = await auth();
  const message = formData.get("message") as string;
  const modelId = formData.get("modelId") as string;

  if (!session?.user?.id) {
    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error: conversationsConstants.ERROR_MESSAGES_CODES.USER_NOT_AUTHORIZED,
      })}`,
    };
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error: conversationsConstants.ERROR_MESSAGES_CODES.MESSAGE_IS_NOT_VALID,
      })}`,
    };
  }

  if (typeof modelId !== "string" || modelId.trim().length === 0) {
    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error: conversationsConstants.ERROR_MESSAGES_CODES.MODEL_IS_NOT_VALID,
      })}`,
    };
  }

  try {
    const newConversation = await createConversation(
      message,
      modelId,
      session.user.id
    );

    if (newConversation.error) {
      return {
        success: false,
        redirectTo: `/app?state=${encryptData({
          error: newConversation.error,
        })}`,
      };
    }

    return {
      success: true,
      redirectTo: `/app/${newConversation.id}`,
    };
  } catch (err) {
    logger.error("[ACTIONS-CREATE-CONVERSATION]", err);

    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error:
          conversationsConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      })}`,
    };
  }
}

async function createEmptyConversationAction(formData: FormData) {
  const session = await auth();
  const modelId = formData.get("modelId") as string;
  const message = formData.get("message") as string;

  if (typeof message !== "string" || message.trim().length === 0) {
    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error: conversationsConstants.ERROR_MESSAGES_CODES.MESSAGE_IS_NOT_VALID,
      })}`,
    };
  }

  if (!session?.user?.id) {
    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error: conversationsConstants.ERROR_MESSAGES_CODES.USER_NOT_AUTHORIZED,
      })}`,
    };
  }

  if (typeof modelId !== "string" || modelId.trim().length === 0) {
    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error: conversationsConstants.ERROR_MESSAGES_CODES.MODEL_IS_NOT_VALID,
      })}`,
    };
  }

  const title = await generateConversationTitle(message);

  try {
    const newConversation = await prisma.conversation.create({
      data: {
        title: title,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    if (!newConversation) {
      return {
        success: false,
        redirectTo: `/app?state=${encryptData({
          error:
            conversationsConstants.ERROR_MESSAGES_CODES
              .CONVERSATION_NOT_CREATED,
        })}`,
      };
    }

    return {
      success: true,
      redirectTo: `/app/${newConversation.id}`,
      conversationId: newConversation.id,
      state: encryptData({
        conversationId: newConversation.id,
        message: message,
        modelId: modelId,
      }),
    };
  } catch (err) {
    logger.error("[ACTIONS-CREATE-CONVERSATION]", err);

    return {
      success: false,
      redirectTo: `/app?state=${encryptData({
        error:
          conversationsConstants.ERROR_MESSAGES_CODES.INTERNAL_SERVER_ERROR,
      })}`,
    };
  }
}

export { createConversationAction, createEmptyConversationAction };
