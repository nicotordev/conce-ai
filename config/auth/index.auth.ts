import { NextAuthConfig, Session } from "next-auth";
import googleAuthConfig from "./google.auth";
import authAdapterPrisma from "@/lib/prisma/authAdapter.prisma";
import credentialsAuthConfig from "./credentials.auth";
import authConstants from "@/constants/auth.constants";
import { v4 } from "uuid";
import prisma from "@/lib/prisma/index.prisma";
import { Adapter, AdapterUser } from "next-auth/adapters";

export const nextAuthConfig: NextAuthConfig = {
  adapter: authAdapterPrisma as Adapter,
  providers: [googleAuthConfig, credentialsAuthConfig],
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    signOut: "/auth/sign-out",
  },
  events: {
    linkAccount: async ({ user, profile }) => {
      const adapterProfile = profile as AdapterUser;
      const partialUser: Partial<AdapterUser> & Pick<AdapterUser, "id"> = {
        id: user.id as string,
        emailVerified: adapterProfile.emailVerified ? new Date() : null,
      };
      if (authAdapterPrisma && authAdapterPrisma.updateUser) {
        await authAdapterPrisma.updateUser(partialUser);
      } else {
        console.error("Adapter or updateUser function is undefined");
      }
      return;
    },
  },
  callbacks: {
    async jwt(params) {
      // Override default jwt callback behavior.
      // Create a session instead and then return that session token for use in the
      // `jwt.encode` callback below.
      if (params.user.id) {
        const session = await authAdapterPrisma.createSession?.({
          expires: new Date(Date.now() + authConstants.SESSION_MAX_AGE * 1000),
          sessionToken: v4(),
          userId: params.user.id,
          accessToken: params.account?.access_token || params.token.sub || v4(),
        });

        return { id: session?.sessionToken };
      }
      return null;
    },
    async session(params) {
      const { session: defaultSession, user, token } = params;
      const userSession = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          Role: true,
        },
      });

      if (!userSession) {
        throw new Error("User not found");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userSession;

      // Crear la sesión personalizada
      const customSession: Session = {
        user: userWithoutPassword,
        expires: defaultSession.expires,
        provider: token?.provider as string,
        accessToken: token?.accessToken as string,
        refreshToken: token?.refreshToken as string,
      };

      return customSession;
    },
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
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
