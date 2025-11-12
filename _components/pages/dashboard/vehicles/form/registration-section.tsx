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
}

export default function RegistrationSection({
  formData,
  onInputChange,
  errors,
}: RegistrationSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Registration
      </h3>
      <div className="space-y-5 desktop-small:space-y-3">
        <FormInputText
          id="registrationNumber"
          name="registrationNumber"
          placeholder="Registration Number"
          required
          label="Registration Number"
          labelClassName="visually-hidden"
          value={formData.registrationNumber}
          onChange={onInputChange}
        />
        {errors?.registrationNumber && (
          <p className="text-red text-paragraph">
            {errors.registrationNumber}
          </p>
        )}

        <FormInputText
          id="registrationExpiry"
          name="registrationExpiry"
          type="date"
          placeholder="Registration Expiry"
          required
          label="Registration Expiry"
          labelClassName="visually-hidden"
          value={formData.registrationExpiry}
          onChange={onInputChange}
        />
        {errors?.registrationExpiry && (
          <p className="text-red text-paragraph">
            {errors.registrationExpiry}
          </p>
        )}
      </div>
    </div>
  );
}
