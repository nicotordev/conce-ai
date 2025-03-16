import { CondorAIProvider } from "@/providers/CondorAIProvider";
import { GoogleRecaptchaProvider } from "@/providers/GoogleRecaptchaProvider";
import TanstackUseQueryProvider from "@/providers/TanstackUseQueryProvider";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TanstackUseQueryProvider>
      <GoogleRecaptchaProvider>
        <CondorAIProvider>{children}</CondorAIProvider>
      </GoogleRecaptchaProvider>
    </TanstackUseQueryProvider>
  );
}
