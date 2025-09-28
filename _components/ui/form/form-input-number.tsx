import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputNumberProps } from "@/_types/form-types";

const FormInputNumber = ({
  id,
  name,
  placeholder,
  required = false,
  className,
  label,
  labelClassName,
  min,
  max,
  disabled = false,
}: FormInputNumberProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <input
        type="number"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        disabled={disabled}
        className={formInputStyles(className, disabled)}
      />
    </div>
  );
};

export default FormInputNumber;
