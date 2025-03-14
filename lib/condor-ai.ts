import { CondorAIError } from "@/errors/condor-ai.errors";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

class CondorAI {
  private apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

  public constructor() {}

  private async get<T>(
    endpoint: string | URL,
    config: RequestInit = {},
    request?: NextRequest
  ) {
    try {
      const requestInit: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...config,
      };

      if (request) {
        requestInit.headers = {
          Cookie: request.headers.get("cookie") || "",
          Authorization: request.headers.get("authorization") || "",
        };
      }

      const response = await fetch(`${this.apiUrl}${endpoint}`, requestInit);

      if (!response.ok) {
        throw new CondorAIError(response.statusText);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      throw new CondorAIError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async getSession(request?: NextRequest): Promise<Session> {
    try {
      const session = await this.get<Session>("/auth/session", {}, request);
      return session;
    } catch (err) {
      throw err;
    }
  }
}


const condorAi = new CondorAI();


export default condorAi;