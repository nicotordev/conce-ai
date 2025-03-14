import { User } from "@prisma/client";

declare global {
  interface Window extends Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
      RECAPTCHA_SECRET_KEY: string;
      GOOGLE_GENERATIVE_AI_API_KEY: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      ENCRYPTION_KEY: string;
    }
  }
  type AdapterUser = User | null;

  type ActionResponse<T = unknownm> =
    | {
        success: true;
        message: string;
        data: T;
      }
    | {
        success: false;
        message: string;
        data: null;
      };
}

export {};
