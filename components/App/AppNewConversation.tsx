"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createConversationAction } from "@/app/actions/conversations.actions";
import { useCondorAI } from "@/providers/CondorAIProvider";
import { AppNewConversationProps } from "@/types/app";
import toast from "react-hot-toast";
import AppConversation from "./AppConversation";
import { v4 } from "uuid";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function AppNewConversation({ state }: AppNewConversationProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { models } = useCondorAI();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.error.length > 0) {
      toast.error(state.error);
    }
  }, [state]);

  async function handleSubmitNewMessage(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { redirectTo } = await createConversationAction(formData);
    router.push(redirectTo);
  }

  return (
    <>
      <Transition
        show={loading}
        enter="transition-all duration-300 ease-out" // Transición más suave
        enterFrom="opacity-0 translate-y-4 z-10" // Empieza un poco más abajo
        enterTo="opacity-100 translate-y-0 z-10" // Llega a su posición final
        leave="transition-all duration-200 ease-in" // Salida más rápida
        leaveFrom="opacity-100 translate-y-0 z-10"
        leaveTo="opacity-0 translate-y-4 z-10" // Sale hacia abajo
      >
        <div className="w-full h-full">
          <AppConversation
            conversation={{
              id: v4(),
              title: message,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              messages: [
                {
                  id: v4(),
                  content: message,
                  sender: "USER",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }}
          />
        </div>
      </Transition>

      <Transition
        show={!loading}
        enter="transition-all duration-300 ease-out" // Similar a la otra transición
        enterFrom="opacity-0 translate-y-4 z-0" // Empieza desde abajo
        enterTo="opacity-100 translate-y-0 z-0" // Llega a su posición final
        leave="transition-all duration-200 ease-in" // Similar a la otra transición
        leaveFrom="opacity-100 translate-y-0 z-0"
        leaveTo="opacity-0 translate-y-4 z-0" // Sale hacia abajo
      >
        <form
          className="text-center flex flex-col gap-4"
          onSubmit={handleSubmitNewMessage}
        >
          <input type="hidden" name="message" value={message} />
          <input
            type="hidden"
            name="modelId"
            value={models.selectedModel?.id ?? ""}
          />
          <h2 className="text-2xl font-semibold">
            ¿En que puedo ayudarte hoy?
          </h2>
          <div className="p-2 min-w-2xl rounded-lg shadow-md w-full max-w-2xl border border-gray-200">
            <div className="relative w-full max-w-full pb-3">
              {!message && (
                <span className="absolute left-3 top-3 text-gray-400 pointer-events-none select-none">
                  Escribe tu mensaje aquí...
                </span>
              )}
              <div
                contentEditable
                translate="no"
                onInput={(e) => setMessage(e.currentTarget.textContent || "")}
                className="relative w-full p-3 bg-transparent focus:outline-none text-left break-words whitespace-pre-wrap"
              ></div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                className="rounded-full text-dark-text-accent shrink-0 aspect-square w-9 h-9 hover:border-white hover:-translate-y-1"
                variant="outline"
                type="submit"
              >
                <ArrowUp />
              </Button>
            </div>
          </div>
        </form>
      </Transition>
    </>
  );
}
