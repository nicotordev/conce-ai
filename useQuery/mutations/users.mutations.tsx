import conceAi from "@/lib/conce-ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MarkdownRenderer from "@/components/Common/MarkdownRenderer";

function useConversationsMutation() {
  const queryClient = useQueryClient();
  const createConversation = useMutation({
    mutationKey: ["user/conversations/create"],
    mutationFn: (data: { message: string; modelId: string }) =>
      conceAi.user.createConversation(data.message, data.modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users/get-conversations"],
      });
    },
  });

  const deleteConversation = useMutation({
    mutationKey: ["user/conversations/delete"],
    mutationFn: (id: string) => conceAi.user.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users/get-conversations"],
      });
    },
  });

  const updateConversation = useMutation({
    mutationKey: ["user/conversations/update"],
    mutationFn: (data: { id: string; title: string }) =>
      conceAi.user.updateConversation(data.id, data.title),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users/get-conversations"],
      });
    },
  });

  return { createConversation, deleteConversation, updateConversation };
}

const useStreamConversation = ({
  onMessage,
  onDone,
}: {
  onMessage: (markdown: React.ReactNode, message: string) => void;
  onDone: (markdown: React.ReactNode, message: string) => void;
  currentMessage?: string;
}) => {
  const doConversationStream = async (
    message: string,
    modelId: string,
    id?: string
  ) => {
    const apiURL = id
      ? `/api/user/conversations/${id}`
      : "/api/user/conversations";

    const response = await fetch(apiURL, {
      method: "POST",
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

      // Mantener última línea incompleta para la próxima vuelta
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.replace("data: ", "");

        if (data === "start") continue;

        if (data === "done") {
          onDone?.(<MarkdownRenderer content={fullMessage} />, fullMessage);
          return;
        }

        if (data === "error") {
          throw new Error("Error del servidor");
        }

        // ✅ Actualizar mensaje completo en tiempo real
        fullMessage += data;
        onMessage(<MarkdownRenderer content={fullMessage} />, fullMessage);
      }
    }

    // Manejar el buffer si queda algo pendiente
    if (buffer.startsWith("data:")) {
      const data = buffer.replace("data: ", "");
      if (data !== "done" && data !== "error") {
        fullMessage += data;
        onMessage(<MarkdownRenderer content={fullMessage} />, fullMessage);
      }
    }
  };

  // Actualizar conversación
  const updateConversationStream = useMutation({
    mutationKey: ["user/conversations/update"],
    mutationFn: (data: { id: string; message: string; modelId: string }) =>
      doConversationStream(data.message, data.modelId, data.id),
  });

  // Crear nueva conversación
  const createConversationStream = useMutation({
    mutationKey: ["user/conversations/create"],
    mutationFn: (data: { message: string; modelId: string }) =>
      doConversationStream(data.message, data.modelId),
  });

  return { createConversationStream, updateConversationStream };
};

export { useConversationsMutation, useStreamConversation };
