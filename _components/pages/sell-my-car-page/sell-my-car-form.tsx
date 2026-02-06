"use client";

import { useEffect, useState, useRef } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import ButtonType from "@/_components/ui/buttons/button-type";
import PersonalInfoSection from "./personal-info-section";
import VehicleInfoSection from "./vehicle-info-section";
import { sellMyCarEmail } from "@/_actions/sell-my-car-email-actions";
import Image from "next/image";
import RecaptchaNotice from "@/_components/ui/recaptcha-notice";

const SellMyCarForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const formRef = useRef<HTMLFormElement>(null);
  const [showFormSubmitted, setShowFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(0);

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
    setError(null);

    try {
      if (!executeRecaptcha) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!executeRecaptcha) {
          setError(
            "Security verification unavailable. Please refresh the page and try again.",
          );
          return;
        }
      }

      const recaptchaToken = await executeRecaptcha("sell_my_car_form");

      const formDataToSubmit = new FormData(formRef.current!);

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "vehicleYear" && value === "") {
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
    }
  };

  return (
    <PageWrapper useMainElement cssClasses="max-w-6xl mx-auto">
      <div id="sell-my-car" className="grid gap-7">
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
            <form ref={formRef} className="grid gap-5" onSubmit={handleSubmit}>
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
                />
                <VehicleInfoSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onImageCountChange={setImageCount}
                />
              </div>
              <hr className="border-black/25 my-10 tablet:hidden" />
              <div className="flex flex-col justify-center gap-4 min-[600px]:justify-start tablet:hidden">
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
                <RecaptchaNotice />
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
