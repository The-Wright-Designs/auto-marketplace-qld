import { X } from "lucide-react";
import Image from "next/image";
import { ProcessedImageResult } from "@/_actions/process-single-image";

interface FileListDisplayProps {
  processedImages: ProcessedImageResult[];
  previews: string[];
  onRemoveFile: (index: number) => void;
  onClearAll: () => void;
  isValidating: boolean;
  disabled?: boolean;
}

const FileListDisplay = ({
  processedImages,
  previews,
  onRemoveFile,
  onClearAll,
  isValidating,
  disabled = false,
}: FileListDisplayProps) => {
  if (processedImages.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[16px] font-medium">
          Added images:
          <span className="ml-2 text-sm text-gray-600"></span>
        </p>
        {processedImages.length > 1 && (
          <button
            type="button"
            onClick={onClearAll}
            disabled={disabled || isValidating}
            className="text-[16px] p-2 -m-2 font-normal text-red desktop-small:hover:opacity-80 desktop-small:p-0 desktop-small:m-0"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-3">
        {processedImages.map((item, index) => {
          const processedImage = (item as ProcessedImageResult).processedImage;
          const fileName = processedImage?.filename || `Image ${index + 1}`;

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-md"
            >
              <div className="flex items-center space-x-3">
                {previews[index] && (
                  <Image
                    src={previews[index]}
                    alt={`Preview of ${fileName}`}
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] object-cover rounded-md"
                    unoptimized
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium truncate max-w-[125px] phone:max-w-[200px] min-[600px]:max-w-full">
                    {fileName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  disabled={disabled || isValidating}
                  className="p-2 -m-2 text-red-600 hover:text-red-800 desktop-small:p-0 desktop-small:m-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileListDisplay;
