import Image from "next/image";
import Link from "next/link";

import generalNavData from "@/_data/general-nav-data.json";
import classNames from "classnames";
import SocialIcons from "@/_lib/utils/social-icons";

const { footer: footerNavData } = generalNavData;

export function MobileGeneralFooter() {
  return (
    <div className="flex flex-col px-5 gap-2 items-center desktop-small:hidden">
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
          <li className="text-paragraph text-white">ABN - 97 653 564 982</li>
        </ul>
      </div>
      <SocialIcons />
      <Link
        href="https://vonblackstudios.com.au"
        target="_blank"
        className="my-5"
      >
        <Image
          src="/logo/von-black-studios-logo.png"
          alt="Von Black Studios logo"
          width={100}
          height={100}
        />
      </Link>
      <h4 className="text-paragraph text-white text-center">
        © {new Date().getFullYear()} Auto Marketplace QLD. All rights reserved
      </h4>
    </div>
  );
}
