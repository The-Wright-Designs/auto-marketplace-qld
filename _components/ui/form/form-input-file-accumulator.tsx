"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { formLabelStyles, formFileStyles } from "@/_styles/form-input-styles";
import { FormInputFileProps } from "@/_types/form-types";
import ButtonType from "@/_components/ui/buttons/button-type";
import Image from "next/image";
import classNames from "classnames";
import { FileValidator } from "@/_lib/utils/file-validator";

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
}: FormInputFileProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsValidating(true);
    setValidationErrors([]);
    setUploadProgress({});

    const newFiles = Array.from(files);
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

      // Update progress
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: Math.round(((i + 1) / newFiles.length) * 50), // 50% for validation
      }));

      const validation = await FileValidator.validateFile(file);
      if (validation.isValid && validation.sanitizedFile) {
        validatedFiles.push(validation.sanitizedFile);

        // Complete progress for this file
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100,
        }));
      } else {
        errors.push(`${file.name}: ${validation.error}`);

        // Mark as failed
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: -1,
        }));
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

    // Clear progress after a delay
    setTimeout(() => {
      setUploadProgress({});
    }, 2000);

    // Reset the input value so the same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
    if (hiddenFileInputRef.current && selectedFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach((file) => dataTransfer.items.add(file));
      hiddenFileInputRef.current.files = dataTransfer.files;
    }
  }, [selectedFiles]);

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
          <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <h4 className="text-red-600 font-semibold">
                File Validation Errors:
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
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-md p-3">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="font-medium">Validating files...</span>
            </div>
          </div>
        )}

        {/* Upload progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="bg-gray-50 rounded-md p-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="truncate max-w-[200px]">{fileName}</span>
                  <div className="flex items-center gap-1">
                    {progress === 100 && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {progress === -1 && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    {progress > 0 && progress < 100 && <span>{progress}%</span>}
                  </div>
                </div>
                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
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
          required={required}
          className="hidden"
        />

        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-medium">
                Selected files:
                <span className="ml-2 text-sm text-gray-600">
                  (
                  {FileValidator.getFileSizeString(
                    selectedFiles.reduce((total, file) => total + file.size, 0)
                  )}{" "}
                  total)
                </span>
              </p>
              {selectedFiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles([]);
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
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded"
                >
                  <div className="flex items-center space-x-3">
                    {previews[index] && FileValidator.isImageFile(file) && (
                      <Image
                        src={previews[index]}
                        alt={`Preview of ${file.name}`}
                        width={50}
                        height={50}
                        className="w-[50px] h-[50px] object-cover rounded"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium truncate max-w-[125px] phone:max-w-[200px] min-[600px]:max-w-full">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {FileValidator.getFileSizeString(file.size)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
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
              ))}
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
          <ButtonType
            type="button"
            onClick={triggerFileSelect}
            disabled={
              disabled ||
              isValidating ||
              (maxFiles !== undefined && selectedFiles.length >= maxFiles)
            }
            cssClasses="w-full min-[600px]:w-auto"
            small
          >
            {isValidating
              ? "Validating..."
              : selectedFiles.length === 0
              ? "Choose Files"
              : "Add More Files"}
          </ButtonType>
          {selectedFiles.length > 0 && (
            <span className="text-[16px] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Total images ({selectedFiles.length}
              {maxFiles ? `/${maxFiles}` : ""})
            </span>
          )}
        </div>

        {/* File requirements info */}
        <div>
          <h5 className="text-[16px] font-semibold mb-1">File Requirements:</h5>
          <ul className="list-disc list-inside space-y-1 text-[14px]">
            <li>Accepted formats: JPEG, PNG, WebP, GIF</li>
            <li>Maximum file size: 2MB per file</li>
            <li>Maximum total size: 20MB</li>
            <li>At least 2 images required</li>
            {maxFiles && <li>Maximum {maxFiles} files allowed</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormInputFileAccumulator;
