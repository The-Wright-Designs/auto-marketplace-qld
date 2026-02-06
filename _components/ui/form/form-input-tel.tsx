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
  const isValidPhoneChar = (char: string): boolean => {
    return /^[0-9+\-() ]$/.test(char);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (
      !allowedKeys.includes(e.key) &&
      !isValidPhoneChar(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const filtered = pastedText
      .split("")
      .filter(isValidPhoneChar)
      .join("");

    if (filtered !== pastedText) {
      e.preventDefault();
      const input = e.currentTarget;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentValue = input.value;
      const newValue =
        currentValue.substring(0, start) +
        filtered +
        currentValue.substring(end);

      input.value = newValue;
      input.setSelectionRange(start + filtered.length, start + filtered.length);

      if (onChange) {
        const event = new Event("change", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: false,
          value: input,
        });
        onChange(event as any);
      }
    }
  };

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
        {...(value !== undefined ? { value, onChange } : {})}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={formInputStyles(className, disabled)}
      />
    </div>
  );
};
export default FormInputTel;
