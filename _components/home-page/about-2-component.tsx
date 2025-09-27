import Image from "next/image";

import about2Data from "@/_data/general-data.json";
import ButtonLink from "../ui/buttons/button-link";
import classNames from "classnames";

const {
  homePage: { about2Info },
} = about2Data;

const About2Component = () => {
  return (
    <section className="py-10 desktop-large:py-100px">
      <ul className="grid gap-10 desktop-large:gap-100px">
        {about2Info.map(({ heading, paragraph, image, link }, index) => (
          <li
            key={index}
            className={classNames("grid gap-5 desktop-large:gap-10", {
              "desktop-small:grid-cols-[1fr_0.925fr]": index % 2,
              "desktop-small:grid-cols-[1fr_2.10fr]": index % 2 === 0,
            })}
          >
            <div
              className={classNames({
                "desktop-small:order-last": index % 2 === 0,
              })}
            >
              <Image
                src={image}
                alt={heading}
                width={800}
                height={600}
                className={classNames(
                  "object-cover w-full h-full aspect-video",
                  {
                    "desktop-small:aspect-[16/12]": index % 2,
                  }
                )}
                sizes="(max-width:1280px) 100vw, (max-width: 1440px) 60vw, 1100px"
              />
            </div>
            <div className="grid gap-5 place-content-center desktop-large:gap-10">
              <h4 className="full-hd:text-subheading-desktop">{heading}</h4>
              <p className="full-hd:text-paragraph-desktop">{paragraph}</p>
              <ButtonLink href={link} ariaLabel={heading} cssClasses="mr-auto">
                Read more
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default About2Component;
