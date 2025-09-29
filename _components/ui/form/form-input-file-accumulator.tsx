"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { X, AlertCircle, ChevronDown } from "lucide-react";
import { formLabelStyles, formFileStyles } from "@/_styles/form-input-styles";
import { FormInputFileProps } from "@/_types/form-types";
import ButtonType from "@/_components/ui/buttons/button-type";
import Image from "next/image";
import classNames from "classnames";
import { FileValidator } from "@/_lib/utils/file-validator";
import {
  processSingleImage,
  ProcessedImageResult,
} from "@/_actions/process-single-image";

const FormInputFileAccumulator = ({
  id,
  name,
  required = false,
  label,
  labelClassName,
  description,
  accept,
  disabled = false,
  maxFiles,
  onImageCountChange,
}: FormInputFileProps & { onImageCountChange?: (count: number) => void }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [processedImages, setProcessedImages] = useState<
    ProcessedImageResult[]
  >([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [showRequirements, setShowRequirements] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Process each file individually with progressive upload
    await processFilesProgressively(newFiles);
  };

  const processFilesProgressively = async (newFiles: File[]) => {
    setIsValidating(true);
    setValidationErrors([]);

    const errors: string[] = [];

    // Check max files limit first
    if (maxFiles && selectedFiles.length + newFiles.length > maxFiles) {
      errors.push(
        `Maximum ${maxFiles} files allowed. You currently have ${selectedFiles.length} files.`
      );
      setValidationErrors(errors);
      setIsValidating(false);
      return;
    }

    // Process each file individually with server-side validation
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      try {
        const result = await processSingleImage(file, sessionId);

        if (result.success && result.processedImage) {
          // Add to processed images
          setProcessedImages((prev) => [...prev, result]);

          // Create preview
          if (FileValidator.isImageFile(file)) {
            const preview = URL.createObjectURL(file);
            setPreviews((prev) => [...prev, preview]);
          }
        } else {
          errors.push(`${file.name}: ${result.error}`);
        }
      } catch (error) {
        errors.push(
          `${file.name}: Upload failed. Please try again or choose a different image.`
        );
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    setIsValidating(false);

    // Reset the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFilesTraditionally = async (newFiles: File[]) => {
    setIsValidating(true);
    setValidationErrors([]);

    const validatedFiles: File[] = [];
    const errors: string[] = [];

    // Check max files limit first
    if (maxFiles && selectedFiles.length + newFiles.length > maxFiles) {
      errors.push(
        `Maximum ${maxFiles} files allowed. You currently have ${selectedFiles.length} files.`
      );
      setValidationErrors(errors);
      setIsValidating(false);
      return;
    }

    // Validate each file
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      const validation = await FileValidator.validateFile(file);
      if (validation.isValid && validation.sanitizedFile) {
        validatedFiles.push(validation.sanitizedFile);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    // Validate total collection
    const totalValidation = FileValidator.validateMultipleFiles([
      ...selectedFiles,
      ...validatedFiles,
    ]);

    if (totalValidation.errors.length > 0) {
      errors.push(...totalValidation.errors);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
    } else {
      setSelectedFiles((prev) => [...prev, ...validatedFiles]);

      // Create previews only for validated files
      const newPreviews = validatedFiles
        .filter((file) => FileValidator.isImageFile(file))
        .map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }

    setIsValidating(false);

    // Reset the input value so the same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    // Remove from processed images
    setProcessedImages((prev) => prev.filter((_, i) => i !== index));

    // Clean up preview URL
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  // Update the hidden file input with accumulated files
  useEffect(() => {
    if (hiddenFileInputRef.current) {
      // For progressive upload, store processed image data in hidden inputs
      // The main form will handle the processed images
    }
  }, [selectedFiles, processedImages]);

  // Notify parent component of image count changes
  useEffect(() => {
    if (onImageCountChange) {
      onImageCountChange(processedImages.length);
    }
  }, [processedImages, onImageCountChange]);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <div className="space-y-5">
        {description && <p className="text-paragraph">{description}</p>}

        {/* Validation errors display */}
        {validationErrors.length > 0 && (
          <div className="bg-red/50 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <h4 className="text-paragraph font-semibold">
                Image upload errors:
              </h4>
            </div>
            <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Loading state */}
        {isValidating && (
          <div className="rounded-md border-blue border-2 p-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue border-t-transparent rounded-full"></div>
              <span className="font-medium">Uploading image/s...</span>
            </div>
          </div>
        )}

        {/* Hidden file input for actual file selection */}
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

        {/* Hidden file input for form submission */}
        <input
          ref={hiddenFileInputRef}
          type="file"
          name={name}
          multiple
          required={false} // Don't require hidden input for progressive upload
          className="hidden"
        />

        {/* Hidden inputs for processed images */}
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

        {/* Display selected/processed files */}
        {processedImages.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-medium">
                Added images:
                <span className="ml-2 text-sm text-gray-600"></span>
              </p>
              {processedImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setProcessedImages([]);
                    setPreviews([]);
                    setValidationErrors([]);
                  }}
                  disabled={disabled || isValidating}
                  className="text-[16px] p-2 -m-2 font-normal text-red desktop-small:hover:opacity-80 desktop-small:p-0 desktop-small:m-0"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-3">
              {processedImages.map((item, index) => {
                const processedImage = (item as ProcessedImageResult)
                  .processedImage;
                const fileName =
                  processedImage?.filename || `Image ${index + 1}`;

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
                          className="w-[50px] h-[50px] object-cover rounded"
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
                        onClick={() => removeFile(index)}
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
        )}

        {/* Custom button to trigger file selection */}
        <div
          className={formFileStyles(
            classNames(
              "w-full flex flex-wrap gap-x-5 gap-y-3 items-center justify-between",
              {
                "mt-10": selectedFiles.length !== 0,
              }
            ),
            disabled || isValidating
          )}
        >
          <div className="flex items-center w-full justify-between gap-3">
            <ButtonType
              type="button"
              onClick={triggerFileSelect}
              disabled={
                disabled ||
                isValidating ||
                (maxFiles !== undefined && processedImages.length >= maxFiles)
              }
              cssClasses="w-full min-[600px]:w-auto"
              small
            >
              {isValidating
                ? "Uploading..."
                : processedImages.length === 0
                ? "Choose images"
                : "Add more images"}
            </ButtonType>

            {/* Accordion button for requirements */}
            <button
              type="button"
              onClick={() => setShowRequirements(!showRequirements)}
              className="text-[16px] text-red font-semibold flex items-center gap-2 desktop-small:hover:opacity-80"
            >
              Image requirements
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showRequirements ? "rotate-180" : ""
                }`}
                color="#FF0000"
              />
            </button>
          </div>
          {processedImages.length > 0 && (
            <span className="text-[16px] flex items-center gap-2">
              Total images ({processedImages.length}
              {maxFiles ? `/${maxFiles}` : ""})
            </span>
          )}
        </div>

        {/* Accordion content for file requirements */}
        {showRequirements && (
          <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
            <ul className="list-disc list-inside space-y-1 text-[14px]">
              <li>Accepted formats: JPEG, PNG, WebP, GIF</li>
              <li>Maximum file size: 20MB per file</li>
              <li>At least 2 images required</li>
              {maxFiles && <li>Maximum {maxFiles} files allowed</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInputFileAccumulator;
