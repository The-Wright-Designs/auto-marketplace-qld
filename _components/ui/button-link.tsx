import classNames from "classnames";
import Link from "next/link";

interface ButtonLinProps {
  href: string;
  ariaLabel: string;
  targetBlank?: boolean;
  cssClasses?: string;
  children: React.ReactNode;
}

const ButtonLink = ({
  href,
  ariaLabel,
  targetBlank,
  cssClasses,
  children,
}: ButtonLinProps) => {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      target={targetBlank ? "_blank" : "_self"}
      className={classNames(
        "text-[25px] p-2 -m-2 leading-[120%] text-blue font-bold desktop-small:text-[30px] hover:desktop-small:text-grey desktop-small:p-0 desktop-small:m-0",
        cssClasses
      )}
    >
      {children} {">>>"}
    </Link>
  );
};

export default ButtonLink;
