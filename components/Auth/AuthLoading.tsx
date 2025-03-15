"use client";
import { AuthLoadingProps } from "@/types/auth";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function AuthLoading({ loading = false }: AuthLoadingProps) {
  return (
    <Transition
      show={loading}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      unmount={true}
      as={Fragment}
    >
      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center mt-4 z-50 pointer-events-none">
        <div className="h-full flex flex-col w-full backdrop-blur-xs bg-white/10 scale-110">
          <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
            <div className="flex justify-center">
              <div
                className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
