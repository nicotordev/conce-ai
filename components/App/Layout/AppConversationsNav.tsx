"use client";
import { Button } from "@/components/ui/button";
import {
  MdOutlineSpaceDashboard,
  MdHistory,
  MdOutlineSettings,
  MdBookmarkBorder,
} from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { IoSearch, IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaRegFileAlt } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import { useUser } from "@/providers/UserProvider";
import { useParams, usePathname, useRouter } from "next/navigation";
import AppConversationItemNav from "./AppConversationItemNav";
import { Virtuoso } from "react-virtuoso";

export default function AppConversationsNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const {
    conversations: {
      conversationsJoinedByDate,
      conversationsOpen,
      setConversationsOpen,
    },
  } = useUser();

  return (
    <Transition
      as="div"
      show={conversationsOpen}
      enter="transition-transform duration-300 origin-left"
      enterFrom="scale-x-0 overflow-hidden"
      enterTo="scale-x-100"
      leave="transition-transform duration-150 origin-left"
      leaveFrom="scale-x-100"
      leaveTo="scale-x-0 overflow-hidden"
      className="bg-white dark:bg-shark-800 px-4 py-3 w-2/12 flex flex-col"
    >
      {/* Navegación principal */}
      <ul className="flex items-center justify-between text-2xl text-dark-text-accent dark:text-[#e1e1e1] mb-4">
        <li className="flex items-center justify-center">
          <Button
            variant="outline"
            onClick={() => setConversationsOpen((prev) => !prev)}
            className="border-none shadow-none relative group bg-transparent"
          >
            <div
              aria-hidden="true"
              className="w-2 h-2 bg-primary-600 absolute top-1.5 right-3 rounded-full group-hover:bg-primary-400 transition-colors duration-300"
            ></div>
            <MdOutlineSpaceDashboard className="!w-6 !h-6" />
          </Button>
        </li>
        <ul className="flex items-center justify-between text-2xl text-dark-text-accent dark:text-[#e1e1e1] gap-2">
          <li>
            <Button
              variant="outline"
              className="border-none shadow-none bg-transparent"
            >
              <IoSearch className="!w-6 !h-6" />
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              className={`border-none shadow-none bg-transparent ${
                pathname === "/app" ? "bg-accent text-accent-foreground" : ""
              }`}
              onClick={() => router.push("/app")}
            >
              <TbMessageCircle className="!w-6 !h-6" />
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              className={`border-none shadow-none bg-transparent ${
                pathname === "/app/news"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
              onClick={() => router.push("/app/news")}
            >
              <IoNewspaperOutline className="!w-6 !h-6" />
            </Button>
          </li>
        </ul>
      </ul>
      {/* Acciones rápidas */}
      <div className="bg-gray-50 dark:bg-shark-900 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-[#e1e1e1] mb-2">
          Acciones rápidas
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-start text-xs py-1 h-auto basis-[calc(50%-1rem)]"
            onClick={() => router.push("/app/templates")}
          >
            <HiOutlineLightBulb className="mr-1 text-amber-500" />
            <span>Plantillas</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-start text-xs py-1 h-auto basis-[calc(50%-1rem)]"
            onClick={() => router.push("/app/documents")}
          >
            <FaRegFileAlt className="mr-1 text-blue-500" />
            <span>Documentos</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-start text-xs py-1 h-auto basis-[calc(50%-1rem)]"
            onClick={() => router.push("/app/saved")}
          >
            <MdBookmarkBorder className="mr-1 text-purple-500" />
            <span>Guardados</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-start text-xs py-1 h-auto basis-[calc(50%-1rem)]"
            onClick={() => router.push("/app/settings")}
          >
            <MdOutlineSettings className="mr-1 text-gray-500" />
            <span>Ajustes</span>
          </Button>
        </div>
      </div>
      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        <Virtuoso
          style={{ height: "100%" }}
          data={Object.entries(conversationsJoinedByDate)}
          itemContent={(index, [date, conversationArray]) => (
            <div key={date} className="py-2 px-0">
              <div className="px-4 sticky top-0 z-10 bg-white dark:bg-shark-950">
                <strong className="text-sm font-semibold dark:text-[#e1e1e1]">
                  {date === "Hoy" || date === "Ayer"
                    ? date
                    : new Date(date).toLocaleDateString("es-CL")}
                </strong>
              </div>
              {conversationArray.map((singleConversation) => (
                <AppConversationItemNav
                  key={singleConversation.id}
                  conversation={singleConversation}
                  id={id}
                />
              ))}
            </div>
          )}
        />
      </div>
      {/* Historial */}
      <div className="pt-2 border-t mt-2 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start text-xs py-1 h-auto text-gray-600 dark:text-[#e1e1e1]"
          onClick={() => router.push("/app/history")}
        >
          <MdHistory className="mr-2" />
          <span>Historial completo</span>
        </Button>
      </div>
    </Transition>
  );
}
