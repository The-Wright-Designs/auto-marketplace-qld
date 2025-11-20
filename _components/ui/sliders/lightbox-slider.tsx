"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

interface LightboxSliderProps {
  images: Array<{ filename: string; url: string }>;
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSlideChange: (index: number) => void;
  onSwiperInit: (swiper: SwiperType) => void;
}

export default function LightboxSlider({
  images,
  activeIndex,
  isOpen,
  onClose,
  onSlideChange,
  onSwiperInit,
}: LightboxSliderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 p-5 bg-black/95 flex items-center justify-center desktop-small:p-10"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50  bg-white p-1 rounded-md desktop-small:hover:scale-105"
        aria-label="Close lightbox"
      >
        <X className="w-8 h-8" color="#13103F" />
      </button>

      <div
        className="relative w-full max-w-[1280px] px-4 aspect-[4/3] max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          modules={[Navigation, Keyboard]}
          navigation={{
            prevEl: ".lightbox-prev",
            nextEl: ".lightbox-next",
          }}
          keyboard={{ enabled: true }}
          initialSlide={activeIndex}
          onSwiper={onSwiperInit}
          loop
          onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
          className="h-full flex items-center justify-center"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={image.filename}
              className="flex items-center justify-center h-full"
            >
              <div className="relative w-full h-full max-w-full max-h-full">
                <Image
                  src={image.url}
                  alt={`Vehicle image ${index + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="lightbox-prev bg-white/80 rounded-md p-1 absolute left-4 top-1/2 -translate-y-1/2 z-50 hidden tablet:block desktop-small:hover:scale-105"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-10 h-10" color="#13103F" />
        </button>
        <button
          className="lightbox-next bg-white rounded-md p-1 absolute right-4 top-1/2 -translate-y-1/2 z-50 hidden tablet:block desktop-small:hover:scale-105"
          aria-label="Next image"
        >
          <ChevronRight className="w-10 h-10" color="#13103F" />
        </button>
      </div>
    </div>,
    document.body
  );
}
