import { useFormStatus } from "react-dom";
import { ButtonProps } from "@/_types/button-types";
import { buttonStyles } from "@/_styles/button-styles";

const ButtonType = ({
  children,
  onClick,
  cssClasses,
  type = "submit",
  disabled = false,
  ariaLabel,
  title,
}: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonStyles(cssClasses, disabled, pending)}
      disabled={disabled || pending}
      title={title}
    >
      {pending && type === "submit" ? (
        <div className="py-[6px]">
          <div className="spinner-button" />
        </div>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default ButtonType;
