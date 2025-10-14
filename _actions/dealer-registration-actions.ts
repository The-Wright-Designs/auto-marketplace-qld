"use server";

import nodemailer from "nodemailer";
import { dealerRegistrationEmailTemplate } from "@/_lib/utils/email-templates/dealer-registration-email-template";
import DOMPurify from "isomorphic-dompurify";
import { verifyRecaptchaToken } from "@/_lib/verify-recaptcha";

interface DealerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensedDealer: string;
  interestedIn: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo: string;
  html: string;
}

export async function sendEmail(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const honey = formData.get("_honey");
  const recaptchaToken = formData.get("recaptchaToken") as string;

  try {
    if (!honey || honey.toString().trim() === "") {
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
      const firstName = DOMPurify.sanitize(
        formData.get("firstName")?.toString() || ""
      );
      const lastName = DOMPurify.sanitize(
        formData.get("lastName")?.toString() || ""
      );
      const email = DOMPurify.sanitize(formData.get("email")?.toString() || "");
      const phone = DOMPurify.sanitize(formData.get("phone")?.toString() || "");
      const licensedDealer = DOMPurify.sanitize(
        formData.get("licensedDealer")?.toString() || ""
      );
      const interestedIn = DOMPurify.sanitize(
        formData.get("interestedIn")?.toString() || ""
      );

      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !licensedDealer.trim() ||
        !interestedIn.trim()
      ) {
        return { success: false, error: "All required fields must be filled" };
      }

      const emailHtmlContent = dealerRegistrationEmailTemplate({
        firstName,
        lastName,
        email,
        phone,
        licensedDealer,
        interestedIn,
      } as DealerRegistrationData);

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER as string,
          pass: process.env.SMTP_PASS as string,
        },
      });

      const mailOptions: MailOptions = {
        from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_SEND_TO as string,
        subject: "Dealer Registration Application - AMQ",
        replyTo: email,
        html: emailHtmlContent,
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
    } else {
      console.error("Invalid form submission due to non-empty honeypot field");
      return { success: false, error: "Spam detected" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to send email" };
  }
}
