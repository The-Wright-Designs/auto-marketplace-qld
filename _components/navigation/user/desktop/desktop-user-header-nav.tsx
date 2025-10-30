"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { ChevronDown } from "lucide-react";

import userNavData from "@/_data/user-nav-data.json";
import classNames from "classnames";
import ButtonType from "@/_components/ui/buttons/button-type";
import {
  navLinkStyles,
  navItemStyles,
  chevronIconStyles,
  dropdownMenuStyles,
  dropdownItemStyles,
  navContainerStyles,
  headerNavStyles
} from "@/_styles/navigation-styles";
import { useAuth } from "@/_lib/auth/auth-context";

interface NavItem {
  title: string;
  url?: string;
  submenu?: {
    title: string;
    url: string;
  }[];
}

const { header: headerNavData } = userNavData;

const DesktopUserHeaderNav = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const router = useRouter();
  const { logout } = useAuth();
  const currentRoute = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className={headerNavStyles()}>
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
                <span
                  className={navLinkStyles(isActive, activeId === id, false)}
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
        <li>
          <ButtonType
            blueStroke
            onClick={handleLogout}
            ariaLabel="Logout"
            type="button"
          >
            Logout
          </ButtonType>
        </li>
      </ul>
    </nav>
  );
};

export default DesktopUserHeaderNav;