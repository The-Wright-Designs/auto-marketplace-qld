"use client";

import { useEffect, useState, useRef } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import ButtonType from "@/_components/ui/buttons/button-type";
import PersonalInfoSection from "./personal-info-section";
import VehicleInfoSection from "./vehicle-info-section";
import { sellMyCarEmail } from "@/_actions/sell-my-car-email-actions";
import Image from "next/image";

const SellMyCarForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const formRef = useRef<HTMLFormElement>(null);
  const [showFormSubmitted, setShowFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    fuelType: "",
    transmission: "",
  });

  useEffect(() => {
    if (showFormSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showFormSubmitted]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      fuelType: "",
      transmission: "",
    });
    setImageCount(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!executeRecaptcha) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!executeRecaptcha) {
          setError(
            "Security verification unavailable. Please refresh the page and try again."
          );
          setIsSubmitting(false);
          return;
        }
      }

      const recaptchaToken = await executeRecaptcha("sell_my_car_form");

      // Create FormData from the actual form element to capture hidden inputs
      const formDataToSubmit = new FormData(formRef.current!);

      // Update with controlled form values (to override any default/empty values)
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "vehicleYear" && value === "") {
          // Skip empty vehicleYear since it's optional
          return;
        }
        formDataToSubmit.set(key, String(value));
      });

      formDataToSubmit.set("recaptchaToken", recaptchaToken);

      const result = await sellMyCarEmail(formDataToSubmit);

      if (result.success) {
        resetForm();
        setShowFormSubmitted(true);
      } else {
        // Handle specific error messages
        if (result.error) {
          setError(result.error);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        // Log detailed error for debugging
        console.log("Form submission failed:", result);
        if (result.fieldErrors) {
          console.log("Field errors:", result.fieldErrors);
        }
        setError(result.error || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sell my car form error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper useMainElement cssClasses="max-w-6xl mx-auto">
      <div id="sell-my-car" className="space-y-7">
        <h2 className="text-subheading full-hd:text-subheading-desktop">
          Sell My Car
        </h2>

        {showFormSubmitted ? (
          <div className="flex flex-col gap-5 justify-center items-center min-h-[60vh]">
            <Image
              src="/logo/amq-logo.png"
              alt="Auto Marketplace QLD logo"
              width={200}
              height={200}
            />
            <p className="text-[20px] max-w-[500px] text-center font-bold text-black pb-5">
              Thank you for your submission, our team will be in touch with you
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

            <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="_honey"
                className="visually-hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10">
                <PersonalInfoSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  imageCount={imageCount}
                  error={error}
                  isSubmitting={isSubmitting}
                />
                <VehicleInfoSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onImageCountChange={setImageCount}
                />
              </div>
              <hr className="border-black/25 my-10 tablet:hidden" />
              <div className="flex flex-col justify-center gap-2 min-[600px]:justify-start tablet:hidden">
                <ButtonType
                  type="submit"
                  cssClasses="w-full min-[600px]:w-auto desktop-small:px-10"
                  disabled={imageCount < 2 || isSubmitting}
                  title={
                    imageCount < 2 ? "Please upload at least 2 images" : ""
                  }
                >
                  {isSubmitting ? (
                    <span>
                      Submitting
                      <span className="inline-flex">
                        <span
                          className="inline-block transition-all duration-300"
                          style={{
                            animation: "growShrink 1.4s infinite",
                            animationDelay: "0s",
                          }}
                        >
                          .
                        </span>
                        <span
                          className="inline-block transition-all duration-300"
                          style={{
                            animation: "growShrink 1.4s infinite",
                            animationDelay: "0.2s",
                          }}
                        >
                          .
                        </span>
                        <span
                          className="inline-block transition-all duration-300"
                          style={{
                            animation: "growShrink 1.4s infinite",
                            animationDelay: "0.4s",
                          }}
                        >
                          .
                        </span>
                      </span>
                      <style jsx>{`
                        @keyframes growShrink {
                          0%,
                          100% {
                            transform: scale(0.8);
                            opacity: 0.3;
                          }
                          50% {
                            transform: scale(1.2);
                            opacity: 1;
                          }
                        }
                      `}</style>
                    </span>
                  ) : (
                    "Submit Vehicle"
                  )}
                </ButtonType>

                <p className="text-[14px] text-red italic">
                  {imageCount < 2 && "Please upload at least 2 images "}
                </p>
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
