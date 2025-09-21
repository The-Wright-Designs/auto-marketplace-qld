import classNames from "classnames";

export const ContactInfoStyles = (cssClasses?: string, isButton?: boolean) => {
  const baseClasses =
    "px-2 text-left -mx-2 text-paragraph font-medium py-3 -my-3 hover:tablet:opacity-80 desktop:p-0 desktop:m-0 hover:desktop-small:text-grey leading-[40px] italic";
  const conditionalClasses = {
    "hover:cursor-pointer": isButton,
  };

  return classNames(baseClasses, cssClasses, conditionalClasses);
};
