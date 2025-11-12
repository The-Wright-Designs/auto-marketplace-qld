import VehicleForm from "@/_components/pages/dashboard/vehicles/vehicle-form";

export const metadata = {
  title: "Add New Vehicle",
};

export default function NewVehiclePage() {
  return (
    <div className="p-50px desktop:p-100px">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-heading text-blue mb-10">Add New Vehicle</h1>
        <VehicleForm mode="create" />
      </div>
    </div>
  );
}
