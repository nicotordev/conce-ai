"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ConceAIContextType, ConceAIProviderProps } from "@/types/providers";
import { useModelsQuery } from "@/useQuery/queries/conce-ai.queries";
import { AppNavModel } from "@/types/layout";
import { getCookie, setCookie } from "cookies-next/client";
import cookiesConstants from "@/constants/cookies.constants";
// Crea el contexto
const ConceAIContext = createContext<ConceAIContextType | null>(null);

// Hook personalizado para usar el contexto en los componentes hijos
export const useConceAI = () => {
  const context = useContext(ConceAIContext);
  if (!context) {
    throw new Error("useConceAI debe ser usado dentro de un ConceAIProvider");
  }
  return context;
};

export const ConceAIProvider = ({ children }: ConceAIProviderProps) => {
  const modelsQuery = useModelsQuery();
  const [selectedModel, setSelectedModel] = useState<AppNavModel | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);

  async function setSelectedModelHandler(model: AppNavModel) {
    setLoadingModels(true);
    setSelectedModel(model);
    setCookie(cookiesConstants.selectedModelId, model.id, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    setLoadingModels(false);
  }

  useEffect(() => {
    if (modelsQuery.data && modelsQuery.data.length > 0 && !selectedModel) {
      const selectedModelId = getCookie(cookiesConstants.selectedModelId);
      if (selectedModelId) {
        const model = modelsQuery.data.find(
          (model) => model.id === selectedModelId
        );
        if (model) {
          setSelectedModel(model);
          return;
        }
      }

      setSelectedModel(modelsQuery.data[0]);
    }
  }, [modelsQuery.data, selectedModel]);

  useEffect(() => {
    setLoadingModels(modelsQuery.isLoading);
  }, [modelsQuery.isLoading]);

  return (
    <ConceAIContext.Provider
      value={{
        models: {
          models: modelsQuery.data || [],
          selectedModel: selectedModel,
          isLoading: loadingModels,
          setSelectedModel: setSelectedModelHandler,
        },
      }}
    >
      {children}
    </ConceAIContext.Provider>
  );
};
