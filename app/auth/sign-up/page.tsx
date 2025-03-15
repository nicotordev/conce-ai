import Link from "next/link";
import { googleLogo, microsoftLogo } from "@/assets";
import Image from "next/image";
import SignUp from "@/components/Auth/SignUp";
import { PagePropsCommon } from "@/types/pages";
import { decryptData } from "@/lib/crypto";
import { SignUpState } from "@/types/auth";
import { SignUpPageStep } from "@/types/auth.enum";

export default async function SignUpPage({ searchParams }: PagePropsCommon) {
  const _searchParams = await searchParams;
  const state: SignUpState | null =
    typeof _searchParams.state === "string"
      ? decryptData<SignUpState>(_searchParams.state)
      : null;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-xs mt-16">
        <h2 className="!font-paragraph font-bold text-dark-text-primary text-3xl text-center">
          Crear una Cuenta
        </h2>
        <SignUp
          state={{
            ...state,
            step: Object.values(SignUpPageStep).includes(
              state?.step as SignUpPageStep
            )
              ? (state?.step as SignUpPageStep)
              : SignUpPageStep.email,
            email: state?.email || "",
            password: state?.password || "",
            error: state?.error || "",
          }}
        />
        {state?.step !== SignUpPageStep.password && (
          <>
            <div className="flex items-center justify-center mt-4">
              <span className="flex items-center justify-center gap-1 text-xs font-medium">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/sign-in" className="text-primary-600">
                  Inicia sesión
                </Link>
              </span>
            </div>
            <div className="flex items-center mt-4">
              <hr className="w-full h-px bg-gray-300 opacity-100 border-none" />
              <span className="mx-2">o</span>
              <hr className="w-full h-px bg-gray-300 opacity-100 border-none" />
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <button className="px-4 rounded-lg py-2 border border-gray-300 border-solid bg-transparent !font-inter flex items-center justify-start gap-2 text-xs">
                <Image
                  src={googleLogo}
                  alt="Google Logo"
                  width={16}
                  height={16}
                />
                Continuar con Google
              </button>
              <button className="px-4 rounded-lg py-2 border border-gray-300 border-solid bg-transparent !font-inter flex items-center justify-start gap-2 text-xs">
                <Image
                  src={microsoftLogo}
                  alt="Microsoft Logo"
                  width={14}
                  height={14}
                />
                Continuar con Microsoft
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
