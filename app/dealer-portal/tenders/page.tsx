import ListedVehiclesComponent from "@/_components/pages/dealer-portal/dashboard/listed-vehicles-component";

export default function TendersPage() {
  return (
    <div className="grid gap-10">
      <h1 className="text-subheading full-hd:text-subheading-desktop">
        Tenders
      </h1>
      <ListedVehiclesComponent listingType="tender" />
    </div>
  );
}
