import condorAi from "@/lib/condor-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useConversationsMutation() {
  const queryClient = useQueryClient();
  const createConversation = useMutation({
    mutationKey: ["user/conversations/create"],
    mutationFn: (data: { message: string; modelId: string }) =>
      condorAi.user.createConversation(data.message, data.modelId),
  });

  const updateConversation = useMutation({
    mutationKey: ["user/conversations/update"],
    mutationFn: (data: { id: string; message: string; modelId: string }) =>
      condorAi.user.updateConversation(data.id, data.message, data.modelId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user/conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users/get-conversation", variables.id],
      });
    },
  });

  return { createConversation, updateConversation };
}
const useStreamConversation = ({
  onMessage,
  onDone,
}: {
  onMessage: (chunk: string) => void;
  onDone: () => void;
}) => {
  return useMutation({
    mutationFn: async ({
      id,
      message,
      modelId,
    }: {
      id: string;
      message: string;
      modelId: string;
    }) => {
      const response = await fetch(`/api/user/conversations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ message, modelId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.body) {
        throw new Error("No stream received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partial = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        partial += decoder.decode(value, { stream: true });
        const lines = partial.split("\n\n");

        // guarda la última línea incompleta
        partial = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "").trim();

            if (data === "start") continue;
            if (data === "done") {
              onDone?.();
              return;
            }
            if (data === "error") {
              throw new Error("Error del servidor");
            }

            onMessage(data);
          }
        }
      }

      if (partial && partial.startsWith("data: ")) {
        const data = partial.replace("data: ", "").trim();
        if (data !== "done" && data !== "error") {
          onMessage(data);
        }
      }

      onDone?.();
    },
  });
};

export { useConversationsMutation, useStreamConversation };
