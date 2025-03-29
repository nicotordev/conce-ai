"use client";

import { useEffect, useRef, useState } from "react";
import { useConceAI } from "@/providers/ConceAIProvider";
import { AppNewConversationProps } from "@/types/app";
import toast from "react-hot-toast";
import AppConversationSkeleton from "../Common/Skeletons/AppConversationSkeleton";
import { createEmptyConversationAction } from "@/app/actions/conversations.actions";
import { useRouter } from "next/navigation";
import AppChatForm from "./AppChatForm";
import AppChatFormSkeleton from "../Common/Skeletons/AppChatFormSkeleton";

export default function AppNewConversation({
  state,
  suggestions,
}: AppNewConversationProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { models } = useConceAI();
  const toastMessageFired = useRef(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.error.length > 0 && !toastMessageFired.current) {
      toastMessageFired.current = true;
      toast.error(state.error);
    }
  }, [state]);

  async function handleNewMessage(message: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append("modelId", models.selectedModel?.id || "");
    formData.append("message", message);
    const { conversationId, success, redirectTo, state } =
      await createEmptyConversationAction(formData);

    if (success === false) {
      router.replace(redirectTo);
      setLoading(false);
      return;
    }

    if (conversationId) {
      return router.push(`/app/${conversationId}?state=${state}`);
    }

    setLoading(false);
    router.replace(redirectTo);
  }

  async function handleSubmitNewMessage(e: React.FormEvent) {
    e.preventDefault();
    await handleNewMessage(message);
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
            <AppChatFormSkeleton isInitialChat={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppChatForm
      onSubmit={handleSubmitNewMessage}
      message={message}
      setMessage={setMessage}
      isPending={loading}
      isInitialChat={true}
      handleQuery={(message) => {
        setMessage(message);
      }}
      suggestions={suggestions}
    />
  );
}
