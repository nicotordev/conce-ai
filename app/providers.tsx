import { CondorAIModalProvider } from "@/providers/CondorAIModalProvider";
import { CondorAIProvider } from "@/providers/CondorAIProvider";
import { GoogleRecaptchaProvider } from "@/providers/GoogleRecaptchaProvider";
import TanstackUseQueryProvider from "@/providers/TanstackUseQueryProvider";
import { UploadFilesProvider } from "@/providers/UploadFilesProvider";
import { UserProvider } from "@/providers/UserProvider";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TanstackUseQueryProvider>
      <GoogleRecaptchaProvider>
        <CondorAIProvider>
          <UserProvider>
            <UploadFilesProvider>
              <CondorAIModalProvider>{children}</CondorAIModalProvider>
            </UploadFilesProvider>
          </UserProvider>
        </CondorAIProvider>
      </GoogleRecaptchaProvider>
    </TanstackUseQueryProvider>
  );
}
