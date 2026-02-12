"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroCarousel() {
  const banners = [
    {
      desktop: "/home/sliders/desk-1.png",
      mobile: "/home/sliders/mob-1.png",
      link: "/product/kaam-creator",
    },
    {
      desktop: "/home/sliders/desk-2.png",
      mobile: "/home/sliders/mob-2.png",
      link: "/product/kaam-creator",
    },
  ];

  return (
    <div className="w-full bg-black">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={banner.link}>
              {/* AUTO HEIGHT CONTAINER */}
              <div className="relative w-full flex justify-center items-center">
                {/* Desktop */}
                <Image
                  src={banner.desktop}
                  alt="banner"
                  width={1920}
                  height={720}
                  priority={index === 0}
                  className="hidden md:block w-full h-auto object-contain"
                />

                {/* Mobile */}
                <Image
                  src={banner.mobile}
                  alt="banner"
                  width={800}
                  height={1000}
                  priority={index === 0}
                  className="block md:hidden w-full h-auto object-contain"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
