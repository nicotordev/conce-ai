import { auth } from "@/auth";
import AppNewConversation from "@/components/App/AppNewConversation";
import { decryptData } from "@/lib/crypto";
import { AppNewConversationState } from "@/types/app";
import { PagePropsCommon } from "@/types/pages";
import { getAppSuggestionsForBar } from "@/utils/@google-generative-ai.utils";

export default async function AppPage({ searchParams }: PagePropsCommon) {
  const [_searchParams, session, suggestions] = await Promise.all([
    searchParams,
    auth(),
    getAppSuggestionsForBar(),
  ]);
  const state: AppNewConversationState | null =
    typeof _searchParams.state === "string"
      ? decryptData<AppNewConversationState>(_searchParams.state)
      : null;

  const mappedSuggestions = suggestions.map((suggestion) => ({
    label: suggestion.label,
    icon: suggestion.icon,
  }));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AppNewConversation
        state={{
          ...state,
          error: state?.error || "",
        }}
        session={session}
        suggestions={mappedSuggestions}
      />
    </div>
  );
}
