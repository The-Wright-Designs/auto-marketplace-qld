"use client";

import { VehicleStatus } from "@/_types/vehicle-types";
import ButtonType from "@/_components/ui/buttons/button-type";

const STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Draft",
  active: "Active",
  sold: "Sold",
  delisted: "Delisted",
};

const STATUS_DESCRIPTIONS: Record<VehicleStatus, string> = {
  draft: "This vehicle will not be visible to the public.",
  active: "This vehicle will be visible to the public.",
  sold: "This vehicle has been sold.",
  delisted:
    "This vehicle has been delisted and is no longer available for sale. IT WILL BE REMOVED FROM THE DEALER PORTAL COMPLETELY.",
};

interface StatusChangeModalProps {
  currentStatus: VehicleStatus;
  newStatus: VehicleStatus;
  vehicleTitle: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StatusChangeModal({
  currentStatus,
  newStatus,
  vehicleTitle,
  isLoading,
  onConfirm,
  onCancel,
}: StatusChangeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50">
      <div className="bg-white rounded-md border-2 border-blue px-7 py-5 max-w-[500px] overflow-hidden grid gap-5">
        <h3 className="text-[28px] font-bold text-blue whitespace-normal">
          Change Vehicle Status
        </h3>

        <div className="grid gap-3">
          <p className="text-paragraph text-grey whitespace-normal">
            <span className="font-bold text-blue">{vehicleTitle}</span>
          </p>

          <div className="grid gap-2">
            <p className="text-paragraph text-grey whitespace-normal">
              Current status:{" "}
              <span className="font-bold">{STATUS_LABELS[currentStatus]}</span>
            </p>
            <p className="text-paragraph text-grey whitespace-normal">
              New status:{" "}
              <span className="font-bold">{STATUS_LABELS[newStatus]}</span>
            </p>
          </div>

          <p className="text-paragraph text-grey italic pt-3 whitespace-normal">
            {STATUS_DESCRIPTIONS[newStatus]}
          </p>
        </div>

        <div className="flex flex-col min-[600px]:flex-row gap-5">
          <ButtonType
            onClick={onConfirm}
            disabled={isLoading}
            cssClasses="bg-blue text-white flex-1"
          >
            {isLoading ? "Changing..." : "Confirm"}
          </ButtonType>

          <ButtonType
            onClick={onCancel}
            disabled={isLoading}
            cssClasses="bg-grey text-white flex-1"
          >
            Cancel
          </ButtonType>
        </div>
      </div>
    </div>
  );
}
