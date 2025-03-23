import React from "react";
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
  User,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import { UserProfileMenuProps } from "@/types/layout";
import { useRouter } from "next/navigation";

const AppNavUserDropdown = ({ session }: UserProfileMenuProps) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-none p-0 hover:bg-secondary/20 rounded-full transition-colors"
        >
          <Avatar className="h-8 w-8 border-2 border-secondary">
            {session?.user?.image ? (
              <AvatarImage
                src={session.user.image}
                alt={session.user.name || "Usuario"}
              />
            ) : (
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="mr-4 w-64 mt-1"
        variant="white"
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
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {session?.user?.name || "Usuario"}
              </span>
              <span className="text-xs text-secondary/70">
                {session?.user?.email || "usuario@ejemplo.com"}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="white">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>

          <DropdownMenuItem variant="white">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Pagos</span>
          </DropdownMenuItem>

          <DropdownMenuItem variant="white">
            <Settings className="mr-2 h-4 w-4" />
            <span>Personalizar Condor-AI</span>
          </DropdownMenuItem>

          <DropdownMenuItem variant="white">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notificaciones</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="white">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ayuda y soporte</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="white"
            onClick={() => {
              router.push("/auth/sign-out");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppNavUserDropdown;
