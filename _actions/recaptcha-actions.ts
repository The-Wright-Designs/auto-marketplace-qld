"use server";

import { verifyRecaptchaToken } from "@/_lib/verify-recaptcha";

export interface RecaptchaVerificationResult {
  success: boolean;
  error?: string;
}

export async function verifyRecaptcha(
  recaptchaToken: string
): Promise<RecaptchaVerificationResult> {
  try {
    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return { success: false, error: "reCAPTCHA verification required" };
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaResult.success) {
      return {
        success: false,
        error: recaptchaResult.error || "reCAPTCHA verification failed",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      error: "reCAPTCHA verification service unavailable",
    };
  }
}
