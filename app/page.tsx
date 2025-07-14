import About2Component from "@/_components/home-page/about-2-component";
import AboutComponent from "@/_components/home-page/about-component";
import CarBrandsSlider from "@/_components/home-page/car-brands-slider";
import CtaComponent from "@/_components/home-page/cta-component";
import HeroComponent from "@/_components/home-page/hero-component";
import WelcomeComponent from "@/_components/home-page/welcome-component";

export default function Home() {
  return (
    <div className="px-5 desktop-small:px-50px full-hd:px-120px overflow-hidden">
      <div className="max-w-[1920px] mx-auto">
        <HeroComponent cssClasses="-mx-5 desktop-small:-mx-50px full-hd:-mx-120px" />
        <CarBrandsSlider cssClasses="max-w-[1920px] my-[30px]" />
        <WelcomeComponent />
        <AboutComponent />
        <CtaComponent />
        <About2Component />
      </div>
    </div>
  );
}
