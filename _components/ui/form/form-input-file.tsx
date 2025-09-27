import { formFileStyles, formLabelStyles } from "@/_styles/form-input-styles";
import { FormInputFileProps } from "@/_types/form-types";

export const FormInputFile = ({
  id,
  name,
  required = false,
  className,
  label,
  labelClassName,
  description,
  multiple = false,
  accept,
  disabled = false,
}: FormInputFileProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyles(labelClassName)}>
          {label}
        </label>
      )}
      <div className="space-y-1">
        {description && <p className="text-[16px]">{description}</p>}
        <input
          type="file"
          id={id}
          name={name}
          required={required}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          className={formFileStyles(className, disabled)}
        />
      </div>
    </div>
  );
};
