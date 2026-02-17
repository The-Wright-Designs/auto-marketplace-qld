"use client";

import {
  useState,
  useEffect,
  useActionState,
  startTransition,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/_lib/firebase/firebase";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import FormInputPassword from "@/_components/ui/form/form-input-password";
import ButtonType from "@/_components/ui/buttons/button-type";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { loginAction } from "@/_actions/auth-actions";
import PasswordResetModal from "@/_components/ui/password-reset-modal";
import { useAuth } from "@/_lib/auth/auth-context";
import RecaptchaNotice from "@/_components/ui/recaptcha-notice";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use server action for form handling
  const [formResult, formAction, isPending] = useActionState(loginAction, null);

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
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        setIsLoading(false);
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

      // Handle the 3 most common error scenarios
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Handle successful login
  useEffect(() => {
    if (formResult?.success && formResult.user) {
      setUser(formResult.user);
      setIsLoading(false);

      const redirect = searchParams.get("redirect") || "/dealer-portal";
      router.push(redirect);
    }
  }, [formResult, router, searchParams, setUser]);

  // Handle form errors
  useEffect(() => {
    if (formResult && !formResult.success) {
      setError(formResult.message);
      setIsLoading(false);
    }
  }, [formResult]);

  return (
    <PageWrapper
      useMainElement
      cssClasses="min-h-[500px] flex flex-col items-center"
    >
      <div className="grid gap-10">
        <h1 className="text-heading tablet:text-heading-tablet full-hd:text-heading-desktop">
          Dealer Login
        </h1>
        <div className="grid gap-5">
          <p className="text-paragraph">Sign in to access your dealer portal</p>

          <form className="grid gap-6" onSubmit={handleSubmit}>
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
              disabled={isPending}
              autoComplete="email"
            />

            <FormInputPassword
              id="password"
              name="password"
              placeholder="Password"
              required
              label="Password"
              disabled={isPending}
              autoComplete="current-password"
            />
            {/* Display errors */}
            {(error || (formResult && !formResult.success)) && (
              <div className="bg-red/10 border border-red text-red p-4 rounded-md">
                {error || formResult?.message}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <ButtonType
                type="submit"
                cssClasses="w-full"
                isLoading={isLoading}
              >
                Sign in
              </ButtonType>
              <RecaptchaNotice />
            </div>
            <div className="flex justify-between items-center">
              <Link
                href="/for-dealers/register"
                className="text-blue hover:text-blue/80 text-[16px] font-light"
              >
                Register
              </Link>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={isPending}
                className="text-blue text-[16px] font-light hover:text-blue/80 disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
        <PasswordResetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </PageWrapper>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="spinner" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
