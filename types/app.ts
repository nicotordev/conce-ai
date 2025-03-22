import { MessageSender } from "@prisma/client";
import { Session } from "next-auth";

type AppNewConversationState = {
  error: string;
};

type AppNewConversationProps = {
  state: AppNewConversationState;
};

type AppConversationMessageType = {
  id: string;
  content: string;
  sender: MessageSender;
  createdAt: string;
  updatedAt: string;
}

type AppConversationType = {
  id: string;
  title: string | null; 
  createdAt: string;
  updatedAt: string;
  messages: AppConversationMessageType[];
};

type AppConversationProps = {
  conversation: AppConversationType;
  session: Session | null;
};

type AppMessageProps = {
  message: AppConversationMessageType;
  session: Session | null
}

export type {
  AppConversationType,
  AppNewConversationProps,
  AppNewConversationState,
  AppConversationProps,
  AppConversationMessageType,
  AppMessageProps
};
