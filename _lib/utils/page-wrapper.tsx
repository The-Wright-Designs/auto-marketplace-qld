import classNames from "classnames";

interface PageWrapperProps {
  children: React.ReactNode;
  cssClasses?: string;
  useMainElement?: boolean;
}

export const PageWrapper = ({
  children,
  cssClasses,
  useMainElement = false,
}: PageWrapperProps) => {
  const wrapperClasses =
    "my-10 px-5 desktop-small:px-50px full-hd:px-120px overflow-hidden";

  const content = (
    <div className={classNames("mx-auto max-w-[1920px]", cssClasses)}>
      {children}
    </div>
  );

  if (useMainElement) {
    return <main className={wrapperClasses}>{content}</main>;
  }

  return <div className={wrapperClasses}>{content}</div>;
};
