"use client";

import Image from "next/image";
import Link from "next/link";
import { Bid } from "@/_types/bid-types";
import { useState } from "react";
import classNames from "classnames";
import { formatPrice } from "@/_components/pages/dealer-portal/vehicles/vehicle-detail-view";
import TenderCountdown from "@/_components/ui/tender-countdown";

interface BidCardProps {
  bid: Bid;
}

export default function BidCard({ bid }: BidCardProps) {
  const imageSrc =
    bid.vehicle.featuredImageUrl || "/images/placeholder-vehicle.png";
  const [showHover, setShowHover] = useState(false);

  return (
    <Link
      href={`/dealer-portal/vehicles/${bid.vehicleUid}/view`}
      className="w-full min-w-[250px] phone:w-[300px] border border-blue rounded-md overflow-hidden"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <div className="bg-grey w-full overflow-hidden relative">
        <Image
          src={imageSrc}
          alt={`${bid.vehicle.year} ${bid.vehicle.make} ${bid.vehicle.model}`}
          width={400}
          height={300}
          className={classNames(
            "object-cover aspect-[4/3] h-full ease-in-out duration-500 delay-75",
            {
              "scale-[103%]": showHover,
              "blur-sm": !bid.vehicle.featuredImageUrl,
            },
          )}
        />
        {bid.tenderResult && (
          <div
            className={classNames(
              "absolute top-2 right-2 px-3 py-1 rounded-md text-white text-[12px]",
              {
                "bg-green": bid.tenderResult === "won",
                "bg-red": bid.tenderResult === "lost",
              },
            )}
          >
            {bid.tenderResult === "won" ? "Successful" : "Unsuccessful"}
          </div>
        )}
      </div>
      <ul
        className={classNames(
          "px-4 py-2 grid grid-cols-2 gap-5 ease-in-out duration-500 delay-75",
          {
            "bg-blue/5": !showHover,
            "bg-blue/15": showHover,
          },
        )}
      >
        <div>
          <li className="text-paragraph text-blue truncate">
            {bid.vehicle.make}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {bid.vehicle.model}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            Your bid:
          </li>
        </div>
        <div className="place-items-end">
          <TenderCountdown
            tenderDeadline={bid.vehicle.tenderDeadline}
            small={true}
          />
          <li className="text-paragraph text-grey text-[16px] truncate">
            {bid.vehicle.year}
          </li>
          <li className="text-paragraph text-blue truncate font-semibold">
            {formatPrice(bid.bidPrice)}
          </li>
        </div>
      </ul>
    </Link>
  );
}
