import React from "react";
import { AppNavConversation, AppNavModel } from "./layout";
import { CondorAIFile } from "./files";

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
};

type CondorAIContextType = {
  models: {
    models: AppNavModel[];
    selectedModel: AppNavModel | null;
    isLoading: boolean;
    setSelectedModel: (model: AppNavModel) => void;
  };
};

type UploadFilesContextType = {
  files: CondorAIFile[];
  handleFileDeletion: (file: CondorAIFile) => Promise<void>;
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
};

type UserProviderProps = {
  children: React.ReactNode;
};

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
  UserProviderProps,
  UploadFilesContextType,
};
