import About2Component from "@/_components/pages/home-page/about-2-component";
import AboutComponent from "@/_components/pages/home-page/about-component";
import CarBrandsSlider from "@/_components/pages/home-page/car-brands-slider";
import Cta2Component from "@/_components/pages/home-page/cta-2-component";
import CtaComponent from "@/_components/pages/home-page/cta-component";
import HeroComponent from "@/_components/pages/home-page/hero-component";
import WelcomeComponent from "@/_components/pages/home-page/welcome-component";
import { PageWrapper } from "@/_lib/utils/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <HeroComponent cssClasses="-mx-5 desktop-small:-mx-50px full-hd:-mx-120px" />
      <CarBrandsSlider cssClasses="max-w-[1920px] my-[30px]" />
      <WelcomeComponent />
      <AboutComponent />
      <CtaComponent />
      <About2Component />
      <Cta2Component />
    </PageWrapper>
  );
}
