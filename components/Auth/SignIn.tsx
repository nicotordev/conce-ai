"use client";

import { SignInProps } from "@/types/auth";
import { SignInPageStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import CondorInput from "../Common/Forms/CondorInput";
import { BsEnvelope, BsLock } from "react-icons/bs";
import { doSignIn, doSteppedRedirection } from "@/app/actions/auth.actions";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthError from "./AuthError";
import AuthLoading from "./AuthLoading";

export default function SignIn({ state }: SignInProps) {
  const step = state?.step ?? SignInPageStep.email;
  const [doingRedirection, setDoingRedirection] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState(state?.password ?? "");
  const error = state?.error ?? "";

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step === SignInPageStep.email) {
      setDoingRedirection(true);
      const redirectionData = await doSteppedRedirection({
        email,
        password,
        step: SignInPageStep.password,
      });
      setDoingRedirection(false);

      if (!redirectionData.success) {
        toast.error("Ha ocurrido un error al intentar crear la cuenta");
        return;
      }

      window.location.href = `/auth/sign-in?state=${redirectionData.data}`;
    } else {
      setLoadingSignUp(true);

      await doSignIn(
        {
          email,
          password,
        },
        SignInPageStep.password
      );
    }
  }

  async function handlePreviousStep() {
    setDoingRedirection(true);
    const redirectionData = await doSteppedRedirection({
      email,
      password,
      step: SignInPageStep.email,
    });

    setDoingRedirection(false);

    if (!redirectionData.success) {
      toast.error("Ha ocurrido un error al intentar crear la cuenta");
      return;
    }

    window.location.href = `/auth/sign-in?state=${redirectionData.data}`;
  }

  useEffect(() => {
    setDoingRedirection(false);
    setLoadingSignUp(false);
  }, [state]);

  return (
    <>
      <h2 className="!font-paragraph font-bold text-[--color-dark-text-primary] dark:text-white text-3xl text-center">
        {step === SignInPageStep.email
          ? "Bienvenido"
          : "Introduce tu contraseña"}
      </h2>

      <form onSubmit={handleNextStep} className="relative mt-4">
        <AuthLoading loading={loadingSignUp} />
        <AuthError error={error} />

        <Transition
          show={step === SignInPageStep.email}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount
        >
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
              disabled={doingRedirection || loadingSignUp}
            />
          </div>
        </Transition>

        <Transition
          show={step === SignInPageStep.password}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount
        >
          <div className="space-y-5 pt-6">
            <div className="relative">
              <CondorInput
                name="email"
                id="email"
                placeholder="Dirección de correo electrónico"
                type="email"
                required
                leftIcon={<BsEnvelope />}
                defaultValue={email}
                readOnly
              />
              <button
                type="button"
                onClick={handlePreviousStep}
                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-50 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300 dark:text-gray-400"
              >
                Editar
              </button>
            </div>
            <div className="flex flex-col-reverse">
              <div className="flex items-center justify-start">
                <Link
                  href="/auth/reset-password"
                  className="w-fit text-xs justify-center text-center py-1.5 pr-4 inline-flex items-center gap-x-2 font-medium rounded-lg text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <CondorInput
                name="password"
                id="password"
                placeholder="Contraseña"
                type="password"
                required
                leftIcon={<BsLock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={doingRedirection || loadingSignUp}
              />
            </div>
          </div>
        </Transition>

        <div className="flex flex-col gap-3">
          <button
            disabled={doingRedirection || loadingSignUp}
            type="submit"
            className="cursor-pointer justify-center text-center mt-4 w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150"
          >
            Continuar
          </button>
        </div>
      </form>
    </>
  );
}
