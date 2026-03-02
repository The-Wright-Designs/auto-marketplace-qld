import classNames from "classnames";

export const ContactInfoStyles = (cssClasses?: string, isButton?: boolean) => {
  const baseClasses =
    "text-[16px] px-2 text-left -mx-2 font-medium py-3 -my-3 min-[450px]:text-paragraph hover:tablet:opacity-80 desktop:p-0 desktop:m-0 hover:desktop-small:text-grey leading-[40px] italic";
  const conditionalClasses = {
    "hover:cursor-pointer": isButton,
  };

  return classNames(baseClasses, cssClasses, conditionalClasses);
};
