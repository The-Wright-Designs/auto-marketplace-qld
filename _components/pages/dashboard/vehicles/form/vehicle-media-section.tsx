"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import {
  uploadSingleVehicleImage,
  deleteVehicleImage,
  reorderVehicleImages,
  setPrimaryVehicleImage,
  getVehicleImagesWithUrls,
  deleteAllVehicleImages,
} from "@/_actions/vehicle-actions";
import { processSingleImage } from "@/_actions/process-single-image";
import UploadControls from "@/_components/ui/form/form-input-file-components/upload-controls";

interface VehicleMediaSectionProps {
  vehicleId: string;
  errors?: Record<string, string>;
  disabled?: boolean;
}

interface DisplayImage {
  filename: string;
  url: string;
  isUploading?: boolean;
}

export default function VehicleMediaSection({
  vehicleId,
  errors,
  disabled = false,
}: VehicleMediaSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [settingPrimaryImageId, setSettingPrimaryImageId] = useState<
    string | null
  >(null);
  const [globalError, setGlobalError] = useState<string>("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);
  const [touchCurrentIndex, setTouchCurrentIndex] = useState<number | null>(null);
  const imageRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());

  const fetchImages = useCallback(async () => {
    try {
      const result = await getVehicleImagesWithUrls(vehicleId);
      if (result.success && result.data) {
        setDisplayImages(result.data.images);
        setPrimaryImage(result.data.primaryImage);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxFiles = 10;
    const totalImages = displayImages.length;
    const availableSlots = maxFiles - totalImages;

    if (availableSlots <= 0) {
      setGlobalError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    setGlobalError("");

    for (const file of filesToProcess) {
      const uploadId = `${Date.now()}-${Math.random()}`;
      const placeholderId = uploadId;

      setDisplayImages((prev) => [
        ...prev,
        {
          filename: placeholderId,
          url: "",
          isUploading: true,
        },
      ]);

      try {
        const processResult = await processSingleImage(
          file,
          "vehicle-media-upload"
        );

        if (!processResult.success) {
          setGlobalError(processResult.error || "Failed to process image");
          setDisplayImages((prev) =>
            prev.filter((img) => img.filename !== placeholderId)
          );
          continue;
        }

        const uploadResult = await uploadSingleVehicleImage(
          vehicleId,
          processResult.processedImage?.contentBase64 || ""
        );

        if (!uploadResult.success) {
          setGlobalError(uploadResult.error || "Failed to upload image");
          setDisplayImages((prev) =>
            prev.filter((img) => img.filename !== placeholderId)
          );
          continue;
        }

        await fetchImages();
      } catch (error) {
        console.error("Upload error:", error);
        setGlobalError(
          error instanceof Error ? error.message : "Upload failed"
        );
        setDisplayImages((prev) =>
          prev.filter((img) => img.filename !== placeholderId)
        );
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = async (filename: string) => {
    if (deleteConfirmId === filename) {
      setDeletingImageId(filename);
      setIsDeleting(true);
      try {
        const result = await deleteVehicleImage(vehicleId, filename);
        if (result.success) {
          setDeleteConfirmId(null);
          await fetchImages();
        } else {
          setGlobalError(result.error || "Failed to delete image");
        }
      } catch (error) {
        setGlobalError(
          error instanceof Error ? error.message : "Delete failed"
        );
      } finally {
        setIsDeleting(false);
        setDeletingImageId(null);
      }
    } else {
      setDeleteConfirmId(filename);
    }
  };

  const handlePrimaryImageClick = async (filename: string) => {
    setSettingPrimaryImageId(filename);
    try {
      const result = await setPrimaryVehicleImage(vehicleId, filename);
      if (result.success) {
        setPrimaryImage(filename);
      } else {
        setGlobalError(result.error || "Failed to set primary image");
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSettingPrimaryImageId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...displayImages];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    setDisplayImages(newOrder);
    const storagePaths = newOrder.map((img) => img.filename);

    setIsReordering(true);
    try {
      const result = await reorderVehicleImages(vehicleId, storagePaths);
      if (!result.success) {
        setGlobalError(result.error || "Failed to reorder images");
        await fetchImages();
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Reorder failed");
      await fetchImages();
    } finally {
      setDraggedIndex(null);
      setIsReordering(false);
    }
  };

  const getImageIndexFromTouch = (touchY: number): number | null => {
    for (const [index, element] of imageRefsMap.current) {
      const rect = element.getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        return index;
      }
    }
    return null;
  };

  const handleTouchStart = (index: number) => {
    if (isReordering || isDeletingAll || disabled) return;
    setTouchStartIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartIndex === null) return;
    const touch = e.touches[0];
    const hoveredIndex = getImageIndexFromTouch(touch.clientY);
    setTouchCurrentIndex(hoveredIndex);
  };

  const handleTouchEnd = async () => {
    if (touchStartIndex === null || touchCurrentIndex === null) {
      setTouchStartIndex(null);
      setTouchCurrentIndex(null);
      return;
    }

    if (touchStartIndex === touchCurrentIndex) {
      setTouchStartIndex(null);
      setTouchCurrentIndex(null);
      return;
    }

    const newOrder = [...displayImages];
    const [draggedItem] = newOrder.splice(touchStartIndex, 1);
    newOrder.splice(touchCurrentIndex, 0, draggedItem);

    setDisplayImages(newOrder);
    const storagePaths = newOrder.map((img) => img.filename);

    setTouchStartIndex(null);
    setTouchCurrentIndex(null);
    setIsReordering(true);

    try {
      const result = await reorderVehicleImages(vehicleId, storagePaths);
      if (!result.success) {
        setGlobalError(result.error || "Failed to reorder images");
        await fetchImages();
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Reorder failed");
      await fetchImages();
    } finally {
      setIsReordering(false);
    }
  };

  const handleDeleteAll = async () => {
    if (displayImages.length === 0) return;

    if (!deleteAllConfirm) {
      setDeleteAllConfirm(true);
      return;
    }

    setIsDeletingAll(true);
    setGlobalError("");

    try {
      for (const image of displayImages) {
        setDeletingImageId(image.filename);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const result = await deleteAllVehicleImages(vehicleId);

      if (result.success) {
        await fetchImages();
      } else {
        setGlobalError(result.error || "Failed to delete all images");
      }
    } catch (error) {
      setGlobalError(
        error instanceof Error ? error.message : "Delete all failed"
      );
    } finally {
      setIsDeletingAll(false);
      setDeletingImageId(null);
      setDeleteAllConfirm(false);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Vehicle Media
      </h3>

      {globalError && (
        <div className="p-18px bg-red rounded border-2 border-red">
          <p className="text-white text-paragraph">{globalError}</p>
        </div>
      )}

      {errors?.images && (
        <p className="text-red text-paragraph">{errors.images}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={displayImages.length >= 10 || disabled}
      />

      <UploadControls
        maxFiles={10}
        processedImagesCount={displayImages.length}
        isValidating={displayImages.some((img) => img.isUploading) || false}
        disabled={displayImages.length >= 10 || disabled}
        onSelectFiles={() => fileInputRef.current?.click()}
        onDeleteAll={handleDeleteAll}
        isDeletingAll={isDeletingAll}
        deleteAllConfirm={deleteAllConfirm}
      />

      {isLoadingImages && displayImages.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner"></div>
        </div>
      ) : null}

      {displayImages.length > 0 && (
        <div
          className={classNames(
            "grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 relative",
            {
              "opacity-50 pointer-events-none": isReordering || isDeletingAll || disabled,
            }
          )}
        >
          {isReordering && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          )}
          {displayImages.map((image, index) => (
            <div
              key={`${image.filename}-${index}`}
              ref={(el) => {
                if (el) {
                  imageRefsMap.current.set(index, el);
                } else {
                  imageRefsMap.current.delete(index);
                }
              }}
              draggable={!isReordering && !isDeletingAll && !disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onTouchStart={() => handleTouchStart(index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={classNames(
                "relative cursor-move group transition-opacity",
                {
                  "opacity-50": draggedIndex === index || touchStartIndex === index,
                  "border-2 border-yellow":
                    (dragOverIndex === index && draggedIndex !== index) ||
                    (touchCurrentIndex === index && touchStartIndex !== index),
                }
              )}
            >
              <div
                className={classNames(
                  "relative overflow-hidden rounded-md border-2 transition-all",
                  {
                    "border-blue shadow-md": primaryImage === image.filename,
                    "border-grey hover:border-blue":
                      primaryImage !== image.filename,
                  }
                )}
              >
                {image.isUploading ? (
                  <div className="w-full h-[150px] bg-gray-200 flex items-center justify-center">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <Image
                    src={image.url}
                    alt={`Vehicle image ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-[150px] object-cover"
                    unoptimized
                  />
                )}

                <button
                  type="button"
                  onClick={() => handlePrimaryImageClick(image.filename)}
                  disabled={
                    settingPrimaryImageId === image.filename ||
                    image.isUploading ||
                    isDeletingAll ||
                    disabled
                  }
                  className={classNames(
                    "absolute bottom-2 right-2 rounded-full w-8 h-8 flex items-center justify-center transition-all",
                    {
                      "bg-yellow":
                        primaryImage === image.filename && !image.isUploading,
                      "bg-white":
                        primaryImage !== image.filename && !image.isUploading,
                      hidden: image.isUploading,
                    }
                  )}
                >
                  <svg
                    className="w-5 h-5"
                    fill={primaryImage === image.filename ? "#FFFD01" : "none"}
                    stroke="#13103F"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>

                {settingPrimaryImageId === image.filename && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                    <div className="spinner"></div>
                  </div>
                )}

                {deletingImageId === image.filename && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                    <div className="spinner"></div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClick(image.filename);
                  }}
                  disabled={isDeleting || image.isUploading || isDeletingAll || disabled}
                  className={classNames(
                    "absolute top-2 left-2 transition-all",
                    {
                      "bg-red text-white px-2 py-1 rounded text-[12px] font-bold":
                        deleteConfirmId === image.filename &&
                        !image.isUploading,
                      "bg-red text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-grey":
                        deleteConfirmId !== image.filename &&
                        !image.isUploading,
                      hidden: image.isUploading,
                    }
                  )}
                >
                  {deleteConfirmId === image.filename ? (
                    "Confirm"
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
