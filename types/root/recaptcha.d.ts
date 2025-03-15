// global.d.ts
interface Window {
  grecaptcha: ReCaptchaInstance;
  onloadCallback?: () => void;
}

interface ReCaptchaInstance {
  ready: (callback: () => void) => Promise<void>;
  enterprise: ReCaptchaEnterprise;
  render: (
    container: string | HTMLElement,
    parameters: ReCaptchaRenderParameters
  ) => number;
  reset: (widgetId?: number) => void;
  getResponse: (widgetId?: number) => string;
  execute: (
    siteKey?: string,
    action?: ReCaptchaExecuteParameters
  ) => Promise<string>;
}

interface ReCaptchaEnterprise {
  render: (
    container: string | HTMLElement,
    parameters: ReCaptchaRenderParameters
  ) => number;
  ready: (callback: () => void) => Promise<void>;
  execute: (
    siteKey: string,
    action: ReCaptchaExecuteParameters
  ) => Promise<string>;
  reset: (widgetId?: number) => void;
  getResponse: (widgetId?: number) => string;
}

interface ReCaptchaRenderParameters {
  sitekey: string;
  theme?: "light" | "dark";
  size?: "normal" | "compact" | "invisible";
  badge?: "bottomright" | "bottomleft" | "inline";
  tabindex?: number;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface ReCaptchaExecuteParameters {
  action: string;
  [key: string]: unknown;
}

// Declara el módulo para permitir la importación de scripts de reCAPTCHA
declare module "https://www.google.com/recaptcha/enterprise.js";
declare module "https://www.google.com/recaptcha/api.js";
