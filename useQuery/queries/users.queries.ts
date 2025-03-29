import conceAi from "@/lib/conce-ai";
import { AppConversationType } from "@/types/app";
import { useQuery } from "@tanstack/react-query";

function useConversationsQuery() {
  const conversationsQuery = useQuery({
    queryKey: ["users/get-conversations"],
    queryFn: () => conceAi.user.getConversations(),
  });

  return conversationsQuery;
}

function useConversationQuery(id: string, conversation?: AppConversationType) {
  const conversationQuery = useQuery({
    queryKey: ["users/get-conversation", id],
    queryFn: ({ queryKey }) =>
      conceAi.user.getConversation(queryKey[1] as string),
    initialData: conversation,
  });

  return conversationQuery;
}

function useSessionQuery() {
  const sessionQuery = useQuery({
    queryKey: ["users/get-session"],
    queryFn: () => conceAi.user.getSession(),
  });

  return sessionQuery;
}

export { useConversationsQuery, useConversationQuery, useSessionQuery };
