"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CondorAIContextType, CondorAIProviderProps } from "@/types/providers";
import { useModelsQuery } from "@/useQuery/mutations/condor-ai.mutations";
import {
  AppNavConversation,
  AppNavConversationJoinedByDate,
  AppNavModel,
} from "@/types/layout";
import { useConversationsQuery } from "@/useQuery/mutations/users.mutations";
import { encryptDataAction } from "@/app/actions/crypto.actions";
import { setCookie } from "cookies-next/client";
import cookiesConstants from "@/constants/cookies.constants";
import { startOfDay } from "date-fns";
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
  selectedConversationId,
  selectedModelId,
}: CondorAIProviderProps) => {
  const modelsQuery = useModelsQuery();
  const conversationsQuery = useConversationsQuery();
  const [selectedModel, setSelectedModel] = useState<AppNavModel | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<AppNavConversation | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(false);
  const [conversationsJoinedByDate, setConversationsJoinedByDate] =
    useState<AppNavConversationJoinedByDate>({});

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
  async function setSelectedConversationHandler(
    conversation: AppNavConversation
  ) {
    setLoadingConversations(true);
    setSelectedConversation(conversation);
    const encryptedData = await encryptDataAction({ id: conversation.id });
    setCookie(cookiesConstants.selectedConversationId, encryptedData, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    setLoadingConversations(false);
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
    if (
      conversationsQuery.data &&
      conversationsQuery.data.length > 0 &&
      !selectedConversation
    ) {
      if (selectedConversationId) {
        const conversation = conversationsQuery.data.find(
          (conversation) => conversation.id === selectedConversationId
        );
        if (conversation) {
          setSelectedConversation(conversation);
          return;
        }
      }
      setConversationsJoinedByDate(
        conversationsQuery.data.reduce((acc, conversation) => {
          const date = conversation.updatedAt.toDateString();
          const todaysDate = startOfDay(new Date()).getTime();
          const yesterdayDate = startOfDay(
            new Date(Date.now() - 86400000)
          ).getTime();
          if (startOfDay(conversation.updatedAt).getTime() === todaysDate) {
            acc["Hoy"] = acc["Hoy"] || [];
            acc["Hoy"].push(conversation);
            return acc;
          } else if (
            startOfDay(conversation.updatedAt).getTime() === yesterdayDate
          ) {
            acc["Ayer"] = acc["Ayer"] || [];
            acc["Ayer"].push(conversation);
            return acc;
          }
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(conversation);
          return acc;
        }, {} as AppNavConversationJoinedByDate)
      );
    }
  }, [conversationsQuery.data, selectedConversation, selectedConversationId]);

  useEffect(() => {
    setLoadingModels(modelsQuery.isLoading);
  }, [modelsQuery.isLoading]);

  useEffect(() => {
    setLoadingConversations(conversationsQuery.isLoading);
  }, [conversationsQuery.isLoading]);

  return (
    <CondorAIContext.Provider
      value={{
        models: {
          models: modelsQuery.data || [],
          selectedModel: selectedModel,
          isLoading: loadingModels,
          setSelectedModel: setSelectedModelHandler,
        },
        conversations: {
          conversations: conversationsQuery.data || [],
          selectedConversation: selectedConversation,
          isLoading: loadingConversations,
          setSelectedConversation: setSelectedConversationHandler,
          setConversationsOpen: setConversationsOpen,
          conversationsOpen: conversationsOpen,
          conversationsJoinedByDate,
        },
      }}
    >
      {children}
    </CondorAIContext.Provider>
  );
};
