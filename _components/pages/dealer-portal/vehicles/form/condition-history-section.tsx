"use client";

import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputTextarea from "@/_components/ui/form/form-input-textarea";

interface ConditionHistorySectionProps {
  formData: {
    condition: string;
    serviceHistory: string;
    accidentHistory: string;
    financeOwing: string;
    modifications: string;
    notes: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function ConditionHistorySection({
  formData,
  onInputChange,
  errors,
  disabled = false,
}: ConditionHistorySectionProps) {
  return (
    <div className="grid gap-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Condition & History
      </h3>
      <div className="grid gap-5 desktop-small:gap-3">
        <FormInputSelect
          id="condition"
          name="condition"
          options={[
            { value: "excellent", label: "Excellent" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" },
          ]}
          label="Condition"
          value={formData.condition}
          onChange={onInputChange}
          error={errors?.condition}
          disabled={disabled}
        />
        {errors?.condition && (
          <p className="text-red text-[16px] -mt-2">{errors.condition}</p>
        )}

        <FormInputTextarea
          id="serviceHistory"
          name="serviceHistory"
          placeholder="Service History (max 500 characters)"
          label="Service History"
          maxLength={500}
          rows={4}
          value={formData.serviceHistory}
          onChange={onInputChange}
          error={errors?.serviceHistory}
          disabled={disabled}
        />
        {errors?.serviceHistory && (
          <p className="text-red text-[16px] -mt-2">{errors.serviceHistory}</p>
        )}

        <FormInputSelect
          id="accidentHistory"
          name="accidentHistory"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          label="Accident History"
          value={formData.accidentHistory}
          onChange={onInputChange}
          error={errors?.accidentHistory}
          disabled={disabled}
        />
        {errors?.accidentHistory && (
          <p className="text-red text-[16px] -mt-2">{errors.accidentHistory}</p>
        )}

        <FormInputSelect
          id="financeOwing"
          name="financeOwing"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          label="Finance Owing"
          value={formData.financeOwing}
          onChange={onInputChange}
          error={errors?.financeOwing}
          disabled={disabled}
        />
        {errors?.financeOwing && (
          <p className="text-red text-[16px] -mt-2">{errors.financeOwing}</p>
        )}

        <FormInputTextarea
          id="modifications"
          name="modifications"
          placeholder="Modifications (max 500 characters)"
          label="Modifications"
          maxLength={500}
          rows={4}
          value={formData.modifications}
          onChange={onInputChange}
          error={errors?.modifications}
          disabled={disabled}
        />
        {errors?.modifications && (
          <p className="text-red text-[16px] -mt-2">{errors.modifications}</p>
        )}

        <FormInputTextarea
          id="notes"
          name="notes"
          placeholder="Additional Notes (max 1000 characters)"
          label="Additional Notes"
          maxLength={1000}
          rows={4}
          value={formData.notes}
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
