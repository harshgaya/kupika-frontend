"use client";

import { support_mobile, whatsapp } from "@/src/lib/constants";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function FloatingContactButtons({ site }) {
  const phone = support_mobile;
  const whatsappLink = whatsapp;

  return (
    <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      {/* CALL BUTTON */}
      <a
        href={`tel:${phone}`}
        aria-label="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition hover:scale-105"
      >
        <FaPhoneAlt className="text-lg" />
      </a>

      {/* WHATSAPP BUTTON */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-105"
      >
        <FaWhatsapp className="text-xl" />
      </a>
    </div>
  );
}
