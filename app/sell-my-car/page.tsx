"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import SellMyCarForm from "@/_components/pages/sell-my-car-page/sell-my-car-form";

const SellMyCarPage = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    >
      <SellMyCarForm />
    </GoogleReCaptchaProvider>
  );
};

export default SellMyCarPage;
