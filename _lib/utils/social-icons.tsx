import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

const socialData = [
  {
    iconUrl: "/icons/facebook.svg",
    url: "#",
    platform: "Facebook",
  },
  {
    iconUrl: "/icons/instagram.svg",
    url: "#",
    platform: "Instagram",
  },
  {
    iconUrl: "/icons/linkedin.svg",
    url: "#",
    platform: "LinkedIn",
  },
];

interface SocialIconsProps {
  containerCssClasses?: string;
  iconCssClasses?: string;
}

const SocialIcons = ({
  containerCssClasses,
  iconCssClasses,
}: SocialIconsProps) => {
  return (
    <ul className={classNames("flex gap-2", containerCssClasses)}>
      {socialData.map(({ iconUrl, platform, url }, id) => {
        return (
          <li key={id}>
            <Link
              href={url}
              className="text-paragraph text-white p-1 -m-1 ease-in-out duration-300 desktop-small:hover:opacity-80"
            >
              <Image
                src={iconUrl}
                alt={`Follow us on ${platform}`}
                width={49}
                height={49}
                className={iconCssClasses}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialIcons;
