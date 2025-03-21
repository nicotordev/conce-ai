import condorAi from "@/lib/condor-ai";
import { useQuery } from "@tanstack/react-query";

function useConversationsQuery() {
  const conversationsQuery = useQuery({
    queryKey: ["users/get-conversations"],
    queryFn: () => condorAi.user.getConversations(),
  });

  return conversationsQuery;
}

function useConversationQuery(id: string) {
  const conversationQuery = useQuery({
    queryKey: ["users/get-conversation", id],
    queryFn: () => condorAi.user.getConversation(id),
  });

  return conversationQuery;
}

export { useConversationsQuery, useConversationQuery };
