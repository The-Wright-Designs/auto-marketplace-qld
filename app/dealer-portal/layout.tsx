"use client";

import ButtonLink from "@/_components/ui/buttons/button-link";
import { useAuth } from "@/_lib/auth/auth-context";
import { ReactNode } from "react";

interface DealerPortalLayoutProps {
  children: ReactNode;
}

export default function DealerPortalLayout({
  children,
}: DealerPortalLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-2.5">
        <div className="spinner" />
        <p className="text-[28px]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-5 items-center justify-center">
        <h1 className="text-subheading text-blue">Authentication Required</h1>
        <p className="text-paragraph text-grey">
          Please log in to access this page.
        </p>
        <ButtonLink
          href="/for-dealers/login"
          ariaLabel="Go to Login"
          traditionalButton
          cssClasses="place-self-center"
        >
          Go to Login
        </ButtonLink>
      </div>
    );
  }

  return children;
}
