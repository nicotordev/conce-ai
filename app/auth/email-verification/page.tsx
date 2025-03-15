import { auth } from "@/auth";
import EmailVerification from "@/components/Auth/EmailVerification";
import { decryptData } from "@/lib/crypto";
import prisma from "@/lib/prisma/index.prisma";
import { EmailVerificationState } from "@/types/auth";
import { EmailVerificationStep } from "@/types/auth.enum";
import { PagePropsCommon } from "@/types/pages";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function EmailVerificationPage(props: PagePropsCommon) {
  const session = await auth();
  const _searchParams = await props.searchParams;
  const state: EmailVerificationState | null =
    typeof _searchParams.state === "string"
      ? decryptData<EmailVerificationState>(_searchParams.state)
      : null;
  let user: (Partial<User> & Pick<User, "email">) | null = null;

  if (state?.userId) {
    user = await prisma.user.findUnique({
      where: {
        id: state.userId,
      },
      select: {
        email: true,
      },
    });
  }

  if (session?.user.emailVerified !== null) {
    return redirect("/app");
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-xs mt-16">
        <h2 className="!font-paragraph font-bold text-dark-text-primary text-3xl text-center">
          Verifica tu Correo Electrónico
        </h2>
        <EmailVerification
          state={{
            ...state,
            step: state?.step || EmailVerificationStep.start,
            code: state?.code || "",
            userId: state?.userId || "",
            error: state?.error || "",
            email: user?.email || "",
          }}
          session={session}
        />
      </div>
    </div>
  );
}
