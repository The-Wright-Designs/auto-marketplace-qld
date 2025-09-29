"use client";

import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import ButtonType from "@/_components/ui/buttons/button-type";
import PersonalInfoSection from "./personal-info-section";
import VehicleInfoSection from "./vehicle-info-section";
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
                <PersonalInfoSection
                  imageCount={imageCount}
                  error={error}
                />
                <VehicleInfoSection
                  onImageCountChange={setImageCount}
                />
              </div>
              <hr className="border-black/25 my-10 tablet:hidden" />
              <div className="flex flex-col justify-center gap-2 min-[600px]:justify-start tablet:hidden">
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
