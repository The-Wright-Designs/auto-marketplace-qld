"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import classNames from "classnames";

import dashboardNavData from "@/_data/user-nav-data.json";
import { useAuth } from "@/_lib/auth/auth-context";
import ButtonType from "@/_components/ui/buttons/button-type";
import { NavItem } from "@/_types/general-types";

const { header: headerNavData } = dashboardNavData;

interface DashboardSidebarProps {
  disabled?: boolean;
}

export function DashboardSidebar({ disabled = false }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/for-dealers");
  };

  const isAdmin = user?.customClaims?.admin === true;

  const filteredNavData = headerNavData.filter((item: NavItem) => {
    if (item.adminOnly) {
      return isAdmin;
    }
    return true;
  });

  return (
    <aside
      className={classNames(
        "hidden desktop-small:flex fixed left-0 top-0 w-[280px] h-screen bg-blue flex-col z-40 transition-opacity",
        {
          "opacity-75 pointer-events-none": disabled,
        }
      )}
    >
      <div className="p-50px border-b border-white/20">
        <Link
          href="/dealer-portal"
          className="flex justify-center"
          aria-label="Dashboard Home"
        >
          <Image
            src="/logo/amq-logo.png"
            alt="Auto Marketplace QLD logo"
            width={120}
            height={120}
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-50px px-50px">
        <ul className="space-y-5">
          {filteredNavData.map(({ title, url }, id) => {
            const isActive = pathname === url;

            return (
              <li key={id}>
                {url && (
                  <Link
                    href={url}
                    className={classNames(
                      "text-paragraph text-white block p-3 -m-3 rounded-md transition-colors hover:bg-white/10",
                      {
                        "bg-white/20 hover:bg-white/20": isActive,
                      }
                    )}
                  >
                    {title}
                  </Link>
                )}
              </li>
            );
          })}
          <li className="pt-5">
            <ButtonType onClick={handleLogout} cssClasses="w-full" yellowStroke>
              Logout
            </ButtonType>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
