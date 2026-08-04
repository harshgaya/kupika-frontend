"use client";

import { useState } from "react";
import Image from "next/image";

export default function DesktopImageGallery({ images = [], title }) {
  const [active, setActive] = useState(images?.[0]);
  if (!images.length) return null;

  return (
    <div className="hidden lg:flex gap-4">
      <div className="flex flex-col gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onMouseEnter={() => setActive(img)}
            onClick={() => setActive(img)}
            className={`h-20 w-16 rounded-xl border bg-white p-1 transition-all duration-200
              ${active === img ? "border-[#1b4332] shadow-md scale-105" : "border-stone-200 hover:border-stone-400"}`}
          >
            <Image
              src={img}
              alt={`${title} thumb ${index + 1}`}
              width={60}
              height={80}
              className="h-full w-full object-contain"
              unoptimized
            />
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-stone-100">
        <Image
          src={active}
          alt={title}
          width={360}
          height={520}
          className="mx-auto object-contain"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
