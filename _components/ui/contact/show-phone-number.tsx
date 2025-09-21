"use client";

import Link from "next/link";
import { useState } from "react";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { fetchPhoneNumber } from "@/_actions/contact-actions";
import { showContactProps } from "@/_types/general-types";
import { ContactInfoStyles } from "@/_styles/contact-info-styles";

const ShowPhoneNumber = ({ buttonClasses, linkClasses }: showContactProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showPhone, setShowPhone] = useState("Show phone number");
  const [showSpinnerPhone, setShowSpinnerPhone] = useState(false);

  const handleShowPhoneNumbers = async () => {
    setShowSpinnerPhone(true);

    try {
      let recaptchaToken: string | undefined;

      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("fetch_phone");
      }

      const phoneNumber =
        (await fetchPhoneNumber(recaptchaToken)) || "Phone number not found";
      setShowPhone(phoneNumber);
    } catch (error) {
      console.error("Error fetching phone:", error);
      setShowPhone("Phone not available");
    }

    setShowSpinnerPhone(false);
  };

  if (showPhone === "Show phone number") {
    return (
      <button
        onClick={() => handleShowPhoneNumbers()}
        className={ContactInfoStyles(buttonClasses, true)}
        aria-label="Show phone number"
      >
        {showSpinnerPhone ? <div className="spinner"></div> : showPhone}
      </button>
    );
  } else {
    return (
      <Link
        href={`tel:${showPhone}`}
        className={ContactInfoStyles(linkClasses)}
      >
        {showPhone}
      </Link>
    );
  }
};

export default ShowPhoneNumber;
