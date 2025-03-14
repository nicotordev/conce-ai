import EmailVerification from "@/components/Auth/EmailVerification";
import { decryptData } from "@/lib/crypto";
import { EmailVerificationState } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import { PagePropsCommon } from "@/types/pages";
import Link from "next/link";

export default async function EmailVerificationPage(props: PagePropsCommon) {
  const _searchParams = await props.searchParams;
  const state: EmailVerificationState | null =
    typeof _searchParams.state === "string"
      ? decryptData<EmailVerificationState>(_searchParams.state)
      : null;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-xs mt-16">
        <h2 className="!font-paragraph font-bold text-dark-text-primary text-3xl text-center">
          Bienvenido
        </h2>
        <EmailVerification
          state={{
            ...state,
            step: state?.step || EmailVerificationStep.start,
            code: state?.code || "",
            userId: state?.userId || "",
            error: state?.error || "",
          }}
        />

        <div className="mt-12 flex items-center justify-center gap-2 text-xs fixed bottom-12 left-1/2 -translate-x-1/2">
          <Link href="/auth/sign-up" className="text-primary-600">
            Terminos de uso
          </Link>
          |
          <Link href="/auth/sign-up" className="text-primary-600">
            Politica y privacidad
          </Link>
        </div>
      </div>
    </div>
  );
}
