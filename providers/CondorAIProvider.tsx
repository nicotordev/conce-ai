"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CondorAIContextType, CondorAIProviderProps } from "@/types/providers";
import { useModelsQuery } from "@/useQuery/queries/condor-ai.queries";
import {
  AppNavModel,
} from "@/types/layout";
import { encryptDataAction } from "@/app/actions/crypto.actions";
import { setCookie } from "cookies-next/client";
import cookiesConstants from "@/constants/cookies.constants";
// Crea el contexto
const CondorAIContext = createContext<CondorAIContextType | null>(null);

// Hook personalizado para usar el contexto en los componentes hijos
export const useCondorAI = () => {
  const context = useContext(CondorAIContext);
  if (!context) {
    throw new Error("useCondorAI debe ser usado dentro de un CondorAIProvider");
  }
  return context;
};

export const CondorAIProvider = ({
  children,
  selectedModelId,
}: CondorAIProviderProps) => {
  const modelsQuery = useModelsQuery();
  const [selectedModel, setSelectedModel] = useState<AppNavModel | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);

  async function setSelectedModelHandler(model: AppNavModel) {
    setLoadingModels(true);
    setSelectedModel(model);
    const encryptedData = await encryptDataAction({ id: model.id });
    setCookie(cookiesConstants.selectedModelId, encryptedData, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    setLoadingModels(false);
  }

  useEffect(() => {
    if (modelsQuery.data && modelsQuery.data.length > 0 && !selectedModel) {
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
  }, [modelsQuery.data, selectedModel, selectedModelId]);

  useEffect(() => {
    setLoadingModels(modelsQuery.isLoading);
  }, [modelsQuery.isLoading]);

  return (
    <CondorAIContext.Provider
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
    </CondorAIContext.Provider>
  );
};
