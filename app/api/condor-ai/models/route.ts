import logger from "@/lib/logger";
import { getGoogleGenerativeAIModels } from "@/utils/@google-generative-ai.utils";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";

const getModelsHandler = async () => {
  try {
    const models = await getGoogleGenerativeAIModels();

    return ApiResponse.ok(models);
  } catch (error) {
    logger.error(`[GET-MODELS-HANDLER-ERROR]`, error);
    return ApiResponse.internalServerError();
  }
};

const handler = withApiAuthRequired(getModelsHandler);

export { handler as GET };
