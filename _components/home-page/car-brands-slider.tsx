"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import data from "@/_data/general-data.json";

import "swiper/css";
import "swiper/css/pagination";

const { carBrands } = data;

interface Props {
  cssClasses?: string;
}

const CarBrandsSlider = ({ cssClasses }: Props) => {
  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={30}
      breakpoints={{
        475: {
          slidesPerView: 4,
        },
        700: {
          slidesPerView: 5,
        },
        900: {
          slidesPerView: 6,
        },
        1100: {
          slidesPerView: 7,
        },
        1280: {
          slidesPerView: 8,
          spaceBetween: 48,
        },
        1440: {
          slidesPerView: 9,
        },
      }}
      loop={true}
      speed={1000}
      autoplay={{
        disableOnInteraction: true,
        delay: 1500,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      modules={[Autoplay, Pagination]}
      className={cssClasses}
      style={
        {
          "--swiper-pagination-color": "#FFFFFF",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-inactive-color": "#FFFFFF",
        } as React.CSSProperties
      }
    >
      {carBrands.map(({ src, alt }, index) => (
        <SwiperSlide key={`${src}-${index}`}>
          <div className="grid w-full h-full place-items-center">
            <Image
              src={src}
              alt={alt}
              width={150}
              height={150}
              className="h-[90px] w-auto object-contain phone:h-[110px] tablet-small:h-[120px] desktop-small:h-[150px]"
              sizes="150px"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarBrandsSlider;
