import { auth } from "@/auth";
import AppNewConversation from "@/components/App/AppNewConversation";
import { decryptData } from "@/lib/crypto";
import { AppNewConversationState } from "@/types/app";
import { PagePropsCommon } from "@/types/pages";

export default async function AppPage({ searchParams }: PagePropsCommon) {
  const _searchParams = await searchParams;
  const state: AppNewConversationState | null =
    typeof _searchParams.state === "string"
      ? decryptData<AppNewConversationState>(_searchParams.state)
      : null;
  const session = await auth();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AppNewConversation
        state={{
          ...state,
          error: state?.error || "",
        }}
        session={session}
      />
    </div>
  );
}
