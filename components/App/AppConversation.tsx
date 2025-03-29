"use client";
import { AppConversationMessageType, AppConversationProps } from "@/types/app";
import { useStreamConversation } from "@/useQuery/mutations/users.mutations";
import { useConversationQuery } from "@/useQuery/queries/users.queries";
import { MessageSender } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useConceAI } from "@/providers/ConceAIProvider";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { v4 } from "uuid";
import AppMessage from "./AppMessage";
import { usePathname, useRouter } from "next/navigation";
import AppChatForm from "./AppChatForm";

export default function AppConversation({
  conversation,
  session,
  createMessage,
  suggestions,
}: AppConversationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { models } = useConceAI();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AppConversationMessageType[]>([]);
  const currentQueryExecuted = useRef(false);

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
      createMessage: true,
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

  useEffect(() => {
    if (createMessage?.message && !currentQueryExecuted.current) {
      router.replace(`/app/${conversation.id}`);
      currentQueryExecuted.current = true;
      sendMessage({
        id: conversation.id,
        message: createMessage.message,
        modelId: createMessage.modelId,
        createMessage: false,
      });

      const newUserMessage: AppConversationMessageType = {
        id: v4(),
        content: createMessage.message,
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
    }
  }, [
    createMessage,
    conversation.id,
    messages.length,
    message,
    models.selectedModel?.id,
    sendMessage,
  ]);

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
