"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import classNames from "classnames";

import "swiper/css";
import "swiper/css/pagination";

interface MainSliderProps {
  images: Array<{ filename: string; url: string }>;
  onSlideChange: (index: number) => void;
  onLightboxOpen: () => void;
  onSwiperInit: (swiper: SwiperType) => void;
  cssClasses?: string;
}

export default function MainSlider({
  images,
  onSlideChange,
  onLightboxOpen,
  onSwiperInit,
  cssClasses,
}: MainSliderProps) {
  return (
    <div className={classNames("relative", cssClasses)}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={images.length > 1}
        onSwiper={onSwiperInit}
        onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
        className="aspect-[4/3] rounded-md overflow-hidden bg-grey/10 flex items-center justify-center"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={image.filename}
            className="flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-full max-h-full">
              <Image
                src={image.url}
                alt={`Vehicle image ${index + 1}`}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 0 && (
        <button
          onClick={onLightboxOpen}
          className="absolute bottom-4 right-4 z-10 bg-white desktop:hover:scale-105 desktop:hover:cursor-pointer p-2 rounded-md"
          aria-label="Open fullscreen view"
        >
          <ZoomIn className="size-7 desktop-small:size-6" color="#13103F" />
        </button>
      )}
    </div>
  );
}
