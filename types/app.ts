import { MessageSender } from "@prisma/client";
import { Session } from "next-auth";
import { ParamValue } from "next/dist/server/request/params";

type AppNewConversationState = {
  error: string;
};

type AppNewConversationProps = {
  state: AppNewConversationState;
  session: Session | null;
};

type AppConversationMessageType = {
  id: string;
  content: string;
  sender: MessageSender;
  createdAt: string;
  updatedAt: string;
  isTyping?: boolean;
  isGhost?: boolean;
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
  currentQuery: string |null;
};

type AppMessageProps = {
  message: AppConversationMessageType;
  session: Session | null;
  isLastIndex: boolean;
  isPending: boolean;
}

type AppConversationSkeletonBubble = {
  sender: "user" | "ia";
  lines: number;
  message?: string;
}

type AppConversationSkeletonProps = {
  bubblesParam?: AppConversationSkeletonBubble[];
}

type AppConversationItemNavProps = {
  id: ParamValue;
  conversation: {
    id: string;
    title: string;
  };
}
export type {
  AppConversationType,
  AppNewConversationProps,
  AppNewConversationState,
  AppConversationProps,
  AppConversationMessageType,
  AppMessageProps,
  AppConversationSkeletonProps,
  AppConversationSkeletonBubble,
  AppConversationItemNavProps
};
