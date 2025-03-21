"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createConversationAction } from "@/app/actions/conversations.actions";
import { useCondorAI } from "@/providers/CondorAIProvider";
import { AppNewConversationProps } from "@/types/app";
import toast from "react-hot-toast";

export default function AppNewConversation({ state }: AppNewConversationProps) {
  const [message, setMessage] = useState("");
  const { models } = useCondorAI();

  useEffect(() => {
    if (state.error.length > 0) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      className="text-center flex flex-col gap-4"
      action={createConversationAction}
    >
      <input type="hidden" name="message" value={message} />
      <input
        type="hidden"
        name="modelId"
        value={models.selectedModel?.id ?? ""}
      />
      <h2 className="text-2xl font-semibold">¿En que puedo ayudarte hoy?</h2>
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
  );
}
