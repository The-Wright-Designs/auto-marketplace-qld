import { formCheckboxStyles } from "@/_styles/form-input-styles";
import { FormInputCheckboxProps } from "@/_types/form-types";

const FormInputCheckbox = ({
  id,
  name,
  required = false,
  className,
  disabled = false,
  checked,
  onChange,
  children,
}: FormInputCheckboxProps) => {
  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={formCheckboxStyles(className, disabled)}
      />
      {children && (
        <label htmlFor={id} className="-mt-[3px] text-16px font-normal">
          {children}
        </label>
      )}
    </div>
  );
};
export default FormInputCheckbox;
