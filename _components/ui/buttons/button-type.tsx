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
  isLoading = false,
}: ButtonProps) => {
  const { pending } = useFormStatus();
  const isPending = pending || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonStyles(
        cssClasses,
        disabled,
        isPending,
        small,
        whiteButton,
        traditionalButton,
        blueStroke,
        yellowStroke,
      )}
      disabled={disabled || isPending}
      title={title}
    >
      {isPending && type === "submit" ? (
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
