import Image from "next/image";
import Link from "next/link";

const Cta2Component = () => {
  return (
    <section className="relative -mx-5 overflow-hidden bg-blue pt-10 grid gap-7 desktop-small:grid-cols-[1fr_0.75fr] desktop-small:h-[480px] desktop-small:gap-0 desktop-small:-mx-10 desktop:h-[600px] desktop-large:grid-cols-[1fr_0.5fr] desktop-large:h-[700px]">
      <h4 className="text-[40px] px-5 leading-[120%] tablet-small:text-[50px] text-white flex flex-col text-center desktop-small:pl-50px desktop-small:my-auto desktop-small:text-left min-[1350px]:text-[60px] desktop-large:text-[70px] full-hd:text-[90px]">
        Sell your car with
        <span className="text-yellow">Auto Marketplace QLD</span>
        <Link
          href="/sell-my-car"
          aria-label="Sell My Car"
          className="flex justify-center gap-2 p-2 -m-2 mx-auto text-white desktop-small:justify-start desktop-small:p-0 desktop-small:m-0 desktop-small:gap-2 desktop-small:mr-auto desktop-small:hover:text-yellow ease-in-out duration-300"
        >
          Sell My Car
          <Image
            src="/icons/click-bold-yellow.svg"
            alt="Sell My Car"
            width={166}
            height={134}
            className="w-[76px] h-auto -translate-y-1 desktop-small:translate-y-2 desktop-small:w-[90px] desktop:w-[100px] desktop-large:w-[120px] desktop-large:translate-y-2 desktop-large:translate-x-2 full-hd:w-[166px] full-hd:translate-y-4 full-hd:translate-x-4"
          />
        </Link>
      </h4>
      <div className="relative flex justify-center items-center desktop-small:block desktop-small:pb-0 desktop-small:place-self-center desktop-small:z-10">
        <Image
          src="/images/graphics/05a.png"
          alt="Sell my car"
          width={1500}
          height={600}
          className="w-full h-auto flex-shrink-0 desktop-small:absolute desktop-small:min-w-[1270px] desktop-small:-left-[420px] desktop-small:-top-[190px] desktop:min-w-[1470px] desktop:-top-[230px] desktop:-left-[35vw] desktop-large:min-w-[1750px] desktop-large:-top-[240px] desktop-large:-left-[40vw] full-hd:-left-[520px] full-hd:min-w-[1500px]"
        />
      </div>
      <div className="bg-yellow h-[calc(100px+10vw)] -mt-[calc(40px+5vw)] tablet-small:-mt-[calc(50px+5vw)] desktop-small:mt-0 desktop-small:absolute desktop-small:w-1/4 desktop-small:h-full desktop-small:right-[50px]" />
    </section>
  );
};

export default Cta2Component;
