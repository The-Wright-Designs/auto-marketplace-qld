import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import ButtonType from "@/_components/ui/buttons/button-type";
import { resendResetLinkAction } from "@/_actions/password-reset-email-actions";

interface CodeExpiredStateProps {
  error: string;
  email: string;
}

export default function CodeExpiredState({
  error,
  email,
}: CodeExpiredStateProps) {
  const [inputEmail, setInputEmail] = useState(email);
  const [state, formAction] = useActionState(resendResetLinkAction, null);
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-grey/10">
      <div className="bg-white p-5 rounded-md shadow-md max-w-md w-full space-y-5">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="#ff0000"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-subheading text-center">Link Expired</h2>
        <p className="text-paragraph text-center">{error}</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-paragraph mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="w-full px-3 py-2 border border-grey rounded-md text-paragraph"
              placeholder="Enter your email address"
              required
            />
          </div>

          <ButtonType cssClasses="w-full" disabled={!inputEmail} type="submit">
            Resend Password Reset Link
          </ButtonType>

          {state && (
            <div className="p-3 rounded-md text-paragraph text-center">
              {state.message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-paragraph desktop-small:text-link-blue desktop-small:hover:opacity-80 ease-in-out duration-300"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
