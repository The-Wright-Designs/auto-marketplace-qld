"use client";

import ListedVehiclesComponent from "@/_components/pages/dealer-portal/dashboard/listed-vehicles-component";

export default function BuyNowPage() {
  return (
    <div className="grid gap-10">
      <h1 className="text-subheading full-hd:text-subheading-desktop">
        Buy Now
      </h1>
      <ListedVehiclesComponent listingType="buy-now" />
    </div>
  );
}
