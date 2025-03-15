import googleGenerativeAI from "@/lib/@google-generative-ai";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma/index.prisma";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";

const getModelsHandler = async () => {
  try {
    const currentModels = await prisma.model.findMany();

    /**
     * If no models are found in the database, fetch models from Google Generative AI
     */
    if (currentModels.length === 0) {
      const newModels = await googleGenerativeAI.getModels();

      if (newModels.length === 0) {
        return ApiResponse.success([], "No models found");
      }

      const createdModels = await prisma.model.createManyAndReturn({
        data: newModels,
      });

      return ApiResponse.success(createdModels, "Models fetched successfully");
    }

    /**
     * If models are found in the database, check that the update date is not older than 1 day
     */

    const lastUpdatedDate = currentModels[0].updatedAt;
    const currentDate = new Date();
    const diffTime = Math.abs(
      currentDate.getTime() - lastUpdatedDate.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      const newModels = await googleGenerativeAI.getModels();

      if (newModels.length === 0) {
        return ApiResponse.success([], "No models found");
      }

      const createdModels = await prisma.model.createManyAndReturn({
        data: newModels,
      });

      return ApiResponse.success(createdModels, "Models fetched successfully");
    }

    return ApiResponse.success(currentModels, "Models fetched successfully");
  } catch (error) {
    logger.error(`[GET-MODELS-HANDLER-ERROR]`, error);
    return ApiResponse.internalServerError();
  }
};

const handler = withApiAuthRequired(getModelsHandler);

export { handler as GET };
