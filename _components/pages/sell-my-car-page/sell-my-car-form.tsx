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

const SellMyCarForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showFormSubmitted, setShowFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    if (showFormSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showFormSubmitted]);

  return (
    <PageWrapper useMainElement cssClasses="max-w-6xl mx-auto">
      <div id="sell-my-car" className="space-y-7">
        <h2 className="text-subheading full-hd:text-subheading-desktop">
          Sell My Car
        </h2>

        {showFormSubmitted ? (
          <div className="flex flex-col gap-5 justify-center items-center min-h-[50vh]">
            <p className="text-[20px] font-bold text-black pb-5">
              Your vehicle details have been submitted, we will be in touch
              soon.
            </p>
            <ButtonType onClick={() => setShowFormSubmitted(false)}>
              Back
            </ButtonType>
          </div>
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
                  } else {
                    setError(
                      result.error || "Failed to submit form. Please try again."
                    );
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
                  <div className="hidden tablet:flex flex-col gap-1">
                    <ButtonType
                      type="submit"
                      cssClasses="w-full -mt-2"
                      disabled={imageCount < 2}
                      title={
                        imageCount < 2 ? "Please upload at least 2 images" : ""
                      }
                    >
                      Submit Vehicle
                    </ButtonType>
                    {imageCount < 2 && (
                      <p className="text-[14px] text-red italic">
                        Please upload at least 2 images
                      </p>
                    )}
                  </div>
                  {/* General error message desktop */}
                  {error && (
                    <div className="hidden bg-red/50 rounded-md p-3 tablet:block">
                      <h4 className="text-paragraph font-semibold">
                        Submission error:
                      </h4>
                      <p className="text-[16px]">{error}</p>
                    </div>
                  )}
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
                      placeholder="Vehicle Year (optional)"
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
                    description="Images"
                    accept="image/*"
                    maxFiles={10}
                    onImageCountChange={setImageCount}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 mt-15 min-[600px]:justify-start tablet:hidden">
                <ButtonType
                  type="submit"
                  cssClasses="w-full min-[600px]:w-auto desktop-small:px-10"
                  disabled={imageCount < 2}
                  title={
                    imageCount < 2 ? "Please upload at least 2 images" : ""
                  }
                >
                  Submit Vehicle
                </ButtonType>
                {imageCount < 2 && (
                  <p className="text-[14px] text-red italic">
                    Please upload at least 2 images
                  </p>
                )}
              </div>
              {/* General error message mobile */}
              {error && (
                <div className="bg-red/50 rounded-md p-3 tablet:hidden">
                  <h4 className="text-paragraph font-semibold">
                    Submission error:
                  </h4>
                  <p className="text-[16px]">{error}</p>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default SellMyCarForm;
