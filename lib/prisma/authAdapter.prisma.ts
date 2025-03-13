import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./index.prisma";

const authAdapterPrisma = {
  ...PrismaAdapter(prisma),
  getUserByUsername: async (username: string) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  },
};

export default authAdapterPrisma;
