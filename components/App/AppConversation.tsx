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
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { v4 } from "uuid";
import AppMessage from "./AppMessage";
import { usePathname } from "next/navigation";

export default function AppConversation({
  conversation,
  session,
}: AppConversationProps) {
  const pathname = usePathname();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { models } = useCondorAI();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AppConversationMessageType[]>([]);

  const currentConversationQuery = useConversationQuery(
    conversation.id,
    conversation
  );

  const { mutate: sendMessage, isPending } = useStreamConversation({
    onMessage: (chunk) => {
      setMessages((prevMessages) => {
        const prevMessagesCopy = [...prevMessages];
        const lastMessage = prevMessagesCopy[prevMessagesCopy.length - 1];

        if (lastMessage.sender === MessageSender.ASSISTANT) {
          const updatedLastMessage = {
            ...lastMessage,
            content: chunk,
            isTyping: true,
          };
          return [
            ...prevMessagesCopy.slice(0, prevMessagesCopy.length - 1),
            updatedLastMessage,
          ];
        }

        return [
          ...prevMessagesCopy,
          {
            id: v4(),
            content: chunk,
            sender: MessageSender.ASSISTANT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isTyping: true,
          },
        ];
      });
    },
    onDone: (message) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.sender === MessageSender.ASSISTANT) {
          const updatedLastMessage = {
            ...lastMessage,
            isTyping: false,
            content: message,
          };
          return [
            ...prevMessages.slice(0, prevMessages.length - 1),
            updatedLastMessage,
          ];
        }

        return prevMessages;
      });
      currentConversationQuery.refetch();
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

    const newUserMessage: AppConversationMessageType = {
      id: v4(),
      content: message,
      sender: MessageSender.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    virtuosoRef.current?.scrollToIndex({
      index: messages.length,
      behavior: "smooth",
    });
    setMessage("");
  };

  useEffect(() => {
    if (
      currentConversationQuery.data &&
      !currentConversationQuery.isLoading &&
      currentConversationQuery.isSuccess
    ) {
      setMessages(
        currentConversationQuery.data.messages.sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        })
      );
    }
  }, [
    currentConversationQuery.data,
    currentConversationQuery.isLoading,
    currentConversationQuery.isSuccess,
  ]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const scroll = () => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    };

    // pequeño delay por si el contenido aún se está montando
    const timeout = setTimeout(scroll, 10);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
      {/* Mensajes */}
      <div className="flex-1" ref={messagesContainerRef}>
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          followOutput
          itemContent={(index, message) => (
            <AppMessage key={message.id} message={message} session={session} />
          )}
        />
      </div>

      {/* Formulario */}
      <form
        className="text-center flex w-full p-2"
        onSubmit={handleSubmitNewMessage}
      >
        <div className="p-2 w-full rounded-lg shadow-md border border-gray-200">
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
