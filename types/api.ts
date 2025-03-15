import { ApiResponse } from "@/utils/api.utils";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

type CustomApiHandler = (
  req: NextRequest
) => void | Promise<void | NextApiResponse<unknown>> | ApiResponse;


export type { CustomApiHandler };
