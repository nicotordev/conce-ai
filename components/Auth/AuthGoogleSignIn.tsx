"use client";
import { SignInGoogleAction } from "@/app/actions/auth.actions";
import { googleLogo } from "@/assets/assets";
import Image from "next/image";

export default function AuthGoogleSignIn() {
  return (
    <button
      className="px-4 rounded-lg py-2 border border-gray-300 dark:border-shark-600 bg-transparent hover:bg-gray-100 dark:hover:bg-shark-800 transition-colors !font-inter flex items-center justify-start gap-2 text-xs text-black dark:text-white"
      onClick={() => SignInGoogleAction()}
    >
      <Image src={googleLogo} alt="Google Logo" width={16} height={16} />
      Continuar con Google
    </button>
  );
}
