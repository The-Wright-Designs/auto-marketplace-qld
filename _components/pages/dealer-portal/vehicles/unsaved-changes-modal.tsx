"use client";

import ButtonType from "@/_components/ui/buttons/button-type";

interface UnsavedChangesModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesModal({
  onConfirm,
  onCancel,
}: UnsavedChangesModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50">
      <div className="bg-white rounded-md border-2 border-blue px-7 py-5 max-w-[500px] overflow-hidden space-y-5">
        <h3 className="text-[28px] font-bold text-blue whitespace-normal">
          Unsaved Changes
        </h3>

        <p className="text-paragraph text-grey whitespace-normal">
          You have unsaved changes that will be lost if you leave this page. Are
          you sure you want to continue?
        </p>

        <div className="flex flex-col min-[600px]:flex-row gap-5">
          <ButtonType
            onClick={onConfirm}
            type="button"
            cssClasses="bg-red text-white flex-1"
          >
            Discard
          </ButtonType>

          <ButtonType
            onClick={onCancel}
            type="button"
            cssClasses="bg-grey text-white flex-1"
          >
            Keep Editing
          </ButtonType>
        </div>
      </div>
    </div>
  );
}
