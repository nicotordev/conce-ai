"use client";
import {
  AppNavUserConfigurationModalProps,
  AppNavUserConfigurationModalPropsTab,
} from "@/types/app";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transition } from "@headlessui/react";
import {
  BsGear,
  BsBell,
  BsPalette,
  BsVolumeUp,
  BsShieldLock,
  BsCreditCard,
} from "react-icons/bs";
import {
  HiOutlineDatabase,
  HiOutlineHome,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { FiLink } from "react-icons/fi";

export default function AppNavUserConfigurationModal({
  isOpen,
  setIsOpen,
}: AppNavUserConfigurationModalProps) {
  const [activeTab, setActiveTab] =
    useState<AppNavUserConfigurationModalPropsTab>("general");

  const tabs: {
    id: AppNavUserConfigurationModalPropsTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "general",
      label: "General",
      icon: <HiOutlineHome className="h-4 w-4" />,
    },
    {
      id: "notifications",
      label: "Notificaciones",
      icon: <BsBell className="h-4 w-4" />,
    },
    {
      id: "personalization",
      label: "Personalización",
      icon: <BsPalette className="h-4 w-4" />,
    },
    { id: "audio", label: "Audio", icon: <BsVolumeUp className="h-4 w-4" /> },
    {
      id: "data-control",
      label: "Controles de datos",
      icon: <HiOutlineDatabase className="h-4 w-4" />,
    },
    {
      id: "constructor-profile",
      label: "Perfil de Constructor",
      icon: <HiOutlineUserCircle className="h-4 w-4" />,
    },
    {
      id: "connected-apps",
      label: "Apps Conectadas",
      icon: <FiLink className="h-4 w-4" />,
    },
    {
      id: "security",
      label: "Seguridad",
      icon: <BsShieldLock className="h-4 w-4" />,
    },
    {
      id: "subscription",
      label: "Suscripción",
      icon: <BsCreditCard className="h-4 w-4" />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 overflow-hidden !max-w-[unset] w-[20vw]">
        <div>
          <DialogHeader className="flex flex-row items-start space-y-0 gap-4 border-b border-gray-300 p-6">
            <BsGear className="h-6 w-6" />
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold mb-2">
                Configuración
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-4 flex items-stretch px-6 pt-2 pb-4 w-full">
            <nav className="w-3/12">
              <ul className="space-y-1 text-sm w-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left w-full px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                      activeTab === tab.id
                        ? "bg-gray-200 text-black"
                        : "hover:bg-gray-200 hover:text-black text-gray-600"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </ul>
            </nav>

            <div className="w-9/12">
              <Transition
                show={activeTab === "general"}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0"
                enterTo="transform opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100"
                leaveTo="transform opacity-0"
                as={Fragment}
              >
                <div className="flex-1 w-full">
                  <AppNavUserConfigurationModalGeneralConfiguration />
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AppNavUserConfigurationModalGeneralConfiguration() {
  return (
    <div className="p-4 text-sm text-gray-600 w-full">
      <div className="flex flex-col w-full">
        <div className="py-2 border-b border-gray-300 w-full">
          <div className="flex items-center justify-between w-full">Theme</div>
          <div>

          </div>
        </div>
      </div>
    </div>
  );
}
