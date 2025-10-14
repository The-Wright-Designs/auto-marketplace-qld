"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/_components/ui/contact/forms/input";
import { Textarea } from "@/_components/ui/contact/forms/textarea";
import { Label } from "@/_components/ui/contact/forms/label";
import ButtonType from "@/_components/ui/buttons/button-type";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sendEmail } from "@/_actions/send-email-actions";

export const ContactForm = () => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showEmailSubmitted, setShowEmailSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-7">
      {showEmailSubmitted ? (
        <div
          className="grid place-items-center min-h-[400px] p-10 bg-blue scroll-mt-56"
          id="submitted"
        >
          <p className="text-center text-white italic">
            Your email has been sent, we will be in touch soon.
          </p>
        </div>
      ) : (
        <>
          <p className="italic text-[16px]">
            Please fill out the below form and our team will get back to you
            ASAP...
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
            <div>
              <Label htmlFor="name" className="visually-hidden">
                Name:
              </Label>
              <Input
                type="text"
                placeholder="Name"
                name="name"
                id="name"
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
              <Input type="tel" placeholder="Phone" name="phone" id="phone" />
            </div>

            <div>
              <Label htmlFor="message" className="visually-hidden">
                Message:
              </Label>
              <Textarea
                placeholder="Message"
                name="message"
                rows={4}
                id="message"
                required
              />
            </div>

            <ButtonType type="submit" cssClasses="w-full min-[600px]:w-auto">
              Submit
            </ButtonType>
          </form>
        </>
      )}
    </div>
  );
};
