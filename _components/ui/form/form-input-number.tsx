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
  prefix,
}: FormInputNumberProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/70">
            {prefix}
          </span>
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
          className={`${formInputStyles(className, disabled, !!error)} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );
};

export default FormInputNumber;
