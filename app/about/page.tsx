import { PageWrapper } from "@/_lib/utils/page-wrapper";
import AboutPageComponent from "@/_components/about-page/about-page-component";
import OurStoryComponent from "@/_components/about-page/our-story-component";
import FaqComponent from "@/_components/about-page/faq-component";
import FeesComponent from "@/_lib/fees-component";
import generalData from "@/_data/general-data.json";
import Image from "next/image";

const AboutPage = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10">
        <div className="grid gap-7">
          <h2 className="text-subheading full-hd:text-subheading-desktop">
            About
          </h2>
          <AboutPageComponent />
        </div>
        <div id="our-story" className="-translate-y-28" />
        <div className="grid gap-7">
          <h3>Our Story</h3>
          <OurStoryComponent />
        </div>
        <div id="seller-fees" className="-translate-y-28" />
        <div className="grid gap-7 desktop-small:grid-cols-2 desktop-small:gap-x-10">
          <h3 className="desktop-small:col-span-2">Seller Fees</h3>
          <FeesComponent fees={generalData.aboutPage.fees.sellerFees} />
          <Image
            src="/images/placeholders/BLOG-FEATURED-IMAGE-7.png"
            alt="Auto Marketplace Queensland"
            width={1000}
            height={800}
            className="w-full h-full object-cover aspect-video desktop-small:aspect-auto"
          />
          <div id="faqs" className="-translate-y-28" />
        </div>
        <div className="grid gap-7">
          <h3>Frequently Asked Questions</h3>
          <FaqComponent />
        </div>
      </div>
    </PageWrapper>
  );
};

export default AboutPage;
