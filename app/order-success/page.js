"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

  // 🔒 Guard: block direct / refresh access
  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId, router]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen pt-10 bg-[#FAF8F4] flex items-start justify-center px-4">
      <div className="w-full max-w-xl text-center">
        {/* Brand */}
        <h1 className="text-2xl font-semibold text-primary mb-8">
          Kupika Ayurveda
        </h1>

        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-primary">
          Thank You for Your Order!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your order has been placed successfully.
        </p>

        {/* Order Reference */}
        <p className="mt-3 text-xs text-gray-500">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>

        {/* Actions */}
        <div className="mt-8">
          <button
            onClick={() => router.replace("/")}
            className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Go to Home
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-gray-600">
          <span>🌿 100% Ayurvedic</span>
          <span>✅ Quality Assured</span>
          <span>🇮🇳 Made in India</span>
        </div>
      </div>
    </div>
  );
}
