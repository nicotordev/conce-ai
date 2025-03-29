"use client";

import { useEffect, useRef, useState } from "react";
import {
  AppConversationMessageType,
  AppNewConversationProps,
} from "@/types/app";
import AppChatForm from "./AppChatForm";
import { useStreamConversation } from "@/useQuery/mutations/users.mutations";
import { MessageSender } from "@prisma/client";
import { useConceAI } from "@/providers/ConceAIProvider";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { v4 } from "uuid";
import { usePathname, useRouter } from "next/navigation";
import AppMessage from "./AppMessage";
import { useConversationsQuery } from "@/useQuery/queries/users.queries";
export default function AppNewConversation({
  suggestions,
  session,
}: AppNewConversationProps) {
  const router = useRouter();
  const conversationsQuery = useConversationsQuery();
  const [message, setMessage] = useState<string>("");
  const pathname = usePathname();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { models } = useConceAI();
  const [messages, setMessages] = useState<AppConversationMessageType[]>([]);
  const [messageSubmitted, setMessageSubmitted] = useState<boolean>(false);

  const { createConversationStream } = useStreamConversation({
    onMessage: (chunk) => {
      setMessages((prevMessages) => {
        const prevMessagesCopy = [...prevMessages];
        const lastMessage = prevMessagesCopy[prevMessagesCopy.length - 1];

        if (!lastMessage) {
          return [
            {
              id: v4(),
              content: chunk,
              sender: MessageSender.ASSISTANT,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
        }

        if (lastMessage.sender === MessageSender.ASSISTANT) {
          const updatedLastMessage = {
            ...lastMessage,
            content: chunk,
            isTyping: true,
            isLoading: false,
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
            isLoading: false,
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
            isLoading: false,
            content: message,
          };
          return [
            ...prevMessages.slice(0, prevMessages.length - 1),
            updatedLastMessage,
          ];
        }

        return prevMessages;
      });
      conversationsQuery.refetch().then(({ data: conversations }) => {
        if (conversations && conversations.length > 0) {
          const newestConversation = conversations.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          return router.push(`/app/${newestConversation.id}`);
        }
      });
    },
  });

  const { mutate: sendMessage, isPending } = createConversationStream;

  const handleSubmitNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSubmitted(true);
    if (!message.trim()) return;

    sendMessage({
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

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, newUserMessage];

      return newMessages;
    });

    setTimeout(() => {
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          {
            id: v4(),
            content: "",
            sender: MessageSender.ASSISTANT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLoading: true,
            isTyping: false,
          },
        ];

        return newMessages;
      });
    }, 150);
    virtuosoRef.current?.scrollToIndex({
      index: messages.length,
      behavior: "smooth",
    });
    setMessage("");
  };

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

  if (messageSubmitted) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
        {/* Mensajes */}
        <div
          className="flex-1 relative pb-24 flex-grow w-full"
          ref={messagesContainerRef}
        >
          <Virtuoso
            ref={virtuosoRef}
            data={messages}
            followOutput
            className="overflow-x-clip"
            itemContent={(index, message) => (
              <AppMessage
                key={message.content + index}
                message={message}
                session={session}
                isPending={isPending}
                isLastIndex={index === messages.length - 1}
              />
            )}
          />
        </div>

        <AppChatForm
          onSubmit={handleSubmitNewMessage}
          message={message}
          setMessage={setMessage}
          isPending={isPending}
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
      isPending={isPending}
      isInitialChat={true}
      handleQuery={(message) => {
        setMessage(message);
      }}
      suggestions={suggestions}
    />
  );
}
