import { DealerRegistrationForm } from "@/_components/pages/for-dealers/register/dealer-registration-form";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealer Registration | Auto Marketplace QLD",
  description:
    "Register as a dealer on Auto Marketplace QLD and start listing vehicles today.",
  openGraph: {
    title: "Dealer Registration | Auto Marketplace QLD",
    description:
      "Register as a dealer on Auto Marketplace QLD and start listing vehicles today.",
  },
};

const RegisterPage = () => {
  return (
    <PageWrapper cssClasses="grid gap-10 tablet:grid-cols-2">
      <div>
        <h2 className="text-subheading mb-50px full-hd:text-subheading-desktop">
          Dealer Registration
        </h2>
        <DealerRegistrationForm />
      </div>
      <div className="h-full">
        <Image
          src="/images/about/auto-marketplace-qld-4.jpg"
          alt="Dealership showcase"
          width={1200}
          height={800}
          className="object-cover w-full h-full"
        />
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
