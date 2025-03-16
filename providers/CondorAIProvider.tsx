"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CondorAIContextType, CondorAIProviderProps } from "@/types/providers";
import { useModelsQuery } from "@/useQuery/mutations/users.mutations";
import { AppNavModel } from "@/types/layout";
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

export const CondorAIProvider = ({ children }: CondorAIProviderProps) => {
  const modelsQuery = useModelsQuery();
  const [selectedModel, setSelectedModel] = useState<AppNavModel | null>(null);

  useEffect(() => {
    if (modelsQuery.data && modelsQuery.data.length > 0 && !selectedModel) {
      setSelectedModel(modelsQuery.data[0]);
    }
  }, [modelsQuery.data, selectedModel]);

  return (
    <CondorAIContext.Provider
      value={{
        models: modelsQuery.data || [],
        selectedModel: selectedModel,
        isLoading: modelsQuery.isLoading,
        setSelectedModel,
      }}
    >
      {children}
    </CondorAIContext.Provider>
  );
};
