"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BsGear,
  BsPalette,
  BsCreditCard,
  BsQuestionCircle,
  BsBoxArrowRight,
} from "react-icons/bs";
import { UserProfileMenuProps } from "@/types/layout";
import { useRouter } from "next/navigation";
import AppNavUserConfigurationModal from "./AppNavUserConfigurationModal";

const AppNavUserDropdown = ({ session }: UserProfileMenuProps) => {
  const router = useRouter();
  const [configurationMenuOpen, setConfigurationMenuOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-none p-0 hover:bg-secondary/20 dark:hover:bg-shark-700 rounded-full transition-colors"
          >
            <Avatar className="h-8 w-8 border-2 border-secondary dark:border-shark-600">
              {session?.user?.image ? (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name || "Usuario"}
                />
              ) : (
                <AvatarFallback className="bg-secondary text-secondary-foreground dark:bg-shark-600 dark:text-white">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="mr-4 w-64 mt-1 bg-white text-black dark:bg-shark-800 dark:text-white border border-gray-200 dark:border-shark-700"
          align="end"
        >
          <div className="flex flex-col p-2 gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                {session?.user?.image ? (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || "Usuario"}
                  />
                ) : (
                  <AvatarFallback className="bg-secondary text-secondary-foreground dark:bg-shark-600 dark:text-white">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {session?.user?.name || "Usuario"}
                </span>
                <span className="text-xs text-secondary/70 dark:text-gray-400">
                  {session?.user?.email || "usuario@ejemplo.com"}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-shark-600" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary/20 dark:hover:bg-shark-700">
              <BsPalette className="mr-2 h-4 w-4" />
              <span>Personalizar Conce-AI</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer hover:bg-secondary/20 dark:hover:bg-shark-700"
              onClick={() => setConfigurationMenuOpen(true)}
            >
              <BsGear className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-shark-600" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary/20 dark:hover:bg-shark-700">
              <BsCreditCard className="mr-2 h-4 w-4" />
              <span>Mejora tu Plan</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-shark-600" />

          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary/20 dark:hover:bg-shark-700">
              <BsQuestionCircle className="mr-2 h-4 w-4" />
              <span>Ayuda y soporte</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/auth/sign-out")}
              className="cursor-pointer hover:bg-secondary/20 dark:hover:bg-shark-700"
            >
              <BsBoxArrowRight className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppNavUserConfigurationModal
        isOpen={configurationMenuOpen}
        setIsOpen={setConfigurationMenuOpen}
      />
    </>
  );
};

export default AppNavUserDropdown;
