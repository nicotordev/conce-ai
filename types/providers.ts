import { AppNavModel } from "./layout";

type GoogleRecaptchaProviderProps = {
  children: React.ReactNode;
};
type RecaptchaContextType = {
  executeRecaptcha: (action: string) => Promise<string>;
  isLoaded: boolean;
  error: Error | null;
};

type CondorAIProviderProps = {
  children: React.ReactNode;
};

type CondorAIContextType = {
  models: AppNavModel[];
  selectedModel: AppNavModel | null;
  isLoading: boolean;
  setSelectedModel: (model: AppNavModel) => void;
};

type TanstackUseQueryProviderProps = {
  children: React.ReactNode;
}

export type {
  GoogleRecaptchaProviderProps,
  CondorAIProviderProps,
  RecaptchaContextType,
  CondorAIContextType,
  TanstackUseQueryProviderProps
};
