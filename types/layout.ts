import { Model } from "@prisma/client";
import { Session } from "next-auth";

type AppNavModel = Partial<Model> & Pick<Model, "displayName" | "description">;

type AppNavConversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

type AppNavConversationJoinedByDate = Record<string, AppNavConversation[]>;

type AppNavProps = {
  session: Session | null;
  children: React.ReactNode;
};

type AppConversationsNavProps = {
  conversations: AppNavConversation[];
};

type UserProfileMenuProps = {
  session: Session | null;
}


export type {
  AppNavModel,
  AppNavProps,
  AppNavConversation,
  AppConversationsNavProps,
  AppNavConversationJoinedByDate,
  UserProfileMenuProps
};
