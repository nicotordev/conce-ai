"use client";
import { Button } from "@/components/ui/button";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import { useUser } from "@/providers/UserProvider";

export default function AppConversationsNav() {
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
        <div className="w-full flex flex-col gap-4">
          {Object.entries(conversationsJoinedByDate).map(
            ([date, conversationArray]) => (
              <ul className="py-2 px-0" key={date}>
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
                    className="text-sm hover:bg-silver-100 flex items-center justify-start"
                  >
                    <Button
                      className="text-xs w-full h-full bg-transparent border-none shadow-none text-left font-normal flex items-start justify-start whitespace-pre-wrap text-dark-text-primary rounded-md"
                      variant={"outline"}
                      onClick={() => {
                        window.location.href = `/app/${singleConversation.id}`;
                      }}
                    >
                      <span>{singleConversation.title}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </Transition>
  );
}
