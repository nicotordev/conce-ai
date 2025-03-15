import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./index.prisma";
import { stripUndefined } from "@/utils/objects.utilts";
import {
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { Prisma } from "@prisma/client";

const authAdapterPrisma = {
  ...PrismaAdapter(prisma),
  getUserByEmail: async (email: string): Promise<AdapterUser | null> => {
    return prisma.user.findUnique({
      where: { email },
      include: { Role: true },
    }) as Awaitable<AdapterUser>;
  },
  createUser: async (
    data: Partial<AdapterUser>,
    prismaTx: Prisma.TransactionClient = prisma
  ): Promise<AdapterUser> => {
    const userData = { ...stripUndefined(data) };
    const createdUser = prismaTx.user.create({
      data: {
        ...userData,
        roleId: undefined,
        Role: {
          connectOrCreate: {
            where: { name: "USER" },
            create: { name: "USER" },
          },
        },
      },
      include: {
        Role: true,
      },
    });
    return createdUser as Awaitable<AdapterUser>;
  },
  createSession(
    session: {
      sessionToken: string;
      accessToken: string;
      userId: string;
      expires: Date;
    },
    prismaTx: Prisma.TransactionClient = prisma
  ): Awaitable<AdapterSession> {
    return prismaTx.session.create({
      data: {
        sessionToken: session.sessionToken,
        expires: session.expires,
        user: {
          connect: {
            id: session.userId,
          },
        },
      },
    }) as Awaitable<AdapterSession>;
  },
  createVerificationToken(
    verificationToken: VerificationToken,
    prismaTx: Prisma.TransactionClient = prisma
  ): Awaitable<VerificationToken | null | undefined> {
    return prismaTx.verificationToken.create({
      data: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      },
    });
  },
  useVerificationToken(
    params: {
      identifier: string;
      token: string;
    },
    prismTx: Prisma.TransactionClient = prisma
  ): Awaitable<VerificationToken | null> {
    return prismTx.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: params.identifier,
          token: params.token,
        }
      },
    });
  },
};

export default authAdapterPrisma;
