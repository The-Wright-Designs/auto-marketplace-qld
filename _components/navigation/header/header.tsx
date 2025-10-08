"use client";

import { MobileHeader } from "./mobile/mobile-header";
import { DesktopHeader } from "./desktop/desktop-header";

import useScrollPosition from "@/_lib/utils/scroll-position";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPosition = useScrollPosition();
  const pathname = usePathname();

  useEffect(() => {
    if (scrollPosition > 150) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, [scrollPosition]);

  return (
    <header className="sticky left-0 top-0 mx-auto z-50 desktop-small:bg-blue desktop-small:px-50px full-hd:px-120px">
      <div className="max-w-[1920px] mx-auto relative">
        <MobileHeader />
        {pathname !== "/sell-my-car" && (
          <Link
            href="sell-my-car"
            aria-label="Sell My Car"
            className={classNames(
              "bg-white h-[90px] flex items-center justify-center gap-2 ease-in-out duration-300 desktop-small:hidden overflow-hidden",
              {
                "-mt-[90px]": isScrolled,
              }
            )}
          >
            <h3 className="text-paragraph-desktop font-bold min-[375px]:text-subheading uppercase">
              Sell My Car
            </h3>
            <Image
              src="/icons/click-blue.svg"
              alt="Sell My Car"
              width={62}
              height={50}
            />
          </Link>
        )}
        <DesktopHeader />
      </div>
    </header>
  );
}
