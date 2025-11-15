import { redirect } from "next/navigation";
import { getVehicle } from "@/_actions/vehicle-actions";
import VehicleForm from "@/_components/pages/dashboard/vehicles/vehicle-form";

export const metadata = {
  title: "Edit Vehicle",
};

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getVehicle(id);

  if (!result.success || !result.data) {
    redirect("/dealer-portal/vehicles");
  }

  return (
    <div>
      <h1 className="text-subheading full-hd:text-subheading-desktop mb-10">
        Edit Vehicle
      </h1>
      <VehicleForm mode="edit" initialData={result.data} vehicleId={id} />
    </div>
  );
}
