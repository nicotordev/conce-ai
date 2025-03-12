import { NextAuthConfig } from "next-auth";
import googleAuthConfig from "./google.auth";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";

export const nextAuthConfig: NextAuthConfig = {
  adapter: authAdapterPrisma,
  providers: [googleAuthConfig],
};
