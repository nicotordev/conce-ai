import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./index.prisma";
import { stripUndefined } from "@/utils/objects.utilts";

const authAdapterPrisma = {
  ...PrismaAdapter(prisma),
  getUserByEmail: async (email: string): Promise<AdapterUser> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  },
  createUser: async (
    data: NonNullable<Partial<AdapterUser>>
  ): Promise<AdapterUser> => {
    const userData = { ...stripUndefined(data) };
    return await prisma.user.create({
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
    });
  },
};

export default authAdapterPrisma;
