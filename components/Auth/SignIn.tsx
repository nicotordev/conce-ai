"use client";

import { SignInProps } from "@/types/auth";
import { SignInPageStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
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

  return (
    <>
      <h2 className="!font-paragraph font-bold text-dark-text-primary text-3xl text-center">
        {step === SignInPageStep.email
          ? "Bienvenido"
          : "Introducte tu contraseña"}
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
          unmount={true}
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
          unmount={true}
        >
          <div className="space-y-5 pt-6">
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
            <div className="flex flex-col-reverse">
              <div className="flex items-center justify-start">
                <Link
                  href="/auth/reset-password"
                  type="button"
                  className="w-fit text-xs cursor-pointer justify-center text-center py-1.5 pr-4 inline-flex items-center gap-x-2 font-medium rounded-lg border border-transparent text-primary-600 hover:text-primary-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:text-primary-600 transition-all duration-300"
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
            className="cursor-pointer justify-center text-center mt-4 w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-hidden focus:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
          >
            Continuar
          </button>
        </div>
      </form>
    </>
  );
}
