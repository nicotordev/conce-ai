"use client";
import { EmailVerificationProps } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import CondorInput from "../Common/Forms/CondorInput";
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
    return await doEmailVerification({
      code,
      userId,
    });
  }

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
        <form onSubmit={handleNextStep} className="relative mt-4">
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
      </Transition>
      <AuthTokenExpired
        show={Boolean(step === EmailVerificationStep.expired)}
      />
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
            <Button
              onClick={() => {
                if (session) {
                  redirect("/app");
                } else {
                  redirect("/auth/sign-in");
                }
              }}
            ></Button>
          </div>
        </div>
      </Transition>
      <EmailVerificationModal
        loading={loading}
        setLoading={setLoading}
        handleStep={handleStep}
        email={state?.email || ""}
      />
    </>
  );
}
