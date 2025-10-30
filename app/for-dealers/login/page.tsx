"use client";

import { useState, useEffect, useActionState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/_lib/firebase/firebase";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import ButtonType from "@/_components/ui/buttons/button-type";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { hybridLoginAction } from "@/_actions/auth-actions";
import PasswordResetModal from "@/_components/ui/password-reset-modal";
import { useAuth } from "@/_lib/auth/auth-context";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use server action for form handling
  const [formResult, formAction, isPending] = useActionState(
    hybridLoginAction,
    null
  );

  // Handle error from URL params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setError(decodeURIComponent(error));
    }
  }, [searchParams]);

  // Handle client-side authentication and then server session creation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        setIsSubmitting(false);
        return;
      }

      // Get reCAPTCHA token
      let recaptchaToken = "";
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha("login_form");
        } catch (recaptchaError) {
          console.error("reCAPTCHA error:", recaptchaError);
        }
      }

      // First authenticate with Firebase client-side to verify password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // Add ID token to form data for server action
      formData.set("idToken", idToken);
      formData.set("recaptchaToken", recaptchaToken);

      // Submit to server action to create session using startTransition
      startTransition(() => {
        formAction(formData);
      });
    } catch (err: unknown) {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please try again.";

      const error = err as { code?: string; message?: string };

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection";
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Handle successful login
  useEffect(() => {
    if (formResult?.success && formResult.user) {
      setUser(formResult.user);

      const redirect =
        searchParams.get("redirect") || "/dealer-portal/dashboard";
      router.push(redirect);
    }
  }, [formResult, router, searchParams, setUser]);

  // Handle form errors
  useEffect(() => {
    if (formResult && !formResult.success) {
      setError(formResult.message);
      setIsSubmitting(false);
    }
  }, [formResult]);

  const isFormDisabled = isPending || isSubmitting;

  return (
    <PageWrapper
      useMainElement
      cssClasses="grid place-items-center min-h-screen py-12"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-heading tablet:text-heading-tablet full-hd:text-heading-desktop">
            Dealer Login
          </h1>
          <p className="mt-2 text-paragraph">
            Sign in to access your dealer portal
          </p>
        </div>

        {/* Display errors */}
        {(error || (formResult && !formResult.success)) && (
          <div className="bg-red/10 border border-red text-red p-4 rounded-md">
            {error || formResult?.message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Honeypot field for bot protection */}
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
            required
            label="Email"
            disabled={isFormDisabled}
          />

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-grey mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              disabled={isFormDisabled}
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-grey/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={isFormDisabled}
                className="text-blue hover:text-blue/80 underline disabled:opacity-50"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <ButtonType
            type="submit"
            cssClasses="w-full"
            disabled={isFormDisabled}
            isLoading={isSubmitting}
          >
            Sign in
          </ButtonType>
        </form>

        <PasswordResetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
