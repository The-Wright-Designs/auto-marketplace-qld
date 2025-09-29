import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FileValidator } from "@/_lib/utils/file-validator";
import {
  processSingleImage,
  ProcessedImageResult,
} from "@/_actions/process-single-image";
import { generateSecureSessionId } from "@/_actions/generate-session-id";

interface UseFileUploadProps {
  maxFiles?: number;
  onImageCountChange?: (count: number) => void;
}

interface FailedFile {
  file: File;
  error: string;
}

export const useFileUpload = ({ maxFiles, onImageCountChange }: UseFileUploadProps = {}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImageResult[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [failedFiles, setFailedFiles] = useState<FailedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    if (!sessionId) {
      const sessionResult = await generateSecureSessionId();
      if (sessionResult.success && sessionResult.sessionId) {
        setSessionId(sessionResult.sessionId);
      } else {
        setValidationErrors([
          sessionResult.error || "Failed to initialize upload session",
        ]);
        return;
      }
    }

    await processFilesProgressively(newFiles);
  };

  const processFilesProgressively = async (newFiles: File[]) => {
    setIsValidating(true);
    setValidationErrors([]);

    const errors: string[] = [];

    if (maxFiles && selectedFiles.length + newFiles.length > maxFiles) {
      errors.push(
        `Maximum ${maxFiles} files allowed. You currently have ${selectedFiles.length} files.`
      );
      setValidationErrors(errors);
      setIsValidating(false);
      return;
    }

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      try {
        const result = await processSingleImage(file, sessionId);

        if (result.success && result.processedImage) {
          setProcessedImages((prev) => [...prev, result]);

          if (FileValidator.isImageFile(file)) {
            const preview = URL.createObjectURL(file);
            setPreviews((prev) => [...prev, preview]);
          }
        } else {
          setFailedFiles((prev) => [
            ...prev,
            {
              file,
              error: result.error || "Upload failed",
            },
          ]);
          errors.push(`${file.name}: ${result.error}`);
        }
      } catch (error) {
        setFailedFiles((prev) => [
          ...prev,
          {
            file,
            error: "Upload failed. Please try again or choose a different image.",
          },
        ]);
        errors.push(
          `${file.name}: Upload failed. Please try again or choose a different image.`
        );
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    setIsValidating(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const retryFileUpload = async (failedFileIndex: number) => {
    const failedFile = failedFiles[failedFileIndex];
    if (!failedFile) return;

    setFailedFiles((prev) => prev.filter((_, i) => i !== failedFileIndex));
    setIsValidating(true);
    setValidationErrors([]);

    try {
      const result = await processSingleImage(failedFile.file, sessionId);

      if (result.success && result.processedImage) {
        setProcessedImages((prev) => [...prev, result]);

        if (FileValidator.isImageFile(failedFile.file)) {
          const preview = URL.createObjectURL(failedFile.file);
          setPreviews((prev) => [...prev, preview]);
        }
      } else {
        setFailedFiles((prev) => [
          ...prev,
          {
            file: failedFile.file,
            error: result.error || "Retry failed",
          },
        ]);
      }
    } catch (error) {
      setFailedFiles((prev) => [
        ...prev,
        {
          file: failedFile.file,
          error: "Retry failed. Please try again.",
        },
      ]);
    }

    setIsValidating(false);
  };

  const removeFile = (index: number) => {
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    setProcessedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFailedFile = (index: number) => {
    setFailedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setProcessedImages([]);
    setPreviews([]);
    setValidationErrors([]);
  };

  const clearAllFailedFiles = () => {
    setFailedFiles([]);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (onImageCountChange) {
      onImageCountChange(processedImages.length);
    }
  }, [processedImages, onImageCountChange]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return {
    fileInputRef,
    selectedFiles,
    previews,
    validationErrors,
    isValidating,
    processedImages,
    sessionId,
    failedFiles,
    handleFileSelect,
    retryFileUpload,
    removeFile,
    removeFailedFile,
    clearAllFiles,
    clearAllFailedFiles,
    triggerFileSelect,
  };
};