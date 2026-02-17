import { Suspense } from "react";
import { Metadata } from "next";
import { LoginContent } from "@/_components/pages/for-dealers/login/login-content";

export const metadata: Metadata = {
  title: "Dealer Login | Auto Marketplace QLD",
  description:
    "Sign in to access your Auto Marketplace QLD dealer portal.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="spinner" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
