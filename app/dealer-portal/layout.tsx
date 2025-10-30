"use client";

import { useAuth } from "@/_lib/auth/auth-context";
import Link from "next/link";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-subheading text-blue mb-6">
            Authentication Required
          </h1>
          <p className="text-paragraph text-grey mb-8">
            Please log in to access this page.
          </p>
          <Link
            href="/for-dealers/login"
            className="inline-block bg-blue text-white px-6 py-2 hover:bg-blue/80 ease-in-out duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
