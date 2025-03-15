import * as google from "@google/generative-ai";
import FetchClient from "./fetch-client";
import { GoogleModel } from "@/types/@google-generative-ai";

class GoogleGenerativeAI {
  private googleGenerativeAiApiKey: string =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  private googleGenerativeAiApiUrl: string =
    process.env.GOOGLE_GENERATIVE_AI_API_URL;
  public genAI: google.GoogleGenerativeAI = new google.GoogleGenerativeAI(
    this.googleGenerativeAiApiKey
  );
  private fetchClient: FetchClient = new FetchClient(
    this.googleGenerativeAiApiUrl
  );
  public get = this.fetchClient.get.bind(this.fetchClient);
  public post = this.fetchClient.post.bind(this.fetchClient);

  public async getModels(): Promise<GoogleModel[]> {
    try {
      const { models } = await this.get<{ models: GoogleModel[] }>("/models");
      return models;
    } catch (err) {
      throw err;
    }
  }
}

const googleGenerativeAI = new GoogleGenerativeAI();

export default googleGenerativeAI;
