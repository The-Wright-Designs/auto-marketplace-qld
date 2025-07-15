"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CtaComponent = () => {
  const [ctaHover, setCtaHover] = useState(false);

  return (
    <section className="-mx-5 overflow-hidden desktop-small:-mx-50px desktop-small:relative desktop-small:h-[400px] desktop:h-[620px]">
      <div className="bg-blue py-10 grid gap-8 desktop-small:grid-cols-[350px_1fr] desktop-small:h-full desktop:grid-cols-[450px_1fr] desktop-large:grid-cols-[440px_1fr]">
        <h4 className="text-[60px] px-5 leading-[120%] text-white flex flex-col text-center desktop-small:place-self-center desktop-small:text-left desktop-small:px-0 desktop-small:pl-50px desktop:text-[90px]">
          We sell <span className="text-yellow">so you don't have to.</span>
        </h4>
        <div className="relative flex justify-center items-center desktop-small:block desktop-small:pb-0 desktop-small:place-self-center">
          <Image
            src="/images/graphics/05a.png"
            alt="Sell my car"
            width={1500}
            height={600}
            className="w-full h-auto flex-shrink-0 desktop-small:absolute desktop-small:min-w-[970px] desktop-small:-left-[480px] desktop-small:-top-[130px] desktop:min-w-[1370px] desktop:-top-[160px] desktop:-left-[670px] desktop-large:min-w-[1550px] desktop-large:-top-[200px] desktop-large:-left-[825px]"
          />
        </div>
      </div>
      <Link
        href="sell-my-car"
        aria-label="Sell My Car"
        className={classNames(
          "bg-yellow py-4 min-[400px]:py-10 px-5 flex items-center justify-center gap-3 ease-in-out duration-300 desktop-small:absolute desktop-small:top-0 desktop-small:right-[100px] desktop-small:w-[300px] desktop-small:h-[400px] desktop-small:border-8 border-yellow desktop:h-[620px] desktop:right-[50px] desktop:w-[450px] desktop-large:w-[526px]",
          {
            "desktop-small:bg-yellow": !ctaHover,
            "desktop-small:bg-blue": ctaHover,
          }
        )}
        onMouseEnter={() => setCtaHover(true)}
        onMouseLeave={() => setCtaHover(false)}
      >
        <h3
          className={classNames(
            "text-[60px] text-center leading-[120%] uppercase ease-in-out duration-300 flex flex-wrap items-center gap-2 justify-center desktop:text-[80px] desktop-large:text-[100px]",
            {
              "desktop-small:text-yellow": ctaHover,
            }
          )}
        >
          Sell My{" "}
          <span
            className={classNames(
              "flex gap-2 text-blue ease-in-out duration-300",
              {
                "desktop-small:text-yellow": ctaHover,
              }
            )}
          >
            Car
            <Image
              src="/icons/click-bold-blue.svg"
              alt="Sell My Car"
              width={70}
              height={50}
              className="ease-in-out duration-300 desktop-small:hidden"
            />
            {ctaHover ? (
              <Image
                src="/icons/click-bold-yellow.svg"
                alt="Sell My Car"
                width={90}
                height={75}
                className="hidden h-auto ease-in-out duration-300 desktop-small:block desktop:w-[125px] desktop-large:w-[166px]"
              />
            ) : (
              <Image
                src="/icons/click-bold-blue.svg"
                alt="Sell My Car"
                width={90}
                height={75}
                className="hidden h-auto ease-in-out duration-300 desktop-small:block desktop:w-[125px] desktop-large:w-[166px]"
              />
            )}
          </span>
        </h3>
      </Link>
    </section>
  );
};

export default CtaComponent;
