"use client";

import { useEffect, useRef, useState } from "react";
import { useConceAI } from "@/providers/ConceAIProvider";
import { AppNewConversationProps } from "@/types/app";
import toast from "react-hot-toast";
import AppConversation from "./AppConversation";
import { v4 } from "uuid";
import AppConversationSkeleton from "../Common/Skeletons/AppConversationSkeleton";
import { createEmptyConversationAction } from "@/app/actions/conversations.actions";
import { useRouter } from "next/navigation";
import AppChatForm from "./AppChatForm";
import AppChatFormSkeleton from "../Common/Skeletons/AppChatFormSkeleton";

export default function AppNewConversation({
  state,
  session,
  suggestions,
}: AppNewConversationProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { models } = useConceAI();
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

  async function handleNewMessage(message: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append("modelId", models.selectedModel?.id || "");
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
          suggestions={suggestions}
        />
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
