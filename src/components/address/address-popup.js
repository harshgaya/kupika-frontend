"use client";
import { websiteTrack } from "@/src/lib/api";
import { whatsapp } from "@/src/lib/constants";
import { useState } from "react";

export default function AddressPopup({ open, onClose }) {
  if (!open) return null;

  const handleButtonClick = (type) => {
    // fire-and-forget (do NOT await)
    websiteTrack({ type });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-red-600">
          🔥 Product in Huge Demand
        </h2>

        <p className="mt-3 text-lg font-semibold text-gray-800">
          Currently Out of Stock on Website
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Order quickly on WhatsApp before stock ends again.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            onClick={() => handleButtonClick("whatsapp_click")}
            href={whatsapp}
            target="_blank"
            className="w-full rounded-full bg-green-500 py-3 text-white font-semibold text-lg"
          >
            Order from WhatsApp
          </a>

          <button
            onClick={onClose}
            className="w-full rounded-full border py-3 font-medium text-gray-700"
          >
            No, Continue Checkout
          </button>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 text-xs text-gray-400 underline"
        >
          Yes, Exit Checkout
        </button>
      </div>
    </div>
  );
}
