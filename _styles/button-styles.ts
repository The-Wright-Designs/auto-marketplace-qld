import classNames from "classnames";

export const buttonStyles = (
  cssClasses?: string,
  disabled?: boolean,
  pending?: boolean,
  small?: boolean,
  whiteButton?: boolean,
  traditionalButton?: boolean
) =>
  classNames(
    "border-blue flex text-center justify-center ease-in-out duration-300 py-1 rounded-md",
    traditionalButton
      ? "bg-transparent text-blue border-2"
      : whiteButton
      ? "bg-white text-black border-blue"
      : "bg-blue text-white",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed hover:none": pending || disabled,
      "cursor-pointer": !(disabled || pending),
      "desktop:hover:bg-blue desktop:hover:text-white": !(disabled || pending) && (traditionalButton || whiteButton),
      "desktop:hover:bg-white desktop:hover:text-blue": !(disabled || pending) && !whiteButton && !traditionalButton,
      "border-4 text-paragraph px-4 min-w-[150px] font-[500] leading-[30px]":
        !small && !traditionalButton,
      "border-2 text-paragraph px-4 min-w-[150px] font-[500] leading-[30px]":
        !small && traditionalButton,
      "border-2 text-[16px] px-2 leading-[100%] py-3 min-w-[125px] font-normal":
        small,
    }
  );
