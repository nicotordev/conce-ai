import { FetchClientError } from "@/errors/fetch-client.errors";
import { NextRequest } from "next/server";

class FetchClient {
  private apiUrl: string;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async get<T>(
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
        throw new FetchClientError(response.statusText);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async post<T, P>(
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
        throw new FetchClientError(response.statusText);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async put<T, P>(
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
        throw new FetchClientError(response.statusText);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async delete<T>(
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
        throw new FetchClientError(response.statusText);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async patch<T, D>(
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
        throw new FetchClientError(response.statusText);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
}

export default FetchClient;
