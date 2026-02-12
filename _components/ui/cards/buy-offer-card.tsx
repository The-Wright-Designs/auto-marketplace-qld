"use client";

import Image from "next/image";
import Link from "next/link";
import { Purchase } from "@/_types/purchase-types";
import { Offer } from "@/_types/offer-types";
import { useState } from "react";
import classNames from "classnames";
import { formatPrice } from "@/_components/pages/dealer-portal/vehicles/vehicle-detail-view";

interface BuyOfferCardProps {
  item: Purchase | Offer;
  type: "purchase" | "offer";
}

export default function BuyOfferCard({ item, type }: BuyOfferCardProps) {
  const imageSrc =
    item.vehicle.featuredImageUrl || "/images/placeholder-vehicle.png";
  const [showHover, setShowHover] = useState(false);

  const price = type === "purchase"
    ? (item as Purchase).purchasePrice
    : (item as Offer).offerPrice;

  return (
    <Link
      href={`/dealer-portal/vehicles/${item.vehicleUid}/view`}
      className="w-full min-w-[250px] phone:w-[300px] border border-blue rounded-md overflow-hidden"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <div className="bg-grey w-full overflow-hidden relative">
        <Image
          src={imageSrc}
          alt={`${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`}
          width={400}
          height={300}
          className={classNames(
            "object-cover aspect-[4/3] h-full ease-in-out duration-500 delay-75",
            {
              "scale-[103%]": showHover,
              "blur-sm": !item.vehicle.featuredImageUrl,
            },
          )}
        />
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
            {item.vehicle.make}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {item.vehicle.model}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {type === "purchase" ? "Purchased:" : "Offer:"}
          </li>
        </div>
        <div className="place-items-end">
          <li className="text-paragraph text-grey text-[16px] truncate">
            {item.vehicle.year}
          </li>
          <li className="text-paragraph text-blue truncate font-semibold">
            {formatPrice(price)}
          </li>
        </div>
      </ul>
    </Link>
  );
}
