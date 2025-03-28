"use client";
import { EmailVerificationProps } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import ConceAIInput from "../Common/Forms/ConceAIInput";
import { BsLock } from "react-icons/bs";
import {
  doEmailVerification,
  doSteppedRedirection,
} from "@/app/actions/auth.actions";
import { Button } from "../ui/button";
import { EmailVerificationModal } from "./EmailVerificationModal";
import AuthLoading from "./AuthLoading";
import AuthError from "./AuthError";
import AuthTokenExpired from "./AuthTokenExpired";
import { CgRadioCheck } from "react-icons/cg";
import { redirect } from "next/navigation";
export default function EmailVerification({
  state,
  session,
}: EmailVerificationProps) {
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
    await doEmailVerification({
      code,
      userId,
    });
    setLoading(false);
  }

  useEffect(() => {
    setLoading(false);
  }, [state]);

  return (
    <>
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
          <form onSubmit={handleNextStep} className="relative mt-4">
            <div>
              <ConceAIInput
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

            <AuthLoading loading={loading} />
            <AuthError error={error} />
            <div className="mt-4">
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={loading}>
                  Verificar
                </Button>
              </div>
            </div>
          </form>
          <EmailVerificationModal
            loading={loading}
            setLoading={setLoading}
            handleStep={handleStep}
            email={state?.email || ""}
          />
        </div>
      </Transition>

      <AuthTokenExpired show={Boolean(step === EmailVerificationStep.expired)}>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => handleStep(EmailVerificationStep.start)}
            disabled={loading}
            type="submit"
          >
            Volver a intentarlo
          </Button>
        </div>
      </AuthTokenExpired>
      <Transition
        show={EmailVerificationStep.success === step}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        unmount={true}
      >
        <div>
          <div className="flex flex-col gap-2 text-center bg-white rounded-md border border-solid border-gray-300 p-4 my-4">
            <p className="!text-silver-700 font-semibold text-xs flex flex-col gap-1">
              <strong className="!text-green-500 !text-sm !font-medium flex items-center justify-center gap-2">
                <CgRadioCheck /> Verificación exitosa
              </strong>
              Tu cuenta ha sido verificada exitosamente, ahora puedes continuar
              con tu sesión.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              if (session) {
                redirect("/app");
              } else {
                redirect("/auth/sign-in");
              }
            }}
          >
            Continuar
          </Button>
        </div>
      </Transition>
    </>
  );
}
