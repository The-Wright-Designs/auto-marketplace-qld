"use client";

import { ContactForm } from "@/_components/pages/contact-page/contact-form";
import ShowEmailAddress from "@/_components/ui/contact/show-email-address";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import Image from "next/image";

const contactStyles =
  "grid place-self-start tablet-small:grid-cols-[85px_1fr] items-center";

const ContactPage = () => {
  return (
    <PageWrapper
      useMainElement
      cssClasses="grid gap-7 tablet:grid-cols-2 tablet:gap-x-10"
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
            {/* <div className={contactStyles}>
                <p className="font-bold">Phone:</p>
                <ShowPhoneNumber />
              </div> */}
          </div>
          <hr className="border-black/25" />
          <ContactForm />
        </div>
      </div>
      <Image
        src="/images/placeholders/jaguar-e-gt-2-copy-6788058583eae.avif"
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
