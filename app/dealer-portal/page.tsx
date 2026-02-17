import ListedVehiclesComponent from "@/_components/pages/dealer-portal/dashboard/listed-vehicles-component";

export default function DealerDashboard() {
  return (
    <div className="grid gap-10">
      <h1 className="text-subheading full-hd:text-subheading-desktop">
        Dealer Dashboard
      </h1>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">Most recent tenders</h2>
        <ListedVehiclesComponent listingType="tender" maxLimit={20} />
      </div>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">
          Recent Vehicles available to buy now
        </h2>
        <ListedVehiclesComponent listingType="buy-now" maxLimit={20} />
      </div>
    </div>
  );
}
