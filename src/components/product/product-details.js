"use client";

import { useState } from "react";
import Image from "next/image";
import STRAPI_URL, { addToCheckout } from "@/src/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

const getGuestId = () => {
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }
  return id;
};

export default function ProductDetails({ product }) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const increaseQty = () => setQty((q) => q + 1);
  const decreaseQty = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleBuy = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await addToCheckout({
        productId: product._id,
        quantity: qty,
        guest_id: getGuestId(),
      });

      if (!res) {
        alert("Failed to add product. Please try again.");
        return;
      }

      router.push("/checkout");
    } catch (err) {
      console.log("Buy failed", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const discount = Math.round(
    ((product.market_price - product.selling_price) / product.market_price) *
      100,
  );

  return (
    <main className="bg-[#FAF8F4]">
      {/* ================= PRODUCT ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* IMAGE */}
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-6">
              <Image
                src={`${product.cover_image}`}
                alt={product.title}
                width={300}
                height={520}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-semibold text-secondary">
              {product.title}
            </h1>

            <p className="mt-4 max-w-md text-sm text-gray-700">
              {product.description}
            </p>

            {/* PRICE */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-semibold text-gray-900">
                ₹{product.selling_price}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.market_price}
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {discount}% OFF
              </span>
            </div>

            {/* QTY + BUY */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border px-6 py-3">
                <button
                  onClick={decreaseQty}
                  className="px-3 text-lg font-semibold"
                >
                  −
                </button>
                <span className="px-4 text-sm font-semibold">{qty}</span>
                <button
                  onClick={increaseQty}
                  className="px-3 text-lg font-semibold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleBuy}
                disabled={loading}
                className={`rounded-full px-16 py-4 text-sm font-medium text-white 
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-secondary hover:opacity-90"}
  `}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>

            {/* BADGES */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
              <span>🔒 Secure Payment</span>
              <span>🚚 Free Shipping</span>
              <span>↩ 7-Day Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="bg-[#EFECE6] py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Why Choose Horse Fire Tablets?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Experience the power of authentic Ayurveda.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Ayurvedic Formulation",
                desc: "Based on ancient texts, perfected for modern lifestyle.",
                icon: "/product-details/ayurvedic.png",
              },
              {
                title: "Natural Ingredients",
                desc: "100% pure herbal extracts with no fillers.",
                icon: "/product-details/natural.png",
              },
              {
                title: "Daily Wellness",
                desc: "Supports stamina with consistent usage.",
                icon: "/product-details/daily.png",
              },
              {
                title: "Safe & Certified",
                desc: "GMP certified & quality tested.",
                icon: "/product-details/safe.png",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-6 flex flex-col items-center"
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={30}
                  height={30}
                  className="mb-3"
                />
                <p className="font-bold text-secondary">{item.title}</p>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INGREDIENTS ================= */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Powerful Ingredients
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                name: "Ashwagandha",
                desc: "Reduces stress and improves energy.",
                img: "/home/ingredients/ashw.png",
              },
              {
                name: "Shilajit",
                desc: "Boosts strength and endurance.",
                img: "/home/ingredients/shilajit.png",
              },
              {
                name: "Safed Musli",
                desc: "Known for rejuvenating properties.",
                img: "/home/ingredients/bhringraj.png",
              },
            ].map((ing) => (
              <div key={ing.name}>
                <Image
                  src={ing.img}
                  alt={ing.name}
                  width={80}
                  height={80}
                  className="mx-auto mb-3 rounded-full bg-gray-100"
                />
                <p className="font-medium text-secondary">{ing.name}</p>
                <p className="mt-1 text-xs text-gray-600">{ing.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-[#EFECE6] py-3 text-xs text-gray-700">
            No Steroids • No Parabens • Non-Addictive • 100% Vegetarian
          </div>
        </div>
      </section>

      {/* ================= HOW TO USE (TEXT DESIGN) ================= */}
      <section className="bg-[#0F3D32] text-white">
        <div className="mx-auto max-w-6xl px-6">
          {/* Grid */}
          <div className="grid min-h-105 grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* LEFT – TEXT */}
            <div className="flex flex-col justify-center py-16 pr-0 lg:pr-16">
              <h2 className="text-2xl font-semibold mb-10">How to Use</h2>

              <div className="space-y-8 max-w-lg">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1A74B] text-sm font-bold text-black">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-[#D1A74B]">
                      Take 1 Tablet
                    </p>
                    <p className="text-sm text-white/80">
                      Consume one tablet daily, preferably before bedtime.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1A74B] text-sm font-bold text-black">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-[#D1A74B]">
                      With Warm Milk
                    </p>
                    <p className="text-sm text-white/80">
                      For best results, take it with warm milk or water.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1A74B] text-sm font-bold text-black">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-[#D1A74B]">
                      Be Consistent
                    </p>
                    <p className="text-sm text-white/80">
                      Continue for at least 3 months to see optimal benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT – IMAGE (FULL HEIGHT) */}
            <div className="relative hidden lg:block">
              <Image
                src="/product-details/man.png"
                alt="How to use"
                fill
                className="object-cover object-center "
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-[#FAF8F4] py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Why Trust Kupika?
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Made in India",
              "Lab Tested",
              "Support Available",
              "Quality Assured",
            ].map((trust) => (
              <div key={trust}>
                <div className="mb-2 text-lg">✔</div>
                <p className="font-medium text-secondary">{trust}</p>
                <p className="mt-1 text-xs text-gray-600">
                  Trusted & verified standards.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
