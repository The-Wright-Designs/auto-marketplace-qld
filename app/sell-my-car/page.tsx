import SellMyCarForm from "@/_components/pages/sell-my-car-page/sell-my-car-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell My Car | Auto Marketplace QLD",
  description:
    "Submit your vehicle for sale on Auto Marketplace QLD. Fast, secure, and trusted by Queensland sellers.",
  openGraph: {
    title: "Sell My Car | Auto Marketplace QLD",
    description:
      "Submit your vehicle for sale on Auto Marketplace QLD. Fast, secure, and trusted by Queensland sellers.",
  },
};

const SellMyCarPage = () => {
  return <SellMyCarForm />;
};

export default SellMyCarPage;
