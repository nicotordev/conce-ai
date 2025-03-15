import { GoogleRecaptchaProvider } from "@/providers/GoogleRecaptchaProvider";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <GoogleRecaptchaProvider>{children}</GoogleRecaptchaProvider>
  );
}
