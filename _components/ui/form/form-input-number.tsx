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
  step,
  disabled = false,
  value,
  onChange,
  error,
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
        step={step}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`${formInputStyles(className, disabled, !!error)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
    </div>
  );
};

export default FormInputNumber;
