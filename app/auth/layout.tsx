import AuthFooter from "@/components/Auth/AuthFooter";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-shark-950 text-black dark:text-white transition-colors">
      <header className="w-full">
        <div className="p-4">
          <h1 className="!font-bold !font-lato text-[--color-dark-text-accent] dark:text-white text-xl">
            CondorAI
          </h1>
        </div>
      </header>

      <main>{children}</main>

      <AuthFooter />
    </div>
  );
}
