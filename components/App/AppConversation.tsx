"use client";
import { AppConversationMessageType, AppConversationProps } from "@/types/app";
import { useStreamConversation } from "@/useQuery/mutations/users.mutations";
import { useConversationQuery } from "@/useQuery/queries/users.queries";
import { MessageSender } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { useCondorAI } from "@/providers/CondorAIProvider";
import EditableDiv from "../Common/EditableDiv";
import { useQueryClient } from "@tanstack/react-query";
import { Transition } from "@headlessui/react";
import { v4 } from "uuid";
import MarkdownRenderer from "../Common/MarkdownRenderer";
export default function AppConversation({
  conversation,
}: AppConversationProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { models } = useCondorAI();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AppConversationMessageType[]>([]);
  const currentConversationQuery = useConversationQuery(
    conversation.id,
    conversation
  );
  const messagesRef = useRef(messages);
  const { mutate: sendMessage, isPending } = useStreamConversation({
    onMessage: (chunk) => {
      const currentMessages = messagesRef.current;

      const newMessage: AppConversationMessageType = {
        id: v4(),
        content: chunk,
        sender: MessageSender.ASSISTANT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      messagesRef.current = [...currentMessages, newMessage];
      setMessages(messagesRef.current);
    },
    onDone: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation.id],
      });
    },
  });

  const handleSubmitNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage({
      id: conversation.id,
      message,
      modelId: models.selectedModel?.id || "",
    });

    setMessage("");
    setMessages((prev) => [
      ...prev,
      {
        id: v4(),
        content: message,
        sender: MessageSender.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (currentConversationQuery.data) {
      setMessages(currentConversationQuery.data.messages);
    }
  }, [currentConversationQuery.data]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    messagesRef.current = messages;
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="h-[80vh] overflow-y-scroll space-y-3 p-2"
        ref={messagesContainerRef}
      >
        {messages.map((message) => {
          if (message.sender === MessageSender.USER) {
            return (
              <Transition
                key={message.id}
                show={true}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="w-full flex items-center justify-end"
                  key={message.id}
                >
                  <div className="w-fit text-start break-words whitespace-normal min-h-8 relative bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                    {message.content}
                  </div>
                </div>
              </Transition>
            );
          } else if (message.sender === MessageSender.ASSISTANT) {
            return (
              <Transition
                key={message.id}
                show={true}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="w-full flex items-center justify-start"
                  key={message.id}
                >
                  <div className="px-5 py-2.5 max-w-3/4 prose">
                    <MarkdownRenderer content={message.content} />
                  </div>
                </div>
              </Transition>
            );
          }

          return null;
        })}
      </div>

      <form
        className="text-center flex w-full"
        onSubmit={handleSubmitNewMessage}
      >
        <div className="p-2 min-w-2xl rounded-lg shadow-md w-full border border-gray-200">
          <div className="relative w-full max-w-full pb-3">
            {!message && (
              <span className="absolute left-3 top-3 text-gray-400 pointer-events-none select-none">
                Escribe tu mensaje aquí...
              </span>
            )}
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
              disabled={isPending}
            >
              <ArrowUp />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
