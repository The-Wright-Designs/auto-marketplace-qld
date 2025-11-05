import classNames from "classnames";
import Link from "next/link";
import { buttonStyles } from "@/_styles/button-styles";

interface ButtonLinkProps {
  href: string;
  ariaLabel: string;
  targetBlank?: boolean;
  cssClasses?: string;
  traditionalButton?: boolean;
  whiteButton?: boolean;
  yellowStroke?: boolean;
  children: React.ReactNode;
}

const ButtonLink = ({
  href,
  ariaLabel,
  targetBlank,
  cssClasses,
  traditionalButton = false,
  whiteButton = false,
  yellowStroke = false,
  children,
}: ButtonLinkProps) => {
  const linkClasses = traditionalButton
    ? buttonStyles(
        cssClasses,
        undefined,
        undefined,
        undefined,
        whiteButton,
        false,
        false,
        yellowStroke
      )
    : classNames(
        "text-[25px] p-2 -m-2 leading-[120%] text-blue font-bold desktop-small:text-[30px] hover:desktop-small:text-grey desktop-small:p-0 desktop-small:m-0",
        cssClasses
      );

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      target={targetBlank ? "_blank" : "_self"}
      className={linkClasses}
    >
      {traditionalButton ? (
        children
      ) : (
        <>
          {children} {">>>"}
        </>
      )}
    </Link>
  );
};

export default ButtonLink;
