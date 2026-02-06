"use client";

import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputCheckbox from "@/_components/ui/form/form-input-checkbox";

interface RegistrationSectionProps {
  formData: {
    registrationNumber: string;
    registrationExpiry: string;
    isUnregistered: boolean;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onUnregisteredChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function RegistrationSection({
  formData,
  onInputChange,
  onUnregisteredChange,
  errors,
  disabled = false,
}: RegistrationSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
        <h3 className="text-blue font-bold text-paragraph-desktop">
          Registration
        </h3>
        <FormInputCheckbox
          id="isUnregistered"
          name="isUnregistered"
          checked={formData.isUnregistered}
          onChange={onUnregisteredChange}
          disabled={disabled}
        >
          <span className="text-grey text-[16px]">Vehicle is unregistered</span>
        </FormInputCheckbox>
      </div>
      <div className="grid gap-5 desktop-small:gap-3">
        {!formData.isUnregistered && (
          <>
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
              <p className="text-red text-[16px] -mt-2">
                {errors.registrationNumber}
              </p>
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
              <p className="text-red text-[16px] -mt-2">
                {errors.registrationExpiry}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
