import { FetchClientError } from "@/errors/fetch-client.errors";
import { NextRequest } from "next/server";

class FetchClient {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  private buildHeaders(
    baseHeaders: HeadersInit = {},
    request?: NextRequest
  ): Headers {
    const headers = new Headers(baseHeaders);

    if (request) {
      const cookie = request.headers.get("cookie");
      const auth = request.headers.get("authorization");

      if (cookie) headers.set("Cookie", cookie);
      if (auth) headers.set("Authorization", auth);
    }

    return headers;
  }

  private buildRequestInit<P>(
    method: string,
    data?: P,
    config?: RequestInit,
    request?: NextRequest
  ): RequestInit {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const headers = this.buildHeaders(config?.headers, request);

    // Solo si no es FormData, se define el Content-Type
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return {
      method,
      headers,
      body: data
        ? isFormData
          ? (data as BodyInit)
          : JSON.stringify(data)
        : undefined,
      ...config,
    };
  }

  public async get<T>(
    endpoint: string | URL,
    config: RequestInit = {},
    request?: NextRequest
  ): Promise<T> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: "GET",
        headers: this.buildHeaders(config.headers, request),
        ...config,
      });
      if (!response.ok) throw new FetchClientError(response.statusText);
      return await response.json();
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async post<T, P>(
    endpoint: string | URL,
    data: P,
    config?: RequestInit,
    request?: NextRequest
  ): Promise<T> {
    try {
      const requestInit = this.buildRequestInit("POST", data, config, request);
      const response = await fetch(`${this.apiUrl}${endpoint}`, requestInit);
      if (!response.ok) throw new FetchClientError(response.statusText);
      return await response.json();
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async put<T, P>(
    endpoint: string | URL,
    data: P,
    config?: RequestInit,
    request?: NextRequest
  ): Promise<T> {
    try {
      const requestInit = this.buildRequestInit("PUT", data, config, request);
      const response = await fetch(`${this.apiUrl}${endpoint}`, requestInit);
      if (!response.ok) throw new FetchClientError(response.statusText);
      return await response.json();
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  public async patch<T, P>(
    endpoint: string | URL,
    data: P,
    config?: RequestInit,
    request?: NextRequest
  ): Promise<T> {
    try {
      const requestInit = this.buildRequestInit("PATCH", data, config, request);
      const response = await fetch(`${this.apiUrl}${endpoint}`, requestInit);
      if (!response.ok) throw new FetchClientError(response.statusText);
      return await response.json();
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
  ): Promise<T> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.buildHeaders(config.headers, request),
        ...config,
      });
      if (!response.ok) throw new FetchClientError(response.statusText);
      return await response.json();
    } catch (err) {
      throw new FetchClientError(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
}

export default FetchClient;
