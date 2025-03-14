/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role } from "@prisma/client";
import NextAuth, {
  AdapterUser as BaseAdapterUser,
  DefaultSession,
  Adapter as DefaultAdapter,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  export interface User extends DefaultUser {
    id: User["id"];
    name: User["name"];
    password: User["password"];
    email: User["email"];
    emailVerified: User["emailVerified"];
    image: User["image"];
    createdAt: User["createdAt"];
    updatedAt: User["updatedAt"];
    roleId: User["roleId"];
    Role: Role | null;
  }

  export interface Session extends DefaultSession {
    user: Omit<User, "password">;
  }
}
