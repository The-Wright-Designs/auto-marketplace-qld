"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuth, verifyPasswordResetCode } from "firebase/auth";
import { firebaseApp } from "@/_lib/firebase/firebase";
import { resetPasswordAction } from "@/_actions/password-reset-actions";
import LoadingState from "@/_components/pages/auth/password-reset/loading-state";
import SuccessState from "@/_components/pages/auth/password-reset/success-state";
import CodeExpiredState from "@/_components/pages/auth/password-reset/code-expired-state";
import PasswordResetForm from "@/_components/pages/auth/password-reset/password-reset-form";

function PasswordResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [codeExpired, setCodeExpired] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const verifyResetCode = async () => {
      if (mode !== "resetPassword" || !oobCode) {
        setError("Invalid reset link");
        setLoading(false);
        return;
      }

      try {
        const auth = getAuth(firebaseApp);
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setLoading(false);
      } catch (error: unknown) {
        console.error("Error verifying reset code:", error);
        const firebaseError = error as { code?: string };
        if (
          firebaseError.code === "auth/invalid-action-code" ||
          firebaseError.code === "auth/expired-action-code"
        ) {
          setCodeExpired(true);
          setError("This password reset link has expired or is invalid");
        } else {
          setError("Unable to verify reset link");
        }
        setLoading(false);
      }
    };

    verifyResetCode();
  }, [mode, oobCode]);

  const handlePasswordReset = async (formData: FormData) => {
    setError("");
    setSuccessMessage("");

    try {
      // Add verification flag since client-side oobCode verification was successful
      formData.append("verified", "true");

      const result = await resetPasswordAction(formData);

      if (result.success) {
        setSuccessMessage(
          "Password has been successfully reset. Redirecting to login..."
        );
        setTimeout(() => {
          router.push("/login?reset=success");
        }, 3000);
      } else {
        if (
          result.message.includes("expired") ||
          result.message.includes("invalid")
        ) {
          setCodeExpired(true);
        }

        if (result.details && result.details.length > 0) {
          setError(`${result.message}: ${result.details.join(", ")}`);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (successMessage) {
    return <SuccessState />;
  }

  if (codeExpired) {
    return <CodeExpiredState error={error} email={email} />;
  }

  return (
    <PasswordResetForm
      oobCode={oobCode || ""}
      email={email}
      error={error}
      success={successMessage}
      formAction={handlePasswordReset}
    />
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex items-center justify-center bg-grey/10">
          <div className="spinner" />
        </div>
      }
    >
      <PasswordResetContent />
    </Suspense>
  );
}
