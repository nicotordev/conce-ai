import { Button } from "@/components/ui/button";
import {
  AppConversationItemNavEditConversationNameProps,
  AppConversationItemNavProps,
} from "@/types/app";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsThreeDots, BsBrush, BsTrash, BsShare } from "react-icons/bs";
import CondorDropdown from "@/components/@Condor-ui/CondorDropdown";
import { useConversationsMutation } from "@/useQuery/mutations/users.mutations";
import { useCondorAIModal } from "@/providers/CondorAIModalProvider";
import toast from "react-hot-toast";
import CondorInput from "@/components/Common/Forms/CondorInput";

export default function AppConversationItemNav({
  conversation,
  id,
}: AppConversationItemNavProps) {
  const condorAIModal = useCondorAIModal();
  const router = useRouter();
  const { deleteConversation, updateConversation } = useConversationsMutation();

  async function handleDeleteConversation() {
    condorAIModal.openModal({
      title: "Eliminar Conversación",
      description: `¿Estás seguro que deseas eliminar la conversación "${conversation.title}"?`,
      size: "sm",
      type: "warning",
      footer: (onClose, onConfirm) => (
        <>
          <Button onClick={onConfirm}>Confirmar</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </>
      ),
      onConfirm: async () => {
        const toastId = toast.loading("Eliminando conversación...");
        try {
          await deleteConversation.mutateAsync(conversation.id);
          toast.success("Conversación eliminada exitosamente", { id: toastId });
        } catch (err) {
          console.error(err);
          toast.error("Ocurrió un error al eliminar la conversación", {
            id: toastId,
          });
        }
      },
    });
  }

  async function handleEditConversationName() {
    condorAIModal.openModal({
      title: "Editar Nombre de la Conversación",
      description: `Ingresa el nuevo nombre para la conversación "${conversation.title}"`,
      size: "sm",
      type: "info",
      body: (
        <AppConversationItemNavEditConversationName
          conversationName={conversation.title}
        />
      ),
      footer: (onClose, onConfirm) => (
        <>
          <Button onClick={onConfirm}>Confirmar</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </>
      ),
      onConfirm: async () => {
        const toastId = toast.loading(
          "Actualizando nombre de la conversación..."
        );
        try {
          await updateConversation.mutateAsync({
            id: conversation.id,
            title: conversation.title,
          });
          toast.success("Nombre de la conversación actualizado exitosamente", {
            id: toastId,
          });
        } catch (err) {
          console.error(err);
          toast.error(
            "Ocurrió un error al actualizar el nombre de la conversación",
            {
              id: toastId,
            }
          );
        }
      },
    });
  }

  async function handleShareConversation() {
    condorAIModal.openModal({
      title: "Compartir Conversación",
      description: `Comparte el enlace de la conversación "${conversation.title}"`,
      size: "sm",
      type: "info",
      body: (
        <CondorInput
          label="Enlace de la Conversación"
          value={`${window.location.origin}/app/${conversation.id}`}
          readOnly
        />
      ),
      footer: (onClose) => <Button onClick={onClose}>Cerrar</Button>,
    });
  }

  return (
    <li
      key={conversation.id}
      className="text-sm hover:bg-silver-100 flex items-center justify-start my-1 relative group"
    >
      <Button
        className={clsx(
          "text-xs w-full h-full bg-transparent border-none shadow-none text-left font-normal flex items-start justify-start whitespace-pre-wrap text-dark-text-primary rounded-md",
          {
            ["text-white bg-secondary-400"]: id === conversation.id,
          }
        )}
        variant={"outline"}
        onClick={() => {
          router.push(`/app/${conversation.id}`);
        }}
      >
        <span className="font-medium max-w-4/5">{conversation.title}</span>
      </Button>
      <CondorDropdown
        variant="transparent-white"
        button={
          <Button
            variant="ghost"
            className="border-none hover:!bg-transparent hover:text-black group-hover:text-white active:text-black rounded-full transition-colors absolute right-5 top-1/2 -translate-y-2/4 z-50 opacity-50 hover:opacity-100 bg-transparent"
          >
            <BsThreeDots className="!w-4 !h-4" />
          </Button>
        }
        items={[
          {
            icon: BsShare,
            text: "Compartir",
            action: handleShareConversation,
          },
          {
            icon: BsBrush,
            text: "Editar Nombre",
            action: handleEditConversationName,
          },
          {
            icon: BsTrash,
            text: "Eliminar",
            type: "danger",
            action: handleDeleteConversation,
          },
        ]}
      />
    </li>
  );
}

function AppConversationItemNavEditConversationName({
  conversationName,
}: AppConversationItemNavEditConversationNameProps) {
  const [name, setName] = useState(conversationName);

  return (
    <div className="flex items-center justify-between">
      <CondorInput
        label="Nuevo Nombre"
        placeholder="Nuevo Nombre"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
    </div>
  );
}
