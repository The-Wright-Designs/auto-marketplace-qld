"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { X, AlignJustify } from "lucide-react";
import classNames from "classnames";

import navData from "@/_data/nav-data.json";

const { header: headerNavData } = navData;

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="relative bg-blue px-5 h-[90px] grid place-items-center z-50 desktop-small:hidden">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => setIsOpen(true)}
          className="-m-3 p-3"
          aria-label="Open menu"
        >
          <AlignJustify
            color="#FFFFFF"
            className="h-[58px] w-[58px]"
            strokeWidth={1.5}
          />
        </button>
        <Link
          href="/"
          className="flex gap-1 place-self-center"
          aria-label="Auto Marketplace QLD - Home"
        >
          <Image
            src="/logo/amq-logo.png"
            alt="Auto Marketplace QLD logo"
            width={69}
            height={69}
          />
        </Link>
        <div className="w-[58px]"></div>
      </div>

      {/* Slide-out Menu */}
      <div
        className={classNames(
          "fixed inset-0 z-50 px-[22px] transform bg-white transition-transform duration-300 ease-in-out",
          {
            "translate-x-full": !isOpen,
          }
        )}
      >
        <div className="h-[90px] grid align-middle">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="-ml-2.5"
          >
            <X
              color="#231f20"
              className="h-[58px] w-[58px]"
              strokeWidth={1.5}
            />
          </button>
        </div>
        <nav>
          <ul className="grid gap-5 mt-4">
            {headerNavData.map(({ title, url }, id) => {
              return (
                <li key={id}>
                  <Link
                    href={url}
                    onClick={() => setIsOpen(false)}
                    className="text-paragraph text-black font-normal p-3 -m-3"
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
