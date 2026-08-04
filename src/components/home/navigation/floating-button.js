"use client";

import { websiteTrack } from "@/src/lib/api";
import { support_mobile, whatsapp } from "@/src/lib/constants";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function FloatingContactButtons() {
  const phone = support_mobile;
  const whatsappLink = whatsapp;

  const handleButtonClick = (type) => {
    // fire-and-forget (do NOT await)
    websiteTrack({ type });
  };

  return (
    <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      {/* CALL */}
      <a
        href={`tel:${phone}`}
        onClick={() => handleButtonClick("call_click")}
        aria-label="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition hover:scale-105"
      >
        <FaPhoneAlt className="text-lg" />
      </a>

      {/* WHATSAPP */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleButtonClick("whatsapp_click")}
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-105"
      >
        <FaWhatsapp className="text-xl" />
      </a>
    </div>
  );
}
