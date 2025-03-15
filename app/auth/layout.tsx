import AuthFooter from "@/components/Auth/AuthFooter";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full">
        <div className="p-4">
          <h1 className="!font-bold !font-lato text-dark-text-accent text-xl">
            CondorAI
          </h1>
        </div>
      </div>
      <main>{children}</main>;

      <AuthFooter />
    </>
  );
}
