"use client";
import { EmailVerificationProps } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import CondorInput from "../Common/Forms/CondorInput";
import { BsLock } from "react-icons/bs";
import { CgCalendar, CgCheck, CgDanger } from "react-icons/cg";
import {
  doEmailVerification,
  doSteppedRedirection,
} from "@/app/actions/auth.actions";
import Link from "next/link";
import authConstants from "@/constants/auth.constants";
import { Button } from "../ui/button";
import { EmailVerificationModal } from "./EmailVerificationModal";
export default function EmailVerification({ state }: EmailVerificationProps) {
  const step = state?.step || EmailVerificationStep.start;
  const error = state?.error || "";
  const userId = state?.userId || "";
  const [code, setCode] = useState<string>(state?.code || "");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleStep(step: EmailVerificationStep, error?: string) {
    setLoading(true);
    await doSteppedRedirection({ step, code, error: error || "" });
    setLoading(false);
  }

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const actionResponse = await doEmailVerification({
      code,
      userId,
    });

    if (actionResponse.success) {
      return await handleStep(EmailVerificationStep.success);
    }

    return await handleStep(
      EmailVerificationStep.error,
      actionResponse.message
    );
  }

  return (
    <>
      <form onSubmit={handleNextStep} className="relative">
        <Transition
          show={EmailVerificationStep.start === step}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={true}
        >
          <div>
            <CondorInput
              name="code"
              id="code"
              placeholder="Código de verificación"
              type="text"
              label="Código de verificación"
              required
              leftIcon={<BsLock />}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
          </div>
        </Transition>
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
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <Transition
          show={step === EmailVerificationStep.success && !loading}
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
                <strong className="!text-green-500 !text-sm !font-medium flex items-center justify-center gap-2">
                  <CgCheck />{" "}
                  {error ===
                  authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN
                    ? "Código de verificación incorrecto"
                    : "Código de verificación correcto"}
                </strong>
                {error ===
                authConstants.ERROR_MESSAGES_CODES.INVALID_VERIFICATION_TOKEN
                  ? "El código de verificación ingresado no es correcto. Por favor, verifica el código e intenta nuevamente."
                  : "Ha ocurrido un error interno. Por favor, intenta nuevamente."}
                <small>
                  <strong>Nota:</strong> Serás redirigido a la aplicación en
                  unos segundos
                </small>
              </p>
            </div>
          </div>
        </Transition>
        <Transition
          show={Boolean(step === EmailVerificationStep.expired && !loading)}
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
                  <CgCalendar /> Código de verificación Expirado
                </strong>
                El código de verificación ingresado ha expirado. Hemos enviado
                un nuevo código de verificación a tu correo electrónico.
              </p>
            </div>
          </div>
        </Transition>
        <Transition
          show={Boolean(step === EmailVerificationStep.error && !loading)}
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
                  <CgDanger /> Código de verificación incorrecto
                </strong>
                El código de verificación ingresado no es correcto. Por favor,
                verifica el código e intenta nuevamente.
              </p>
            </div>
          </div>
        </Transition>
        <div className="mt-4">
          {Boolean(step === EmailVerificationStep.expired) ? null : Boolean(
              step === EmailVerificationStep.error
            ) ? (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleStep(EmailVerificationStep.start)}
                disabled={loading}
                type="button"
              >
                Volver a intentarlo
              </Button>
            </div>
          ) : Boolean(step === EmailVerificationStep.success) ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/app"
                type="submit"
                className="cursor-pointer justify-center text-center mt-4 w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-hidden focus:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
              >
                Continuar
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={loading}>
                Continuar
              </Button>
            </div>
          )}
        </div>
      </form>

      <EmailVerificationModal
        loading={loading}
        setLoading={setLoading}
        handleStep={handleStep}
        email={state?.email || ""}
      />

      {/* <form
        onSubmit={handleEmailResend}
        className="flex items-center justify-center"
      >
        <button
          disabled={loading}
          type="submit"
          className="mx-auto w-fit text-xs text-primary-500 cursor-pointer justify-center text-center mt-4 py-3 px-4 inline-flex items-center gap-x-2 font-medium rounded-lg border border-transparent bg-transparent focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
        >
          Solicitar nuevo código
        </button>
      </form> */}
    </>
  );
}
