import Image from "next/image";
import Link from "next/link";

import navData from "@/_data/nav-data.json";
import classNames from "classnames";
import SocialIcons from "@/_lib/utils/social-icons";

const { footer: footerNavData } = navData;

export function MobileFooter() {
  return (
    <div className="flex flex-col gap-2 items-center desktop-small:hidden">
      <div className="grid gap-5">
        <Link
          href="/"
          className="flex gap-2 place-self-center"
          aria-label="Auto Marketplace QLD - Home"
        >
          <Image
            src="/logo/amq-logo.png"
            alt="Auto Marketplace QLD logo"
            width={195}
            height={195}
          />
        </Link>
        <ul className="grid gap-2 text-center">
          {footerNavData.map(({ title, url }, id) => {
            return (
              <li
                key={id}
                className={classNames({
                  "mt-2": title === "Terms & Conditions",
                })}
              >
                <Link href={url} className="text-paragraph text-white p-2 -m-2">
                  {title}
                </Link>
              </li>
            );
          })}
          <li className="text-paragraph text-white">ABN - xxxxx</li>
        </ul>
      </div>
      <SocialIcons />
      <h4 className="text-paragraph text-white text-center">
        © {new Date().getFullYear()} Auto Marketplace QLD. All rights reserved
      </h4>
    </div>
  );
}
