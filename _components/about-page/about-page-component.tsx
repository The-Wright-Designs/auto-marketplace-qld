import Image from "next/image";

import aboutPageData from "@/_data/general-data.json";
import classNames from "classnames";

const {
  aboutPage: { aboutSection },
} = aboutPageData;

const AboutPageComponent = () => {
  return (
    <main className="grid gap-7">
      <div className="grid gap-5">
        {aboutSection.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="grid gap-10 tablet:grid-cols-2">
        {aboutSection.images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            sizes="(max-width:1000px) 100vw, 50vw"
            width={1000}
            height={800}
            className={classNames(
              "h-full w-full object-cover aspect-video desktop-small:aspect-auto",
              {
                "hidden tablet:block": index === 1,
              }
            )}
          />
        ))}
      </div>
    </main>
  );
};

export default AboutPageComponent;
