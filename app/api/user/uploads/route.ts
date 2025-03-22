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

const POST = withApiAuthRequired(userUploadHandler);

export { POST };
