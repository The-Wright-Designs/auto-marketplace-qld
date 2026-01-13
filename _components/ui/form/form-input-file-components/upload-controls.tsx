import { useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import ButtonType from "@/_components/ui/buttons/button-type";
import classNames from "classnames";
import { formFileStyles } from "@/_styles/form-input-styles";

interface UploadControlsProps {
  maxFiles?: number;
  processedImagesCount: number;
  isValidating: boolean;
  disabled?: boolean;
  onSelectFiles: () => void;
  onDeleteAll?: () => void;
  isDeletingAll?: boolean;
  deleteAllConfirm?: boolean;
}

const UploadControls = ({
  maxFiles,
  processedImagesCount,
  isValidating,
  disabled = false,
  onSelectFiles,
  onDeleteAll,
  isDeletingAll = false,
  deleteAllConfirm = false,
}: UploadControlsProps) => {
  const [showRequirements, setShowRequirements] = useState(false);

  return (
    <div
      className={formFileStyles(
        classNames(
          "w-full flex flex-wrap gap-x-5 gap-y-3 items-center justify-between",
          {
            "mt-10": processedImagesCount !== 0,
          }
        ),
        disabled || isValidating
      )}
    >
      <div className="flex flex-wrap items-center w-full justify-between gap-3 min-[600px]:flex-row">
        <div className="flex flex-wrap gap-3 w-full min-[600px]:w-auto">
          <ButtonType
            type="button"
            onClick={onSelectFiles}
            disabled={
              disabled ||
              isValidating ||
              isDeletingAll ||
              (maxFiles !== undefined && processedImagesCount >= maxFiles)
            }
            cssClasses="w-full min-[600px]:w-auto"
            small
          >
            {isValidating
              ? "Uploading..."
              : processedImagesCount === 0
              ? "Choose images"
              : "Add more images"}
          </ButtonType>

          {onDeleteAll && processedImagesCount > 0 && (
            <ButtonType
              type="button"
              onClick={onDeleteAll}
              disabled={disabled || isValidating || isDeletingAll}
              cssClasses="w-full min-[600px]:w-auto bg-red/75"
              small
            >
              {isDeletingAll
                ? "Deleting all..."
                : deleteAllConfirm
                ? "Confirm"
                : "Delete all"}
            </ButtonType>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowRequirements(!showRequirements)}
          className="text-[16px] font-normal flex items-center gap-2 italic desktop-small:hover:opacity-80"
        >
          <span className="flex gap-2 items-center">
            <AlertCircle color="red" className="w-4 h-4" />
            Image requirements
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showRequirements ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {showRequirements && (
        <div className="p-4 w-full rounded-md border border-grey tablet:mt-3">
          <ul className="list-disc desktop:grid grid-cols-2 list-inside grid gap-1 text-[14px]">
            <li>Accepted formats: JPEG, PNG, WebP, GIF</li>
            <li>Maximum file size: 20MB per image</li>
            <li>At least 2 images required</li>
            {maxFiles && <li>Maximum {maxFiles} images allowed</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadControls;
