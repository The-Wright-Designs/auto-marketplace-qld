"use client";

import BidCard from "@/_components/ui/cards/bid-card";
import VehicleCardSkeleton from "@/_components/ui/cards/vehicle-card-skeleton";
import { Bid } from "@/_types/bid-types";

interface DealerBidsComponentProps {
  bids: Bid[];
  filterType: "current" | "past";
  loading: boolean;
}

export default function DealerBidsComponent({
  bids,
  filterType,
  loading,
}: DealerBidsComponentProps) {
  if (loading) {
    return (
      <div className="grid gap-5 phone:grid-cols-2 tablet-small:grid-cols-3 tablet:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const now = new Date();
  const filteredBids = bids.filter((bid) => {
    const deadline = new Date(bid.vehicle.tenderDeadline);
    if (filterType === "current") {
      return deadline > now;
    } else {
      return deadline <= now;
    }
  });

  const getEmptyMessage = () => {
    if (filterType === "current") {
      return "No current tender bids";
    }
    return "No past tender bids";
  };

  if (filteredBids.length === 0) {
    return <p className="text-paragraph text-grey">{getEmptyMessage()}</p>;
  }

  return (
    <div className="grid gap-5 phone:grid-cols-2 tablet-small:grid-cols-3 tablet:grid-cols-4">
      {filteredBids.map((bid) => (
        <BidCard key={`${bid.vehicleUid}_${bid.dealerUid}`} bid={bid} />
      ))}
    </div>
  );
}
