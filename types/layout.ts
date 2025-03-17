import { Conversation, Model } from "@prisma/client";
import { Session } from "next-auth";

type AppNavModel = Partial<Model> & Pick<Model, "displayName" | "description">;

type AppNavConversation = Partial<Conversation> &
  Pick<Conversation, "id" | "title" | "updatedAt">;

type AppNavConversationJoinedByDate = Record<string, AppNavConversation[]>;

type AppNavProps = {
  session: Session | null;
  children: React.ReactNode;
};

type AppConversationsNavProps = {
  conversations: AppNavConversation[];
};

export type {
  AppNavModel,
  AppNavProps,
  AppNavConversation,
  AppConversationsNavProps,
  AppNavConversationJoinedByDate,
};
