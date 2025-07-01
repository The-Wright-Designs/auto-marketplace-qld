import Link from "next/link";

import Image from "next/image";
import DesktopHeaderNav from "./desktop-header-nav";

export function DesktopHeader() {
  return (
    <div className="hidden desktop-small:flex items-center justify-between h-[120px]">
      <Link
        href="/"
        className="flex gap-2 items-center ease-in-out duration-300 hover:opacity-80"
      >
        <Image
          src="/logo/amq-logo.png"
          alt="Auto Marketplace QLD logo"
          width={79}
          height={79}
        />
        <div className="relative hidden desktop:block desktop-large:-ml-1">
          <h1 className="text-white text-paragraph-desktop grid gap-x-2 font-bold desktop-large:tracking-[0.030rem] desktop-large:text-[40px] desktop-large:leading-[40px] desktop-large:block">
            Auto <span className="text-yellow">Marketplace</span>{" "}
            <span className="col-span-2 text-white text-[40px]">QLD</span>
          </h1>
          <div className="hidden absolute top-[36px] right-1 desktop-large:flex gap-[2px] place-self-end bg-blue z-50">
            <h2 className="text-white text-[12.5px] leading-[9px] italic font-light">
              Sell smarter. Faster. Online.
            </h2>
            <Image
              src="/icons/car.svg"
              alt="Sell smarter. Faster. Online."
              width={20}
              height={10}
            />
          </div>
        </div>
      </Link>
      <DesktopHeaderNav />
    </div>
  );
}
