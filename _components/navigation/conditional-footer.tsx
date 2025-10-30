"use client";

import { GeneralFooter } from "./general/footer/general-footer";
import { UserFooter } from "./user/footer/user-footer";
import { useAuth } from "@/_lib/auth/auth-context";
import { hasSessionCookie } from "@/_lib/auth/check-session-client";

export function ConditionalFooter() {
  const { user } = useAuth();

  if (user) {
    return <UserFooter />;
  }

  if (hasSessionCookie()) {
    return <UserFooter />;
  }

  return <GeneralFooter />;
}
