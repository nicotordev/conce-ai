import AppNav from "@/components/App/Layout/AppNav";
import { getGoogleGenerativeAIModels } from "@/utils/@google-generative-ai.utils";

export default async function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const models = await getGoogleGenerativeAIModels();
  return (
    <>
      <AppNav models={models} />
      <main>{children}</main>
    </>
  );
}
