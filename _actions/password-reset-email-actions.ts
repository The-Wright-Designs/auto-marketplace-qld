"use server";

import { adminAuth } from "@/_lib/firebase/firebase-admin";
import nodemailer from "nodemailer";
import { passwordResetEmailTemplate } from "@/_lib/utils/email-templates/password-reset-email-template";

interface ResetResult {
  success: boolean;
  message: string;
}

export async function resendPasswordResetEmail(
  email: string
): Promise<ResetResult> {
  try {
    if (!email || typeof email !== "string") {
      return {
        success: false,
        message: "Invalid email address",
      };
    }

    try {
      // Check if user exists and get user data
      const userRecord = await adminAuth.getUserByEmail(email);

      // Generate password reset link
      const resetLink = await adminAuth.generatePasswordResetLink(email, {
        url: process.env.NEXT_PUBLIC_APP_URL + "/auth/action",
      });

      // Send custom email
      const emailResult = await sendPasswordResetEmail(
        email,
        resetLink,
        userRecord.displayName || undefined
      );

      if (!emailResult.success) {
        return {
          success: false,
          message: `Failed to send reset email: ${emailResult.error}`,
        };
      }

      return {
        success: true,
        message: "Password reset link has been sent to your email.",
      };
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return {
          success: false,
          message: "User not found.",
        };
      }
      if (error.code === "auth/invalid-email") {
        return {
          success: false,
          message: "Invalid email address.",
        };
      }
      if (error.code === "auth/too-many-requests") {
        return {
          success: false,
          message: "Too many requests. Please try again later.",
        };
      }
      throw error;
    }
  } catch (error: any) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

async function sendEmailWithRetry(
  transporter: any,
  mailOptions: MailOptions,
  maxRetries: number = 3
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      return; // Success, exit the retry loop
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error; // Last attempt failed, throw the error
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function resendResetLinkAction(
  state: ResetResult | null,
  formData: FormData
): Promise<ResetResult> {
  const email = formData.get("email") as string;

  return await resendPasswordResetEmail(email);
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailHtmlContent = passwordResetEmailTemplate({
      resetLink,
      userName,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions: MailOptions = {
      from: `Auto Market QLD <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password - Auto Market QLD",
      html: emailHtmlContent,
    };

    await sendEmailWithRetry(transporter, mailOptions);

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
