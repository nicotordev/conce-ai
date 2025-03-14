"use client";

import { SignUpProps } from "@/types/auth";
import { SignUpPageStep } from "@/types/auth.enum";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import Input from "../Common/Forms/Input";
import { BsEnvelope } from "react-icons/bs";
import { doSignUpSteppedRedirection } from "@/app/actions/auth.actions";
import toast from "react-hot-toast";
import PasswordInput from "../Common/Forms/PasswordInput";

export default function SignUp({ state }: SignUpProps) {
  const step = state?.step ?? SignUpPageStep.email;
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState(state?.password ?? "");

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = await doSignUpSteppedRedirection({
      email,
      password,
      step: SignUpPageStep.password,
    });

    if (!data) {
      toast.error("Ha ocurrido un error al intentar crear la cuenta");
      return;
    }

    window.location.href = `/auth/sign-up?state=${data}`;
  }

  return (
    <form onSubmit={handleNextStep}>
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
          <Input
            name="email"
            id="email"
            placeholder="Dirección de correo electrónico"
            type="email"
            label="Correo electrónico"
            required
            leftIcon={<BsEnvelope />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <Input
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
          <PasswordInput
            name="password"
            id="password"
            placeholder="Contraseña"
            label="Contraseña"
            required
            setPassword={setPassword}
          />
        </div>
      </Transition>
      <button
        type="submit"
        className="cursor-pointer justify-center text-center mt-4 w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-600 focus:outline-hidden focus:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        Continuar
      </button>
    </form>
  );
}
