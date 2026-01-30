import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputTextareaProps } from "@/_types/form-types";

const FormInputTextarea = ({
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
  rows = 4,
  maxLength,
  error,
}: FormInputTextareaProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange as any}
        rows={rows}
        maxLength={maxLength}
        className={formInputStyles(className, disabled, !!error)}
      />
    </div>
  );
};
export default FormInputTextarea;
