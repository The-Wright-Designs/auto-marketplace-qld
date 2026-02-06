import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputTextProps } from "@/_types/form-types";

const FormInputText = ({
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
  type = "text",
  error,
}: FormInputTextProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...(value !== undefined ? { value, onChange } : {})}
        className={formInputStyles(className, disabled, !!error)}
      />
    </div>
  );
};
export default FormInputText;
