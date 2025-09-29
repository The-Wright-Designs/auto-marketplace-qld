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
}: FormInputTextProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <input
        type="text"
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
export default FormInputText;
