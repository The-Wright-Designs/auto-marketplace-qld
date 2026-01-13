"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface ReCaptchaProviderProps {
  children: ReactNode;
}

export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dealer-portal");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
