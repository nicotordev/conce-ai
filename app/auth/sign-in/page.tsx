import Link from "next/link";
import { microsoftLogo } from "@/assets/assets";
import Image from "next/image";
import SignIn from "@/components/Auth/SignIn";
import { PagePropsCommon } from "@/types/pages";
import { SignInState } from "@/types/auth";
import { decryptData } from "@/lib/crypto";
import { SignInPageStep } from "@/types/auth.enum";
import { redirect } from "next/navigation";
import AuthGoogleSignIn from "@/components/Auth/AuthGoogleSignIn";

export default async function SignInPage({ searchParams }: PagePropsCommon) {
  const _searchParams = await searchParams;
  const state: SignInState | null =
    typeof _searchParams.state === "string"
      ? decryptData<SignInState>(_searchParams.state)
      : null;

  if ((await _searchParams.email) || (await _searchParams.password)) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-shark-950 text-black dark:text-white transition-colors">
      <div className="mx-auto max-w-xs mt-16">
        <SignIn
          state={{
            ...state,
            step: Object.values(SignInPageStep).includes(
              state?.step as SignInPageStep
            )
              ? (state?.step as SignInPageStep)
              : SignInPageStep.email,
            email: state?.email || "",
            password: state?.password || "",
            error: state?.error || "",
          }}
        />

        {/* Registro */}
        <div className="flex items-center justify-center mt-4">
          <span className="flex items-center justify-center gap-1 text-xs font-medium">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/sign-up"
              className="text-primary-600 dark:text-primary-400 underline-offset-2 hover:underline"
            >
              Suscríbete
            </Link>
          </span>
        </div>

        {/* Separador */}
        <div className="flex items-center mt-6">
          <hr className="w-full h-px bg-gray-300 dark:bg-shark-700 border-none" />
          <span className="mx-2 text-sm dark:text-gray-400">o</span>
          <hr className="w-full h-px bg-gray-300 dark:bg-shark-700 border-none" />
        </div>

        {/* Proveedores externos */}
        <div className="mt-6 flex flex-col gap-4">
          <AuthGoogleSignIn />

          <button className="px-4 rounded-lg py-2 border border-gray-300 dark:border-shark-600 bg-transparent hover:bg-gray-100 dark:hover:bg-shark-800 transition-colors !font-inter flex items-center justify-start gap-2 text-xs text-black dark:text-white">
            <Image
              src={microsoftLogo}
              alt="Microsoft Logo"
              width={14}
              height={14}
            />
            Continuar con Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
