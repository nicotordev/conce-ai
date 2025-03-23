import authConstants from "@/constants/auth.constants";
import prisma from "@/lib/prisma/index.prisma";
import { ApiResponse } from "@/utils/api.utils";

export async function POST() {
  const adminRole = await prisma.role.upsert({
    where: {
      name: authConstants.ROLES.ADMIN.name,
    },
    create: {
      name: authConstants.ROLES.ADMIN.name,
    },
    update: {
      name: authConstants.ROLES.ADMIN.name,
    },
  });
  await prisma.user.updateMany({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
    data: {
      roleId: adminRole.id,
    },
  });

  return ApiResponse.ok();
}
