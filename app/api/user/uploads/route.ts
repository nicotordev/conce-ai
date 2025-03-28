import nicodropzone from "@/lib/@nicotordev/nicodropzone";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { AuthenticatedNextRequest } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { Prisma } from "@prisma/client";

const userUploadHandler = async (req: AuthenticatedNextRequest) => {
  try {
    const session = req.session;
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!session.user.id) {
      return ApiResponse.badRequest("No se ha encontrado el usuario");
    }

    if (files.length === 0) {
      return ApiResponse.badRequest("No se han encontrado archivos");
    }

    const todayDate = new Date();
    const thirtyMinutesAgoDate = new Date(
      todayDate.setMinutes(todayDate.getMinutes() - 30)
    );

    const filesUploaded = await nicodropzone.uploadFiles(
      `user-uploads/${session.user.id}`,
      files
    );

    await Promise.allSettled([
      prisma.conceAIFile.createMany({
        data: filesUploaded.map((file) => {
          const data: Prisma.ConceAIFileCreateManyInput = {
            name: file.name,
            src: file.src,
            previewSrc: file.preview,
            type: file.type,
            mimeType: file.type,
            nameWithoutExtension: file.nameWithoutExtension,
            sizeInMB: file.sizeInMB,
            userId: session.user.id,
          };
          return data;
        }),
      }),
      prisma.conceAIFile.deleteMany({
        where: {
          createdAt: {
            lt: thirtyMinutesAgoDate,
          },
        },
      }),
    ]);

    return ApiResponse.ok(filesUploaded);
  } catch (err) {
    console.error(err);
    logger.error(`[ERROR-USER-UPLOAD-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const userUploadDeleteHandler = async (req: AuthenticatedNextRequest) => {
  try {
    const src = req.nextUrl.searchParams.get("src");
    const preview = req.nextUrl.searchParams.get("preview");

    if (typeof src !== "string" || typeof preview !== "string") {
      return ApiResponse.badRequest(
        "No se han encontrado los parametros necesarios"
      );
    }
    const todayDate = new Date();
    const thirtyMinutesAgoDate = new Date(
      todayDate.setMinutes(todayDate.getMinutes() - 30)
    );

    await Promise.allSettled([
      nicodropzone.deleteFile(src, preview),
      prisma.conceAIFile.deleteMany({
        where: {
          src,
        },
      }),
      prisma.conceAIFile.deleteMany({
        where: {
          createdAt: {
            lt: thirtyMinutesAgoDate,
          },
        },
      }),
    ]);

    return ApiResponse.ok();
  } catch (err) {
    console.error(err);
    logger.error(`[ERROR-USER-UPLOAD-DELETE-HANDLER]`, err);
    return ApiResponse.internalServerError();
  }
};

const POST = withApiAuthRequired(userUploadHandler);
const DELETE = withApiAuthRequired(userUploadDeleteHandler);

export { POST, DELETE };
