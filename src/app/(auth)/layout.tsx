import { AuthHeader } from "@/components/layout/auth-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-background-25">
      <AuthHeader />
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-16 xs:px-6">
        {children}
      </main>
    </div>
  );
}
