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
    >
  ) => void;
  errors?: Record<string, string>;
}

export default function BasicVehicleInfoSection({
  formData,
  onInputChange,
  errors,
}: BasicVehicleInfoSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Basic Vehicle Information
      </h3>
      <div className="space-y-5 desktop-small:space-y-3">
        <FormInputNumber
          id="year"
          name="year"
          placeholder="Year"
          required
          label="Year"
          labelClassName="visually-hidden"
          min={1900}
          max={new Date().getFullYear() + 1}
          value={formData.year}
          onChange={onInputChange}
        />
        {errors?.year && (
          <p className="text-red text-paragraph">{errors.year}</p>
        )}

        <FormInputText
          id="make"
          name="make"
          placeholder="Make"
          required
          label="Make"
          labelClassName="visually-hidden"
          value={formData.make}
          onChange={onInputChange}
        />
        {errors?.make && (
          <p className="text-red text-paragraph">{errors.make}</p>
        )}

        <FormInputText
          id="model"
          name="model"
          placeholder="Model"
          required
          label="Model"
          labelClassName="visually-hidden"
          value={formData.model}
          onChange={onInputChange}
        />
        {errors?.model && (
          <p className="text-red text-paragraph">{errors.model}</p>
        )}

        <FormInputText
          id="vin"
          name="vin"
          placeholder="VIN"
          required
          label="VIN"
          labelClassName="visually-hidden"
          value={formData.vin}
          onChange={onInputChange}
        />
        {errors?.vin && (
          <p className="text-red text-paragraph">{errors.vin}</p>
        )}

        <FormInputText
          id="colour"
          name="colour"
          placeholder="Colour"
          required
          label="Colour"
          labelClassName="visually-hidden"
          value={formData.colour}
          onChange={onInputChange}
        />
        {errors?.colour && (
          <p className="text-red text-paragraph">{errors.colour}</p>
        )}

        <FormInputText
          id="bodyType"
          name="bodyType"
          placeholder="Body Type"
          required
          label="Body Type"
          labelClassName="visually-hidden"
          value={formData.bodyType}
          onChange={onInputChange}
        />
        {errors?.bodyType && (
          <p className="text-red text-paragraph">{errors.bodyType}</p>
        )}
      </div>
    </div>
  );
}
