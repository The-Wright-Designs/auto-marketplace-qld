"use client";

import { GeneralHeader } from "./general/general-header";
import { UserHeader } from "./user/user-header";
import { useAuth } from "@/_lib/auth/auth-context";
import { hasSessionCookie } from "@/_lib/auth/check-session-client";

export function ConditionalHeader() {
  const { user } = useAuth();

  if (user) {
    return <UserHeader />;
  }

  if (hasSessionCookie()) {
    return <UserHeader />;
  }

  return <GeneralHeader />;
}
