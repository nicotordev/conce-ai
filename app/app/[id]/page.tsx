import { auth } from "@/auth";
import prisma from "@/lib/prisma/index.prisma";
import { PagePropsCommon } from "@/types/pages";
import { MessageSender } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function Conversation(props: PagePropsCommon) {
  const { id } = await props.params;
  const session = await auth();

  if (!session || !session.user.id) {
    notFound();
  }

  if (typeof id !== "string" || !id) {
    notFound();
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      title: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        select: {
          id: true,
          content: true,
          sender: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  const messages = conversation.messages;

  return (
    <div className="w-full h-full">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => {
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
          }

          return null;
        })}
      </div>
    </div>
  );
}
