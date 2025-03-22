import condorAi from "@/lib/condor-ai";
import { formatMarkdown } from "@/utils/markdown.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marked } from "marked";

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
  onMessage: (fullText: string) => void;
  onDone: (message: string) => void;
  currentMessage?: string;
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
      let buffer = "";
      let fullMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");

        // mantener última línea incompleta para la próxima vuelta
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.replace("data: ", "");

          if (data === "start") continue;
          if (data === "done") {
            onDone?.(fullMessage);
            return;
          }
          if (data === "error") {
            throw new Error("Error del servidor");
          }

          fullMessage += data;
          const formattedMessage = await formatMarkdown(fullMessage);

          const html = await marked(formattedMessage);

          // ✅ Enviamos el texto acumulado completo
          onMessage(html);
        }
      }

      // manejar el buffer si queda algo pendiente
      if (buffer.startsWith("data:")) {
        const data = buffer.replace("data:", "").trim();
        if (data !== "done" && data !== "error") {
          fullMessage += data;

          const formattedMessage = await formatMarkdown(fullMessage);

          const html = await marked(formattedMessage);
          onMessage(html);
        }
      }

      onDone?.(fullMessage);
    },
  });
};

export { useConversationsMutation, useStreamConversation };
