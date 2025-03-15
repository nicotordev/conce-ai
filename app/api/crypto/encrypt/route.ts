import { encryptData } from "@/lib/crypto";
import { ApiResponse, withApikeyAuthRequired } from "@/utils/api.utils";
import { NextRequest } from "next/server";

const encryptHandler = withApikeyAuthRequired(async (req: NextRequest) => {
  const data = await req.json();
  const encryptedData = encryptData(data);

  return ApiResponse.success(encryptedData);
});

export { encryptHandler as POST };
