import { ContactForm } from "@/_components/pages/contact-page/contact-form";
import ShowEmailAddress from "@/_components/ui/contact/show-email-address";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Auto Marketplace QLD",
  description:
    "Get in touch with the Auto Marketplace QLD team. We're here to help with any questions about selling your vehicle.",
  openGraph: {
    title: "Contact | Auto Marketplace QLD",
    description:
      "Get in touch with the Auto Marketplace QLD team. We're here to help with any questions about selling your vehicle.",
  },
};

const contactStyles =
  "grid place-self-start tablet-small:grid-cols-[85px_1fr] items-center";

const ContactPage = () => {
  return (
    <PageWrapper
      useMainElement
      cssClasses="grid gap-7 tablet:grid-cols-2 tablet:gap-x-5"
    >
      <div className="grid gap-7">
        <h2 className="text-subheading tablet:col-span-2 full-hd:text-subheading-desktop">
          Contact
        </h2>
        <div className="grid gap-7">
          <div className="grid gap-5 desktop-small:gap-2">
            <div className={contactStyles}>
              <p className="font-bold">Email:</p>
              <ShowEmailAddress />
            </div>
          </div>
          <hr className="border-black/25" />
          <ContactForm />
        </div>
      </div>
      <Image
        src="/images/about/auto-marketplace-qld-2.jpeg"
        alt="Auto Marketplace QLD"
        sizes="(max-width:1000px) 100vw, 50vw"
        width={1000}
        height={800}
        className="h-full w-full object-cover"
      />
    </PageWrapper>
  );
};

export default ContactPage;
