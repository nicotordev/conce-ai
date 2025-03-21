"use client";
import { AppConversationProps } from "@/types/app";
import { useConversationQuery } from "@/useQuery/queries/users.queries";
import { MessageSender } from "@prisma/client";

export default function AppConversation({
  conversation,
}: AppConversationProps) {
  const currentConversationQuery = useConversationQuery(
    conversation.id,
    conversation
  );

  if (currentConversationQuery.isLoading) {
    return null;
  }

  if (currentConversationQuery.isError) {
    return null;
  }

  if (currentConversationQuery.data === undefined) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {currentConversationQuery.data.messages.map((message) => {
        if (message.sender === MessageSender.USER) {
          return (
            <div
              className="w-full flex items-center justify-end"
              key={message.id}
            >
              <div className="w-fit text-start break-words whitespace-normal min-h-8 relative bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                {message.content}
              </div>
            </div>
          );
        } else if (message.sender === MessageSender.ASSISTANT) {
          return (
            <div
              className="w-full flex items-center justify-start"
              key={message.id}
            >
              <p className="px-5 py-2.5 max-w-3/4">{message.content}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
