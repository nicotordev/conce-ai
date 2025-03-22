import { CondorAIError } from "@/errors/condor-ai.errors";
import { Session } from "next-auth";
import { NextRequest } from "next/server";
import FetchClient from "./fetch-client";
import { FetchClientError } from "@/errors/fetch-client.errors";
import { AppNavConversation, AppNavModel } from "@/types/layout";
import { AppConversationType } from "@/types/app";

class CondorAI {
  private apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;
  private fetchClient: FetchClient = new FetchClient(this.apiUrl);
  private get = this.fetchClient["get"].bind(this.fetchClient);
  private post = this.fetchClient["post"].bind(this.fetchClient);
  private patch = this.fetchClient["patch"].bind(this.fetchClient);

  public constructor() {
    this.fetchClient = new FetchClient(this.apiUrl);
  }

  public async getSession(request?: NextRequest): Promise<Session> {
    try {
      const session = await this.get<Session>("/auth/session", {}, request);
      return session;
    } catch (err) {
      throw err;
    }
  }
  // <T extends object>(data: T): Promise<string>
  public crypto = {
    encryptData: async <T = unknown>(data: T): Promise<string> => {
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
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
    decryptData: async <T = unknown>(encryptedData: string): Promise<T> => {
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
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
  };

  public condorAI = {
    getModels: async (): Promise<AppNavModel[]> => {
      try {
        const { data: models } = await this.get<BaseApiResponse<AppNavModel[]>>(
          "/condor-ai/models"
        );
        return models;
      } catch (err) {
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
  };

  public user = {
    getConversations: async (): Promise<AppNavConversation[]> => {
      try {
        const { data: conversations } = await this.get<
          BaseApiResponse<AppNavConversation[]>
        >("/user/conversations");

        return conversations;
      } catch (err) {
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
    getConversation: async (id: string): Promise<AppConversationType> => {
      try {
        const { data: conversation } = await this.get<
          BaseApiResponse<AppConversationType>
        >(`/user/conversations/${id}`);

        return conversation;
      } catch (err) {
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
    createConversation: async (
      message: string,
      modelId: string
    ): Promise<AppNavConversation> => {
      try {
        const { data: conversation } = await this.post<
          BaseApiResponse<AppNavConversation>,
          { message: string; modelId: string }
        >("/user/conversations", { message, modelId });

        return conversation;
      } catch (err) {
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
    updateConversation: async (
      id: string,
      message: string,
      modelId: string
    ): Promise<AppNavConversation> => {
      try {
        const { data: conversation } = await this.patch<
          BaseApiResponse<AppNavConversation>,
          { message: string; modelId: string }
        >(`/user/conversations/${id}`, { message, modelId });

        return conversation;
      } catch (err) {
        throw new CondorAIError((err as FetchClientError).message);
      }
    },
  };
}

const condorAi = new CondorAI();

export default condorAi;
