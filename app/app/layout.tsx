import { auth } from "@/auth";
import AppNav from "@/components/App/Layout/AppNav/AppNav";

export default async function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <AppNav session={session} />
      <main>{children}</main>
    </>
  );
}
