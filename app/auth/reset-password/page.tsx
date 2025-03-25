import ResetPassword from "@/components/Auth/ResetPassword";
import { decryptData } from "@/lib/crypto";
import { ResetPasswordState } from "@/types/auth";
import { ResetPasswordStep } from "@/types/auth.enum";
import { PagePropsCommon } from "@/types/pages";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: PagePropsCommon) {
  const _searchParams = await searchParams;
  const state: ResetPasswordState | null =
    typeof _searchParams.state === "string"
      ? decryptData<ResetPasswordState>(_searchParams.state)
      : null;

  if ((await _searchParams.email) || (await _searchParams.password)) {
    /* Send other params except by email and password */
    const searchParamsQuery = new URLSearchParams();
    await Promise.all(
      Object.keys(_searchParams).map(async (key) => {
        if (key !== "email" && key !== "password") {
          searchParamsQuery.append(key, (await _searchParams[key]) as string);
        }
      })
    );

    redirect(`/auth/reset-password?${searchParamsQuery.toString()}`);
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-shark-950 text-black dark:text-white transition-colors">
      <div className="mx-auto max-w-xs mt-16">
        <ResetPassword
          state={{
            ...state,
            step: Object.values(ResetPasswordStep).includes(
              state?.step as ResetPasswordStep
            )
              ? (state?.step as ResetPasswordStep)
              : ResetPasswordStep.email,
            email: state?.email ?? "",
            error: state?.error ?? "",
            password: state?.password ?? "",
            token: state?.token ?? "",
          }}
        />
      </div>
    </div>
  );
}
