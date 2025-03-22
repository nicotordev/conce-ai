/* eslint-disable @typescript-eslint/no-unused-vars */
import logger from "@/lib/consola/logger";
import { CustomApiHandler } from "@/types/api";
import { getGoogleGenerativeAIModels } from "@/utils/@google-generative-ai.utils";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { NextRequest } from "next/server";

const getModelsHandler = async (req: NextRequest) => {
  try {
    const models = await getGoogleGenerativeAIModels();

    return ApiResponse.ok(models);
  } catch (error) {
    logger.error(`[GET-MODELS-HANDLER-ERROR]`, error);
    return ApiResponse.internalServerError();
  }
};

const handler = withApiAuthRequired(getModelsHandler as unknown as CustomApiHandler);

export { handler as GET };
