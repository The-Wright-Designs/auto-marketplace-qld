export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  cssClasses?: string;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "submit" | "reset" | "button";
  title?: string;
  small?: boolean;
  whiteButton?: boolean;
  traditionalButton?: boolean;
  blueStroke?: boolean;
  yellowStroke?: boolean;
  isLoading?: boolean;
}
