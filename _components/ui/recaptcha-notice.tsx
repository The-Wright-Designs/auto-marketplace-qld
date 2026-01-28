"use client";

import Link from "next/link";
import classNames from "classnames";

interface RecaptchaNoticeProps {
  cssClasses?: string;
  isDark?: boolean;
}

export default function RecaptchaNotice({
  cssClasses,
  isDark = false,
}: RecaptchaNoticeProps) {
  return (
    <p
      className={classNames(
        "text-[12px] text-center -mt-2",
        isDark ? "text-white" : "text-black",
        cssClasses,
      )}
    >
      This site is protected by reCAPTCHA and the Google{" "}
      <Link
        href="https://policies.google.com/privacy"
        target="_blank"
        className="underline text-link-blue desktop:hover:opacity-80"
      >
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link
        href="https://policies.google.com/terms"
        target="_blank"
        className="underline text-link-blue desktop:hover:opacity-80"
      >
        Terms of Service
      </Link>{" "}
      apply.
    </p>
  );
}
