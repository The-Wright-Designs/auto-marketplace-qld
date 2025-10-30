"use client";

import { useState, useActionState, startTransition, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { resendResetLinkAction } from "@/_actions/password-reset-email-actions";
import { verifyRecaptcha } from "@/_actions/recaptcha-actions";
import ButtonType from "@/_components/ui/buttons/button-type";
import { formInputStyles, formLabelStyles } from "@/_styles/form-input-styles";
import classNames from "classnames";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordResetModal({
  isOpen,
  onClose,
}: PasswordResetModalProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState("");
  const [formResult, formAction] = useActionState(resendResetLinkAction, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email client-side before reCAPTCHA
    if (!email || !email.includes("@")) {
      return;
    }

    // Verify reCAPTCHA server-side
    if (!executeRecaptcha) {
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("password_reset_modal");

      // Create FormData and submit to server action within transition
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("recaptchaToken", recaptchaToken);

      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      // Continue without reCAPTCHA if it fails
      const formData = new FormData(e.target as HTMLFormElement);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Handle form result changes with useEffect
  useEffect(() => {
    if (formResult && formResult.success) {
      setEmail("");
      // Close modal after success
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [formResult, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center phone:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-md shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-black/50 hover:text-black transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-subheading text-black">Reset Your Password</h2>
            <p className="text-paragraph text-black/70 mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="_honey"
              className="visually-hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label htmlFor="email" className={formLabelStyles()}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={formInputStyles()}
                required
              />
            </div>

            {formResult && !formResult.success && (
              <div className="bg-red/10 border border-red text-red p-3 rounded-md text-[16px]">
                {formResult.message}
              </div>
            )}

            {formResult && formResult.success && (
              <div className="bg-green/10 border border-green text-green p-3 rounded-md text-[16px]">
                {formResult.message}
              </div>
            )}

            <ButtonType type="submit" cssClasses="w-full">
              Send Reset Link
            </ButtonType>
          </form>

          {/* Footer */}
          <div className="text-center text-paragraph text-black/60 text-[14px]">
            Remember your password?{" "}
            <button
              onClick={handleClose}
              className="text-blue hover:text-blue/80 underline font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
