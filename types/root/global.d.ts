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
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
      RECAPTCHA_SECRET_KEY: string;
      GOOGLE_GENERATIVE_AI_API_KEY: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      ENCRYPTION_KEY: string;
      BREVO_SENDER_NAME: string;
      BREVO_SENDER_EMAIL: string;
      BREVO_SMTP_SERVER: string;
      BREVO_SMTP_PORT: string;
      BREVO_SMTP_LOGIN: string;
      BREVO_SMTP_PASSWORD: string;
      CONCE_AI_API_KEY: string;
      GOOGLE_GENERATIVE_AI_API_URL: string;
      NICODROPZONE_BASE_URL: string;
      NICODROPZONE_API_KEY: string;
      BRIGHT_DATA_TOKEN: string;
      CLOUDFARE_AI_WORKER_TOKEN: string;
      ADMIN_EMAIL: string;
      MAIN_PROMPT: string;
      VERIFY_TITLE_NAME_PROMPT: string;
      SUGGESTIONS_PROMPT: string;
    }
  }


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
  type BaseApiResponse<T = unknown> = {
    data: T;
    meta: {
      message: string;
      status: number;
      ok: boolean;
    };
  };

  type Awaitable<T> = T | PromiseLike<T>;
  type Awaited<T> = T extends Promise<infer U> ? U : T;
}

export {};
