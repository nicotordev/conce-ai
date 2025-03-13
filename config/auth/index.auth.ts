import { NextAuthConfig, Session } from "next-auth";
import googleAuthConfig from "./google.auth";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import credentialsAuthConfig from "./credentials.auth";
import authConstants from "@/constants/auth.constants";
import { v4 } from "uuid";
import prisma from "@/lib/prisma/index.prisma";

export const nextAuthConfig: NextAuthConfig = {
  adapter: authAdapterPrisma,
  providers: [googleAuthConfig, credentialsAuthConfig],
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    signOut: "/auth/sign-out",
  },
  callbacks: {
    async jwt({ user }) {
      // Override default jwt callback behavior.
      // Create a session instead and then return that session token for use in the
      // `jwt.encode` callback below.
      if (user.id) {
        const session = await authAdapterPrisma.createSession?.({
          expires: new Date(Date.now() + authConstants.SESSION_MAX_AGE * 1000),
          sessionToken: v4(),
          userId: user.id,
        });

        return { id: session?.sessionToken };
      }
      return null;
    },
    async session({ session: defaultSession, user }) {
      // Make our own custom session object.
      const userSession = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });
      if (!userSession) {
        throw new Error("User not found");
      }
      const session: Session = {
        user: userSession,
        expires: defaultSession.expires,
      };

      return session;
    },
  },
  jwt: {
    async encode({ token }) {
      // This is the string returned from the `jwt` callback above.
      // It represents the session token that will be set in the browser.
      return token?.id as unknown as string;
    },
    async decode() {
      // Disable default JWT decoding.
      // This method is really only used when using the email provider.
      return null;
    },
  },
  session: {
    strategy: "database",
    maxAge: authConstants.SESSION_MAX_AGE,
    generateSessionToken: () => v4(),
  },
};
