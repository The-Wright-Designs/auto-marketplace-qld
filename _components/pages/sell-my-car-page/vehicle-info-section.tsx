import { useState } from "react";
import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputNumber from "@/_components/ui/form/form-input-number";
import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputFileAccumulator from "@/_components/ui/form/form-input-file-accumulator";

interface VehicleInfoSectionProps {
  formData: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    fuelType: string;
    transmission: string;
  };
  onInputChange: (name: string, value: string) => void;
  onImageCountChange: (count: number) => void;
}

const VehicleInfoSection = ({
  formData,
  onInputChange,
  onImageCountChange,
}: VehicleInfoSectionProps) => {
  const [imageCount, setImageCount] = useState(0);

  const handleImageCountChange = (count: number) => {
    setImageCount(count);
    onImageCountChange(count);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onInputChange(name, value);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-blue font-bold text-paragraph-desktop">
        Vehicle Information
      </h3>
      <div className="space-y-5 desktop-small:space-y-3">
        <FormInputText
          id="vehicleMake"
          name="vehicleMake"
          placeholder="Vehicle Make"
          required
          label="Vehicle Make"
          labelClassName="visually-hidden"
          value={formData.vehicleMake}
          onChange={handleInputChange}
        />

        <FormInputText
          id="vehicleModel"
          name="vehicleModel"
          placeholder="Vehicle Model"
          required
          label="Vehicle Model"
          labelClassName="visually-hidden"
          value={formData.vehicleModel}
          onChange={handleInputChange}
        />

        <FormInputNumber
          id="vehicleYear"
          name="vehicleYear"
          placeholder="Vehicle Year (optional)"
          label="Vehicle Year"
          labelClassName="visually-hidden"
          min={1900}
          max={new Date().getFullYear() + 1}
          value={formData.vehicleYear}
          onChange={handleInputChange}
        />

        <FormInputSelect
          id="fuelType"
          name="fuelType"
          options={[
            { value: "diesel", label: "Diesel" },
            { value: "petrol", label: "Petrol" },
          ]}
          required
          placeholder="Select Fuel Type"
          label="Fuel Type"
          labelClassName="visually-hidden"
          value={formData.fuelType}
          onChange={handleInputChange}
        />

        <FormInputSelect
          id="transmission"
          name="transmission"
          options={[
            { value: "manual", label: "Manual" },
            { value: "automatic", label: "Automatic" },
          ]}
          required
          placeholder="Select Transmission"
          label="Transmission"
          labelClassName="visually-hidden"
          value={formData.transmission}
          onChange={handleInputChange}
        />
      </div>
      <FormInputFileAccumulator
        id="images"
        name="images"
        required
        label="Vehicle Images"
        labelClassName="visually-hidden"
        description="Images"
        accept="image/*"
        maxFiles={10}
        onImageCountChange={handleImageCountChange}
      />
    </div>
  );
};

export default VehicleInfoSection;
