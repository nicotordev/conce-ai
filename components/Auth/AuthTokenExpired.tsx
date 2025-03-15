"use client";

import { AuthTokenExpiredProps } from "@/types/auth";
import { Transition } from "@headlessui/react";
import { CgCalendar } from "react-icons/cg";

export default function AuthTokenExpired({
  show,
  children,
}: AuthTokenExpiredProps) {
  return (
    <Transition
      show={show}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      unmount={true}
    >
      <div>
        <div>
          {/* Error UI */}
          <div className="flex flex-col gap-2 text-center bg-white rounded-md border border-solid border-gray-300 p-4 my-4">
            <p className="!text-silver-700 font-semibold text-xs flex flex-col gap-1">
              <strong className="!text-red-500 !text-sm !font-medium flex items-center justify-center gap-2">
                <CgCalendar /> Código de verificación Expirado
              </strong>
              El código de verificación ingresado ha expirado. Hemos enviado un
              nuevo código de verificación a tu correo electrónico.
            </p>
          </div>
        </div>
        {children || null}
      </div>
    </Transition>
  );
}
