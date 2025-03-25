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

type AppSuggestionAiItem = {
  icon: "pensando" | "alegre" | "misterioso" | "tecnologico" | "creativo";
  label: string;
} 

export type { GoogleModel, AppSuggestionAiItem };
