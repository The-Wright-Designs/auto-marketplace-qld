"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { listVehicles, deleteVehicle } from "@/_actions/vehicle-actions";
import { Vehicle, VehicleStatus } from "@/_types/vehicle-types";
import ButtonType from "@/_components/ui/buttons/button-type";
import ButtonLink from "@/_components/ui/buttons/button-link";
import VehicleStatusToggle from "@/_components/pages/dashboard/vehicles/vehicle-status-toggle";

const LISTING_TYPE_LABELS: Record<string, string> = {
  tender: "Tender",
  "buy-now": "Buy Now",
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface VehicleFilters {
  limit: number;
  offset: number;
  listingType?: "tender" | "buy-now";
  status?: VehicleStatus;
}

type SortField = "dateAdded" | "year" | "make" | "model" | "price";
type SortDirection = "asc" | "desc";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingTypeFilter, setListingTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<SortField>("dateAdded");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const limit = 20;

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: VehicleFilters = { limit: limit + 1, offset };

      if (listingTypeFilter) {
        filters.listingType = listingTypeFilter as "tender" | "buy-now";
      }

      if (statusFilter) {
        filters.status = statusFilter as VehicleStatus;
      }

      const result = await listVehicles(filters);

      if (result.success && result.data) {
        const vehicleList = result.data;

        if (vehicleList.length > limit) {
          setVehicles(vehicleList.slice(0, limit));
          setHasMore(true);
        } else {
          setVehicles(vehicleList);
          setHasMore(false);
        }
      } else {
        setError(result.error || "Failed to load vehicles");
      }
    } catch (err) {
      setError("An error occurred while loading vehicles");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [listingTypeFilter, statusFilter, offset, limit]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (vehicleId: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteVehicle(vehicleId);

      if (result.success) {
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
        setDeleteConfirmId(null);
      } else {
        setError(result.error || "Failed to delete vehicle");
      }
    } catch (err) {
      setError("An error occurred while deleting the vehicle");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      const descByDefault = ["dateAdded", "year", "price"];
      setSortDirection(descByDefault.includes(field) ? "desc" : "asc");
    }
  };

  const getSortedAndFilteredVehicles = () => {
    const filtered = vehicles.filter((vehicle) => {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.vin.toLowerCase().includes(query)
      );
    });

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "dateAdded":
          aValue = new Date(a.metadata.createdAt).getTime();
          bValue = new Date(b.metadata.createdAt).getTime();
          break;
        case "year":
          aValue = a.year;
          bValue = b.year;
          break;
        case "make":
          aValue = a.make.toLowerCase();
          bValue = b.make.toLowerCase();
          break;
        case "model":
          aValue = a.model.toLowerCase();
          bValue = b.model.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  const filteredVehicles = getSortedAndFilteredVehicles();

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>;
  };

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="text-left p-3 text-blue font-bold cursor-pointer hover:opacity-70"
      onClick={() => handleSort(field)}
    >
      {label}
      <SortIndicator field={field} />
    </th>
  );

  return (
    <div className="p-50px desktop:p-100px">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between mb-10 gap-5">
          <h1 className="text-heading text-blue">Vehicle Management</h1>
          <ButtonLink
            href="/dealer-portal/vehicles/new"
            ariaLabel="Add New Vehicle"
            cssClasses="bg-blue text-white"
          >
            Add New Vehicle
          </ButtonLink>
        </div>

        {error && (
          <div className="p-18px bg-red rounded border-2 border-red mb-10">
            <p className="text-white text-paragraph">{error}</p>
          </div>
        )}

        <div className="bg-white rounded border-2 border-grey p-50px">
          <div className="space-y-5 mb-10">
            <h3 className="text-subheading text-blue">Filters</h3>

            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-5">
              <div>
                <label className="block text-paragraph text-blue font-bold mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Make, Model, or VIN"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-grey rounded focus:outline-none focus:border-blue"
                />
              </div>

              <div>
                <label className="block text-paragraph text-blue font-bold mb-2">
                  Listing Type
                </label>
                <select
                  value={listingTypeFilter}
                  onChange={(e) => {
                    setListingTypeFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="w-full px-3 py-2 border-2 border-grey rounded focus:outline-none focus:border-blue"
                >
                  <option value="">All Types</option>
                  <option value="tender">Tender</option>
                  <option value="buy-now">Buy Now</option>
                </select>
              </div>

              <div>
                <label className="block text-paragraph text-blue font-bold mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="w-full px-3 py-2 border-2 border-grey rounded focus:outline-none focus:border-blue"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-paragraph text-grey">Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-paragraph text-grey">
                {vehicles.length === 0
                  ? "No vehicles found. Create your first vehicle to get started."
                  : "No vehicles match your search filters."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-paragraph text-grey">
                  <thead>
                    <tr className="border-b-2 border-grey">
                      <SortableHeader field="dateAdded" label="Date Added" />
                      <SortableHeader field="year" label="Year" />
                      <SortableHeader field="make" label="Make" />
                      <SortableHeader field="model" label="Model" />
                      <SortableHeader field="price" label="Price" />
                      <th className="text-left p-3 text-blue font-bold">
                        Status
                      </th>
                      <th className="text-left p-3 text-blue font-bold">
                        Type
                      </th>
                      <th className="text-left p-3 text-blue font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle) => (
                      <tr
                        key={vehicle.id}
                        className="border-b border-grey hover:bg-grey hover:bg-opacity-10"
                      >
                        <td className="p-3">{formatDate(vehicle.metadata.createdAt)}</td>
                        <td className="p-3">{vehicle.year}</td>
                        <td className="p-3">{vehicle.make}</td>
                        <td className="p-3">{vehicle.model}</td>
                        <td className="p-3">
                          ${vehicle.price.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <VehicleStatusToggle
                            vehicleId={vehicle.id}
                            currentStatus={vehicle.status}
                            vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            onStatusChange={(newStatus) => {
                              setVehicles((prev) =>
                                prev.map((v) =>
                                  v.id === vehicle.id
                                    ? { ...v, status: newStatus }
                                    : v
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="p-3">
                          {LISTING_TYPE_LABELS[vehicle.listingType]}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-3">
                            <Link
                              href={`/dealer-portal/vehicles/${vehicle.id}/edit`}
                              className="text-link-blue underline hover:no-underline"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteConfirmId(vehicle.id)}
                              className="text-red underline hover:no-underline"
                              disabled={isDeleting}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-10">
                <ButtonType
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0 || isLoading}
                  cssClasses="bg-blue text-white"
                >
                  Previous
                </ButtonType>

                <p className="text-paragraph text-grey">
                  Showing {filteredVehicles.length} of {vehicles.length}{" "}
                  vehicles
                </p>

                <ButtonType
                  onClick={() => setOffset(offset + limit)}
                  disabled={!hasMore || isLoading}
                  cssClasses="bg-blue text-white"
                >
                  Next
                </ButtonType>
              </div>
            </>
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded border-2 border-blue p-50px max-w-md w-full">
            <h3 className="text-subheading text-blue mb-5">Delete Vehicle</h3>
            <p className="text-paragraph text-grey mb-10">
              Are you sure you want to delete this vehicle? This action cannot
              be undone.
            </p>

            <div className="flex gap-5">
              <ButtonType
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                cssClasses="bg-red text-white flex-1"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </ButtonType>

              <ButtonType
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                cssClasses="bg-grey text-white flex-1"
              >
                Cancel
              </ButtonType>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
