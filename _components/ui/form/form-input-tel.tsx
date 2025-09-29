import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputTelProps } from "@/_types/form-types";

const FormInputTel = ({
  id,
  name,
  placeholder,
  required = false,
  className,
  label,
  labelClassName,
  disabled = false,
  value,
  onChange,
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
        value={value}
        onChange={onChange}
        className={formInputStyles(className, disabled)}
      />
    </div>
  );
};
export default FormInputTel;
