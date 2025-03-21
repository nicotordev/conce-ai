import React from "react";
import { AppNavConversation, AppNavModel } from "./layout";

type GoogleRecaptchaProviderProps = {
  children: React.ReactNode;
};
type RecaptchaContextType = {
  executeRecaptcha: (action: string) => Promise<string>;
  isLoaded: boolean;
  error: Error | null;
};

type CondorAIProviderProps = {
  children: React.ReactNode;
  selectedModelId: string | null;
};

type CondorAIContextType = {
  models: {
    models: AppNavModel[];
    selectedModel: AppNavModel | null;
    isLoading: boolean;
    setSelectedModel: (model: AppNavModel) => void;
  };
};

type UserProviderContextType = {
  conversations: {
    conversations: AppNavConversation[];
    selectedConversation: AppNavConversation | null;
    isLoading: boolean;
    conversationsOpen: boolean;
    conversationsJoinedByDate: Record<string, AppNavConversation[]>;
    setConversationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedConversation: (conversation: AppNavConversation) => void;
  };
}

type UserProviderProps = {
  children: React.ReactNode;
  selectedConversationId: string | null;
}

type TanstackUseQueryProviderProps = {
  children: React.ReactNode;
};

export type {
  GoogleRecaptchaProviderProps,
  CondorAIProviderProps,
  RecaptchaContextType,
  CondorAIContextType,
  TanstackUseQueryProviderProps,
  UserProviderContextType,
  UserProviderProps
};
