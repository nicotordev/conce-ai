import nicodropzone from "@/lib/@nicotordev/nicodropzone";
import logger from "@/lib/consola/logger";
import { AuthenticatedNextRequest } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";

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

    const filesUploaded = await nicodropzone.uploadFiles(
      `user-uploads/${session.user.id}`,
      files
    );

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

    await nicodropzone.deleteFile(src, preview);

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
