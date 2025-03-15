import { decryptData } from "@/lib/crypto";
import { ApiResponse, withApikeyAuthRequired } from "@/utils/api.utils";
import { NextRequest } from "next/server";

const decryptHandler = withApikeyAuthRequired(async (req: NextRequest) => {
  const encryption = req.nextUrl.searchParams.get("encryption");

  if (typeof encryption !== "string") {
    return ApiResponse.badRequest();
  }

  const decryptedData = decryptData(encryption);

  return ApiResponse.success(decryptedData);
});

export { decryptHandler as GET };
