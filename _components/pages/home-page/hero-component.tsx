import classNames from "classnames";
import Image from "next/image";

interface HeroComponentProps {
  cssClasses?: string;
}

const HeroComponent = ({ cssClasses }: HeroComponentProps) => {
  return (
    <section
      className={classNames(
        "bg-yellow pt-16 overflow-hidden tablet-small:pt-50px tablet:pt-100px desktop:pt-150px",
        cssClasses
      )}
    >
      <h2 className="grid text-center text-subheading phone:text-subheading-desktop tablet-small:text-left tablet-small:ml-10 desktop-small:text-[100px] desktop-small:leading-[100px] desktop-small:ml-20 desktop:text-[150px] desktop:leading-[150px]">
        sell smart.
        <span className="text-blue text-subheading phone:text-subheading-desktop tablet-small:text-left desktop-small:text-[100px] desktop-small:leading-[100px] desktop:text-[150px] desktop:leading-[150px]">
          sell fast.
        </span>
        sell online.
      </h2>
      <div className="overflow-hidden h-[calc(20vw+160px)] phone:h-[calc(30vw+160px)] min-[600px]:h-[calc(40vw+160px)] tablet-small:h-[320px] tablet-small:overflow-visible desktop-small:h-[200px]">
        <Image
          src="/images/graphics/02.png"
          alt="Sell smart, sell fast, sell online with AMQ."
          width={1380}
          height={1380}
          className="min-w-[125%] h-auto -translate-x-8 min-[600px]:-translate-x-12 -translate-y-[calc(27.5vw)] tablet-small:min-w-[1000px] tablet-small:translate-x-24 tablet-small:-translate-y-[380px] min-[900px]:min-w-[1100px] min-[900px]:-translate-y-[410px] tablet:min-w-[1200px] tablet:-translate-y-[520px] tablet:translate-x-40 min-[1150px]:min-w-[1300px] min-[1150px]:-translate-y-[560px] desktop-small:min-w-[1362px] desktop-small:-translate-y-[700px] desktop-small:translate-x-[430px] desktop:-translate-y-[830px] desktop:translate-x-[675px]"
          sizes="125vw"
        />
      </div>
    </section>
  );
};

export default HeroComponent;
