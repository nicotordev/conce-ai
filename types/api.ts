import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type AuthenticatedNextRequest = NextRequest & {
  session: Session;
};
type CustomApiHandler = (
  req: AuthenticatedNextRequest,
  { params }: { params: Promise<{ id: string }> }
) => NextResponse | Promise<NextResponse>;

type CustomApiKeyHandler = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => NextResponse | Promise<NextResponse>;

export type { CustomApiHandler, CustomApiKeyHandler, AuthenticatedNextRequest };
