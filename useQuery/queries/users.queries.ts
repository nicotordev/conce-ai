import condorAi from "@/lib/condor-ai";
import { AppConversationType } from "@/types/app";
import { useQuery } from "@tanstack/react-query";

function useConversationsQuery() {
  const conversationsQuery = useQuery({
    queryKey: ["users/get-conversations"],
    queryFn: () => condorAi.user.getConversations(),
  });

  return conversationsQuery;
}

function useConversationQuery(id: string, conversation?: AppConversationType) {
  const conversationQuery = useQuery({
    queryKey: ["users/get-conversation", id],
    queryFn: ({ queryKey }) => condorAi.user.getConversation(queryKey[1] as string),
    initialData: conversation,
  });

  return conversationQuery;
}

export { useConversationsQuery, useConversationQuery };
