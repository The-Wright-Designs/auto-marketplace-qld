"use client";

import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputNumber from "@/_components/ui/form/form-input-number";

interface EngineDrivetrainSectionProps {
  formData: {
    transmission: string;
    fuelType: string;
    engineCapacity: number | string;
    driveType: string;
    odometer: number | string;
    seats: number | string;
    doors: number | string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function EngineDrivetrainSection({
  formData,
  onInputChange,
  errors,
  disabled = false,
}: EngineDrivetrainSectionProps) {
  return (
    <div className="grid gap-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Engine & Drivetrain
      </h3>
      <div className="grid gap-5 desktop-small:gap-3">
        <FormInputSelect
          id="transmission"
          name="transmission"
          options={[
            { value: "manual", label: "Manual" },
            { value: "automatic", label: "Automatic" },
            { value: "cvt", label: "CVT" },
          ]}
          label="Transmission"
          value={formData.transmission}
          onChange={onInputChange}
          error={errors?.transmission}
          disabled={disabled}
        />
        {errors?.transmission && (
          <p className="text-red text-[16px] -mt-2">{errors.transmission}</p>
        )}

        <FormInputSelect
          id="fuelType"
          name="fuelType"
          options={[
            { value: "petrol", label: "Petrol" },
            { value: "diesel", label: "Diesel" },
            { value: "hybrid", label: "Hybrid" },
            { value: "electric", label: "Electric" },
            { value: "lpg", label: "LPG" },
          ]}
          label="Fuel Type"
          value={formData.fuelType}
          onChange={onInputChange}
          error={errors?.fuelType}
          disabled={disabled}
        />
        {errors?.fuelType && (
          <p className="text-red text-[16px] -mt-2">{errors.fuelType}</p>
        )}

        <FormInputNumber
          id="engineCapacity"
          name="engineCapacity"
          placeholder="Engine Capacity (L)"
          label="Engine Capacity"
          min={0}
          step={0.1}
          value={formData.engineCapacity}
          onChange={onInputChange}
          error={errors?.engineCapacity}
          disabled={disabled}
        />
        {errors?.engineCapacity && (
          <p className="text-red text-[16px] -mt-2">{errors.engineCapacity}</p>
        )}

        <FormInputSelect
          id="driveType"
          name="driveType"
          options={[
            { value: "2WD", label: "2WD" },
            { value: "4WD", label: "4WD" },
            { value: "AWD", label: "AWD" },
          ]}
          label="Drive Type"
          value={formData.driveType}
          onChange={onInputChange}
          error={errors?.driveType}
          disabled={disabled}
        />
        {errors?.driveType && (
          <p className="text-red text-[16px] -mt-2">{errors.driveType}</p>
        )}

        <FormInputNumber
          id="odometer"
          name="odometer"
          placeholder="Odometer Reading"
          label="Odometer"
          min={0}
          value={formData.odometer}
          onChange={onInputChange}
          error={errors?.odometer}
          disabled={disabled}
        />
        {errors?.odometer && (
          <p className="text-red text-[16px] -mt-2">{errors.odometer}</p>
        )}

        <div className="grid gap-5 phone:grid-cols-2 phone:gap-3">
          <div className="grid gap-5 phone:gap-3">
            <FormInputNumber
              id="seats"
              name="seats"
              placeholder="Seats"
              label="Seats"
              min={1}
              max={10}
              value={formData.seats}
              onChange={onInputChange}
              error={errors?.seats}
              disabled={disabled}
            />
            {errors?.seats && (
              <p className="text-red text-[16px] -mt-2">{errors.seats}</p>
            )}
          </div>

          <div className="grid gap-5 phone:gap-3">
            <FormInputNumber
              id="doors"
              name="doors"
              placeholder="Doors"
              label="Doors"
              min={1}
              max={6}
              value={formData.doors}
              onChange={onInputChange}
              error={errors?.doors}
              disabled={disabled}
            />
            {errors?.doors && (
              <p className="text-red text-[16px] -mt-2">{errors.doors}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
