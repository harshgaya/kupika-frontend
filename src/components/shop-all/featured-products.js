"use client";

import Link from "next/link";
import React, { useState } from "react";

// ── Product Data ──────────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Kupika Kaam Creator",
    subtitle: "Ayurvedic Vitality Capsules",
    price: 1799,
    originalPrice: 3000,
    discount: 10,
    badge: "Best Seller",
    tag: "POWER",
    inStock: true,
    link: "/product/kaam-creator",
    img: "/product-details/kupika-kaam.jpg",
  },
  {
    id: 2,
    name: "Kupika Hair Creator Oil",
    subtitle: "Hair Fall Control & Scalp Nourishment",
    price: 799,
    originalPrice: 1499,
    discount: 46,
    badge: "New",
    tag: "Natural",
    inStock: true,
    link: "/product/kupika-hair-creator-oil",
    img: "https://d2yhk23ciu9dj0.cloudfront.net/rb-iit/product-images/ist-8522.jpg",
  },
  {
    id: 3,
    name: "Kupika Original Honey",
    subtitle: "Pure, Unfiltered, Ayurvedic Honey",
    price: 1759,
    originalPrice: 1999,
    discount: 12,
    badge: null,
    tag: "Sweet",
    inStock: false,
    img: "/product-details/honey.jpg",
  },
  {
    id: 4,
    name: "Kupika Hair Shampoo",
    subtitle: "Strengthen Roots & Promote Growth",
    price: 1793,
    originalPrice: 1999,
    discount: 10,
    badge: "Top Rated",
    tag: "Grooming",
    inStock: false,
    img: "/product-details/shampoo.jpg",
  },
];

const tagColors = {
  POWER: "bg-amber-100 text-amber-700",
  STAMINA: "bg-emerald-100 text-emerald-700",
  STRESS: "bg-sky-100 text-sky-700",
  ENERGY: "bg-orange-100 text-orange-700",
  DRIVE: "bg-purple-100 text-purple-700",
  RESTORE: "bg-rose-100 text-rose-700",
  VITAL: "bg-teal-100 text-teal-700",
  BOOST: "bg-yellow-100 text-yellow-700",
  ENDURE: "bg-indigo-100 text-indigo-700",
  ZINC: "bg-lime-100 text-lime-700",
  RESIN: "bg-stone-100 text-stone-700",
  BUNDLE: "bg-red-100 text-red-700",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className="w-4 h-4 shrink-0"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className="w-4 h-4 shrink-0"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ── Single Product Card ───────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const { inStock } = product;

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-500 shadow-sm
        ${
          inStock
            ? "hover:shadow-xl hover:-translate-y-1 border-stone-100"
            : "border-stone-200"
        }`}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-stone-50 aspect-[3/2] sm:aspect-[4/5]">
        <img
          src={product.img}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700
            ${inStock ? "group-hover:scale-105" : "grayscale-[55%] brightness-90 scale-[1.02]"}`}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0
          ${
            inStock
              ? "bg-gradient-to-t from-black/55 via-transparent to-transparent"
              : "bg-gradient-to-t from-stone-900/75 via-stone-600/20 to-stone-300/10"
          }`}
        />

        {/* Out of stock stamp */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/20 animate-ping" />
            <div className="relative bg-black/70 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5 text-center shadow-2xl">
              <div className="flex justify-center mb-1">
                <span className="w-5 h-5 rounded-full bg-stone-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={2.5}
                    className="w-3 h-3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </div>
              <p className="text-[8px] font-semibold tracking-[0.2em] text-stone-400 uppercase leading-none mb-1">
                Currently
              </p>
              <p className="text-xs font-black tracking-widest text-white uppercase leading-none">
                Out of Stock
              </p>
            </div>
          </div>
        )}

        {/* Badge top-left */}
        {product.badge && inStock && (
          <span className="absolute top-2.5 left-2.5 bg-[#1b4332] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow">
            {product.badge}
          </span>
        )}

        {/* Discount chip top-right */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full
          ${inStock ? "bg-rose-500 text-white" : "bg-stone-600/50 text-stone-400 line-through"}`}
        >
          -{product.discount}%
        </span>

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform duration-200 active:scale-90 hover:scale-110 cursor-pointer z-10"
          aria-label="Wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "#888"}
            strokeWidth={2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Tag pill bottom-left */}
        <span
          className={`absolute bottom-2.5 left-2.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full z-10
          ${inStock ? (tagColors[product.tag] ?? "bg-gray-100 text-gray-600") : "bg-stone-700/60 text-stone-300"}`}
        >
          {product.tag}
        </span>
      </div>

      {/* ── Card body ── */}
      <div
        className={`flex flex-col gap-2 p-3 sm:p-4 flex-1 ${!inStock ? "bg-stone-50/80" : ""}`}
      >
        {/* Name + subtitle */}
        <div>
          <p
            className={`text-sm font-bold leading-snug ${inStock ? "text-stone-800" : "text-stone-500"}`}
          >
            {product.name}
          </p>
          <p className="text-xs text-stone-400 mt-0.5 font-medium leading-snug">
            {product.subtitle}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-100" />

        {/* Price */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-base font-black ${inStock ? "text-[#1b4332]" : "text-stone-400"}`}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-stone-400 line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
          {inStock && (
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
              −₹
              {(product.originalPrice - product.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Ayurvedic row */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${inStock ? "bg-emerald-400" : "bg-stone-300"}`}
          />
          <span>Ayurvedic · No Chemicals</span>
        </div>

        {/* ── CTA ── */}
        {inStock ? (
          <Link
            href={product.link}
            className="mt-auto w-full flex items-center justify-center gap-2 bg-[#1b4332] text-white text-sm font-bold py-3 rounded-xl transition-all duration-300 group-hover:bg-emerald-700 cursor-pointer"
          >
            <CartIcon />
            Buy Now
          </Link>
        ) : (
          <div className="mt-auto space-y-2">
            {/* Separator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[9px] font-bold tracking-wider text-stone-400 uppercase shrink-0">
                Unavailable
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Out of stock */}
            <div className="pointer-events-none w-full flex items-center justify-center gap-2 bg-stone-100 border border-dashed border-stone-300 text-stone-400 text-sm font-bold py-3 rounded-xl select-none relative overflow-hidden">
              <span
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)",
                  backgroundSize: "6px 6px",
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 relative z-10 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span className="relative z-10">Out of Stock</span>
            </div>

            {/* Notify me */}
            <button className="pointer-events-none w-full flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-3 rounded-xl cursor-default select-none">
              <BellIcon />
              <span>Notify Me</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader() {
  return (
    <div className="text-center mb-8 sm:mb-10">
      <p className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-2">
        Curated for Men
      </p>
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-800 tracking-tight"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Featured Products
      </h2>
      <p className="mt-3 text-sm text-stone-400 max-w-md mx-auto leading-relaxed px-4">
        Clinically validated, 100% Ayurvedic formulas — crafted to help you
        perform, recover, and thrive.
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="h-px w-12 sm:w-16 bg-stone-200" />
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <div className="h-px w-12 sm:w-16 bg-stone-200" />
      </div>
    </div>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: "🌿", label: "100% Ayurvedic" },
    { icon: "🧪", label: "Clinically Validated" },
    { icon: "🏥", label: "Doctor Formulated" },
    { icon: "🚚", label: "All India Delivery" },
  ];
  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl bg-stone-50 border border-stone-100"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-[11px] font-bold text-stone-600 tracking-wide uppercase text-center leading-tight">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function FeaturedProducts() {
  return (
    <section className="bg-gradient-to-b from-stone-50 to-white px-3 sm:px-6 py-10 sm:py-14 max-w-7xl mx-auto">
      <SectionHeader />

      {/* 1 col mobile → 2 col sm → 3 col md → 4 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <TrustBar />
    </section>
  );
}
