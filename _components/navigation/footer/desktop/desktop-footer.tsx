import Link from "next/link";

import navData from "@/_data/nav-data.json";
import Image from "next/image";
import SocialIcons from "@/_lib/utils/social-icons";

const { footer: footerNavData } = navData;

export function DesktopFooter() {
  return (
    <div className="hidden desktop-small:block">
      <div className="grid grid-cols-[1fr_1.5fr]">
        <Link
          href="/"
          aria-label="Auto Marketplace QLD - Home"
          className="ease-in-out duration-300 hover:opacity-80 mr-auto"
        >
          <Image
            src="/logo/amq-logo.png"
            alt="Auto Marketplace QLD logo"
            width={391}
            height={391}
          />
        </Link>
        <div className="grid grid-cols-[1.3fr_1fr] my-auto">
          <nav>
            <ul className="flex flex-col gap-0.5">
              {footerNavData.slice(0, 5).map((item) => {
                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      className="text-paragraph text-white hover:text-yellow ease-in-out duration-300 desktop:text-subheading"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <nav>
            <ul className="flex flex-col gap-0.5">
              {footerNavData.slice(5).map((item) => {
                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      className="text-paragraph text-white hover:text-yellow ease-in-out duration-300 desktop:text-subheading"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <li className="text-paragraph text-white desktop:text-subheading">
                ABN - 97 653 564 982
              </li>
            </ul>
            <SocialIcons iconCssClasses="w-[30px] h-auto desktop:w-[49px]" />
          </nav>
          <div className="col-span-2 mt-7 place-self-start">
            <h4 className="text-paragraph text-white text-center desktop:text-paragraph-desktop">
              © {new Date().getFullYear()} Auto Marketplace QLD. All rights
              reserved
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
