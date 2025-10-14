"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/_components/ui/contact/forms/input";
import { Label } from "@/_components/ui/contact/forms/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/_components/ui/form/form-input-radio";
import ButtonType from "@/_components/ui/buttons/button-type";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sendEmail } from "@/_actions/dealer-registration-actions";
import Link from "next/link";

export const DealerRegistrationForm = () => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showEmailSubmitted, setShowEmailSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  return (
    <div className="space-y-7">
      {showEmailSubmitted ? (
        <div
          className="grid place-items-center min-h-[400px] p-10 bg-blue rounded-lg scroll-mt-56"
          id="submitted"
        >
          <div className="space-y-6">
            <p className="text-center text-white">
              Your application has been sent, our team will be in touch soon.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-[16px]">
            Complete the application form below and a member of our friendly
            team will be in touch soon.
          </p>

          {error && (
            <div className="bg-red/10 border border-red text-red p-4 rounded">
              {error}
            </div>
          )}
          <form
            className="space-y-5"
            action={async (formData) => {
              try {
                setError(null);

                if (!executeRecaptcha) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  if (!executeRecaptcha) {
                    setError(
                      "Security verification unavailable. Please refresh the page and try again."
                    );
                    return;
                  }
                }

                const recaptchaToken = await executeRecaptcha("contact_form");
                formData.append("recaptchaToken", recaptchaToken);

                const result = await sendEmail(formData);

                if (result.success) {
                  setShowEmailSubmitted(true);
                } else {
                  setError(
                    result.error || "Failed to send message. Please try again."
                  );
                }
              } catch (err) {
                setError("An unexpected error occurred. Please try again.");
                console.error("Contact form error:", err);
              } finally {
                router.push("#submitted");
              }
            }}
          >
            <input
              type="text"
              name="_honey"
              className="visually-hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="grid gap-7 tablet:grid-cols-2">
              <div>
                <Label htmlFor="firstName" className="visually-hidden">
                  First Name:
                </Label>
                <Input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  id="firstName"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="visually-hidden">
                  Last Name:
                </Label>
                <Input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  id="lastName"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="visually-hidden">
                  Email:
                </Label>
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  id="email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="visually-hidden">
                  Phone:
                </Label>
                <Input
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                  id="phone"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-16px font-medium text-black mb-2 block">
                Are you a licensed dealer?
              </Label>
              <RadioGroup name="licensedDealer" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="licensed-yes" />
                  <Label
                    htmlFor="licensed-yes"
                    className="text-16px font-normal translate-y-1"
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="licensed-no" />
                  <Label
                    htmlFor="licensed-no"
                    className="text-16px font-normal translate-y-1"
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-16px font-medium text-black mb-2 block">
                Interested in:
              </Label>
              <RadioGroup name="interestedIn" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buying" id="interested-buying" />
                  <Label
                    htmlFor="interested-buying"
                    className="text-16px font-normal translate-y-1"
                  >
                    Buying
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selling" id="interested-selling" />
                  <Label
                    htmlFor="interested-selling"
                    className="text-16px font-normal translate-y-1"
                  >
                    Selling
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="interested-both" />
                  <Label
                    htmlFor="interested-both"
                    className="text-16px font-normal translate-y-1"
                  >
                    Both
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="legal-acceptance"
                name="legalAcceptance"
                required
                onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                className="mt-2 size-4 border-2 border-grey/50 rounded focus:outline-none focus:ring focus:ring-blue"
              />
              <Label
                htmlFor="legal-acceptance"
                className="text-16px font-normal translate-y-1"
              >
                I accept the{" "}
                <Link href="/terms" className="text-link-blue underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-link-blue underline"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <ButtonType
              type="submit"
              cssClasses="w-full min-[600px]:w-auto"
              disabled={!isTermsAccepted}
              title={
                !isTermsAccepted
                  ? "Please accept the Terms & Conditions and Privacy Policy to continue"
                  : undefined
              }
            >
              Submit Application
            </ButtonType>
          </form>
        </>
      )}
    </div>
  );
};
