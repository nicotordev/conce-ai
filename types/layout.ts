import { Conversation, Model } from "@prisma/client";
import { Session } from "next-auth";

type AppNavModel = Partial<Model> & Pick<Model, "displayName" | "description">;

type AppNavConversation = Partial<Conversation> & Pick<Conversation, 'id' | 'title'>;

type AppNavProps = {
  session: Session | null;
};

export type {
  AppNavModel,
  AppNavProps,
  AppNavConversation
};
