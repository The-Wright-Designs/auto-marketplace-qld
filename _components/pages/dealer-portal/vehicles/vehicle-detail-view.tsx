"use client";

import { useRouter } from "next/navigation";
import VehicleImageSlider from "@/_components/ui/sliders/vehicle-image-slider";
import ButtonType from "@/_components/ui/buttons/button-type";
import { Vehicle } from "@/_types/vehicle-types";

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

function formatDate(isoString: string | undefined): string {
  if (!isoString) return "Not provided";
  return new Date(isoString).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(price: number | undefined): string {
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
        { label: "VIN", value: vehicle.vin },
        { label: "Colour", value: vehicle.colour },
        { label: "Body Type", value: vehicle.bodyType },
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
        { label: "Accident History", value: vehicle.accidentHistory },
        { label: "Finance Owing", value: vehicle.financeOwing },
        { label: "Modifications", value: vehicle.modifications },
        { label: "Additional Notes", value: vehicle.notes },
      ],
    },
    {
      title: "Registration",
      fields: [
        {
          label: "Registration Expiry",
          value: formatDate(vehicle.registrationExpiry),
        },
      ],
    },
    {
      title: "Listing Details",
      fields: [
        {
          label: "Listing Type",
          value: LISTING_TYPE_LABELS[vehicle.listingType],
        },
        { label: "Price", value: formatPrice(vehicle.price) },
        ...(vehicle.listingType === "tender"
          ? [
              {
                label: "Reserve Price",
                value: formatPrice(vehicle.reservePrice),
              },
              {
                label: "Tender Deadline",
                value: formatDate(vehicle.tenderDeadline),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="grid gap-10">
      <ButtonType
        type="button"
        onClick={() => router.back()}
        cssClasses="w-fit"
      >
        Back
      </ButtonType>
      <div className="grid grid-cols-1 desktop-small:grid-cols-2 gap-10">
        <div className="flex flex-col gap-10 desktop-small:sticky desktop-small:top-10 desktop-small:self-start">
          <div className="flex gap-10 justify-between">
            <div>
              <h1 className="text-subheading text-blue">
                {[vehicle.make, vehicle.model].filter(Boolean).join(" ") ||
                  "Vehicle Details"}
              </h1>
              {vehicle.year && (
                <h2 className="text-paragraph text-grey">{vehicle.year}</h2>
              )}
            </div>
            <h2 className="text-subheading font-light">
              {formatPrice(vehicle.price)}
            </h2>
          </div>

          <VehicleImageSlider
            images={images}
            primaryImage={vehicle.media?.primaryImage || ""}
          />
        </div>

        <div className="bg-white rounded-md border border-blue p-7 grid gap-10">
          {sections.map((section) => (
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
                      <p className="text-paragraph text-grey">{field.value}</p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
