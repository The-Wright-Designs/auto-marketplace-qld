"use client";

import { useRouter } from "next/navigation";
import VehicleImageSlider from "@/_components/ui/sliders/vehicle-image-slider";
import ButtonType from "@/_components/ui/buttons/button-type";
import { Vehicle } from "@/_types/vehicle-types";
import BuyAndOfferComponent from "../purchase-components/buy-and-offer-component";
import classNames from "classnames";
import BidComponent from "../purchase-components/bid-component";
import { formatDate, formatDateTime } from "@/_lib/utils/date-formatter";
import ButtonLink from "@/_components/ui/buttons/button-link";

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  images: Array<{ filename: string; url: string }>;
}

const LISTING_TYPE_LABELS: Record<string, string> = {
  tender: "Tender",
  "buy-now": "Buy Now",
};

const CONDITION_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: "Manual",
  automatic: "Automatic",
  cvt: "CVT",
};

const FUEL_TYPE_LABELS: Record<string, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
  lpg: "LPG",
};

const YES_NO_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
};

export function formatPrice(price: number | undefined): string {
  if (price === undefined) return "Not provided";
  return `$${price.toLocaleString("en-AU")}`;
}

function formatOdometer(odometer: number | undefined): string {
  if (odometer === undefined) return "Not provided";
  return `${odometer.toLocaleString("en-AU")} km`;
}

interface InfoSection {
  title: string;
  fields: Array<{
    label: string;
    value: string | undefined;
  }>;
}

export default function VehicleDetailView({
  vehicle,
  images,
}: VehicleDetailViewProps) {
  const router = useRouter();

  const sections: InfoSection[] = [
    {
      title: "Basic Vehicle Information",
      fields: [
        { label: "Colour", value: vehicle.colour },
        { label: "Body Type", value: vehicle.bodyType },
      ],
    },
    {
      title: "Listing Details",
      fields: [
        {
          label: "Listing Type",
          value: LISTING_TYPE_LABELS[vehicle.listingType],
        },
        ...(vehicle.listingType !== "tender"
          ? [
              {
                label: "Price",
                value: formatPrice(vehicle.price),
              },
            ]
          : []),
        ...(vehicle.listingType === "tender"
          ? [
              {
                label: "Tender Deadline",
                value: `${formatDateTime(vehicle.tenderDeadline)} AEST/AEDT`,
              },
            ]
          : []),
      ],
    },
    {
      title: "Engine & Drivetrain",
      fields: [
        {
          label: "Transmission",
          value: TRANSMISSION_LABELS[vehicle.transmission],
        },
        { label: "Fuel Type", value: FUEL_TYPE_LABELS[vehicle.fuelType] },
        {
          label: "Engine Capacity",
          value: vehicle.engineCapacity
            ? `${vehicle.engineCapacity}L`
            : undefined,
        },
        { label: "Drive Type", value: vehicle.driveType },
        {
          label: "Odometer",
          value: formatOdometer(vehicle.odometer),
        },
        { label: "Seats", value: vehicle.seats?.toString() },
        { label: "Doors", value: vehicle.doors?.toString() },
      ],
    },
    {
      title: "Condition & History",
      fields: [
        { label: "Condition", value: CONDITION_LABELS[vehicle.condition] },
        { label: "Service History", value: vehicle.serviceHistory },
        {
          label: "Accident History",
          value: YES_NO_LABELS[vehicle.accidentHistory],
        },
        { label: "Finance Owing", value: YES_NO_LABELS[vehicle.financeOwing] },
        { label: "Modifications", value: vehicle.modifications },
        { label: "Additional Notes", value: vehicle.notes },
      ],
    },
    {
      title: "Registration",
      fields: vehicle.isUnregistered
        ? [
            {
              label: "Status",
              value: "Unregistered",
            },
          ]
        : [
            {
              label: "Registration Expiry",
              value: formatDate(vehicle.registrationExpiry),
            },
          ],
    },
  ];

  return (
    <div className="grid gap-10 relative">
      {vehicle.status === "sold" && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-white/80 p-10 rounded-md flex flex-col gap-5 items-center">
            <h2 className="text-heading text-blue">Vehicle Sold</h2>
            <ButtonLink
              href="/dealer-portal"
              cssClasses="w-fit"
              ariaLabel="Dealer Portal"
              traditionalButton
            >
              Back
            </ButtonLink>
          </div>
        </div>
      )}

      {vehicle.status === "delisted" && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-white/80 p-10 rounded-md flex flex-col gap-5 items-center">
            <h2 className="text-heading text-blue">No Longer Available</h2>
            <ButtonType
              type="button"
              onClick={() => router.back()}
              cssClasses="w-fit"
              small
            >
              Back
            </ButtonType>
          </div>
        </div>
      )}

      <ButtonType
        type="button"
        onClick={() => router.back()}
        cssClasses="w-fit"
      >
        Back
      </ButtonType>
      <div className="grid grid-cols-1 desktop-small:grid-cols-2 gap-10">
        <div className="flex flex-col gap-10 desktop-small:sticky desktop-small:top-10 desktop-small:self-start">
          <div className="flex flex-col gap-5 tablet-small:flex-row tablet-small:gap-10 tablet-small:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex gap-3 items-center">
                {vehicle.status === "draft" && (
                  <p className="px-2 py-1 place-self-start rounded-md text-[12px] leading-normal bg-blue text-white">
                    Draft
                  </p>
                )}
                <p
                  className={classNames(
                    "px-2 py-1 place-self-start rounded-md text-[12px] leading-normal",
                    {
                      "bg-yellow text-blue": vehicle.listingType === "tender",
                      "bg-blue text-white": vehicle.listingType === "buy-now",
                    },
                  )}
                >
                  {vehicle.listingType === "tender"
                    ? "Tender"
                    : vehicle.listingType === "buy-now"
                      ? "Buy Now"
                      : null}
                </p>
              </div>
              <h1 className="text-subheading text-blue">
                {[vehicle.make, vehicle.model].filter(Boolean).join(" ") ||
                  "Vehicle Details"}
              </h1>
              {vehicle.year && (
                <h2 className="text-paragraph text-grey">{vehicle.year}</h2>
              )}
            </div>
            {vehicle.listingType !== "tender" && (
              <h2 className="text-subheading font-light">
                {formatPrice(vehicle.price)}
              </h2>
            )}
          </div>

          <VehicleImageSlider
            images={images}
            primaryImage={vehicle.media?.primaryImage || ""}
          />
        </div>
        <div className="grid gap-10">
          {vehicle.listingType === "buy-now" && (
            <BuyAndOfferComponent
              vehicleStatus={vehicle.status}
              vehiclePrice={vehicle.price}
              vehicleId={vehicle.id}
              registrationNumber={vehicle.registrationNumber}
              make={vehicle.make}
              model={vehicle.model}
              year={vehicle.year}
              featuredImagePath={
                vehicle.media?.primaryImage ||
                (vehicle.media?.images && vehicle.media.images[0]) ||
                ""
              }
              bodyType={vehicle.bodyType}
              transmission={TRANSMISSION_LABELS[vehicle.transmission]}
              engineCapacity={vehicle.engineCapacity}
              fuelType={FUEL_TYPE_LABELS[vehicle.fuelType]}
              driveType={vehicle.driveType}
              colour={vehicle.colour}
              vin={vehicle.vin}
            />
          )}

          {vehicle.listingType === "tender" && vehicle.tenderDeadline && (
            <BidComponent
              status={vehicle.status}
              vehiclePrice={vehicle.price}
              vehicleId={vehicle.id}
              registrationNumber={vehicle.registrationNumber}
              make={vehicle.make}
              model={vehicle.model}
              year={vehicle.year}
              featuredImagePath={
                vehicle.media?.primaryImage ||
                (vehicle.media?.images && vehicle.media.images[0]) ||
                ""
              }
              bodyType={vehicle.bodyType}
              transmission={TRANSMISSION_LABELS[vehicle.transmission]}
              engineCapacity={vehicle.engineCapacity}
              fuelType={FUEL_TYPE_LABELS[vehicle.fuelType]}
              driveType={vehicle.driveType}
              colour={vehicle.colour}
              vin={vehicle.vin}
              tenderDeadline={vehicle.tenderDeadline}
            />
          )}

          <div className="bg-white rounded-md border border-blue p-7 grid gap-10">
            {sections
              .filter((section) =>
                section.fields.some(
                  (field) => field.value && field.value !== "Not provided",
                ),
              )
              .map((section) => (
                <div key={section.title}>
                  <h2 className="text-paragraph-desktop text-blue font-semibold mb-5">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
                    {section.fields.map((field) =>
                      field.value && field.value !== "Not provided" ? (
                        <div key={field.label}>
                          <p className="text-paragraph text-blue font-semibold">
                            {field.label}
                          </p>
                          <p className="text-paragraph text-grey">
                            {field.value}
                          </p>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
