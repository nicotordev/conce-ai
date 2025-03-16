import condorAi from "@/lib/condor-ai";
import { useQuery } from "@tanstack/react-query";

function useConversationsQuery() {
  const conversationsQuery = useQuery({
    queryKey: ["users/get-conversations"],
    queryFn: () => condorAi.user.getConversations(),
  });

  return conversationsQuery;
}

export { useConversationsQuery };
