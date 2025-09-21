"use client";

import Link from "next/link";
import { useState } from "react";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { fetchEmailAddress } from "@/_actions/contact-actions";
import { showContactProps } from "@/_types/general-types";
import { ContactInfoStyles } from "@/_styles/contact-info-styles";

const ShowEmailAddress = ({ buttonClasses, linkClasses }: showContactProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showEmail, setShowEmail] = useState("Show email address");
  const [showSpinnerEmail, setShowSpinnerEmail] = useState(false);

  const handleShowEmailAddress = async () => {
    setShowSpinnerEmail(true);

    try {
      let recaptchaToken: string | undefined;

      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("fetch_email");
      }

      const emailAddress =
        (await fetchEmailAddress(recaptchaToken)) || "Email not found";
      setShowEmail(emailAddress);
    } catch (error) {
      console.error("Error fetching email:", error);
      setShowEmail("Email not available");
    }

    setShowSpinnerEmail(false);
  };

  if (showEmail === "Show email address") {
    return (
      <button
        onClick={() => handleShowEmailAddress()}
        className={ContactInfoStyles(buttonClasses, true)}
        aria-label="Show email address"
      >
        {showSpinnerEmail ? <div className="spinner"></div> : showEmail}
      </button>
    );
  } else {
    return (
      <Link
        href={`mailto:${showEmail}`}
        className={ContactInfoStyles(linkClasses)}
      >
        {showEmail}
      </Link>
    );
  }
};

export default ShowEmailAddress;
