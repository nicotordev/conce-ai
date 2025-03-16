"use client";
import { Button } from "@/components/ui/button";
import { AppNavProps } from "@/types/layout";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { BsFillShareFill } from "react-icons/bs";
import AppNavModelsDropdownProps from "./AppNavModelsDropdown";
import AppNavUserDropdown from "./AppNavUserDropdown";
export default function AppNav({ session }: AppNavProps) {
  return (
    <header>
      <nav className="px-4 py-3">
        <div className="flex items-center justify-between">
          <ul className="flex items-center gap-6 text-2xl text-dark-text-accent">
            <li>
              <MdOutlineSpaceDashboard />
            </li>
            <li>
              <TbMessageCircle />
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
