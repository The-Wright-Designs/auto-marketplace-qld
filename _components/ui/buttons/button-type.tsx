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
  small,
  whiteButton,
  traditionalButton,
}: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonStyles(
        cssClasses,
        disabled,
        pending,
        small,
        whiteButton,
        traditionalButton
      )}
      disabled={disabled || pending}
      title={title}
    >
      {pending && type === "submit" ? (
        <div className="py-[1px] min-w-[125px] flex justify-center">
          <div className="spinner-button" />
        </div>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default ButtonType;
