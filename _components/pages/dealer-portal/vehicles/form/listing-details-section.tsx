"use client";

import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputNumber from "@/_components/ui/form/form-input-number";
import FormInputText from "@/_components/ui/form/form-input-text";

interface ListingDetailsSectionProps {
  formData: {
    listingType: string;
    price: number | string;
    reservePrice: number | string;
    tenderDeadline: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function ListingDetailsSection({
  formData,
  onInputChange,
  errors,
  disabled = false,
}: ListingDetailsSectionProps) {
  const showReservePrice = formData.listingType === "tender";
  const showTenderDeadline = formData.listingType === "tender";

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Listing Details
      </h3>
      <div className="grid gap-5 desktop-small:gap-3">
        <FormInputSelect
          id="listingType"
          name="listingType"
          options={[
            { value: "tender", label: "Tender" },
            { value: "buy-now", label: "Buy Now" },
          ]}
          label="Listing Type"
          value={formData.listingType}
          onChange={onInputChange}
          error={errors?.listingType}
          disabled={disabled}
        />
        {errors?.listingType && (
          <p className="text-red text-paragraph">{errors.listingType}</p>
        )}

        <FormInputNumber
          id="price"
          name="price"
          placeholder="Price ($)"
          label="Price"
          min={0}
          step={1}
          value={formData.price}
          onChange={onInputChange}
          disabled={disabled}
        />
        {errors?.price && (
          <p className="text-red text-paragraph">{errors.price}</p>
        )}

        {showReservePrice && (
          <>
            <FormInputNumber
              id="reservePrice"
              name="reservePrice"
              placeholder="Reserve Price ($) - Optional"
              label="Reserve Price"
              min={0}
              step={1}
              value={formData.reservePrice}
              onChange={onInputChange}
              disabled={disabled}
            />
            {errors?.reservePrice && (
              <p className="text-red text-paragraph">{errors.reservePrice}</p>
            )}
          </>
        )}

        {showTenderDeadline && (
          <>
            <FormInputText
              id="tenderDeadline"
              name="tenderDeadline"
              type="datetime-local"
              placeholder="Tender Deadline - Optional"
              label="Tender Deadline"
              value={formData.tenderDeadline}
              onChange={onInputChange}
              disabled={disabled}
            />
            {errors?.tenderDeadline && (
              <p className="text-red text-paragraph">{errors.tenderDeadline}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
