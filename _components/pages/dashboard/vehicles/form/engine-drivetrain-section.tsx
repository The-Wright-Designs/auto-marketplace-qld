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
    odometerUnit: string;
    seats: number | string;
    doors: number | string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors?: Record<string, string>;
}

export default function EngineDrivetrainSection({
  formData,
  onInputChange,
  errors,
}: EngineDrivetrainSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Engine & Drivetrain
      </h3>
      <div className="space-y-5 desktop-small:space-y-3">
        <FormInputSelect
          id="transmission"
          name="transmission"
          options={[
            { value: "", label: "Select Transmission" },
            { value: "manual", label: "Manual" },
            { value: "automatic", label: "Automatic" },
            { value: "cvt", label: "CVT" },
          ]}
          required
          label="Transmission"
          labelClassName="visually-hidden"
          value={formData.transmission}
          onChange={onInputChange}
        />
        {errors?.transmission && (
          <p className="text-red text-paragraph">{errors.transmission}</p>
        )}

        <FormInputSelect
          id="fuelType"
          name="fuelType"
          options={[
            { value: "", label: "Select Fuel Type" },
            { value: "petrol", label: "Petrol" },
            { value: "diesel", label: "Diesel" },
            { value: "hybrid", label: "Hybrid" },
            { value: "electric", label: "Electric" },
            { value: "lpg", label: "LPG" },
          ]}
          required
          label="Fuel Type"
          labelClassName="visually-hidden"
          value={formData.fuelType}
          onChange={onInputChange}
        />
        {errors?.fuelType && (
          <p className="text-red text-paragraph">{errors.fuelType}</p>
        )}

        <FormInputNumber
          id="engineCapacity"
          name="engineCapacity"
          placeholder="Engine Capacity (L)"
          required
          label="Engine Capacity"
          labelClassName="visually-hidden"
          min={0}
          step={0.1}
          value={formData.engineCapacity}
          onChange={onInputChange}
        />
        {errors?.engineCapacity && (
          <p className="text-red text-paragraph">{errors.engineCapacity}</p>
        )}

        <FormInputSelect
          id="driveType"
          name="driveType"
          options={[
            { value: "", label: "Select Drive Type" },
            { value: "2WD", label: "2WD" },
            { value: "4WD", label: "4WD" },
            { value: "AWD", label: "AWD" },
          ]}
          required
          label="Drive Type"
          labelClassName="visually-hidden"
          value={formData.driveType}
          onChange={onInputChange}
        />
        {errors?.driveType && (
          <p className="text-red text-paragraph">{errors.driveType}</p>
        )}

        <FormInputNumber
          id="odometer"
          name="odometer"
          placeholder="Odometer Reading"
          required
          label="Odometer"
          labelClassName="visually-hidden"
          min={0}
          value={formData.odometer}
          onChange={onInputChange}
        />
        {errors?.odometer && (
          <p className="text-red text-paragraph">{errors.odometer}</p>
        )}

        <FormInputSelect
          id="odometerUnit"
          name="odometerUnit"
          options={[
            { value: "km", label: "Kilometers" },
            { value: "mi", label: "Miles" },
          ]}
          required
          label="Odometer Unit"
          labelClassName="visually-hidden"
          value={formData.odometerUnit}
          onChange={onInputChange}
        />
        {errors?.odometerUnit && (
          <p className="text-red text-paragraph">{errors.odometerUnit}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FormInputNumber
              id="seats"
              name="seats"
              placeholder="Seats"
              required
              label="Seats"
              labelClassName="visually-hidden"
              min={1}
              max={10}
              value={formData.seats}
              onChange={onInputChange}
            />
            {errors?.seats && (
              <p className="text-red text-paragraph">{errors.seats}</p>
            )}
          </div>

          <div>
            <FormInputNumber
              id="doors"
              name="doors"
              placeholder="Doors"
              required
              label="Doors"
              labelClassName="visually-hidden"
              min={1}
              max={6}
              value={formData.doors}
              onChange={onInputChange}
            />
            {errors?.doors && (
              <p className="text-red text-paragraph">{errors.doors}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
