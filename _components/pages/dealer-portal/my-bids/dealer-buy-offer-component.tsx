"use client";

import BuyOfferCard from "@/_components/ui/cards/buy-offer-card";
import VehicleCardSkeleton from "@/_components/ui/cards/vehicle-card-skeleton";
import { Purchase } from "@/_types/purchase-types";
import { Offer } from "@/_types/offer-types";

interface DealerBuyOfferComponentProps {
  items: Purchase[] | Offer[];
  type: "purchase" | "offer";
  loading: boolean;
}

export default function DealerBuyOfferComponent({
  items,
  type,
  loading,
}: DealerBuyOfferComponentProps) {
  if (loading) {
    return (
      <div className="grid gap-5 phone:grid-cols-2 tablet-small:grid-cols-3 tablet:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const getEmptyMessage = () => {
    if (type === "purchase") {
      return "No purchased vehicles";
    }
    return "No offers made";
  };

  if (items.length === 0) {
    return <p className="text-paragraph text-grey">{getEmptyMessage()}</p>;
  }

  return (
    <div className="grid gap-5 phone:grid-cols-2 tablet-small:grid-cols-3 tablet:grid-cols-4">
      {items.map((item) => (
        <BuyOfferCard
          key={`${item.vehicleUid}_${item.dealerUid}`}
          item={item}
          type={type}
        />
      ))}
    </div>
  );
}
