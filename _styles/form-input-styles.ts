import classNames from "classnames";

export const formInputStyles = (cssClasses?: string, disabled?: boolean) =>
  classNames(
    "border-2 border-grey/75 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue hover:cursor-text placeholder:text-black/50",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed": disabled,
      "cursor-pointer": !disabled,
    }
  );

export const formSelectStyles = (cssClasses?: string, disabled?: boolean) =>
  classNames(
    "border-2 border-grey/75 text-[16px] rounded-md px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue text-paragraph appearance-none pr-10",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed": disabled,
      "cursor-pointer": !disabled,
    }
  );

export const formLabelStyles = (cssClasses?: string) =>
  classNames("block text-sm font-medium text-black mb-2", cssClasses);

export const formFileStyles = (cssClasses?: string, disabled?: boolean) =>
  classNames(
    "file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[16px] file:font-semibold file:bg-blue file:text-white hover:file:opacity-80 hover:file:desktop:cursor-pointer file:ease-in-out file:duration-300",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed": disabled,
      "cursor-pointer": !disabled,
    }
  );
