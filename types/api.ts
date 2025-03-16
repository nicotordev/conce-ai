import { ApiResponse } from "@/utils/api.utils";
import { NextApiResponse } from "next";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

type AuthenticatedNextRequest = NextRequest & {
  session: Session;
};
type CustomApiHandler = (
  req: AuthenticatedNextRequest
) => void | Promise<void | NextApiResponse<unknown>> | ApiResponse;

type CustomApiKeyHandler = (
  req: NextRequest
) => void | Promise<void | NextApiResponse<unknown>> | ApiResponse;

export type { CustomApiHandler, CustomApiKeyHandler, AuthenticatedNextRequest };
