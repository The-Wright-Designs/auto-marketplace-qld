"use client";

import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputNumber from "@/_components/ui/form/form-input-number";

interface BasicVehicleInfoSectionProps {
  formData: {
    year: number | string;
    make: string;
    model: string;
    vin: string;
    colour: string;
    bodyType: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function BasicVehicleInfoSection({
  formData,
  onInputChange,
  errors,
  disabled = false,
}: BasicVehicleInfoSectionProps) {
  return (
    <div className="grid gap-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Basic Vehicle Information
      </h3>
      <div className="grid gap-5 desktop-small:gap-3">
        <FormInputNumber
          id="year"
          name="year"
          placeholder="Year"
          label="Year"
          min={1900}
          max={new Date().getFullYear() + 1}
          value={formData.year}
          onChange={onInputChange}
          error={errors?.year}
          disabled={disabled}
        />
        {errors?.year && (
          <p className="text-red text-[16px] -mt-2">{errors.year}</p>
        )}

        <FormInputText
          id="make"
          name="make"
          placeholder="Make"
          label="Make"
          value={formData.make}
          onChange={onInputChange}
          error={errors?.make}
          disabled={disabled}
        />
        {errors?.make && (
          <p className="text-red text-[16px] -mt-2">{errors.make}</p>
        )}

        <FormInputText
          id="model"
          name="model"
          placeholder="Model"
          label="Model"
          value={formData.model}
          onChange={onInputChange}
          error={errors?.model}
          disabled={disabled}
        />
        {errors?.model && (
          <p className="text-red text-[16px] -mt-2">{errors.model}</p>
        )}

        <FormInputText
          id="vin"
          name="vin"
          placeholder="VIN"
          label="VIN"
          value={formData.vin}
          onChange={onInputChange}
          error={errors?.vin}
          disabled={disabled}
        />
        {errors?.vin && (
          <p className="text-red text-[16px] -mt-2">{errors.vin}</p>
        )}

        <FormInputText
          id="colour"
          name="colour"
          placeholder="Colour"
          label="Colour"
          value={formData.colour}
          onChange={onInputChange}
          error={errors?.colour}
          disabled={disabled}
        />
        {errors?.colour && (
          <p className="text-red text-[16px] -mt-2">{errors.colour}</p>
        )}

        <FormInputText
          id="bodyType"
          name="bodyType"
          placeholder="Body Type"
          label="Body Type"
          value={formData.bodyType}
          onChange={onInputChange}
          error={errors?.bodyType}
          disabled={disabled}
        />
        {errors?.bodyType && (
          <p className="text-red text-[16px] -mt-2">{errors.bodyType}</p>
        )}
      </div>
    </div>
  );
}
