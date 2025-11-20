"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import classNames from "classnames";

import "swiper/css";

interface ThumbnailSliderProps {
  images: Array<{ filename: string; url: string }>;
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
  onSwiperInit: (swiper: SwiperType) => void;
  cssClasses?: string;
}

export default function ThumbnailSlider({
  images,
  activeIndex,
  onThumbnailClick,
  onSwiperInit,
  cssClasses,
}: ThumbnailSliderProps) {
  if (images.length <= 1) return null;

  return (
    <div className={classNames("hidden tablet:block mt-5", cssClasses)}>
      <Swiper
        onSwiper={onSwiperInit}
        slidesPerView={5}
        centeredSlides={true}
        spaceBetween={10}
        slideToClickedSlide={true}
        watchSlidesProgress={true}
        loop={true}
        className="thumbnail-slider"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.filename}>
            <button
              onClick={() => onThumbnailClick(index)}
              className={classNames(
                "relative aspect-video w-full rounded-md overflow-hidden flex items-center justify-center",
                {
                  "opacity-60 desktop-small:hover:opacity-100":
                    index !== activeIndex,
                }
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
