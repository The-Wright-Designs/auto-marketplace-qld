"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { X, AlignJustify, ChevronDown } from "lucide-react";
import classNames from "classnames";

import generalNavData from "@/_data/general-nav-data.json";

const { header: headerNavData } = generalNavData;

export function MobileGeneralHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
            onClick={() => {
              setIsOpen(false);
              setOpenSubmenu(null);
            }}
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
          <ul className="grid gap-5 mt-5">
            {headerNavData.map(({ title, url, submenu }, id) => {
              const hasSubmenu = submenu && submenu.length > 0;
              const isSubmenuOpen = openSubmenu === title;

              return (
                <li key={id}>
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenSubmenu(isSubmenuOpen ? null : title)
                        }
                        className="text-paragraph font-normal p-3 -m-3 flex items-center justify-between w-full"
                      >
                        <span className="text-blue">{title}</span>
                        <ChevronDown
                          className={classNames(
                            "h-8 w-8 transition-transform duration-200",
                            {
                              "rotate-180": isSubmenuOpen,
                            }
                          )}
                          color="#13103F"
                        />
                      </button>
                      {isSubmenuOpen && (
                        <ul className="ml-6 mt-3 grid gap-5">
                          {submenu.map((subItem, subId) => (
                            <li key={subId}>
                              {subItem.url && (
                                <Link
                                  href={subItem.url}
                                  onClick={() => {
                                    setIsOpen(false);
                                    setOpenSubmenu(null);
                                  }}
                                  className="text-paragraph text-blue font-thin place-self-start p-2 -m-2"
                                >
                                  {subItem.title}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <>
                      {url && (
                        <Link
                          href={url}
                          onClick={() => {
                            setIsOpen(false);
                            setOpenSubmenu(null);
                          }}
                          className="text-paragraph text-blue font-normal p-3 -m-3"
                        >
                          {title}
                        </Link>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}