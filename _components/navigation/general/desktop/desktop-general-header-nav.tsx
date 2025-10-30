"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import generalNavData from "@/_data/general-nav-data.json";
import classNames from "classnames";
import {
  navLinkStyles,
  navItemStyles,
  chevronIconStyles,
  navContainerStyles,
  headerNavStyles,
} from "@/_styles/navigation-styles";

interface NavItem {
  title: string;
  url?: string;
  submenu?: {
    title: string;
    url: string;
  }[];
}

const { header: headerNavData } = generalNavData;

const DesktopGeneralHeaderNav = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [ctaHover, setCtaHover] = useState(false);
  const currentRoute = usePathname();

  const shouldSelfEnd =
    currentRoute !== "/sell-my-car" &&
    currentRoute !== "/for-dealers/login" &&
    currentRoute.startsWith("/for-dealers");

  return (
    <nav className={headerNavStyles(shouldSelfEnd)}>
      <ul className={navContainerStyles()}>
        {(headerNavData as NavItem[]).map((item, id) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isActive = activeId === id || currentRoute === item.url;

          return (
            <li
              key={id}
              className={navItemStyles()}
              onMouseEnter={() => setActiveId(id)}
              onMouseLeave={() => setActiveId(null)}
            >
              {item.url ? (
                <Link
                  href={item.url}
                  className={navLinkStyles(isActive, activeId === id, true)}
                >
                  {item.title}
                  {hasSubmenu && (
                    <ChevronDown
                      size={30}
                      strokeWidth={1.5}
                      color={isActive ? "#FFFD01" : "#FFFFFF"}
                      className={chevronIconStyles(false, activeId === id)}
                    />
                  )}
                </Link>
              ) : (
                <span className={navLinkStyles(isActive, activeId === id, false)}>
                  {item.title}
                  {hasSubmenu && (
                    <ChevronDown
                      size={30}
                      strokeWidth={1.5}
                      color={isActive ? "#FFFD01" : "#FFFFFF"}
                      className={chevronIconStyles(false, activeId === id)}
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
                      "-translate-x-1.5 min-w-[150px]":
                        item.title === "For Dealers",
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
        {currentRoute !== "/sell-my-car" &&
          currentRoute !== "/for-dealers/login" && (
            <li>
              <Link
                href={
                  !currentRoute.startsWith("/for-dealers")
                    ? "/sell-my-car"
                    : "/for-dealers/login"
                }
                aria-label={
                  !currentRoute.startsWith("/for-dealers")
                    ? "Sell My Car"
                    : "Dealer Login"
                }
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
                  {currentRoute.startsWith("/for-dealers")
                    ? "Dealer Login"
                    : "Sell My Car"}
                </h3>
                {!currentRoute.startsWith("/for-dealers") &&
                  (ctaHover ? (
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
                  ))}
              </Link>
            </li>
          )}
      </ul>
    </nav>
  );
};

export default DesktopGeneralHeaderNav;
