"use client";
import { Button } from "@/components/ui/button";
import { AppNavProps } from "@/types/layout";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import { BsFillShareFill } from "react-icons/bs";
import AppNavModelsDropdownProps from "./AppNavModelsDropdown";
import AppNavUserDropdown from "./AppNavUserDropdown/AppNavUserDropdown";
import clsx from "clsx";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

export default function AppNav({ session, children }: AppNavProps) {
  const router = useRouter();
  const { conversations } = useUser();

  return (
    <div className="w-full h-screen overflow-y-scroll bg-white dark:bg-shark-950 text-black dark:text-white">
      <header className="bg-white dark:bg-shark-950 border-b border-gray-200 dark:border-shark-700">
        <nav>
          <div className="flex w-full">
            <ul
              className={clsx(
                "flex items-center justify-between px-4 py-3 w-full",
                conversations.conversationsOpen &&
                  "flex items-center justify-between"
              )}
            >
              {conversations.conversationsOpen === true ? (
                <li>
                  <AppNavModelsDropdownProps />
                </li>
              ) : (
                <>
                  <ul className="flex items-center text-2xl text-[--color-dark-text-accent] dark:text-white gap-4">
                    <li className="flex items-center justify-center">
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          conversations.setConversationsOpen((prev) => !prev)
                        }
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
                      <Button
                        variant={"outline"}
                        className="border-none shadow-none"
                        onClick={() => {
                          router.push("/app");
                        }}
                      >
                        <TbMessageCircle className="!w-6 !h-6" />
                      </Button>
                    </li>
                    <li>
                      <AppNavModelsDropdownProps />
                    </li>
                  </ul>
                </>
              )}
              <li>
                <div className="flex items-center justify-end gap-4">
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
      <main className="relative">{children}</main>
    </div>
  );
}
