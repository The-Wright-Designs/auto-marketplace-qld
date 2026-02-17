import { PageWrapper } from "@/_lib/utils/page-wrapper";
import AboutPageComponent from "@/_components/pages/about-page/about-page-component";
import OurStoryComponent from "@/_components/pages/about-page/our-story-component";
import FaqComponent from "@/_components/pages/about-page/faq-component";
import FeesComponent from "@/_components/pages/about-page/fees-component";
import generalData from "@/_data/general-data.json";
import HowItWorksComponent from "@/_components/pages/about-page/how-it-works-component";
import Image from "next/image";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About | Auto Marketplace QLD",
  description:
    "Learn about Auto Marketplace QLD — our story, how it works, seller fees, and frequently asked questions.",
  openGraph: {
    title: "About | Auto Marketplace QLD",
    description:
      "Learn about Auto Marketplace QLD — our story, how it works, seller fees, and frequently asked questions.",
  },
};

const AboutPage = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10">
        <section className="grid gap-7">
          <h2 className="text-subheading full-hd:text-subheading-desktop">
            About
          </h2>
          <AboutPageComponent />
        </section>
        <div
          id="our-story"
          className="-translate-y-40 tablet:-translate-y-28"
        />
        <main className="grid gap-7">
          <h3>Our Story</h3>
          <OurStoryComponent />
        </main>
        <div
          id="how-it-works"
          className="-translate-y-40 tablet:-translate-y-28"
        />
        <section className="grid gap-7">
          <h3>How It Works</h3>
          <HowItWorksComponent />
        </section>
        <div
          id="seller-fees"
          className="-translate-y-40 tablet:-translate-y-28"
        />
        <section className="grid gap-7">
          <h3>Seller Fees</h3>
          <div className="grid gap-7 desktop-small:grid-cols-2 gap-x-10">
            <FeesComponent fees={generalData.aboutPage.fees.sellerFees} />
            <Image
              src={generalData.aboutPage.fees.image.src}
              alt={generalData.aboutPage.fees.image.alt}
              width={1000}
              height={800}
              className="w-full h-full object-cover aspect-video desktop-small:aspect-auto"
            />
          </div>
        </section>
        <div id="faqs" className="-translate-y-28" />
        <section className="grid gap-7">
          <h3>Frequently Asked Questions</h3>
          <FaqComponent />
        </section>
      </div>
    </PageWrapper>
  );
};

export default AboutPage;
