export default function VehicleCardSkeleton() {
  return (
    <div className="w-[250px]">
      <div className="aspect-[4/3] bg-grey rounded-t-md overflow-hidden animate-pulse">
        <div className="h-full w-full bg-grey-dark" />
      </div>

      <div className="p-4 pt-5 bg-blue/5 flex justify-between gap-10 border-x border-b border-blue rounded-b-md space-y-2">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-grey rounded animate-pulse w-20" />
          <div className="h-4 bg-grey rounded animate-pulse w-16" />
          <div className="h-4 mt-[14px] bg-grey rounded animate-pulse w-20" />
        </div>
        <div className="flex-1 space-y-3 place-items-end">
          <div className="h-5 bg-grey rounded animate-pulse w-18" />
          <div className="h-4 bg-grey rounded animate-pulse w-12" />
          <div className="h-4 mt-[14px] bg-grey rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}
