"use client";
import { Button } from "@/components/ui/button";
import { useCondorAI } from "@/providers/CondorAIProvider";
import { AppConversationsNavProps } from "@/types/layout";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import clsx from "clsx";
import { Transition } from "@headlessui/react";

const conversationsArray = {
  [new Date().toDateString()]: [
    {
      id: "1",
      title: "Alguien tiene un buen dato de empanadas en Santiago?",
      description:
        "Quiero comer empanadas ricas, alguna picada que recomienden",
    },
    {
      id: "2",
      title: "Cuándo juega Colo-Colo esta semana",
      description: "No cacho cuándo es el partido, alguien sabe?",
    },
    {
      id: "3",
      title: "Qué micro tomo pa llegar a Providencia?",
      description: "Me confundí con los nuevos recorridos",
    },
  ],

  [new Date(Date.now() - 86400000).toDateString()]: [
    // Ayer
    {
      id: "4",
      title: "Está abierto el Costanera hoy",
      description: "Alguien sabe si puedo ir al mall hoy?",
    },
    {
      id: "5",
      title: "Habrá fila hoy en el Registro Civil?",
      description:
        "Tengo que renovar el carnet y quiero cachar cómo anda el tiempo de espera",
    },
    {
      id: "5",
      title: "Cómo está la Ruta 68 hacia Viña",
      description: "Voy saliendo ahora y quiero saber si hay taco?",
    },
  ],

  [new Date(Date.now() - 2 * 86400000).toDateString()]: [
    {
      id: "6",
      title: "Qué micro sirve para ir al Costanera Center?",
      description: "Necesito llegar rápido al mall y no sé cuál tomar",
    },
    {
      id: "7",
      title: "Dónde ir a carretear en Conce este finde",
      description: "Estoy buscando recomendaciones buenas para salir en Conce?",
    },
    {
      id: "8",
      title: "En qué canal transmiten el partido de Chile hoy?",
      description: "No puedo encontrar dónde verlo",
    },
  ],
};

export default function AppConversationsNav({}: AppConversationsNavProps) {
  const { conversations } = useCondorAI();

  return (
    <Transition
      as="div"
      show={conversations.conversationsOpen}
      enter="transition-all duration-300 [&_*]:whitespace-nowrap"
      enterFrom="w-0 overflow-clip [&_*]:whitespace-nowrap"
      enterTo="w-2/12 [&_*]:whitespace-nowrap"
      leave="transition-all duration-300"
      leaveFrom="w-2/12 [&_*]:whitespace-nowrap"
      leaveTo="w-0 overflow-clip [&_*]:whitespace-nowrap"
      className={clsx("bg-white px-4 py-3")}
    >
      <ul className="flex items-center justify-between text-2xl text-dark-text-accent">
        <li className="flex items-center justify-center">
          <Button
            variant={"outline"}
            onClick={() => conversations.setConversationsOpen((prev) => !prev)}
            className="border-none shadow-none relative group bg-transparent"
          >
            <div
              aria-hidden="true"
              className="w-2 h-2 bg-primary-600 absolute top-1.5 right-3 rounded-full group-hover:bg-primary-400 transition-colors duration-300"
            ></div>
            <MdOutlineSpaceDashboard className="!w-6 !h-6" />
          </Button>
        </li>
        <ul className="flex items-center justify-between text-2xl text-dark-text-accent gap-2">
          <li className="flex items-center justify-center">
            <Button
              variant={"outline"}
              className="border-none shadow-none bg-transparent"
            >
              <IoSearch className="!w-6 !h-6" />
            </Button>
          </li>
          <li className="flex items-center justify-center">
            <Button
              variant={"outline"}
              className="border-none shadow-none bg-transparent"
            >
              <TbMessageCircle className="!w-6 !h-6" />
            </Button>
          </li>
        </ul>
      </ul>
      <div className="flex items-stretch min-h-screen">
        <div className="w-full flex flex-col gap-8">
          {Object.entries(conversationsArray).map(
            ([date, conversationArray]) => (
              <>
                <ul className="py-2 px-0">
                  <li className="px-4">
                    {/**
                     * [TODO] - Add locale to date
                     */}
                    <strong className="text-sm font-semibold">
                      {date === "Hoy" || date === "Ayer"
                        ? date
                        : new Date(date).toLocaleDateString("es-CL")}
                    </strong>
                  </li>
                  {conversationArray.map((singleConversation) => (
                    <li
                      key={singleConversation.id}
                      className="text-base hover:bg-silver-100 flex items-center justify-start"
                    >
                      {
                        // conversations.setSelectedConversation(
                        //   singleConversation
                        // ) [TODO] - Add setSelectedConversation
                      }
                      <Button
                        className="text-sm w-full h-full bg-transparent border-none text-left font-normal flex items-start justify-start whitespace-pre-wrap hover:bg-silver-100/50 text-dark-text-primary hover:text-black"
                        variant={"outline"}
                      >
                        <span>{singleConversation.title}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )
          )}
        </div>
      </div>
    </Transition>
  );
}
