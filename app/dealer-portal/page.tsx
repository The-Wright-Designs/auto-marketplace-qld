"use client";

import { useAuth } from "@/_lib/auth/auth-context";

export default function DealerDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.customClaims?.admin === true;

  return (
    <div className="space-y-5 py-10 px-5 phone:px-18px tablet-small:px-50px tablet:px-50px desktop-small:px-50px full-hd:px-120px">
      <h2 className="text-heading text-blue">Dealer Dashboard</h2>
      <p className="text-paragraph text-grey">
        Congratulations, you&apos;re logged in as <strong>{user!.email}</strong>
        .
      </p>
      {isAdmin && (
        <p className="text-paragraph underline italic">
          <strong>Admin Access:</strong> You have admin privileges and can
          access the <strong>&quot;Vehicles&quot;</strong> menu item in the
          sidebar to manage vehicle listings. Dealers won&apos;t be able to see
          the <strong>&quot;Vehicles&quot;</strong> menu item.
        </p>
      )}
      <p className="text-paragraph text-grey">
        This is when the dealer <strong>tendors</strong>,{" "}
        <strong>past bids</strong> and <strong>buy now</strong> functionality
        will live once completed.
      </p>
    </div>
  );
}
