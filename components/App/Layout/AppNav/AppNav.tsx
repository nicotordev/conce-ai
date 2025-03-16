"use client";
import { Button } from "@/components/ui/button";
import { AppNavProps } from "@/types/layout";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { BsFillShareFill } from "react-icons/bs";
import AppNavModelsDropdownProps from "./AppNavModelsDropdown";
import AppNavUserDropdown from "./AppNavUserDropdown";
import { useCondorAI } from "@/providers/CondorAIProvider";
export default function AppNav({ session }: AppNavProps) {
  const { conversations } = useCondorAI();
  return (
    <header>
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          <ul className="flex items-center gap-6 text-2xl text-dark-text-accent">
            <li className="flex items-center justify-center">
              <Button
                variant={"outline"}
                onClick={() => conversations.setConversationsOpen(true)}
                className="border-none shadow-none relative group"
              >
                <div
                  aria-hidden="true"
                  className="w-2 h-2 bg-primary-600 absolute top-1.5 right-3 rounded-full group-hover:bg-primary-400 transition-colors duration-300"
                ></div>
                <MdOutlineSpaceDashboard className="!w-6 !h-6" />
              </Button>
            </li>
            <li className="flex items-center justify-center">
              <Button variant={"outline"} className="border-none shadow-none">
                <TbMessageCircle className="!w-6 !h-6" />
              </Button>
            </li>
            <li>
              <AppNavModelsDropdownProps />
            </li>
          </ul>
          <ul>
            <li>
              <div className="flex items-center justify-center gap-4">
                <Button variant={"outline"}>
                  <BsFillShareFill />
                  Compartir
                </Button>
                <AppNavUserDropdown session={session} />
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
