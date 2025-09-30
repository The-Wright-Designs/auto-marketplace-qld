"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import navData from "@/_data/nav-data.json";
import classNames from "classnames";

interface NavItem {
  title: string;
  url?: string;
  submenu?: {
    title: string;
    url: string;
  }[];
}

const { header: headerNavData } = navData;

const DesktopHeaderNav = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [ctaHover, setCtaHover] = useState(false);

  const currentRoute = usePathname();

  return (
    <nav
      className={classNames({ "self-end": currentRoute !== "/sell-my-car" })}
    >
      <ul className="flex gap-5 items-center full-hd:gap-7">
        {(headerNavData as NavItem[]).map((item, id) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <li
              key={id}
              className="relative"
              onMouseEnter={() => setActiveId(id)}
              onMouseLeave={() => setActiveId(null)}
            >
              {item.url ? (
                <Link
                  href={item.url}
                  className={classNames("text-paragraph flex items-center", {
                    "text-white": activeId !== id,
                    "text-yellow": activeId === id || currentRoute === item.url,
                  })}
                >
                  {item.title}
                  {hasSubmenu && (
                    <ChevronDown
                      size={30}
                      strokeWidth={1.5}
                      color={activeId === id ? "#FFFD01" : "#FFFFFF"}
                      className={classNames(
                        "transition-transform duration-300",
                        {
                          "rotate-180": activeId === id,
                        }
                      )}
                    />
                  )}
                </Link>
              ) : (
                <span
                  className={classNames(
                    "text-paragraph flex items-center cursor-pointer",
                    {
                      "text-white": activeId !== id,
                      "text-yellow": activeId === id,
                    }
                  )}
                >
                  {item.title}
                  {hasSubmenu && (
                    <ChevronDown
                      size={30}
                      strokeWidth={1.5}
                      color={activeId === id ? "#FFFD01" : "#FFFFFF"}
                      className={classNames(
                        "transition-transform duration-300",
                        {
                          "rotate-180": activeId === id,
                        }
                      )}
                    />
                  )}
                </span>
              )}

              {/* Dropdown Menu */}
              {hasSubmenu && (
                <div
                  className={classNames(
                    "absolute top-3.5 left-0 z-50 transition-all duration-300",
                    {
                      "opacity-100 visible translate-y-4": activeId === id,
                      "-translate-x-[34px] min-w-[150px] full-hd:-translate-x-12 full-hd:min-w-[180px]":
                        item.title === "About",
                      "translate-x-3.5": item.title === "Dealership Portal",
                      "opacity-0 invisible translate-y-2": activeId !== id,
                    }
                  )}
                >
                  <div className="h-[45px] w-full bg-blue"></div>
                  <div className="bg-[#3B3B3C]">
                    {item.submenu!.map(
                      (subItem, subIndex) =>
                        subItem.url && (
                          <Link
                            key={subIndex}
                            href={subItem.url}
                            onClick={() => setActiveId(null)}
                            className="block px-5 py-2.5 text-white hover:bg-yellow hover:text-black transition-colors duration-300 full-hd:px-8"
                          >
                            {subItem.title}
                          </Link>
                        )
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {currentRoute !== "/sell-my-car" && (
          <li>
            <Link
              href="sell-my-car"
              aria-label="Sell My Car"
              className={classNames(
                "px-10 full-hd:px-[75px] border-8 border-yellow h-[120px] flex items-center justify-center gap-2 ease-in-out duration-300",
                {
                  "bg-yellow": !ctaHover,
                  "bg-blue": ctaHover,
                }
              )}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
            >
              <h3
                className={classNames(
                  "text-subheading uppercase ease-in-out duration-300",
                  {
                    "text-yellow": ctaHover,
                  }
                )}
              >
                Sell My Car
              </h3>
              {ctaHover ? (
                <Image
                  src="/icons/click-yellow.svg"
                  alt="Sell My Car"
                  width={62}
                  height={50}
                  className="h-auto w-12 full-hd:w-[62px] ease-in-out duration-300"
                />
              ) : (
                <Image
                  src="/icons/click-blue.svg"
                  alt="Sell My Car"
                  width={62}
                  height={50}
                  className="h-auto w-12 full-hd:w-[62px] ease-in-out duration-300"
                />
              )}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default DesktopHeaderNav;
