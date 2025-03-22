import { CondorAIProvider } from "@/providers/CondorAIProvider";
import { GoogleRecaptchaProvider } from "@/providers/GoogleRecaptchaProvider";
import TanstackUseQueryProvider from "@/providers/TanstackUseQueryProvider";
import { UserProvider } from "@/providers/UserProvider";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <TanstackUseQueryProvider>
      <GoogleRecaptchaProvider>
        <CondorAIProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </CondorAIProvider>
      </GoogleRecaptchaProvider>
    </TanstackUseQueryProvider>
  );
}
