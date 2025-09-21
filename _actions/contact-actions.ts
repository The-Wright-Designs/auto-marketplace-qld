"use server";

import contactData from "@/_data/general-data.json";
import { verifyRecaptchaToken } from "@/_lib/verify-recaptcha";

const {
  contact: { email, phone },
} = contactData;

export const fetchEmailAddress = async (recaptchaToken?: string) => {
  if (recaptchaToken) {
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaResult.success) {
      throw new Error(recaptchaResult.error || "reCAPTCHA verification failed");
    }
  }
  return email;
};

export const fetchPhoneNumber = async (recaptchaToken?: string) => {
  if (recaptchaToken) {
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaResult.success) {
      throw new Error(recaptchaResult.error || "reCAPTCHA verification failed");
    }
  }
  return phone;
};
