"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createVehicle,
  updateVehicle,
  uploadProcessedImagesToStorage,
} from "@/_actions/vehicle-actions";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "@/_lib/validation/vehicle-schema";
import { Vehicle } from "@/_types/vehicle-types";
import BasicVehicleInfoSection from "./form/basic-vehicle-info-section";
import EngineDrivetrainSection from "./form/engine-drivetrain-section";
import ConditionHistorySection from "./form/condition-history-section";
import RegistrationSection from "./form/registration-section";
import ListingDetailsSection from "./form/listing-details-section";
import VehicleMediaSection from "./form/vehicle-media-section";
import ButtonType from "@/_components/ui/buttons/button-type";
import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputFileAccumulator from "@/_components/ui/form/form-input-file-accumulator";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import UnsavedChangesModal from "./unsaved-changes-modal";
import { ProcessedImageResult } from "@/_actions/process-single-image";

interface VehicleFormProps {
  mode: "create" | "edit";
  initialData?: Vehicle;
  vehicleId?: string;
}

interface FormData {
  year: number | string;
  make: string;
  model: string;
  vin: string;
  colour: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  engineCapacity: number | string;
  driveType: string;
  odometer: number | string;
  seats: number | string;
  doors: number | string;
  condition: string;
  serviceHistory: string;
  accidentHistory: string;
  financeOwing: string;
  modifications: string;
  notes: string;
  registrationNumber: string;
  registrationExpiry: string;
  listingType: string;
  price: number | string;
  reservePrice: number | string;
  tenderDeadline: string;
  status: string;
}

const emptyFormData: FormData = {
  year: "",
  make: "",
  model: "",
  vin: "",
  colour: "",
  bodyType: "",
  transmission: "",
  fuelType: "",
  engineCapacity: "",
  driveType: "",
  odometer: "",
  seats: "",
  doors: "",
  condition: "",
  serviceHistory: "",
  accidentHistory: "no",
  financeOwing: "no",
  modifications: "",
  notes: "",
  registrationNumber: "",
  registrationExpiry: "",
  listingType: "",
  price: "",
  reservePrice: "",
  tenderDeadline: "",
  status: "draft",
};

export default function VehicleForm({
  mode,
  initialData,
  vehicleId,
}: VehicleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(
    initialData
      ? {
          year: initialData.year,
          make: initialData.make,
          model: initialData.model,
          vin: initialData.vin,
          colour: initialData.colour,
          bodyType: initialData.bodyType,
          transmission: initialData.transmission,
          fuelType: initialData.fuelType,
          engineCapacity: initialData.engineCapacity,
          driveType: initialData.driveType,
          odometer: initialData.odometer,
          seats: initialData.seats,
          doors: initialData.doors,
          condition: initialData.condition,
          serviceHistory: initialData.serviceHistory,
          accidentHistory: initialData.accidentHistory,
          financeOwing: initialData.financeOwing,
          modifications: initialData.modifications,
          notes: initialData.notes,
          registrationNumber: initialData.registrationNumber,
          registrationExpiry: initialData.registrationExpiry,
          listingType: initialData.listingType,
          price: initialData.price,
          reservePrice: initialData.reservePrice || "",
          tenderDeadline: initialData.tenderDeadline || "",
          status: initialData.status || "",
        }
      : emptyFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processedImages, setProcessedImages] = useState<
    ProcessedImageResult[]
  >([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const getInitialFormData = (): FormData => {
    if (initialData) {
      return {
        year: initialData.year,
        make: initialData.make,
        model: initialData.model,
        vin: initialData.vin,
        colour: initialData.colour,
        bodyType: initialData.bodyType,
        transmission: initialData.transmission,
        fuelType: initialData.fuelType,
        engineCapacity: initialData.engineCapacity,
        driveType: initialData.driveType,
        odometer: initialData.odometer,
        seats: initialData.seats,
        doors: initialData.doors,
        condition: initialData.condition,
        serviceHistory: initialData.serviceHistory,
        accidentHistory: initialData.accidentHistory,
        financeOwing: initialData.financeOwing,
        modifications: initialData.modifications,
        notes: initialData.notes,
        registrationNumber: initialData.registrationNumber,
        registrationExpiry: initialData.registrationExpiry,
        listingType: initialData.listingType,
        price: initialData.price,
        reservePrice: initialData.reservePrice || "",
        tenderDeadline: initialData.tenderDeadline || "",
        status: initialData.status || "",
      };
    }
    return emptyFormData;
  };

  const hasUnsavedChanges = (): boolean => {
    const initial = getInitialFormData();
    return Object.keys(formData).some((key) => {
      const formKey = key as keyof FormData;
      return String(formData[formKey]) !== String(initial[formKey]);
    });
  };

  const handleCancelClick = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChangesModal(true);
    } else {
      router.push("/dealer-portal/vehicles");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const submitForm = async (statusOverride?: "draft" | "active" | "sold") => {
    setIsSubmitting(true);
    setGlobalError(null);
    setErrors({});

    try {
      const submitData: any = {};

      if (formData.year) submitData.year = Number(formData.year);
      submitData.make = formData.make;
      submitData.model = formData.model;
      if (formData.vin) submitData.vin = formData.vin;
      if (formData.colour) submitData.colour = formData.colour;
      if (formData.bodyType) submitData.bodyType = formData.bodyType;
      if (formData.transmission)
        submitData.transmission = formData.transmission;
      if (formData.fuelType) submitData.fuelType = formData.fuelType;
      if (formData.engineCapacity)
        submitData.engineCapacity = Number(formData.engineCapacity);
      if (formData.driveType) submitData.driveType = formData.driveType;
      if (formData.odometer) submitData.odometer = Number(formData.odometer);
      if (formData.seats) submitData.seats = Number(formData.seats);
      if (formData.doors) submitData.doors = Number(formData.doors);
      if (formData.condition) submitData.condition = formData.condition;
      if (formData.serviceHistory)
        submitData.serviceHistory = formData.serviceHistory;
      if (formData.accidentHistory)
        submitData.accidentHistory = formData.accidentHistory;
      if (formData.financeOwing)
        submitData.financeOwing = formData.financeOwing;
      if (formData.modifications)
        submitData.modifications = formData.modifications;
      if (formData.notes) submitData.notes = formData.notes;
      if (formData.registrationNumber)
        submitData.registrationNumber = formData.registrationNumber;
      if (formData.registrationExpiry)
        submitData.registrationExpiry = formData.registrationExpiry;
      submitData.listingType = formData.listingType;
      if (formData.price) submitData.price = Number(formData.price);
      if (formData.reservePrice)
        submitData.reservePrice = Number(formData.reservePrice);
      if (formData.tenderDeadline)
        submitData.tenderDeadline = formData.tenderDeadline;

      submitData.status = (statusOverride || formData.status || "draft") as
        | "draft"
        | "active"
        | "sold";

      let result;
      if (mode === "create") {
        const validationResult = createVehicleSchema.safeParse(submitData);

        if (!validationResult.success) {
          const validationErrors: Record<string, string> = {};
          validationResult.error.issues.forEach((error) => {
            const path = error.path.join(".");
            validationErrors[path] = error.message;
          });
          setErrors(validationErrors);
          setGlobalError("Please check the form for errors and try again.");
          setTimeout(() => {
            errorRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 100);
          return;
        }

        result = await createVehicle(validationResult.data);
      } else if (vehicleId) {
        const validationResult = updateVehicleSchema.safeParse(submitData);

        if (!validationResult.success) {
          const validationErrors: Record<string, string> = {};
          validationResult.error.issues.forEach((error) => {
            const path = error.path.join(".");
            validationErrors[path] = error.message;
          });
          setErrors(validationErrors);
          setGlobalError("Please check the form for errors and try again.");
          setTimeout(() => {
            errorRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 100);
          return;
        }

        result = await updateVehicle(vehicleId, validationResult.data);
      } else {
        setGlobalError("Vehicle ID is required for edit mode.");
        return;
      }

      if (result.success) {
        if (mode === "create" && processedImages.length > 0) {
          const vehicleId = result.data?.id;
          if (vehicleId) {
            const base64Images = processedImages
              .filter((img) => img.processedImage)
              .map((img) => img.processedImage!.contentBase64);
            if (base64Images.length > 0) {
              const uploadResult = await uploadProcessedImagesToStorage(
                vehicleId,
                base64Images
              );

              if (uploadResult.success && uploadResult.data) {
                const storagePaths = uploadResult.data.map(
                  (filename) => `vehicles/${vehicleId}/${filename}`
                );
                await updateVehicle(vehicleId, {
                  images: storagePaths,
                  primaryImage: storagePaths[0],
                });
              } else {
                console.error("Image upload error:", uploadResult.error);
              }
            }
          }
        }

        const isDraft =
          statusOverride === "draft" ||
          (!statusOverride && formData.status === "draft");
        setSuccessMessage(
          mode === "create"
            ? "Vehicle created successfully! Redirecting..."
            : isDraft
            ? "Vehicle saved as draft! Redirecting..."
            : "Vehicle updated successfully! Redirecting..."
        );
        setTimeout(() => {
          router.push("/dealer-portal/vehicles");
          setIsSubmitting(false);
        }, 1500);
      } else {
        setGlobalError(
          result.error || "Failed to save vehicle. Please try again."
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setGlobalError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleId) return;

    try {
      setIsDeleting(true);
      setGlobalError(null);

      const result = await updateVehicle(vehicleId, {
        status: "delisted",
      });

      if (result.success) {
        setSuccessMessage("Vehicle deleted successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dealer-portal/vehicles");
        }, 1500);
      } else {
        setGlobalError(
          result.error || "Failed to delete vehicle. Please try again."
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      setGlobalError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    ...(mode === "edit" ? [{ value: "sold", label: "Sold" }] : []),
  ];

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <FormInputSelect
        id="status"
        name="status"
        label="Vehicle Status"
        options={statusOptions}
        value={formData.status}
        onChange={handleInputChange}
        placeholder=""
        required
        disabled={isSubmitting}
      />

      {globalError && (
        <div
          ref={errorRef}
          className="p-18px bg-red rounded-md border-2 border-red"
        >
          <p className="text-white text-paragraph">{globalError}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-18px bg-blue rounded-md border-2 border-blue">
          <p className="text-white text-paragraph">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10 mt-10">
        <div className="grid gap-10">
          <BasicVehicleInfoSection
            formData={{
              year: formData.year,
              make: formData.make,
              model: formData.model,
              vin: formData.vin,
              colour: formData.colour,
              bodyType: formData.bodyType,
            }}
            onInputChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
          />

          <EngineDrivetrainSection
            formData={{
              transmission: formData.transmission,
              fuelType: formData.fuelType,
              engineCapacity: formData.engineCapacity,
              driveType: formData.driveType,
              odometer: formData.odometer,
              seats: formData.seats,
              doors: formData.doors,
            }}
            onInputChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
          />

          <ConditionHistorySection
            formData={{
              condition: formData.condition,
              serviceHistory: formData.serviceHistory,
              accidentHistory: formData.accidentHistory,
              financeOwing: formData.financeOwing,
              modifications: formData.modifications,
              notes: formData.notes,
            }}
            onInputChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-10 tablet:gap-[44px]">
          <RegistrationSection
            formData={{
              registrationNumber: formData.registrationNumber,
              registrationExpiry: formData.registrationExpiry,
            }}
            onInputChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
          />

          <ListingDetailsSection
            formData={{
              listingType: formData.listingType,
              price: formData.price,
              reservePrice: formData.reservePrice,
              tenderDeadline: formData.tenderDeadline,
            }}
            onInputChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
          />

          {mode === "create" ? (
            <FormInputFileAccumulator
              id="vehicle-images"
              name="vehicle-images"
              label="Vehicle Images"
              description="Upload images of the vehicle (optional)"
              accept="image/*"
              maxFiles={10}
              onProcessedImagesChange={setProcessedImages}
              disabled={isSubmitting}
            />
          ) : vehicleId ? (
            <VehicleMediaSection
              vehicleId={vehicleId}
              errors={errors}
              disabled={isSubmitting}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col tablet:flex-row gap-5 pt-10">
        <ButtonType
          type="submit"
          cssClasses="bg-blue text-white"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {mode === "create"
            ? `Create Vehicle - As ${formData.status?.charAt(0).toUpperCase()}${
                formData.status?.slice(1) || "Draft"
              }`
            : `Update Vehicle - As ${formData.status?.charAt(0).toUpperCase()}${
                formData.status?.slice(1) || "Draft"
              }`}
        </ButtonType>

        <ButtonType
          type="button"
          onClick={handleCancelClick}
          whiteButton
          disabled={isSubmitting}
        >
          Cancel
        </ButtonType>

        {mode === "edit" && (
          <ButtonType
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            cssClasses="bg-red/75"
            disabled={isSubmitting || isDeleting}
          >
            Delete Vehicle
          </ButtonType>
        )}
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          title="Delete Vehicle"
          description="Are you sure you want to delete this vehicle? This action cannot be undone."
          itemName={`${formData.year || "Unknown"} ${
            formData.make || "Unknown"
          } ${formData.model || "Unknown"}`}
          isLoading={isDeleting}
          onConfirm={handleDeleteVehicle}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showUnsavedChangesModal && (
        <UnsavedChangesModal
          onConfirm={() => router.push("/dealer-portal/vehicles")}
          onCancel={() => setShowUnsavedChangesModal(false)}
        />
      )}
    </form>
  );
}
