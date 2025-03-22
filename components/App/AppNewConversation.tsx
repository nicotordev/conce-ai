"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createConversationAction } from "@/app/actions/conversations.actions";
import { useCondorAI } from "@/providers/CondorAIProvider";
import { AppNewConversationProps } from "@/types/app";
import toast from "react-hot-toast";
import AppConversation from "./AppConversation";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import EditableDiv from "../Common/EditableDiv";

export default function AppNewConversation({
  state,
  session,
}: AppNewConversationProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { models } = useCondorAI();
  const [loading, setLoading] = useState(false);
  const toastMessageFired = useRef(false);

  useEffect(() => {
    if (state.error.length > 0 && !toastMessageFired.current) {
      toastMessageFired.current = true;
      toast.error(state.error);
    }
  }, [state]);

  async function handleSubmitNewMessage(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const { redirectTo } = await createConversationAction(formData);
    router.replace(redirectTo, { scroll: false });
  }

  if (loading) {
    return (
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
          session={session}
        />
      </div>
    );
  }

  return (
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
      <h2 className="text-2xl font-semibold">¿En que puedo ayudarte hoy?</h2>
      <div className="p-2 min-w-2xl rounded-lg shadow-md w-full max-w-2xl border border-gray-200">
        <div className="relative w-full max-w-full pb-3">
          <EditableDiv
            placeholder="Escribe tu mensaje aquí..."
            onChange={setMessage}
            value={message}
            className="relative w-full p-3 bg-transparent focus:outline-none text-left break-words whitespace-pre-wrap"
          />
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
