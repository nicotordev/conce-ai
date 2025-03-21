import { CondorAIProvider } from "@/providers/CondorAIProvider";
import { GoogleRecaptchaProvider } from "@/providers/GoogleRecaptchaProvider";
import TanstackUseQueryProvider from "@/providers/TanstackUseQueryProvider";
import { UserProvider } from "@/providers/UserProvider";
import { cookies } from "next/headers";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookiesPair = await cookies();
  const selectedConversationId =
    cookiesPair.get("selectedConversationId")?.value || null;
  const selectedModelId = cookiesPair.get("selectedModelId")?.value || null;

  return (
    <TanstackUseQueryProvider>
      <GoogleRecaptchaProvider>
        <CondorAIProvider selectedModelId={selectedModelId}>
          <UserProvider selectedConversationId={selectedConversationId}>
            {children}
          </UserProvider>
        </CondorAIProvider>
      </GoogleRecaptchaProvider>
    </TanstackUseQueryProvider>
  );
}
