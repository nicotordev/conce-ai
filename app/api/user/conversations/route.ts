import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { AuthenticatedNextRequest } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { createConversation } from "@/utils/conversations.utils";

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

    const newConversation = await createConversation(
      message,
      modelId,
      session.user.id
    );

    return ApiResponse.ok(newConversation);
  } catch (err) {
    logger.error(`[ERROR-USER-CONVERSATIONS-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const userGetConversationsHandlerAuthenticated = withApiAuthRequired(
  userGetConversationsHandler
);
const userCreateConversationHandlerAuthenticated = withApiAuthRequired(
  userCreateConversationHandler
);

export {
  userGetConversationsHandlerAuthenticated as GET,
  userCreateConversationHandlerAuthenticated as POST,
};
