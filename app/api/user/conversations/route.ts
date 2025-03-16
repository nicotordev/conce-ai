import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { AuthenticatedNextRequest } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";

const userConversationsHandler = async (req: AuthenticatedNextRequest) => {
  try {
    const session = req.session;

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return ApiResponse.ok(conversations);
  } catch (err) {
    logger.error(`[ERROR-USER-CONVERSATIONS-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const handler = withApiAuthRequired(userConversationsHandler);

export { handler as GET };
