import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputPasswordProps } from "@/_types/form-types";

const FormInputPassword = ({
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
  autoComplete,
  description,
}: FormInputPasswordProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <input
        type="password"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={formInputStyles(className, disabled)}
      />
      {description && (
        <div className="text-paragraph text-black/60 text-[14px] mt-2">
          {description}
        </div>
      )}
    </div>
  );
};
export default FormInputPassword;
