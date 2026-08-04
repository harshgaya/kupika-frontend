"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroCarousel() {
  const swiperRef = useRef(null);

  const banners = [
    {
      desktop: "/home/carousal/kupika-banner-1-desktop.jpg",
      mobile: "/home/carousal/kupika-banner-1-mobile.jpg",
      link: "/product/kaam-creator",
    },
    {
      desktop: "/home/carousal/kupika-banner-2-desktop.jpg",
      mobile: "/home/carousal/kupika-banner-2-mobile.jpg",
      link: "/product/kaam-creator",
    },
    {
      desktop: "/home/carousal/kupika-banner-3-desktop.jpg",
      mobile: "/home/carousal/kupika-banner-3-mobile.jpg",
      link: "/product/kaam-creator",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Left Arrow — always visible on mobile, hover-only on desktop */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous slide"
        className="
          absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10
          w-8 h-8 md:w-12 md:h-12
          flex items-center justify-center
          rounded-full
          bg-white/30 hover:bg-white/50 md:bg-white/20 md:hover:bg-white/40
          border border-white/40
          text-white
          backdrop-blur-sm
          transition-all duration-300 ease-in-out
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          scale-100 md:scale-90 md:group-hover:scale-100
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-5 md:h-5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right Arrow — always visible on mobile, hover-only on desktop */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next slide"
        className="
          absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10
          w-8 h-8 md:w-12 md:h-12
          flex items-center justify-center
          rounded-full
          bg-white/30 hover:bg-white/50 md:bg-white/20 md:hover:bg-white/40
          border border-white/40
          text-white
          backdrop-blur-sm
          transition-all duration-300 ease-in-out
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          scale-100 md:scale-90 md:group-hover:scale-100
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 md:w-5 md:h-5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        speed={900}
        className="[&_.swiper-pagination-bullet]:w-2
                   [&_.swiper-pagination-bullet]:h-2
                   [&_.swiper-pagination-bullet]:bg-white/50
                   [&_.swiper-pagination-bullet]:opacity-100
                   [&_.swiper-pagination-bullet]:rounded-full
                   [&_.swiper-pagination-bullet]:mx-1
                   [&_.swiper-pagination-bullet]:transition-all
                   [&_.swiper-pagination-bullet]:duration-300
                   [&_.swiper-pagination-bullet-active]:w-7
                   [&_.swiper-pagination-bullet-active]:bg-white
                   [&_.swiper-pagination-bullet-active]:rounded-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={banner.link} className="block w-full">
              {/* Desktop */}
              <div className="relative hidden md:block w-full aspect-[16/5]">
                <Image
                  src={banner.desktop}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover object-center"
                />
              </div>

              {/* Mobile */}
              <div className="relative block md:hidden w-full aspect-[4/5]">
                <Image
                  src={banner.mobile}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover object-center"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
