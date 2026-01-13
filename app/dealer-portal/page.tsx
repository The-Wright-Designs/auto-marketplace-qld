"use client";

import RecentVehiclesComponent from "@/_components/pages/dealer-portal/dashboard/recent-vehicles-component";

export default function DealerDashboard() {
  return (
    <div className="grid gap-10">
      <h1 className="text-subheading full-hd:text-subheading-desktop">
        Dealer Dashboard
      </h1>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">Most recent tenders</h2>
        <RecentVehiclesComponent type="tender" />
      </div>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">
          Recent Vehicles available to buy now
        </h2>
        <RecentVehiclesComponent type="buy-now" />
      </div>
    </div>
  );
}
