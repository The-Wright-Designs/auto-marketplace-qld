"use client";

import ButtonType from "@/_components/ui/buttons/button-type";

interface DeleteConfirmationModalProps {
  title: string;
  description: string;
  itemName?: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  title,
  description,
  itemName,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50">
      <div className="bg-white rounded-md border-2 border-blue px-7 py-5 max-w-[500px] overflow-hidden grid gap-5">
        <h3 className="text-[28px] font-bold text-blue whitespace-normal">
          {title}
        </h3>

        <div className="grid gap-3">
          {itemName && (
            <p className="text-paragraph text-grey whitespace-normal">
              <span className="font-bold text-blue">{itemName}</span>
            </p>
          )}

          <p className="text-paragraph text-grey whitespace-normal">
            {description}
          </p>
        </div>

        <div className="flex flex-col min-[600px]:flex-row gap-5">
          <ButtonType
            onClick={onConfirm}
            disabled={isLoading}
            cssClasses="bg-red text-white flex-1"
          >
            {isLoading ? (
              <div className="my-[1px]">
                <div className="spinner-button" />
              </div>
            ) : (
              "Delete"
            )}
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
