"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createVehicle,
  updateVehicle,
} from "@/_actions/vehicle-actions";
import { createVehicleSchema, updateVehicleSchema } from "@/_lib/validation/vehicle-schema";
import { Vehicle } from "@/_types/vehicle-types";
import BasicVehicleInfoSection from "./form/basic-vehicle-info-section";
import EngineDrivetrainSection from "./form/engine-drivetrain-section";
import ConditionHistorySection from "./form/condition-history-section";
import RegistrationSection from "./form/registration-section";
import ListingDetailsSection from "./form/listing-details-section";
import VehicleMediaSection from "./form/vehicle-media-section";
import ButtonType from "@/_components/ui/buttons/button-type";

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
  odometerUnit: string;
  seats: number | string;
  doors: number | string;
  condition: string;
  serviceHistory: string;
  accidentHistory: string;
  modifications: string;
  notes: string;
  registrationNumber: string;
  registrationExpiry: string;
  listingType: string;
  price: number | string;
  reservePrice: number | string;
  tenderDeadline: string;
  images: string[];
  primaryImage: string;
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
  odometerUnit: "km",
  seats: "",
  doors: "",
  condition: "",
  serviceHistory: "",
  accidentHistory: "",
  modifications: "",
  notes: "",
  registrationNumber: "",
  registrationExpiry: "",
  listingType: "",
  price: "",
  reservePrice: "",
  tenderDeadline: "",
  images: [],
  primaryImage: "",
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
          odometerUnit: initialData.odometerUnit,
          seats: initialData.seats,
          doors: initialData.doors,
          condition: initialData.condition,
          serviceHistory: initialData.serviceHistory,
          accidentHistory: initialData.accidentHistory,
          modifications: initialData.modifications,
          notes: initialData.notes,
          registrationNumber: initialData.registrationNumber,
          registrationExpiry: initialData.registrationExpiry,
          listingType: initialData.listingType,
          price: initialData.price,
          reservePrice: initialData.reservePrice || "",
          tenderDeadline: initialData.tenderDeadline || "",
          images: initialData.media?.images || [],
          primaryImage: initialData.media?.primaryImage || "",
        }
      : emptyFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);
    setErrors({});

    try {
      setIsSubmitting(true);

      const submitData = {
        year: Number(formData.year),
        make: formData.make,
        model: formData.model,
        vin: formData.vin,
        colour: formData.colour,
        bodyType: formData.bodyType,
        transmission: formData.transmission as
          | "manual"
          | "automatic"
          | "cvt",
        fuelType: formData.fuelType as
          | "petrol"
          | "diesel"
          | "hybrid"
          | "electric"
          | "lpg",
        engineCapacity: Number(formData.engineCapacity),
        driveType: formData.driveType as "2WD" | "4WD" | "AWD",
        odometer: Number(formData.odometer),
        odometerUnit: formData.odometerUnit as "km" | "mi",
        seats: Number(formData.seats),
        doors: Number(formData.doors),
        condition: formData.condition as
          | "excellent"
          | "good"
          | "fair"
          | "poor",
        serviceHistory: formData.serviceHistory,
        accidentHistory: formData.accidentHistory,
        modifications: formData.modifications,
        notes: formData.notes,
        registrationNumber: formData.registrationNumber,
        registrationExpiry: formData.registrationExpiry,
        listingType: formData.listingType as "tender" | "buy-now",
        price: Number(formData.price),
        reservePrice: formData.reservePrice
          ? Number(formData.reservePrice)
          : undefined,
        tenderDeadline: formData.tenderDeadline || undefined,
        images: formData.images,
        primaryImage: formData.primaryImage,
      };

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
          return;
        }

        result = await updateVehicle(vehicleId, validationResult.data);
      } else {
        setGlobalError("Vehicle ID is required for edit mode.");
        return;
      }

      if (result.success) {
        setSuccessMessage(
          mode === "create"
            ? "Vehicle created successfully! Redirecting..."
            : "Vehicle updated successfully! Redirecting..."
        );
        setTimeout(() => {
          router.push("/dealer-portal/vehicles");
        }, 1500);
      } else {
        setGlobalError(
          result.error || "Failed to save vehicle. Please try again."
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setGlobalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {globalError && (
        <div className="p-18px bg-red rounded border-2 border-red">
          <p className="text-white text-paragraph">{globalError}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-18px bg-blue rounded border-2 border-blue">
          <p className="text-white text-paragraph">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10">
        <div className="space-y-10">
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
          />

          <EngineDrivetrainSection
            formData={{
              transmission: formData.transmission,
              fuelType: formData.fuelType,
              engineCapacity: formData.engineCapacity,
              driveType: formData.driveType,
              odometer: formData.odometer,
              odometerUnit: formData.odometerUnit,
              seats: formData.seats,
              doors: formData.doors,
            }}
            onInputChange={handleInputChange}
            errors={errors}
          />

          <ConditionHistorySection
            formData={{
              condition: formData.condition,
              serviceHistory: formData.serviceHistory,
              accidentHistory: formData.accidentHistory,
              modifications: formData.modifications,
              notes: formData.notes,
            }}
            onInputChange={handleInputChange}
            errors={errors}
          />
        </div>

        <div className="space-y-10">
          <RegistrationSection
            formData={{
              registrationNumber: formData.registrationNumber,
              registrationExpiry: formData.registrationExpiry,
            }}
            onInputChange={handleInputChange}
            errors={errors}
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
          />

          <VehicleMediaSection
            formData={{
              images: formData.images,
              primaryImage: formData.primaryImage,
            }}
            errors={errors}
          />
        </div>
      </div>

      <div className="flex gap-5 pt-10">
        <ButtonType
          type="submit"
          disabled={isSubmitting}
          cssClasses="bg-blue text-white"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Vehicle"
              : "Update Vehicle"}
        </ButtonType>

        <ButtonType
          type="button"
          onClick={() => router.push("/dealer-portal/vehicles")}
          cssClasses="bg-grey text-white"
          disabled={isSubmitting}
        >
          Cancel
        </ButtonType>
      </div>
    </form>
  );
}
