import { notFound } from "next/navigation";
import {
  getVehicle,
  getVehicleImagesWithUrls,
} from "@/_actions/vehicle-actions";
import VehicleDetailView from "@/_components/pages/dealer-portal/vehicles/vehicle-detail-view";

interface VehicleViewPageParams {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: VehicleViewPageParams) {
  const { id } = await params;
  const result = await getVehicle(id);

  if (!result.success || !result.data) {
    return {
      title: "Vehicle Not Found",
    };
  }

  const vehicle = result.data;
  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  };
}

export default async function VehicleViewPage({
  params,
}: VehicleViewPageParams) {
  const { id } = await params;
  const vehicleResult = await getVehicle(id);

  if (!vehicleResult.success || !vehicleResult.data) {
    return notFound();
  }

  const vehicle = vehicleResult.data;

  const imagesResult = await getVehicleImagesWithUrls(id);
  const images = imagesResult.success ? imagesResult.data?.images || [] : [];

  return (
    <div className="max-w-7xl mx-auto">
      <VehicleDetailView vehicle={vehicle} images={images} />
    </div>
  );
}
