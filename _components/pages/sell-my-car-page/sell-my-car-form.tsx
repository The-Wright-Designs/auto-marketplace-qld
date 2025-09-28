"use client";

import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import ButtonType from "@/_components/ui/buttons/button-type";
import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import FormInputNumber from "@/_components/ui/form/form-input-number";
import FormInputTel from "@/_components/ui/form/form-input-tel";
import FormInputSelect from "@/_components/ui/form/form-input-select";
import FormInputFileAccumulator from "@/_components/ui/form/form-input-file-accumulator";
import { sellMyCarEmail } from "@/_actions/sell-my-car-email-actions";
import { useFormValidation } from "@/_hooks/useFormValidation";
import { RateLimiter } from "@/_lib/utils/rate-limiter";

const SellMyCarForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showFormSubmitted, setShowFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { validateSingleField, getFieldValidation } = useFormValidation();
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number;
    resetTime: number;
  } | null>(null);

  useEffect(() => {
    if (showFormSubmitted) {
      const element = document.getElementById("sell-my-car");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showFormSubmitted]);

  return (
    <PageWrapper useMainElement cssClasses="max-w-6xl mx-auto">
      <div id="sell-my-car" className="space-y-7">
        <h2 className="text-subheading full-hd:text-subheading-desktop">
          Sell My Car
        </h2>

        {showFormSubmitted ? (
          <p className="text-[20px] font-bold text-black pb-5">
            Your vehicle details have been submitted, we will be in touch soon.
          </p>
        ) : (
          <>
            <p className="text-[16px]">
              Please fill out your personal & vehicle details below, and our
              team reach out to you ASAP.
            </p>

            <form
              className="space-y-5"
              action={async (formData) => {
                try {
                  setError(null);
                  setFieldErrors({});

                  if (!executeRecaptcha) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    if (!executeRecaptcha) {
                      setError(
                        "Security verification unavailable. Please refresh the page and try again."
                      );
                      return;
                    }
                  }

                  const recaptchaToken = await executeRecaptcha(
                    "sell_my_car_form"
                  );
                  formData.append("recaptchaToken", recaptchaToken);

                  const result = await sellMyCarEmail(formData);

                  if (result.success) {
                    setShowFormSubmitted(true);
                    if (result.rateLimitInfo) {
                      setRateLimitInfo(result.rateLimitInfo);
                    }
                  } else {
                    if (result.fieldErrors) {
                      setFieldErrors(result.fieldErrors);
                      setError(
                        "Please correct the errors below and try again."
                      );
                    } else if (result.rateLimitInfo) {
                      setRateLimitInfo(result.rateLimitInfo);
                      const timeRemaining = RateLimiter.formatTimeRemaining(
                        result.rateLimitInfo.resetTime
                      );
                      setError(
                        `${result.error} Please try again in ${timeRemaining}.`
                      );
                    } else {
                      setError(
                        result.error ||
                          "Failed to submit form. Please try again."
                      );
                    }
                  }
                } catch (err) {
                  setError("An unexpected error occurred. Please try again.");
                  console.error("Sell my car form error:", err);
                } finally {
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
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <h3 className="text-blue font-bold text-paragraph-desktop">
                    Personal
                  </h3>
                  <div className="space-y-5 desktop-small:space-y-3">
                    <FormInputText
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      required
                      label="First Name"
                      labelClassName="visually-hidden"
                    />

                    <FormInputText
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      label="Last Name"
                      labelClassName="visually-hidden"
                    />

                    <FormInputTel
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="Contact Number"
                      required
                      label="Contact Number"
                      labelClassName="visually-hidden"
                    />

                    <FormInputEmail
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      label="Email Address"
                      labelClassName="visually-hidden"
                    />
                  </div>
                  <div className="hidden desktop-small:block">
                    <ButtonType type="submit" cssClasses="w-full">
                      Submit Vehicle
                    </ButtonType>
                  </div>
                </div>
                <div className="space-y-5">
                  <h3 className="text-blue font-bold text-paragraph-desktop">
                    Vehicle Information
                  </h3>
                  <div className="space-y-5 desktop-small:space-y-3">
                    <FormInputText
                      id="vehicleMake"
                      name="vehicleMake"
                      placeholder="Vehicle Make"
                      required
                      label="Vehicle Make"
                      labelClassName="visually-hidden"
                    />

                    <FormInputText
                      id="vehicleModel"
                      name="vehicleModel"
                      placeholder="Vehicle Model"
                      required
                      label="Vehicle Model"
                      labelClassName="visually-hidden"
                    />

                    <FormInputNumber
                      id="vehicleYear"
                      name="vehicleYear"
                      placeholder="Vehicle Year"
                      required
                      label="Vehicle Year"
                      labelClassName="visually-hidden"
                      min={1900}
                      max={new Date().getFullYear() + 1}
                    />

                    <FormInputSelect
                      id="fuelType"
                      name="fuelType"
                      options={[
                        { value: "diesel", label: "Diesel" },
                        { value: "petrol", label: "Petrol" },
                      ]}
                      required
                      placeholder="Select Fuel Type"
                      label="Fuel Type"
                      labelClassName="visually-hidden"
                    />

                    <FormInputSelect
                      id="transmission"
                      name="transmission"
                      options={[
                        { value: "manual", label: "Manual" },
                        { value: "automatic", label: "Automatic" },
                      ]}
                      required
                      placeholder="Select Transmission"
                      label="Transmission"
                      labelClassName="visually-hidden"
                    />
                  </div>
                  <FormInputFileAccumulator
                    id="images"
                    name="images"
                    required
                    label="Vehicle Images"
                    labelClassName="visually-hidden"
                    description="Upload vehicle images"
                    accept="image/*"
                    maxFiles={10}
                  />
                </div>
              </div>
              {/* General error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-[14px] text-red-600">{error}</p>
                </div>
              )}

              {/* Field-specific errors */}
              {Object.keys(fieldErrors).length > 0 && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <h4 className="text-red-600 font-semibold mb-2">
                    Please correct the following errors:
                  </h4>
                  <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                    {Object.entries(fieldErrors).map(([field, error]) => (
                      <li key={field}>
                        <strong>
                          {field.charAt(0).toUpperCase() + field.slice(1)}:
                        </strong>{" "}
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rate limit info */}
              {rateLimitInfo && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-md p-3">
                  <p className="text-[14px] text-yellow-700">
                    <strong>Rate Limit:</strong> {rateLimitInfo.remaining}{" "}
                    submissions remaining. Limit resets in{" "}
                    {RateLimiter.formatTimeRemaining(rateLimitInfo.resetTime)}.
                  </p>
                </div>
              )}
              <div className="flex justify-center mt-15 min-[600px]:justify-start desktop-small:hidden">
                <ButtonType
                  type="submit"
                  cssClasses="w-full min-[600px]:w-auto desktop-small:px-10"
                >
                  Submit Vehicle
                </ButtonType>
              </div>
            </form>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default SellMyCarForm;
