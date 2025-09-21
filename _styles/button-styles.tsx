import classNames from "classnames";

export const buttonStyles = (
  cssClasses?: string,
  disabled?: boolean,
  pending?: boolean
) =>
  classNames(
    "border-4 border-blue flex text-paragraph text-center px-4 justify-center ease-in-out duration-300 rounded-md min-w-[150px] bg-blue text-white",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed hover:none": pending || disabled,
      "cursor-pointer": !(disabled || pending),
      "desktop:hover:bg-white desktop:hover:text-blue": !(disabled || pending),
    }
  );
