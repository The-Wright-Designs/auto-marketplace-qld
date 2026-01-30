export default function VehicleCardSkeleton() {
  return (
    <div className="w-full min-w-[250px] phone:w-[300px]">
      <div className="aspect-[4/3] bg-grey rounded-t-md overflow-hidden animate-pulse">
        <div className="h-full w-full bg-grey-dark" />
      </div>

      <div className="px-4 py-2 pt-5 bg-blue/5 flex justify-between gap-10 border-x border-b border-blue rounded-b-md">
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-5 bg-grey rounded animate-pulse w-20" />
          <div className="h-4 bg-grey rounded animate-pulse w-16" />
          <div className="h-4 bg-grey rounded animate-pulse w-20" />
          <div className="h-5 bg-grey rounded animate-pulse w-18" />
        </div>
        <div className="flex-1 flex flex-col gap-3 place-items-end">
          <div className="h-5 bg-grey rounded animate-pulse w-18" />
          <div className="h-4 bg-grey rounded animate-pulse w-12" />
          <div className="h-4 bg-grey rounded animate-pulse w-16" />
          <div className="h-4 bg-grey rounded animate-pulse w-14" />
        </div>
      </div>
    </div>
  );
}
