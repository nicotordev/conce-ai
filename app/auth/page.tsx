import AuthAppIdeas from "@/components/Auth/AuithAppIdeas";
import LogoText from "@/components/Common/LogoText";
import { getAppIdeas } from "@/utils/openai.utils";
import { Button } from "@/components/ui/button";
import AuthFooter from "@/components/Auth/AuthFooter";

export default async function AuthPage() {
  const [appIdeas] = await Promise.all([getAppIdeas()]);

  return (
    <div className="relative flex items-center h-screen overflow-hidden w-full bg-white dark:bg-shark-950 text-black dark:text-white transition-colors">
      <div className="absolute top-0 left-0 w-full z-50 px-7 py-2.5">
        <LogoText className="!text-primary-500" />
      </div>
      <div className="basis-1/2 h-full dark:bg-primary-800/10">
        <AuthAppIdeas ideas={appIdeas.map((idea) => idea.content)} />
      </div>
      <div className="relative basis-1/2 h-full flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="font-medium text-3xl text-center">
            Bienvenido a ConceAI
          </h2>
          <div className="flex items-center justify-center gap-4">
            <Button
              className="px-12 py-2 rounded-full font-medium text-sm"
              variant="default"
              href="/auth/sign-in"
            >
              Iniciar sesión
            </Button>
            <Button
              href="/auth/sign-up"
              className="px-12 py-2 rounded-full font-medium text-sm"
              variant="default"
            >
              Registrarse
            </Button>
          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  );
}
