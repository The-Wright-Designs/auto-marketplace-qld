"use client";

import { useState, useActionState, startTransition, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { resendResetLinkAction } from "@/_actions/password-reset-email-actions";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import ButtonType from "@/_components/ui/buttons/button-type";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PasswordResetModalContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResult, formAction] = useActionState(resendResetLinkAction, null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      return;
    }

    if (!executeRecaptcha) {
      return;
    }

    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha("password_reset_modal");

      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("recaptchaToken", recaptchaToken);

      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      const formData = new FormData(e.target as HTMLFormElement);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  useEffect(() => {
    if (formResult && formResult.success) {
      setIsSubmitting(false);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [formResult, onClose]);

  return (
    <div className="relative bg-white rounded-md shadow-lg max-w-md w-full mx-5 max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
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

      <div className="p-5 space-y-5">
        <div className="text-center">
          <h2 className="text-subheading">Reset Your Password</h2>
          <p className="text-paragraph mt-2">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="_honey"
            className="visually-hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <FormInputEmail
            id="email"
            name="email"
            placeholder="Email address"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {formResult && !formResult.success && (
            <div className="bg-red/10 border border-red text-red p-4 rounded-md">
              {formResult.message}
            </div>
          )}

          {formResult && formResult.success && (
            <div className="bg-red/10 border border-black p-4 rounded-md">
              {formResult.message}
            </div>
          )}

          <ButtonType type="submit" cssClasses="w-full" isLoading={isSubmitting}>
            Send Reset Link
          </ButtonType>
        </form>
      </div>
    </div>
  );
}

export default function PasswordResetModal({
  isOpen,
  onClose,
}: PasswordResetModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center phone:p-4"
      key={String(isOpen)}
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <PasswordResetModalContent key={String(isOpen)} onClose={onClose} />
    </div>
  );
}
