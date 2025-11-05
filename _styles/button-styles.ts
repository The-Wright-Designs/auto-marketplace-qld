import classNames from "classnames";

export const buttonStyles = (
  cssClasses?: string,
  disabled?: boolean,
  pending?: boolean,
  small?: boolean,
  whiteButton?: boolean,
  traditionalButton?: boolean,
  blueStroke?: boolean,
  yellowStroke?: boolean
) =>
  classNames(
    "flex text-center justify-center ease-in-out duration-300 py-1 rounded-md",
    traditionalButton
      ? "bg-transparent text-blue border-2 border-blue"
      : whiteButton
      ? "bg-white text-black border-blue"
      : blueStroke
      ? "bg-white text-black border-2 border-white"
      : yellowStroke
      ? "bg-blue text-white border-2 border-yellow"
      : "bg-blue text-white border-blue",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed hover:none": pending || disabled,
      "cursor-pointer": !(disabled || pending),
      "desktop:hover:opacity-90": !(disabled || pending) && blueStroke,
      "desktop:hover:bg-white/10 desktop:hover:border-yellow":
        !(disabled || pending) && yellowStroke,
      "desktop:hover:bg-blue desktop:hover:text-white":
        !(disabled || pending) && (traditionalButton || whiteButton),
      "desktop:hover:bg-white desktop:hover:text-blue":
        !(disabled || pending) &&
        !whiteButton &&
        !traditionalButton &&
        !blueStroke &&
        !yellowStroke,
      "border-4 text-paragraph px-4 min-w-[150px] font-[500] leading-[30px]":
        !small && !traditionalButton,
      "border-2 text-paragraph px-4 min-w-[150px] font-[500] leading-[30px]":
        !small && traditionalButton,
      "border-2 text-[16px] px-2 leading-[100%] py-3 min-w-[125px] font-normal":
        small,
    }
  );
