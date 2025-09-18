import Image from "next/image";

import aboutPageData from "@/_data/general-data.json";
import classNames from "classnames";

const { aboutPage } = aboutPageData;

const AboutPage = () => {
  return (
    <main className="grid gap-7 my-10 px-5 desktop-small:px-50px full-hd:px-120px overflow-hidden">
      <h2 className="text-subheading full-hd:text-subheading-desktop">About</h2>
      {aboutPage.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <div className="grid gap-10 tablet:grid-cols-2">
        {aboutPage.images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            sizes="(max-width:1000px) 100vw, 50vw"
            width={1000}
            height={800}
            className={classNames({
              "hidden tablet:block": index === 1,
            })}
          />
        ))}
      </div>
    </main>
  );
};

export default AboutPage;
