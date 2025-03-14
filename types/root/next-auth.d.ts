/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role } from "@prisma/client";
import NextAuth, {
  AdapterUser as BaseAdapterUser,
  DefaultSession,
  Adapter as DefaultAdapter,
} from "next-auth";
import { User as PrismaUser } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  export interface User extends DefaultUser {
    id: PrismaUser["id"];
    name: PrismaUser["name"];
    password: PrismaUser["password"];
    email: PrismaUser["email"];
    emailVerified: PrismaUser["emailVerified"];
    image: PrismaUser["image"];
    createdAt: PrismaUser["createdAt"];
    updatedAt: PrismaUser["updatedAt"];
    roleId: PrismaUser["roleId"];
    Role: Role | null;
  }

  export interface Session extends DefaultSession {
    user: Omit<User, "password">;
    provider: string;
    refreshToken: string;
    accessToken: string;
  }
}
