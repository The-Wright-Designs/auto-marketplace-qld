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
}

export default function ListingDetailsSection({
  formData,
  onInputChange,
  errors,
}: ListingDetailsSectionProps) {
  const showReservePrice = formData.listingType === "tender";
  const showTenderDeadline = formData.listingType === "tender";

  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Listing Details
      </h3>
      <div className="space-y-5 desktop-small:space-y-3">
        <FormInputSelect
          id="listingType"
          name="listingType"
          options={[
            { value: "", label: "Select Listing Type" },
            { value: "tender", label: "Tender" },
            { value: "buy-now", label: "Buy Now" },
          ]}
          required
          label="Listing Type"
          labelClassName="visually-hidden"
          value={formData.listingType}
          onChange={onInputChange}
        />
        {errors?.listingType && (
          <p className="text-red text-paragraph">{errors.listingType}</p>
        )}

        <FormInputNumber
          id="price"
          name="price"
          placeholder="Price ($)"
          required
          label="Price"
          labelClassName="visually-hidden"
          min={0}
          step={1}
          value={formData.price}
          onChange={onInputChange}
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
              labelClassName="visually-hidden"
              min={0}
              step={1}
              value={formData.reservePrice}
              onChange={onInputChange}
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
              labelClassName="visually-hidden"
              value={formData.tenderDeadline}
              onChange={onInputChange}
            />
            {errors?.tenderDeadline && (
              <p className="text-red text-paragraph">
                {errors.tenderDeadline}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
