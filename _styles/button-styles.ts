import classNames from "classnames";

export const buttonStyles = (
  cssClasses?: string,
  disabled?: boolean,
  pending?: boolean,
  small?: boolean
) =>
  classNames(
    "border-blue flex text-center justify-center ease-in-out duration-300 rounded-md bg-blue text-white",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed hover:none": pending || disabled,
      "cursor-pointer": !(disabled || pending),
      "desktop:hover:bg-white desktop:hover:text-blue": !(disabled || pending),
      "border-4 text-paragraph px-4 min-w-[150px]": !small,
      "border-2 text-[16px] px-2 leading-[100%] py-3 min-w-[125px] font-normal":
        small,
    }
  );
