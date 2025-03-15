"use server";
import googleGenerativeAI from "@/lib/@google-generative-ai";
import prisma from "@/lib/prisma/index.prisma";
import { Model } from "@prisma/client";

async function getGoogleGenerativeAIModels(): Promise<Model[]> {
  const currentModels = await prisma.model.findMany();

  /**
   * If no models are found in the database, fetch models from Google Generative AI
   */
  if (currentModels.length === 0) {
    const newModels = await googleGenerativeAI.getModels();

    if (newModels.length === 0) {
      return [];
    }

    const createdModels = await prisma.model.createManyAndReturn({
      data: newModels,
    });

    return createdModels;
  }

  /**
   * If models are found in the database, check that the update date is not older than 1 day
   */

  const lastUpdatedDate = currentModels[0].updatedAt;
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - lastUpdatedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    const newModels = await googleGenerativeAI.getModels();

    if (newModels.length === 0) {
      return [];
    }

    const createdModels = await prisma.model.createManyAndReturn({
      data: newModels,
    });

    return createdModels;
  }

  return currentModels;
}

export { getGoogleGenerativeAIModels };
