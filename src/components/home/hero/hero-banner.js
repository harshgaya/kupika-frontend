// components/HeroBanner.jsx

import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="bg-[#f5f7f6] px-4 md:px-10 py-10">
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-black">
        {/* Background Image */}
        <Image
          src="/home/passion.png"
          alt="banner"
          fill
          className="object-contain object-center bg-[#282423]"
          priority
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {/* Small Text */}
          <p className="text-white/80 text-sm md:text-base mb-2 tracking-wide">
            Confidence • Performance • Comfort
          </p>

          {/* Main Heading */}
          <h2 className="text-white text-2xl md:text-4xl font-serif font-semibold leading-tight max-w-2xl">
            From Passionate Beginnings to a Perfect Finish
          </h2>

          {/* Button */}
          <Link
            href="/shop-all"
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Shop All
          </Link>
        </div>
      </div>
    </section>
  );
}
