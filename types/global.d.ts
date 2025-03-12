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
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
        NEXT_PUBLIC_RECAPTCHA_SECRET_KEY: string;
        NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY: string;
    }
  }
}

export {};
