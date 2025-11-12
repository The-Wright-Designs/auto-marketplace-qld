"use client";

import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputTextarea from "@/_components/ui/form/form-input-textarea";

interface ConditionHistorySectionProps {
  formData: {
    condition: string;
    serviceHistory: string;
    accidentHistory: string;
    modifications: string;
    notes: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors?: Record<string, string>;
}

export default function ConditionHistorySection({
  formData,
  onInputChange,
  errors,
}: ConditionHistorySectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Condition & History
      </h3>
      <div className="space-y-5 desktop-small:space-y-3">
        <FormInputSelect
          id="condition"
          name="condition"
          options={[
            { value: "", label: "Select Condition" },
            { value: "excellent", label: "Excellent" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" },
          ]}
          required
          label="Condition"
          labelClassName="visually-hidden"
          value={formData.condition}
          onChange={onInputChange}
        />
        {errors?.condition && (
          <p className="text-red text-paragraph">{errors.condition}</p>
        )}

        <FormInputTextarea
          id="serviceHistory"
          name="serviceHistory"
          placeholder="Service History (max 500 characters)"
          label="Service History"
          labelClassName="visually-hidden"
          maxLength={500}
          rows={4}
          value={formData.serviceHistory}
          onChange={onInputChange}
        />
        {errors?.serviceHistory && (
          <p className="text-red text-paragraph">{errors.serviceHistory}</p>
        )}

        <FormInputTextarea
          id="accidentHistory"
          name="accidentHistory"
          placeholder="Accident History (max 500 characters)"
          label="Accident History"
          labelClassName="visually-hidden"
          maxLength={500}
          rows={4}
          value={formData.accidentHistory}
          onChange={onInputChange}
        />
        {errors?.accidentHistory && (
          <p className="text-red text-paragraph">{errors.accidentHistory}</p>
        )}

        <FormInputTextarea
          id="modifications"
          name="modifications"
          placeholder="Modifications (max 500 characters)"
          label="Modifications"
          labelClassName="visually-hidden"
          maxLength={500}
          rows={4}
          value={formData.modifications}
          onChange={onInputChange}
        />
        {errors?.modifications && (
          <p className="text-red text-paragraph">{errors.modifications}</p>
        )}

        <FormInputTextarea
          id="notes"
          name="notes"
          placeholder="Additional Notes (max 1000 characters)"
          label="Additional Notes"
          labelClassName="visually-hidden"
          maxLength={1000}
          rows={4}
          value={formData.notes}
          onChange={onInputChange}
        />
        {errors?.notes && (
          <p className="text-red text-paragraph">{errors.notes}</p>
        )}
      </div>
    </div>
  );
}
