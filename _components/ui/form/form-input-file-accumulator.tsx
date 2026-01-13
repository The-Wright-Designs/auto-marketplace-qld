"use client";

import { useRef, useEffect } from "react";
import { formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputFileProps } from "@/_types/form-types";
import { useFileUpload } from "./form-input-file-components/use-file-upload";
import { ProcessedImageResult } from "@/_actions/process-single-image";
import FileUploadErrors from "./form-input-file-components/file-upload-errors";
import FileListDisplay from "./form-input-file-components/file-list-display";
import UploadControls from "./form-input-file-components/upload-controls";

const FormInputFileAccumulator = ({
  id,
  name,
  label,
  labelClassName,
  description,
  accept,
  disabled = false,
  maxFiles,
  onImageCountChange,
  onProcessedImagesChange,
}: FormInputFileProps & {
  onImageCountChange?: (count: number) => void;
  onProcessedImagesChange?: (images: ProcessedImageResult[]) => void;
}) => {
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const {
    fileInputRef,
    selectedFiles,
    previews,
    validationErrors,
    isValidating,
    processedImages,
    failedFiles,
    handleFileSelect,
    retryFileUpload,
    removeFile,
    removeFailedFile,
    clearAllFiles,
    clearAllFailedFiles,
    triggerFileSelect,
  } = useFileUpload({ maxFiles, onImageCountChange });

  useEffect(() => {
    if (onProcessedImagesChange) {
      onProcessedImagesChange(processedImages);
    }
  }, [processedImages, onProcessedImagesChange]);

  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <div className="grid gap-5">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          {description && <p className="text-paragraph">{description}</p>}
          <span className="text-[16px] flex items-center gap-2">
            Total images ({processedImages.length}
            {maxFiles ? `/${maxFiles}` : ""})
          </span>
        </div>

        {isValidating && (
          <div className="rounded-md border-blue border-2 p-3">
            <div className="flex items-center gap-2">
              <div className="spinner"></div>
              <span className="font-medium">Uploading image/s...</span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          id={id}
          multiple
          accept={accept}
          disabled={disabled || isValidating}
          className="hidden"
          onChange={handleFileSelect}
        />

        <input
          ref={hiddenFileInputRef}
          type="file"
          name={name}
          multiple
          required={false}
          className="hidden"
        />

        {processedImages.map((image, index) => (
          <input
            key={index}
            type="hidden"
            name={`${name}_processed_${index}`}
            value={JSON.stringify(image.processedImage)}
            data-filename={image.processedImage?.filename}
          />
        ))}
        <>
          <input
            type="hidden"
            name={`${name}_processed_count`}
            value={processedImages.length}
          />
        </>

        <FileUploadErrors
          validationErrors={validationErrors}
          failedFiles={failedFiles}
          isValidating={isValidating}
          onRetryFile={retryFileUpload}
          onRemoveFailedFile={removeFailedFile}
          disabled={disabled}
        />

        <FileListDisplay
          processedImages={processedImages}
          previews={previews}
          onRemoveFile={removeFile}
          onClearAll={clearAllFiles}
          isValidating={isValidating}
          disabled={disabled}
        />

        <UploadControls
          maxFiles={maxFiles}
          processedImagesCount={processedImages.length}
          isValidating={isValidating}
          disabled={disabled}
          onSelectFiles={triggerFileSelect}
        />
      </div>
    </div>
  );
};

export default FormInputFileAccumulator;
