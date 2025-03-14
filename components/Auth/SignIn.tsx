"use client";

import { SignInProps } from "@/types/auth";
import { SignInPageStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import CondorInput from "../Common/Forms/CondorInput";
import { BsEnvelope } from "react-icons/bs";
import {
  doSignIn,
  doSteppedRedirection,
} from "@/app/actions/auth.actions";
import toast from "react-hot-toast";
import CondorPasswordInput from "../Common/Forms/CondorPasswordInput";

export default function SignIn({ state }: SignInProps) {
  const step = state?.step ?? SignInPageStep.email;
  const [doingRedirection, setDoingRedirection] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState(state?.password ?? "");

  async function prevStep() {
    setDoingRedirection(true);
    const redirectionData = await doSteppedRedirection({
      email: "",
      password: "",
      step: SignInPageStep.email,
    });
    setDoingRedirection(false);
    if (!redirectionData.success) {
      toast.error("Ha ocurrido un error al intentar crear la cuenta");
      return;
    }

    window.location.href = `/auth/sign-in?state=${redirectionData.data}`;
  }

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

      await doSignIn({
        email,
        password,
      });

      setLoadingSignUp(false);

      toast.error("Ha ocurrido un error al intentar iniciar sesión");
    }
  }

  return (
    <form onSubmit={handleNextStep} className="relative">
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
            label="Correo electrónico"
            required
            leftIcon={<BsEnvelope />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={doingRedirection || loadingSignUp}
          />
        </div>
      </Transition>
      <Transition
        show={loadingSignUp}
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
        show={step === SignInPageStep.password}
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
            label="Correo electrónico"
            required
            leftIcon={<BsEnvelope />}
            defaultValue={email}
            readOnly
          />
          <CondorPasswordInput
            name="password"
            id="password"
            placeholder="Contraseña"
            label="Contraseña"
            required
            setPassword={setPassword}
            disabled={doingRedirection || loadingSignUp}
          />
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
        {step === SignInPageStep.password && (
          <button
            onClick={prevStep}
            type="button"
            className="cursor-pointer justify-center text-center w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-primary-600 disabled:opacity-50 disabled:pointer-events-none hover:border-primary-600 hover:text-primary-600 focus:outline-hidden focus:border-primary-600 focus:text-primary-600 transition-all duration-150"
          >
            Volver
          </button>
        )}
      </div>
    </form>
  );
}
