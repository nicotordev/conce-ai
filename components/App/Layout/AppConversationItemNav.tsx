import { Button } from "@/components/ui/button";
import { AppConversationItemNavProps } from "@/types/app";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { BsThreeDots, BsBrush, BsTrash, BsShare } from "react-icons/bs";
import CondorDropdown from "@/components/@Condor-ui/CondorDropdown";

export default function AppConversationItemNav({
  conversation,
  id,
}: AppConversationItemNavProps) {
  const router = useRouter();
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
          },
          {
            icon: BsBrush,
            text: "Editar Nombre",
          },
          {
            icon: BsTrash,
            text: "Eliminar",
            type: "danger",
          },
        ]}
      />
    </li>
  );
}
