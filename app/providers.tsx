import { GoogleRecaptchaProvider } from "@/providers/GoogleRecaptchaProvider";
import TanstackUseQueryProvider from "@/providers/TanstackUseQueryProvider";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TanstackUseQueryProvider>
      <GoogleRecaptchaProvider>{children}</GoogleRecaptchaProvider>
    </TanstackUseQueryProvider>
  );
}
