import Link from "next/link";
import {
  PasswordResetResult,
  resetPasswordAction,
} from "@/_actions/password-reset-actions";
import FormInputPassword from "@/_components/ui/form/form-input-password";
import ButtonType from "@/_components/ui/buttons/button-type";

interface PasswordResetFormProps {
  oobCode: string;
  email: string;
  error?: string;
  success?: string;
  formAction: (
    formData: FormData
  ) => void | Promise<void | PasswordResetResult>;
}

export default function PasswordResetForm({
  oobCode,
  email,
  error,
  success,
  formAction,
}: PasswordResetFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-grey/10">
      <div className="bg-white p-5 rounded-md shadow-md max-w-md w-full space-y-5">
        <h2 className="text-subheading text-black text-center">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hidden inputs for server action */}
          <input type="hidden" name="oobCode" value={oobCode} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="verified" value="true" />

          <FormInputPassword
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            label="New Password"
            required
            autoComplete="new-password"
            description="Password must contain at least 8 characters with uppercase, lowercase, and numbers."
          />

          <FormInputPassword
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            label="Confirm Password"
            required
            autoComplete="new-password"
          />

          {error && (
            <div className="bg-red/10 border border-red text-red p-3 rounded-md text-[16px]">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green/10 border border-green text-green p-3 rounded-md text-[16px]">
              {success}
            </div>
          )}

          <ButtonType type="submit" cssClasses="w-full">
            Reset Password
          </ButtonType>
        </form>

        <div className="text-center">
          <Link
            href="/for-dealers/login"
            className="text-paragraph desktop:text-link-blue"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
