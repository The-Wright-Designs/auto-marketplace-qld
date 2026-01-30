"use client";

import { useEffect, useState } from "react";
import VehicleCard from "@/_components/ui/cards/vehicle-card";
import VehicleCardSkeleton from "@/_components/ui/cards/vehicle-card-skeleton";
import {
  listVehicles,
  getMultipleVehicleImagesWithUrls,
} from "@/_actions/vehicle-actions";
import { Vehicle } from "@/_types/vehicle-types";

interface VehicleWithImage {
  vehicle: Vehicle;
  imageUrl?: string;
}

interface ListedVehiclesProps {
  listingType: "tender" | "buy-now" | undefined;
  maxLimit?: number;
}

export default function ListedVehiclesComponent({
  listingType,
  maxLimit,
}: ListedVehiclesProps) {
  const [vehicles, setVehicles] = useState<VehicleWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const result = await listVehicles({
          listingType: listingType,
          status: "active",
          limit: maxLimit || 1000,
        });

        if (result.success && result.data && result.data.length > 0) {
          const vehicleIds = result.data.map((v) => v.id);
          const imagesResult = await getMultipleVehicleImagesWithUrls(
            vehicleIds
          );

          const vehiclesWithImages: VehicleWithImage[] = [];

          for (const vehicle of result.data) {
            let imageUrl: string | undefined;

            if (
              imagesResult.success &&
              imagesResult.data &&
              imagesResult.data[vehicle.id]
            ) {
              const vehicleImages = imagesResult.data[vehicle.id];
              if (vehicleImages.images.length > 0) {
                const primaryImageData = vehicleImages.images.find(
                  (img) => img.filename === vehicleImages.primaryImage
                );

                imageUrl = primaryImageData
                  ? primaryImageData.url
                  : vehicleImages.images[0].url;
              }
            }

            vehiclesWithImages.push({ vehicle, imageUrl });
          }

          const now = new Date();
          const filteredVehicles = vehiclesWithImages.filter((item) => {
            if (
              item.vehicle.listingType === "tender" &&
              item.vehicle.tenderDeadline
            ) {
              const deadline = new Date(item.vehicle.tenderDeadline);
              return deadline > now;
            }
            return true;
          });

          setVehicles(filteredVehicles);
          setError(null);
        } else {
          setVehicles([]);
          setError(null);
        }
      } catch {
        setError("Failed to load vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [listingType, maxLimit]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const getEmptyMessage = () => {
    if (listingType === "tender") {
      return "No active tender vehicles available";
    }
    if (listingType === "buy-now") {
      return "No active buy now vehicles available";
    }
    return "No active vehicles available";
  };

  return (
    <div className="flex flex-col gap-5">
      {error && <p className="text-paragraph text-red">{error}</p>}

      {!loading && !error && vehicles.length > 0 ? (
        <div className="flex flex-wrap gap-10">
          {vehicles.map((item) => (
            <VehicleCard
              key={item.vehicle.id}
              vehicle={item.vehicle}
              imageUrl={item.imageUrl}
              listingType={listingType}
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-paragraph text-grey">{getEmptyMessage()}</p>
        )
      )}
    </div>
  );
}
