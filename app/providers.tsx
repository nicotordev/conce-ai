import { ConceAIModalProvider } from "@/providers/ConceAIModalProvider";
import { ConceAIProvider } from "@/providers/ConceAIProvider";
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
        <ConceAIProvider>
          <UserProvider>
            <UploadFilesProvider>
              <ConceAIModalProvider>{children}</ConceAIModalProvider>
            </UploadFilesProvider>
          </UserProvider>
        </ConceAIProvider>
      </GoogleRecaptchaProvider>
    </TanstackUseQueryProvider>
  );
}
