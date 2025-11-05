"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, AlignJustify } from "lucide-react";
import classNames from "classnames";

import dashboardNavData from "@/_data/user-nav-data.json";
import { useAuth } from "@/_lib/auth/auth-context";
import ButtonType from "@/_components/ui/buttons/button-type";

const { header: headerNavData } = dashboardNavData;

interface DashboardMobileNavProps {
  disabled?: boolean;
}

export function DashboardMobileNav({ disabled = false }: DashboardMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/for-dealers");
  };

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
    <div
      className={classNames(
        "relative bg-blue px-5 h-[90px] grid place-items-center z-50 desktop-small:hidden transition-opacity",
        {
          "opacity-75": disabled,
        }
      )}
    >
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => !disabled && setIsOpen(true)}
          className="-m-3 p-3"
          aria-label="Open menu"
          disabled={disabled}
        >
          <AlignJustify
            color="#FFFFFF"
            className="h-[58px] w-[58px]"
            strokeWidth={1.5}
          />
        </button>
        <Link
          href="/dealer-portal"
          className="flex gap-1 place-self-center"
          aria-label="Dashboard Home"
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

      <div
        className={classNames(
          "fixed inset-0 z-40 px-[22px] transform bg-white transition-transform duration-300 ease-in-out overflow-hidden",
          {
            "translate-x-full": !isOpen,
            "translate-x-0": isOpen,
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
          <ul className="grid gap-5 mt-5">
            {headerNavData.map(({ title, url }, id) => (
              <li key={id}>
                {url && (
                  <Link
                    href={url}
                    onClick={() => setIsOpen(false)}
                    className="text-paragraph text-blue font-normal p-3 -m-3"
                  >
                    {title}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <ButtonType onClick={handleLogout}>Logout</ButtonType>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
