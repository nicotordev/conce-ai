import { auth } from "@/auth";
import AppConversation from "@/components/App/AppConversation";
import prisma from "@/lib/prisma/index.prisma";
import { AppConversationType } from "@/types/app";
import { PagePropsCommon } from "@/types/pages";
import transformObjectForSerialization from "@/utils/serialization.utils";
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
      id: true,
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

  const conversationDTO = transformObjectForSerialization<
    typeof conversation,
    AppConversationType
  >(conversation);

  return (
    <div className="w-full h-full">
      <AppConversation conversation={conversationDTO} session={session} />
    </div>
  );
}
