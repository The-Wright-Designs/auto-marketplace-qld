"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/_lib/auth/auth-context";
import { ReCaptchaProvider } from "@/_components/providers/recaptcha-provider";
import { GeneralHeader } from "@/_components/navigation/general/general-header";
import { GeneralFooter } from "@/_components/navigation/general/footer/general-footer";
import { UserSession } from "@/_types/auth-types";

interface ClientLayoutProps {
  children: React.ReactNode;
  initialUser: UserSession | null;
}

export function ClientLayout({ children, initialUser }: ClientLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dealer-portal");

  return (
    <ReCaptchaProvider>
      <AuthProvider initialUser={initialUser}>
        {!isDashboard && <GeneralHeader />}
        {children}
        {!isDashboard && <GeneralFooter />}
      </AuthProvider>
    </ReCaptchaProvider>
  );
}
