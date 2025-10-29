"use server";

import { adminAuth } from "@/_lib/firebase/firebase-admin";
import { sendWelcomeAfterResetEmail } from "./password-reset-email-actions";

export interface PasswordResetResult {
  success: boolean;
  message: string;
  details?: string[];
}

function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least 1 number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function resetPasswordAction(
  formData: FormData
): Promise<PasswordResetResult> {
  try {
    const oobCode = formData.get("oobCode") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const email = formData.get("email") as string;
    const verified = formData.get("verified") as string;

    // Validate form inputs
    if (!oobCode || !newPassword || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: "Password does not meet requirements",
        details: passwordValidation.errors,
      };
    }

    if (!email) {
      return {
        success: false,
        message: "Email is required for password reset",
      };
    }

    // Ensure the oobCode was verified client-side before allowing reset
    if (verified !== "true") {
      return {
        success: false,
        message:
          "Reset code must be verified first. Please use the password reset link from your email.",
      };
    }

    // Update the user's password directly using Admin SDK
    try {
      const user = await adminAuth.getUserByEmail(email);
      await adminAuth.updateUser(user.uid, {
        password: newPassword,
      });

      // Send welcome email after successful password reset
      try {
        await sendWelcomeAfterResetEmail(email, user.displayName || undefined);
      } catch (emailError: any) {
        console.error(
          "Failed to send welcome email after password reset:",
          emailError
        );
        // Don't fail the password reset if welcome email fails
      }

      return {
        success: true,
        message: "Password has been successfully reset",
      };
    } catch (error: any) {
      console.error(
        "Password reset confirmation error:",
        error.code || error.message
      );

      if (error.code === "auth/user-not-found") {
        return {
          success: false,
          message: "User not found. Please check your email address",
        };
      }

      if (error.code === "auth/weak-password") {
        return {
          success: false,
          message: "Password is too weak. Please choose a stronger password",
        };
      }

      return {
        success: false,
        message: "Failed to reset password. Please try again",
      };
    }
  } catch (error: any) {
    console.error("Password reset action error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again",
    };
  }
}
