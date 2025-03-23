"use client";
import { SignInGoogleAction } from "@/app/actions/auth.actions";
import { googleLogo } from "@/assets";
import Image from "next/image";

export default function AuthGoogleSignIn() {
  return (
    <button
      onClick={() => SignInGoogleAction()}
      className="px-4 rounded-lg py-2 border border-gray-300 border-solid bg-transparent !font-inter flex items-center justify-start gap-2 text-xs cursor-pointer"
    >
      <Image src={googleLogo} alt="Google Logo" width={16} height={16} />
      Continuar con Google
    </button>
  );
}
