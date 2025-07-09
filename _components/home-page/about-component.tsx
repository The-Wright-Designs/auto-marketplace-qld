import aboutData from "@/_data/general-data.json";
import Image from "next/image";

const { aboutInfo } = aboutData;

const AboutComponent = () => {
  return (
    <main className="desktop-small:pt-5 pb-10 desktop-small:pb-100px">
      <ul className="grid gap-10 tablet-small:grid-cols-2 desktop-large:gap-50px desktop-large:grid-cols-3">
        {aboutInfo.map(({ heading, paragraph, image }, index) => (
          <li key={index} className="flex flex-col gap-5 full-hd:gap-50px">
            <div>
              <Image
                src={image}
                alt={heading}
                width={800}
                height={600}
                className="object-cover w-full h-full aspect-[5/3]"
              />
            </div>
            <h4 className="full-hd:text-subheading-desktop">{heading}</h4>
            <p className="full-hd:text-paragraph-desktop">{paragraph}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default AboutComponent;
