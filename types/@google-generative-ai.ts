type GoogleModel = {
  name: string;
  version: string;
  displayName: string;
  description?: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: Array<string>;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTemperature?: number;
};

export type { GoogleModel };
