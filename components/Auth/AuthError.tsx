"use client";
import { AuthErrorProps } from "@/types/auth";
import { getAuthErrorMessage } from "@/utils/language.utilts";
import { Transition } from "@headlessui/react";
import { CgDanger } from "react-icons/cg";

export default function AuthError({ error }: AuthErrorProps) {
  return (
    <Transition
      show={Boolean(error)}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      unmount={true}
    >
      <div>
        {/* Error UI */}
        <div className="flex flex-col gap-2 text-center bg-white rounded-md border border-solid border-gray-300 p-4 my-4">
          <p className="!text-silver-700 font-semibold text-xs flex flex-col gap-1">
            <strong className="!text-red-500 !text-sm !font-medium flex items-center justify-center gap-2">
              <CgDanger /> Ocurrió un error
            </strong>
            {getAuthErrorMessage(error || "")}
            <small className="text-muted font-bold text-xs">
              Código de error: {error}
            </small>
          </p>
        </div>
      </div>
    </Transition>
  );
}
