"use client";

import { MobileUserHeader } from "./mobile/mobile-user-header";
import { DesktopUserHeader } from "./desktop/desktop-user-header";

import useScrollPosition from "@/_lib/utils/scroll-position";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function UserHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPosition = useScrollPosition();
  const currentRoute = usePathname();

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
        <MobileUserHeader />
        <DesktopUserHeader />
      </div>
    </header>
  );
}