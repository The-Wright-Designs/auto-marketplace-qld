"use client";

import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/_types/vehicle-types";
import { useState } from "react";
import classNames from "classnames";
import { formatPrice } from "@/_components/pages/dealer-portal/vehicles/vehicle-detail-view";

interface VehicleCardProps {
  vehicle: Vehicle;
  imageUrl?: string;
  listingType?: "tender" | "buy-now" | undefined;
}

export default function VehicleCard({
  vehicle,
  imageUrl,
  listingType,
}: VehicleCardProps) {
  const imageSrc = imageUrl || "/images/placeholder-vehicle.png";

  const [showHover, setShowHover] = useState(false);

  return (
    <Link
      href={`/dealer-portal/vehicles/${vehicle.id}/view`}
      className="max-w-[250px] border border-blue rounded-md overflow-hidden"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <div className="bg-grey overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          width={400}
          height={3400}
          className={classNames(
            "object-cover aspect-[4/3] w-[250px] h-full ease-in-out duration-500 delay-75",
            {
              "scale-[103%]": showHover,
              "blur-sm": !imageUrl,
            }
          )}
        />
      </div>
      <ul
        className={classNames(
          "px-4 py-2 grid grid-cols-[1fr_0.75fr] gap-5 ease-in-out duration-500 delay-75",
          {
            "bg-blue/5": !showHover,
            "bg-blue/15": showHover,
          }
        )}
      >
        <div>
          <li className="text-paragraph text-blue truncate">{vehicle.make}</li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {vehicle.model}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {vehicle.fuelType.charAt(0).toUpperCase() +
              vehicle.fuelType.slice(1)}{" "}
            {vehicle.engineCapacity}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {vehicle.odometer}km
          </li>
        </div>
        <div className="place-items-end">
          <li className="text-paragraph text-blue truncate">
            {formatPrice(vehicle.price)}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {vehicle.year}
          </li>
          <li className="text-paragraph text-grey text-[16px] truncate">
            {vehicle.transmission.charAt(0).toUpperCase() +
              vehicle.transmission.slice(1)}
          </li>
          <p
            className={classNames(
              "px-2 rounded-md text-[12px] leading-[22px] mt-0.5",
              {
                "bg-yellow text-blue": listingType === "tender",
                "bg-blue text-white": listingType === "buy-now",
              }
            )}
          >
            {listingType === "tender"
              ? "Tender"
              : listingType === "buy-now"
              ? "Buy Now"
              : null}
          </p>
        </div>
      </ul>
    </Link>
  );
}
