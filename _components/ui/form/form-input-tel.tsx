import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputTelProps } from "@/_types/form-types";

export const FormInputTel = ({
  id,
  name,
  placeholder,
  required = false,
  className,
  label,
  labelClassName,
  disabled = false,
}: FormInputTelProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <input
        type="tel"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={formInputStyles(className, disabled)}
      />
    </div>
  );
};