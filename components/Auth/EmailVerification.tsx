"use client";
import { EmailVerificationProps } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import {  useState } from "react";
import CondorInput from "../Common/Forms/CondorInput";
import { BsLock } from "react-icons/bs";
import {
  doEmailVerification,
  doSteppedRedirection,
} from "@/app/actions/auth.actions";
import Link from "next/link";
import { Button } from "../ui/button";
import { EmailVerificationModal } from "./EmailVerificationModal";
import AuthLoading from "./AuthLoading";
import AuthError from "./AuthError";
import AuthTokenExpired from "./AuthTokenExpired";
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
              required
              leftIcon={<BsLock />}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
          </div>
        </Transition>
        <AuthLoading loading={loading} />
        <AuthError error={error} />
        <AuthTokenExpired
          show={Boolean(step === EmailVerificationStep.expired)}
        />
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
