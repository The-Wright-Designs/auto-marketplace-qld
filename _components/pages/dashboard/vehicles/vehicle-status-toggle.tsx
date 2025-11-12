"use client";

import { useState } from "react";
import { updateVehicle } from "@/_actions/vehicle-actions";
import { VehicleStatus } from "@/_types/vehicle-types";
import StatusChangeModal from "./status-change-modal";
import classNames from "classnames";

const STATUS_COLORS: Record<VehicleStatus, string> = {
  draft: "bg-grey text-white",
  active: "bg-blue text-white",
  sold: "bg-yellow text-black",
  delisted: "bg-red text-white",
};

const STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Draft",
  active: "Active",
  sold: "Sold",
  delisted: "Delisted",
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusSelect = (newStatus: VehicleStatus) => {
    if (newStatus !== currentStatus) {
      setSelectedStatus(newStatus);
      setShowConfirm(true);
      setIsOpen(false);
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
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={classNames(
            "px-3 py-2 rounded text-paragraph font-bold border-2 border-transparent hover:border-blue transition-colors flex items-center gap-2",
            STATUS_COLORS[currentStatus]
          )}
        >
          {STATUS_LABELS[currentStatus]}
          <span
            className={classNames(
              "inline-block transition-transform",
              isOpen ? "rotate-180" : ""
            )}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border-2 border-blue rounded shadow-lg z-40 min-w-max">
            {AVAILABLE_STATUS.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                disabled={status === currentStatus || isLoading}
                className={classNames(
                  "block w-full text-left px-4 py-2 text-paragraph hover:bg-grey hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  status === currentStatus ? "text-grey font-bold" : "text-blue"
                )}
              >
                {STATUS_LABELS[status]}
                {status === currentStatus && " (current)"}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red text-paragraph text-sm mt-2">{error}</p>
      )}

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
