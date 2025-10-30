"use client";

import { useAuth } from "@/_lib/auth/auth-context";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import ButtonType from "@/_components/ui/buttons/button-type";

export default function DealerDashboard() {
  const { user, logout } = useAuth();

  return (
    <PageWrapper useMainElement cssClasses="space-y-5 py-10">
      <h2 className="text-heading text-blue">Dealer Dashboard</h2>
      <p>
        Congratulations, you're logged in with account{" "}
        <strong>{user!.email}</strong>
      </p>
      <ButtonType onClick={logout}>Logout</ButtonType>
    </PageWrapper>
  );
}
