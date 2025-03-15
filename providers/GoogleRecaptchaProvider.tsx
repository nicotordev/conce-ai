"use client";

import React, { createContext, useContext, useState } from "react";
import Script from "next/script";
import { GoogleRecaptchaProviderProps } from "@/types/providers";

// Define la interfaz para el contexto
interface RecaptchaContextType {
  executeRecaptcha: (action: string) => Promise<string>;
  isLoaded: boolean;
  error: Error | null;
}

// Crea el contexto
const RecaptchaContext = createContext<RecaptchaContextType | null>(null);

// Hook personalizado para usar el contexto en los componentes hijos
export const useRecaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error(
      "useRecaptcha debe ser usado dentro de un GoogleRecaptchaProvider"
    );
  }
  return context;
};

export const GoogleRecaptchaProvider = ({
  children,
}: GoogleRecaptchaProviderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Función para ejecutar reCAPTCHA y obtener un token
  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!isLoaded) {
      throw new Error("reCAPTCHA aún no está cargado");
    }

    try {
      // Asegurarse de que grecaptcha esté definido
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        const token = await window.grecaptcha.enterprise.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action }
        );
        return token;
      } else {
        throw new Error("grecaptcha no está disponible");
      }
    } catch (err) {
      console.error("Error al ejecutar reCAPTCHA:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  // Función para manejar la carga del script
  const handleScriptLoad = () => {
    console.log("reCAPTCHA script loaded");

    // Asegurarse de que grecaptcha esté listo para usar
    window.grecaptcha.enterprise.ready(() => {
      setIsLoaded(true);
      console.log("reCAPTCHA is ready to use");
    });
  };

  // Función para manejar errores de carga
  const handleScriptError = (e: Error) => {
    console.error("Error loading reCAPTCHA:", e);
    setError(e);
  };

  // Valor del contexto
  const contextValue: RecaptchaContextType = {
    executeRecaptcha,
    isLoaded,
    error,
  };

  return (
    <RecaptchaContext.Provider value={contextValue}>
      <Script
        id="recaptcha-script"
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      {children}
    </RecaptchaContext.Provider>
  );
};
