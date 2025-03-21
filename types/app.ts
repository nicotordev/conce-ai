import { MessageSender } from "@prisma/client";

type AppConversation = {
  id: string;
  title: string;
  createdAt: string;
  message: {
    id: string;
    content: string;
    createdAt: string;
    sender: MessageSender;
  }[];
};

type AppMessageDTO = {
  modelId: string;
  content: string;
};

type AppNewConversationState = {
  error: string;
}

type AppNewConversationProps = {
  state: AppNewConversationState
}

export type { AppConversation, AppMessageDTO, AppNewConversationProps, AppNewConversationState };
