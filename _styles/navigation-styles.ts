import classNames from "classnames";

export const navLinkStyles = (
  isActive: boolean = false,
  isHovered: boolean = false,
  hasUrl: boolean = true,
  cssClasses?: string
) =>
  classNames(
    "text-paragraph flex items-center transition-colors duration-300",
    {
      "text-yellow": isActive || isHovered,
      "text-white": !isActive && !isHovered,
      "cursor-default": !hasUrl,
    },
    cssClasses
  );

export const navItemStyles = (cssClasses?: string) =>
  classNames("relative", cssClasses);

export const chevronIconStyles = (
  isActive: boolean = false,
  isRotated: boolean = false,
  cssClasses?: string
) =>
  classNames(
    "transition-transform duration-300",
    {
      "rotate-180": isRotated,
    },
    cssClasses
  );

export const dropdownMenuStyles = (cssClasses?: string) =>
  classNames(
    "absolute top-full left-0 mt-2 bg-white border-2 border-blue rounded-md shadow-lg z-50 min-w-[200px]",
    cssClasses
  );

export const dropdownItemStyles = (
  isActive: boolean = false,
  cssClasses?: string
) =>
  classNames(
    "block px-4 py-2 text-paragraph transition-colors duration-300 border-b border-grey last:border-b-0",
    {
      "text-yellow bg-blue": isActive,
      "text-black hover:text-yellow hover:bg-blue": !isActive,
    },
    cssClasses
  );

export const mobileMenuStyles = (
  isOpen: boolean = false,
  cssClasses?: string
) =>
  classNames(
    "fixed top-0 right-0 h-full w-[300px] bg-blue border-l-4 border-white transform transition-transform duration-300 ease-in-out z-50",
    {
      "translate-x-0": isOpen,
      "translate-x-full": !isOpen,
    },
    cssClasses
  );

export const mobileMenuItemStyles = (
  isActive: boolean = false,
  cssClasses?: string
) =>
  classNames(
    "block text-paragraph text-white border-b border-white px-6 py-4 transition-colors duration-300",
    {
      "text-yellow bg-white": isActive,
      "hover:text-yellow hover:bg-white": !isActive,
    },
    cssClasses
  );

export const navContainerStyles = (cssClasses?: string) =>
  classNames("flex gap-5 items-center full-hd:gap-7", cssClasses);

export const headerNavStyles = (
  shouldSelfEnd: boolean = false,
  cssClasses?: string
) =>
  classNames(
    {
      "self-end": shouldSelfEnd,
    },
    cssClasses
  );
