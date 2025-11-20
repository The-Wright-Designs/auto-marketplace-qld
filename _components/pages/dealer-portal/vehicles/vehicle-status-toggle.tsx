"use client";

import { useState } from "react";
import { updateVehicle } from "@/_actions/vehicle-actions";
import { VehicleStatus } from "@/_types/vehicle-types";
import StatusChangeModal from "./status-change-modal";

const STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Draft",
  active: "Active",
  sold: "Sold",
};

const AVAILABLE_STATUS: VehicleStatus[] = ["draft", "active", "sold"];

interface VehicleStatusToggleProps {
  vehicleId: string;
  currentStatus: VehicleStatus;
  vehicleTitle: string;
  onStatusChange?: (newStatus: VehicleStatus) => void;
}

export default function VehicleStatusToggle({
  vehicleId,
  currentStatus,
  vehicleTitle,
  onStatusChange,
}: VehicleStatusToggleProps) {
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusSelect = (newStatus: VehicleStatus) => {
    if (newStatus !== currentStatus) {
      setSelectedStatus(newStatus);
      setShowConfirm(true);
    }
  };

  const handleConfirmChange = async () => {
    if (!selectedStatus) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await updateVehicle(vehicleId, {
        status: selectedStatus,
      });

      if (result.success) {
        onStatusChange?.(selectedStatus);
        setShowConfirm(false);
        setSelectedStatus(null);
      } else {
        setError(result.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedStatus(null);
  };

  return (
    <>
      <select
        value={currentStatus}
        onChange={(e) => handleStatusSelect(e.target.value as VehicleStatus)}
        disabled={isLoading}
        className="px-2 py-1 border-2 border-blue text-black rounded-md text-[16px] font-normal focus:outline-none focus:border-blue disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {AVAILABLE_STATUS.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      {error && <p className="text-red text-paragraph text-sm mt-2">{error}</p>}

      {showConfirm && selectedStatus && (
        <StatusChangeModal
          currentStatus={currentStatus}
          newStatus={selectedStatus}
          vehicleTitle={vehicleTitle}
          isLoading={isLoading}
          onConfirm={handleConfirmChange}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
