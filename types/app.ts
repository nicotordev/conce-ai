import { MessageSender } from "@prisma/client";

type AppMessageDTO = {
  modelId: string;
  content: string;
};

type AppNewConversationState = {
  error: string;
};

type AppNewConversationProps = {
  state: AppNewConversationState;
};

type AppConversationType = {
  id: string;
  title: string | null; 
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    content: string;
    sender: MessageSender;
    createdAt: string;
    updatedAt: string;
  }[];
};

type AppConversationProps = {
  conversation: AppConversationType;
};

export type {
  AppConversationType,
  AppMessageDTO,
  AppNewConversationProps,
  AppNewConversationState,
  AppConversationProps,
};
