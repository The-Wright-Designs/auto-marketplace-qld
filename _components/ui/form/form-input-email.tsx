import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputEmailProps } from "@/_types/form-types";

const FormInputEmail = ({
  id,
  name,
  placeholder,
  required = false,
  className,
  label,
  labelClassName,
  disabled = false,
}: FormInputEmailProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <input
        type="email"
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
export default FormInputEmail;
