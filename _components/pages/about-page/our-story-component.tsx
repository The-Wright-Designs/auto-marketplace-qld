import Image from "next/image";

import aboutPageData from "@/_data/general-data.json";
import classNames from "classnames";

const {
  aboutPage: { ourStorySection },
} = aboutPageData;

const OurStoryComponent = () => {
  return (
    <div className="grid gap-7 desktop-small:grid-cols-2">
      <div className="grid gap-5">
        {ourStorySection.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <Image
        src={ourStorySection.image.src}
        alt={ourStorySection.image.alt}
        width={1000}
        height={800}
        className="h-full w-full object-cover aspect-video desktop-small:aspect-auto"
      />
    </div>
  );
};

export default OurStoryComponent;
