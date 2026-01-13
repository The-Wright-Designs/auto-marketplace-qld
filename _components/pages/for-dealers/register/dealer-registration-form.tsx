"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import FormInputTel from "@/_components/ui/form/form-input-tel";
import FormInputCheckbox from "@/_components/ui/form/form-input-checkbox";
import { FormLabel } from "@/_components/ui/form/form-label";
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
    <div className="grid gap-7">
      {showEmailSubmitted ? (
        <div
          className="grid place-items-center min-h-[400px] p-10 bg-blue rounded-md scroll-mt-56"
          id="submitted"
        >
          <div className="grid gap-6">
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
            <div className="bg-red/10 border border-red text-red p-4 rounded-md">
              {error}
            </div>
          )}
          <form
            className="grid gap-5"
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
              <FormInputText
                id="firstName"
                name="firstName"
                placeholder="First Name"
                required
              />

              <FormInputText
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                required
              />

              <FormInputEmail
                id="email"
                name="email"
                placeholder="Email"
                required
              />

              <FormInputTel
                id="phone"
                name="phone"
                placeholder="Phone"
                required
              />
            </div>
            <div>
              <FormLabel className="text-16px font-medium text-black mb-2 block">
                Are you a licensed dealer?
              </FormLabel>
              <RadioGroup name="licensedDealer" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="licensed-yes" />
                  <FormLabel
                    htmlFor="licensed-yes"
                    className="text-16px font-normal translate-y-1"
                  >
                    Yes
                  </FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="licensed-no" />
                  <FormLabel
                    htmlFor="licensed-no"
                    className="text-16px font-normal translate-y-1"
                  >
                    No
                  </FormLabel>
                </div>
              </RadioGroup>
            </div>
            <div>
              <FormLabel className="text-16px font-medium text-black mb-2 block">
                Interested in:
              </FormLabel>
              <RadioGroup name="interestedIn" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buying" id="interested-buying" />
                  <FormLabel
                    htmlFor="interested-buying"
                    className="text-16px font-normal translate-y-1"
                  >
                    Buying
                  </FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selling" id="interested-selling" />
                  <FormLabel
                    htmlFor="interested-selling"
                    className="text-16px font-normal translate-y-1"
                  >
                    Selling
                  </FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="interested-both" />
                  <FormLabel
                    htmlFor="interested-both"
                    className="text-16px font-normal translate-y-1"
                  >
                    Both
                  </FormLabel>
                </div>
              </RadioGroup>
            </div>
            <FormInputCheckbox
              id="legal-acceptance"
              name="legalAcceptance"
              required
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
            >
              I accept the{" "}
              <Link
                href="/terms-and-conditions"
                className="text-link-blue underline"
                target="_blank"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-link-blue underline"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </FormInputCheckbox>
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
