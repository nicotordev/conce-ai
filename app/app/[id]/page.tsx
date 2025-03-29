import { auth } from "@/auth";
import AppConversation from "@/components/App/AppConversation";
import { decryptData } from "@/lib/crypto";
import prisma from "@/lib/prisma/index.prisma";
import { AppConversationState, AppConversationType } from "@/types/app";
import { PagePropsCommon } from "@/types/pages";
import { getAppSuggestionsForBar } from "@/utils/openai.utils";
import transformObjectForSerialization from "@/utils/serialization.utils";
import { notFound } from "next/navigation";

export default async function Conversation({
  params,
  searchParams,
}: PagePropsCommon) {
  const [{ id }, session, _searchParams] = await Promise.all([
    params,
    auth(),
    searchParams,
  ]);

  const state: AppConversationState | null =
    typeof _searchParams.state === "string"
      ? decryptData<AppConversationState>(_searchParams.state)
      : null;

  if (!session || !session.user.id) {
    notFound();
  }

  if (typeof id !== "string" || !id) {
    notFound();
  }

  const [conversation, suggestions] = await Promise.all([
    prisma.conversation.findUnique({
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
    }),
    getAppSuggestionsForBar(),
  ]);

  if (!conversation) {
    notFound();
  }

  const conversationDTO = transformObjectForSerialization<
    typeof conversation,
    AppConversationType
  >(conversation);

  const mappedSuggestions = suggestions.map((suggestion) => ({
    label: suggestion.label,
    icon: suggestion.icon,
  }));

  return (
    <div className="w-full h-full">
      <AppConversation
        conversation={conversationDTO}
        session={session}
        createMessage={
          state?.modelId && state?.message
            ? {
                modelId: state?.modelId || "",
                message: state?.message || "",
              }
            : null
        }
        suggestions={mappedSuggestions}
      />
    </div>
  );
}
