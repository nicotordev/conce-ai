"use client";
import { ResetPasswordProps } from "@/types/auth";
import { ResetPasswordStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import CondorInput from "../Common/Forms/CondorInput";
import { BsEnvelope, BsSafe } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AuthError from "./AuthError";
import AuthLoading from "./AuthLoading";
import {
  doResetPasswordEmail,
  doSendResetPasswordEmail,
  doSteppedRedirection,
} from "@/app/actions/auth.actions";
import CondorPasswordInput from "../Common/Forms/CondorPasswordInput";
import toast from "react-hot-toast";
import AuthTokenExpired from "./AuthTokenExpired";
import Link from "next/link";

export default function ResetPassword({ state }: ResetPasswordProps) {
  const [doingRedirection, setDoingRedirection] = useState(false);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState(state?.password ?? "");
  const [token, setToken] = useState(state?.token ?? "");

  useEffect(() => {
    setDoingRedirection(false);
    setLoadingResetPassword(false);
  }, [state]);

  async function handleStep(step: ResetPasswordStep) {
    setDoingRedirection(true);
    setLoadingResetPassword(true);

    await doSteppedRedirection({
      token,
      password,
      email,
      step: step,
    });

    setDoingRedirection(false);
    setLoadingResetPassword(false);
  }

  async function handleResendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDoingRedirection(true);
    setLoadingResetPassword(true);

    await doSteppedRedirection({
      email: email,
      step: ResetPasswordStep.email,
    });

    setDoingRedirection(false);
    setLoadingResetPassword(false);
  }

  async function handleSendResetPasswordEmail(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setDoingRedirection(true);
    setLoadingResetPassword(true);

    return doSendResetPasswordEmail({
      email: email,
    });
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDoingRedirection(true);
    setLoadingResetPassword(true);

    const result = await doResetPasswordEmail({
      email,
      token,
      password,
    });

    if (result.success) {
      setDoingRedirection(false);
      setLoadingResetPassword(false);
      toast.success("Contraseña restablecida con éxito");
      window.location.href = "/auth/sign-in";
      return;
    }
    setDoingRedirection(false);
    setLoadingResetPassword(false);
  }

  useEffect(() => {
    setDoingRedirection(false);
    setLoadingResetPassword(false);
  }, [state]);

  return (
    <>
      <h2 className="!font-paragraph font-bold text-dark-text-primary text-3xl text-center">
        Restablece tu contraseña
      </h2>
      {/* INITIAL STEP */}
      <Transition
        show={state.step === ResetPasswordStep.email}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        unmount={true}
      >
        <form className="relative mt-4" onSubmit={handleSendResetPasswordEmail}>
          <AuthError error={state.error} />

          <div>
            <CondorInput
              name="email"
              id="email"
              placeholder="Dirección de correo electrónico"
              type="email"
              required
              leftIcon={<BsEnvelope />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={doingRedirection || loadingResetPassword}
            />
          </div>

          <AuthLoading loading={loadingResetPassword} />
          <div className="flex flex-col gap-3 mt-4">
            <Button
              disabled={doingRedirection || loadingResetPassword}
              type="submit"
            >
              Continuar
            </Button>
          </div>

          <div className="flex items-center justify-center mt-4">
            <Link href="/auth/sign-in" className="text-primary-600 text-sm font-medium">
                Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </Transition>
      {/* SUCCESS STEP AND RESEND STEP */}
      <Transition
        show={state.step === ResetPasswordStep.resend}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        unmount={true}
      >
        <form
          className="fixed inset-0 bg-white flex items-center justify-center"
          onSubmit={handleResendEmail}
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-solid border-secondary-600 text-secondary-600">
              <BsEnvelope />
            </div>
            <h2 className="text-center text-2xl font-medium mt-4 !text-dark-text-accent">
              Revisa tu correo electrónico
            </h2>
            <p className="max-w-100 text-xs mt-2 text-dark-text-muted">
              Por favor revise la dirección de correo electrónico
              {email} y busque un email conteniendo instrucciones acerca de como
              restablecer su contraseña.
            </p>
            <Button
              disabled={doingRedirection || loadingResetPassword}
              type="submit"
              className="w-full mt-3"
              variant="outline"
            >
              Reenviar email
            </Button>
          </div>
        </form>
      </Transition>
      {/* EXPIRED TOKEN STEP */}
      <AuthTokenExpired show={state.step === ResetPasswordStep.expired}>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => handleStep(ResetPasswordStep.email)}
            disabled={doingRedirection || loadingResetPassword}
            type="submit"
          >
            Volver
          </Button>
        </div>
      </AuthTokenExpired>

      {/* RESET PASSWORD STEP (FINAL STEP) */}
      <Transition
        show={state.step === ResetPasswordStep.reset}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        unmount={true}
      >
        <form
          className="relative mt-4 space-y-3"
          onSubmit={handleResetPassword}
        >
          <AuthError error={state.error} />

          <div>
            <CondorInput
              name="token"
              id="token"
              placeholder="Codigo de Restablecimiento"
              type="text"
              required
              leftIcon={<BsSafe />}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={doingRedirection || loadingResetPassword}
            />
          </div>

          <div>
            <CondorPasswordInput
              name="password"
              id="password"
              placeholder="Contraseña"
              type="password"
              required
              password={password}
              setPassword={(e) => setPassword(e)}
              disabled={doingRedirection || loadingResetPassword}
            />
          </div>

          <AuthLoading loading={loadingResetPassword} />
          <div className="flex flex-col gap-3 mt-4">
            <Button
              disabled={doingRedirection || loadingResetPassword}
              type="submit"
            >
              Continuar
            </Button>
          </div>
        </form>
      </Transition>
    </>
  );
}
