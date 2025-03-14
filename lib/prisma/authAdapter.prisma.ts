import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./index.prisma";
import { stripUndefined } from "@/utils/objects.utilts";
import { AdapterUser } from "next-auth/adapters";

const authAdapterPrisma = {
  ...PrismaAdapter(prisma),
  getUserByEmail: async (email: string): Promise<AdapterUser | null> => {
    return prisma.user.findUnique({
      where: { email },
      include: { Role: true },
    }) as Awaitable<AdapterUser>;
  },
  createUser: async (data: Partial<AdapterUser>): Promise<AdapterUser> => {
    const userData = { ...stripUndefined(data) };
    const createdUser = prisma.user.create({
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
}

export default authAdapterPrisma;
