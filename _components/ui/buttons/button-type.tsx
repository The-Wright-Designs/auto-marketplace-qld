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
  blueStroke,
  yellowStroke,
  isLoading,
}: ButtonProps) => {
  const { pending } = useFormStatus();
  const isButtonPending = isLoading !== undefined ? isLoading : pending;

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonStyles(
        cssClasses,
        disabled,
        isButtonPending,
        small,
        whiteButton,
        traditionalButton,
        blueStroke,
        yellowStroke
      )}
      disabled={disabled || isButtonPending}
      title={title}
    >
      {isButtonPending && type === "submit" ? (
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
