"use client";

import { DashboardSidebar } from "@/_components/navigation/dashboard/dashboard-sidebar";
import { DashboardMobileNav } from "@/_components/navigation/dashboard/dashboard-mobile-nav";
import { useAuth } from "@/_lib/auth/auth-context";
import ButtonLink from "@/_components/ui/buttons/button-link";
import { ReactNode } from "react";

interface DealerPortalLayoutProps {
  children: ReactNode;
}

export default function DealerPortalLayout({
  children,
}: DealerPortalLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-5 items-center justify-center">
        <h1 className="text-subheading text-blue">Authentication Required</h1>
        <p className="text-paragraph text-grey">
          Please log in to access the dashboard.
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

  return (
    <>
      <DashboardMobileNav />
      <div className="max-w-[1600px] px-5 py-20 flex min-h-screen desktop-small:px-10">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 ml-0 desktop-small:ml-[280px]">
          {children}
        </main>
      </div>
    </>
  );
}
