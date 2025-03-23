"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCondorAI } from "@/providers/CondorAIProvider";
import { AppNewConversationProps } from "@/types/app";
import toast from "react-hot-toast";
import AppConversation from "./AppConversation";
import { v4 } from "uuid";
import EditableDiv from "../Common/EditableDiv";
import AppConversationSkeleton from "../Common/Skeletons/AppConversationSkeleton";
import AppNewConversationSkeleton from "../Common/Skeletons/AppNewConversationSkeleton";
import { createEmptyConversationAction } from "@/app/actions/conversations.actions";
import { useRouter } from "next/navigation";

export default function AppNewConversation({
  state,
  session,
}: AppNewConversationProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { models } = useCondorAI();
  const [showConversation, setShowConversation] = useState(false);
  const toastMessageFired = useRef(false);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    if (state.error.length > 0 && !toastMessageFired.current) {
      toastMessageFired.current = true;
      toast.error(state.error);
    }
  }, [state]);

  async function handleSubmitNewMessage(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("modelId", models.selectedModel?.id ?? "");
    formData.append("message", message);
    const { conversationId, success, redirectTo } =
      await createEmptyConversationAction(formData);

    if (success === false) {
      router.replace(redirectTo);
      setLoading(false);
      return;
    }

    if (conversationId) {
      router.replace(`/app/${conversationId}`);
      setConversationId(conversationId);
      setShowConversation(true);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace(redirectTo);
  }

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="w-full h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
            {/* Mensajes */}
            <div className="flex-1">
              <AppConversationSkeleton
                bubblesParam={[
                  {
                    sender: "user",
                    lines: 1,
                    message: message,
                  },
                  {
                    sender: "ia",
                    lines: 2,
                  },
                ]}
              />
            </div>
            <AppNewConversationSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (showConversation) {
    return (
      <div className="w-full h-full">
        <AppConversation
          conversation={{
            id: conversationId,
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
          currentQuery={message}
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
            onChange={(value) => {
              setMessage(value);
            }}
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
