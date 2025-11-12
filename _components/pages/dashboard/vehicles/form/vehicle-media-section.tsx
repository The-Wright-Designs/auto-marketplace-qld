"use client";

import FormInputFileAccumulator from "@/_components/ui/form/form-input-file-accumulator";

interface VehicleMediaSectionProps {
  formData: {
    images: string[];
    primaryImage: string;
  };
  onImageCountChange?: (count: number) => void;
  errors?: Record<string, string>;
}

export default function VehicleMediaSection({
  formData,
  onImageCountChange,
  errors,
}: VehicleMediaSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Vehicle Media
      </h3>
      <FormInputFileAccumulator
        id="images"
        name="images"
        required
        label="Vehicle Images"
        labelClassName="visually-hidden"
        description="Upload vehicle images (minimum 1, maximum 10)"
        accept="image/*"
        maxFiles={10}
        onImageCountChange={onImageCountChange}
      />
      {errors?.images && (
        <p className="text-red text-paragraph">{errors.images}</p>
      )}

      {formData.images && formData.images.length > 0 && (
        <div className="space-y-3 mt-5">
          <p className="text-paragraph text-blue font-bold">
            Select Primary Image
          </p>
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <label key={`${image}-${index}`} className="flex items-center">
                <input
                  type="radio"
                  name="primaryImage"
                  value={image}
                  checked={formData.primaryImage === image}
                  className="mr-3"
                  readOnly
                />
                <span className="text-paragraph text-grey">
                  {typeof image === "string"
                    ? image.split("/").pop() || `Image ${index + 1}`
                    : `Image ${index + 1}`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
