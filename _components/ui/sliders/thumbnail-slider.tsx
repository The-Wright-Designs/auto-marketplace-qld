"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import classNames from "classnames";

import "swiper/css";

interface ThumbnailSliderProps {
  images: Array<{ filename: string; url: string }>;
  activeIndex: number;
  onSlideChange: (index: number) => void;
  onSwiperInit: (swiper: SwiperType) => void;
  cssClasses?: string;
}

export default function ThumbnailSlider({
  images,
  activeIndex,
  onSlideChange,
  onSwiperInit,
  cssClasses,
}: ThumbnailSliderProps) {
  if (images.length <= 1) return null;

  return (
    <div className={classNames("hidden tablet:block mt-5", cssClasses)}>
      <Swiper
        onSwiper={onSwiperInit}
        onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
        slidesPerView={5}
        centeredSlides={true}
        spaceBetween={10}
        slideToClickedSlide={true}
        watchSlidesProgress={true}
        className="thumbnail-slider"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.filename}>
            <div
              className={classNames(
                "relative aspect-video w-full rounded-md overflow-hidden flex items-center justify-center desktop:hover:cursor-pointer ease-in-out duration-300",
                {
                  "opacity-60 desktop-small:hover:opacity-100":
                    index !== activeIndex,
                },
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
