"use client";

import { useState, useRef, useMemo } from "react";
import type { Swiper as SwiperType } from "swiper";
import MainSlider from "./main-slider";
import ThumbnailSlider from "./thumbnail-slider";
import LightboxSlider from "./lightbox-slider";
import classNames from "classnames";

interface VehicleImageSliderProps {
  images: Array<{ filename: string; url: string }>;
  primaryImage: string;
  cssClasses?: string;
}

export default function VehicleImageSlider({
  images,
  primaryImage,
  cssClasses,
}: VehicleImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainSwiperRef = useRef<SwiperType | null>(null);
  const thumbSwiperRef = useRef<SwiperType | null>(null);
  const lightboxSwiperRef = useRef<SwiperType | null>(null);

  const sortedImages = useMemo(() => {
    if (!primaryImage || images.length === 0) return images;

    const primary = images.find((img) => img.filename === primaryImage);
    const rest = images.filter((img) => img.filename !== primaryImage);

    return primary ? [primary, ...rest] : images;
  }, [images, primaryImage]);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);

    if (mainSwiperRef.current && mainSwiperRef.current.realIndex !== index) {
      mainSwiperRef.current.slideToLoop(index);
    }
    if (thumbSwiperRef.current && thumbSwiperRef.current.realIndex !== index) {
      thumbSwiperRef.current.slideToLoop(index);
    }
    if (
      lightboxSwiperRef.current &&
      lightboxSwiperRef.current.realIndex !== index
    ) {
      lightboxSwiperRef.current.slideToLoop(index);
    }
  };

  const handleThumbnailClick = (index: number) => {
    handleSlideChange(index);
  };

  const handleLightboxOpen = () => {
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  if (sortedImages.length === 0) {
    return (
      <div
        className={classNames(
          "aspect-[4/3] rounded-md border-2 border-blue bg-grey/10 flex items-center justify-center",
          cssClasses
        )}
      >
        <p className="text-paragraph text-grey">No images available</p>
      </div>
    );
  }

  return (
    <div className={cssClasses}>
      <MainSlider
        images={sortedImages}
        onSlideChange={handleSlideChange}
        onLightboxOpen={handleLightboxOpen}
        onSwiperInit={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
      />

      <ThumbnailSlider
        images={sortedImages}
        activeIndex={activeIndex}
        onThumbnailClick={handleThumbnailClick}
        onSwiperInit={(swiper) => {
          thumbSwiperRef.current = swiper;
        }}
      />

      <LightboxSlider
        images={sortedImages}
        activeIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        onSlideChange={handleSlideChange}
        onSwiperInit={(swiper) => {
          lightboxSwiperRef.current = swiper;
        }}
      />
    </div>
  );
}
