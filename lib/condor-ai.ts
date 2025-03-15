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
  ): Promise<T> {
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

  private async post<T, P>(
    endpoint: string | URL,
    data: P,
    config: RequestInit = {},
    request?: NextRequest
  ) {
    try {
      const requestInit: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  private async put<T, P>(
    endpoint: string | URL,
    data: P,
    config: RequestInit = {},
    request?: NextRequest
  ) {
    try {
      const requestInit: RequestInit = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  private async delete<T>(
    endpoint: string | URL,
    config: RequestInit = {},
    request?: NextRequest
  ) {
    try {
      const requestInit: RequestInit = {
        method: "DELETE",
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

  private async patch<T, D>(
    endpoint: string | URL,
    data: D,
    config: RequestInit = {},
    request?: NextRequest
  ) {
    try {
      const requestInit: RequestInit = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  public async encryptData<T extends object>(data: T): Promise<string> {
    try {
      const { data: encryptedData } = await this.post<
        BaseApiResponse<string>,
        unknown
      >("/crypto/encrypt", data, {
        headers: {
          "Content-Type": "application/json",
          "x-condor-ai-key": process.env.CONDOR_AI_API_KEY || "",
        },
      });
      return encryptedData;
    } catch (err) {
      throw err;
    }
  }

  public async decryptData<T>(encryptedData: string): Promise<T> {
    try {
      const { data: decryptedData } = await this.get<BaseApiResponse<T>>(
        `/crypto/decrypt?encryption=${encryptedData}`,
        {
          headers: {
            "x-condor-ai-key": process.env.CONDOR_AI_API_KEY || "",
          },
        }
      );
      return decryptedData;
    } catch (err) {
      throw err;
    }
  }
}

const condorAi = new CondorAI();

export default condorAi;
