import { Model } from "@prisma/client";
import { Session } from "next-auth";

type AppNavModel = Partial<Model> & Pick<Model, "displayName" | "description">;

type AppNavProps = {
  session: Session | null;
};

export type {
  AppNavModel,
  AppNavProps,
};
