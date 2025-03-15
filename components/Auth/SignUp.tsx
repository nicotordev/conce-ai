"use client";

import { SignUpProps } from "@/types/auth";
import { SignUpPageStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import CondorInput from "../Common/Forms/CondorInput";
import { BsEnvelope } from "react-icons/bs";
import {
  doSignIn,
  doSignUp,
  doSteppedRedirection,
} from "@/app/actions/auth.actions";
import toast from "react-hot-toast";
import CondorPasswordInput from "../Common/Forms/CondorPasswordInput";
import authConstants from "@/constants/auth.constants";
import AuthLoading from "./AuthLoading";
import AuthError from "./AuthError";

export default function SignUp({ state }: SignUpProps) {
  const step = state?.step ?? SignUpPageStep.email;
  const [doingRedirection, setDoingRedirection] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState(state?.password ?? "");

  async function prevStep() {
    setDoingRedirection(true);
    const redirectionData = await doSteppedRedirection({
      email: "",
      password: "",
      step: SignUpPageStep.email,
    });
    setDoingRedirection(false);
    if (!redirectionData.success) {
      toast.error("Ha ocurrido un error al intentar crear la cuenta");
      return;
    }

    window.location.href = `/auth/sign-up?state=${redirectionData.data}`;
  }

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step === SignUpPageStep.email) {
      setDoingRedirection(true);
      const redirectionData = await doSteppedRedirection({
        email,
        password,
        step: SignUpPageStep.password,
      });
      setDoingRedirection(false);
      if (!redirectionData.success) {
        toast.error("Ha ocurrido un error al intentar crear la cuenta");
        return;
      }

      window.location.href = `/auth/sign-up?state=${redirectionData.data}`;
    } else {
      setLoadingSignUp(true);
      const signUpResponse = await doSignUp({ email, password });
      if (signUpResponse.success) {
        await doSignIn({ email, password }, SignUpPageStep.password);
        return;
      }

      setLoadingSignUp(false);

      if (
        signUpResponse.message ===
        authConstants.ERROR_MESSAGES_CODES.USER_ALREADY_EXISTS
      ) {
        toast.error("El usuario ya existe");
        return;
      } else if (authConstants.ERROR_MESSAGES_CODES.INVALID_CREDENTIALS) {
        toast.error("Credenciales inválidas");
        return;
      }
    }
  }

  useEffect(() => {
    setDoingRedirection(false);
    setLoadingSignUp(false);
  }, [state]);

  return (
    <form onSubmit={handleNextStep} className="relative mt-4">
      <AuthLoading loading={loadingSignUp} />
      <AuthError error={state?.error} />
      <Transition
        show={step === SignUpPageStep.email}
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
        show={step === SignUpPageStep.password}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        unmount={true}
      >
        <div className="flex flex-col gap-3">
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
          <CondorPasswordInput
            name="password"
            id="password"
            placeholder="Contraseña"
            required
            password={password}
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
        {step === SignUpPageStep.password && (
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
