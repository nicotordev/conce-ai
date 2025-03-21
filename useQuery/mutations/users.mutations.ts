import condorAi from "@/lib/condor-ai";
import { useMutation } from "@tanstack/react-query";

function useConversationsMutation() {
  const createConversation = useMutation({
    mutationKey: ["user/conversations/create"],
    mutationFn: (data: { message: string; modelId: string }) =>
      condorAi.user.createConversation(data.message, data.modelId),
  });

  const updateConversation = useMutation({
    mutationKey: ["user/conversations/update"],
    mutationFn: (data: { id: string; message: string; modelId: string }) =>
      condorAi.user.updateConversation(data.id, data.message, data.modelId),
  });

  return { createConversation, updateConversation };
}

export { useConversationsMutation };
