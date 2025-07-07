import Image from "next/image";

const WelcomeComponent = () => {
  return (
    <section className="pt-5 mb-10 grid gap-5 desktop-small:grid-cols-[1.5fr_2fr] desktop-small:gap-100px desktop:grid-cols-[1.25fr_2fr] desktop-large:grid-cols-[0.9fr_2fr] full-hd:gap-[200px] full-hd:grid-cols-[0.9fr_2fr]">
      <div className="relative -mx-5 desktop-small:order-last desktop-small:-mx-50px full-hd:-mx-120px">
        <Image
          src="/images/graphics/02a.png"
          alt="Welcome to Auto Marketplace QLD"
          width={1300}
          height={900}
          className="pr-5 pl-1 desktop-small:max-w-[920px] desktop-small:h-auto full-hd:max-w-[1100px]"
          sizes="(max-width: 1280px) 100vw, 50vw"
        />
        <div className="absolute -z-10 top-[15%] left-5 phone:left-8 rounded-l-full bg-blue h-[45vw] w-full desktop-small:h-[440px] desktop-small:-left-0 full-hd:h-[540px] full-hd:w-screen" />
      </div>
      <div className="flex flex-col gap-8 desktop-small:gap-50px desktop:place-self-center">
        <h2 className="text-[40px] leading-[120%] desktop-small:text-[50px]">
          Welcome to Auto Marketplace QLD
        </h2>
        <p className="text-[1.25rem] leading-[1.875rem] min-[1485px]:text-paragraph-desktop">
          – your trusted online portal for selling vehicles across Queensland.
          Whether you’re upgrading, downsizing, or simply ready to move on,
          we’re here to make it easy, fast, and secure to sell your car with
          confidence. Sell smarter and faster every time.
        </p>
      </div>
    </section>
  );
};

export default WelcomeComponent;
