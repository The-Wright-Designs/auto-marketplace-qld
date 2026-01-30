"use client";

import FormInputText from "@/_components/ui/form/form-input-text";

interface RegistrationSectionProps {
  formData: {
    registrationNumber: string;
    registrationExpiry: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function RegistrationSection({
  formData,
  onInputChange,
  errors,
  disabled = false,
}: RegistrationSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Registration
      </h3>
      <div className="grid gap-5 desktop-small:gap-3">
        <FormInputText
          id="registrationNumber"
          name="registrationNumber"
          placeholder="Registration Number"
          label="Registration Number"
          value={formData.registrationNumber}
          onChange={onInputChange}
          error={errors?.registrationNumber}
          disabled={disabled}
        />
        {errors?.registrationNumber && (
          <p className="text-red text-[16px] -mt-2">{errors.registrationNumber}</p>
        )}

        <FormInputText
          id="registrationExpiry"
          name="registrationExpiry"
          type="date"
          placeholder="Registration Expiry"
          label="Registration Expiry"
          value={formData.registrationExpiry}
          onChange={onInputChange}
          error={errors?.registrationExpiry}
          disabled={disabled}
        />
        {errors?.registrationExpiry && (
          <p className="text-red text-[16px] -mt-2">{errors.registrationExpiry}</p>
        )}
      </div>
    </div>
  );
}
