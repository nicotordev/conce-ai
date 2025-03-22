"use server";

import { auth } from "@/auth";
import conversationsConstants from "@/constants/conversations.constants";
import logger from "@/lib/consola/logger";
import { encryptData } from "@/lib/crypto";
import { createConversation } from "@/utils/conversations.utils";

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

export { createConversationAction };
