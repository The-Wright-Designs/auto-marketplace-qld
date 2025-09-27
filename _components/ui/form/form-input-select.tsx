import { formSelectStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { ChevronDown } from "lucide-react";
import { FormInputSelectProps } from "@/_types/form-types";

export const FormInputSelect = ({
  id,
  name,
  options,
  required = false,
  className,
  label,
  labelClassName,
  placeholder = "Select an option",
  disabled = false,
}: FormInputSelectProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          className={formSelectStyles(className, disabled)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue pointer-events-none" />
      </div>
    </div>
  );
};
