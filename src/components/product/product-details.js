"use client";

import { useState } from "react";
import Image from "next/image";
import STRAPI_URL, { addToCheckout } from "@/src/lib/api";
import { useRouter } from "next/navigation";

const getGuestId = () => {
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }
  return id;
};

// ── Static Review Data ────────────────────────────────────────────────────────
const REVIEWS = [
  {
    id: 1,
    name: "Rajesh K.",
    location: "Mumbai",
    rating: 5,
    date: "2 weeks ago",
    title: "Life changing product!",
    body: "Been using for 3 months and the difference is incredible. My stamina has improved significantly and I feel more energetic throughout the day.",
    verified: true,
    avatar: "R",
    avatarColor: "bg-emerald-600",
  },
  {
    id: 2,
    name: "Amit S.",
    location: "Delhi",
    rating: 5,
    date: "1 month ago",
    title: "100% genuine Ayurvedic",
    body: "Tried many supplements before but this one is different. No side effects, purely natural and results are visible after consistent use.",
    verified: true,
    avatar: "A",
    avatarColor: "bg-amber-600",
  },
  {
    id: 3,
    name: "Suresh M.",
    location: "Bangalore",
    rating: 4,
    date: "3 weeks ago",
    title: "Good results, takes time",
    body: "Takes about 6-8 weeks to show results but worth the patience. Quality packaging and fast delivery. Will definitely reorder.",
    verified: true,
    avatar: "S",
    avatarColor: "bg-blue-600",
  },
  {
    id: 4,
    name: "Vikram T.",
    location: "Pune",
    rating: 5,
    date: "5 days ago",
    title: "Best purchase this year",
    body: "Doctor recommended this and I'm glad I tried it. Completely natural formula with no harsh chemicals. Feeling much better.",
    verified: true,
    avatar: "V",
    avatarColor: "bg-purple-600",
  },
];

const FAQS = [
  {
    q: "How long does it take to see results?",
    a: "Most customers notice improvements within 3–4 weeks of consistent daily use. For optimal results, we recommend continuing for at least 3 months.",
  },
  {
    q: "Are there any side effects?",
    a: "Kaam Creator is made with 100% natural Ayurvedic ingredients and has no known side effects. However, consult your doctor if you have pre-existing conditions.",
  },
  {
    q: "Can I take it with other medications?",
    a: "We recommend consulting with your healthcare provider before combining with prescription medications. The formula is natural, but individual responses vary.",
  },
  {
    q: "What is the recommended dosage?",
    a: "Take 1 tablet daily, preferably before bedtime with warm milk or water. Do not exceed the recommended dose.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes! We offer a 7-day return policy. If you're not satisfied with the product for any reason, contact our support team for a full refund.",
  },
  {
    q: "Is this product vegetarian?",
    a: "Yes, Kaam Creator is 100% vegetarian. It contains no animal-derived ingredients, steroids, or parabens.",
  },
];

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${sz} ${i <= rating ? "text-amber-400" : "text-stone-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border-b border-stone-200 transition-all duration-200 ${open ? "bg-emerald-50/50" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 px-1 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-stone-800">{faq.q}</span>
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center transition-transform duration-300 ${open ? "rotate-45 bg-[#1b4332] border-[#1b4332]" : ""}`}
        >
          <svg
            className={`w-3 h-3 ${open ? "text-white" : "text-stone-500"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-5" : "max-h-0"}`}
      >
        <p className="text-sm text-stone-600 leading-relaxed pl-9 pr-4">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full ${review.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {review.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">{review.name}</p>
            <p className="text-xs text-stone-400">{review.location}</p>
          </div>
        </div>
        <span className="text-xs text-stone-400">{review.date}</span>
      </div>

      <div className="flex items-center gap-2">
        <Stars rating={review.rating} />
        {review.verified && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg
              className="w-2.5 h-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-800 mb-1">
          {review.title}
        </p>
        <p className="text-xs text-stone-500 leading-relaxed">{review.body}</p>
      </div>
    </div>
  );
}

// ── Rating Summary Bar ────────────────────────────────────────────────────────
function RatingBar({ label, percent }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-stone-500 font-medium">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-6 text-right text-stone-400">{percent}%</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProductDetails({ product }) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const descriptionPoints = product.description
    ? product.description
        .split(/[.•\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10)
    : [];

  return (
    <main className="bg-[#FAF8F4]">
      {/* ═══════════════════════════ HERO SECTION ═══════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* ── Images ── */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              {/* Mobile carousel */}
              <div
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory lg:hidden"
                onScroll={(e) => {
                  const index = Math.round(
                    e.target.scrollLeft / e.target.clientWidth,
                  );
                  setActiveIndex(index);
                }}
              >
                {product.gallery_images?.map((img, index) => (
                  <div
                    key={index}
                    className="min-w-full snap-center rounded-2xl bg-white p-3 shadow-sm"
                  >
                    <div className="relative w-full aspect-[3/4]">
                      <Image
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-contain"
                        priority={index === 0}
                        unoptimized
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Dots */}
              <div className="mt-3 flex justify-center gap-2 lg:hidden">
                {product.gallery_images?.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-5 bg-[#1b4332]"
                        : "w-1.5 bg-stone-300"
                    }`}
                  />
                ))}
              </div>
              <DesktopImageGallery
                images={product.gallery_images}
                title={product.title}
              />
            </div>
          </div>

          {/* ── Info ── */}
          <div className="pb-24 lg:pb-0">
            {/* Badge row */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Best Seller
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Ayurvedic
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl font-black text-[#1b4332] leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {product.title}
            </h1>

            {/* Social proof row */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Stars rating={5} />
                <span className="text-sm font-bold text-stone-800">4.8</span>
              </div>
              <span className="text-stone-300">|</span>
              <a
                href="#reviews"
                className="text-xs text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-900"
              >
                164 Reviews
              </a>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-bold text-stone-700">64K+</span> Sold
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-[#1b4332]">
                ₹{product.selling_price?.toLocaleString("en-IN")}
              </span>
              <span className="text-base text-stone-400 line-through">
                ₹{product.market_price?.toLocaleString("en-IN")}
              </span>
              <span className="text-sm font-bold text-white bg-rose-500 px-2.5 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Incl. of all taxes · Free Delivery
            </p>

            {/* Divider */}
            <div className="my-5 h-px bg-gradient-to-r from-stone-200 via-stone-100 to-transparent" />

            {/* Description — point wise */}
            {descriptionPoints.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold tracking-widest uppercase text-stone-400">
                  What it does
                </p>
                <ul className="space-y-2">
                  {descriptionPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-stone-700 leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Divider */}
            <div className="my-5 h-px bg-gradient-to-r from-stone-200 via-stone-100 to-transparent" />

            {/* QTY */}
            <div className="flex items-center gap-3 mb-5">
              <p className="text-xs font-bold tracking-widest uppercase text-stone-400">
                Quantity
              </p>
              <div className="flex items-center rounded-full border border-stone-200 bg-white shadow-sm">
                <button
                  onClick={decreaseQty}
                  className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-[#1b4332] font-bold text-lg transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold text-stone-800">
                  {qty}
                </span>
                <button
                  onClick={increaseQty}
                  className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-[#1b4332] font-bold text-lg transition-colors"
                >
                  +
                </button>
              </div>
              {qty > 1 && (
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                  Save ₹
                  {(
                    (product.market_price - product.selling_price) *
                    qty
                  ).toLocaleString("en-IN")}{" "}
                  total
                </span>
              )}
            </div>

            {/* Desktop BUY button */}
            <button
              onClick={handleBuy}
              disabled={loading}
              className={`hidden lg:flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold text-white transition-all duration-300 shadow-lg shadow-emerald-900/20
                ${loading ? "bg-stone-400 cursor-not-allowed" : "bg-[#1b4332] hover:bg-emerald-700 active:scale-[0.98]"}`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Buy Now · ₹
                  {(product.selling_price * qty).toLocaleString("en-IN")}
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="hidden lg:flex mt-4 flex-wrap gap-3 text-xs text-stone-500 font-medium">
              {[
                "🔒 Secure Payment",
                "🚚 Free Shipping",
                "↩ 7-Day Returns",
                "✅ GMP Certified",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 bg-white border border-stone-100 rounded-full px-3 py-1.5 shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ MOBILE STICKY BUY BUTTON ════════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50">
            <button
              onClick={decreaseQty}
              className="w-9 h-10 flex items-center justify-center text-stone-600 font-bold text-lg"
            >
              −
            </button>
            <span className="w-7 text-center text-sm font-bold text-stone-800">
              {qty}
            </span>
            <button
              onClick={increaseQty}
              className="w-9 h-10 flex items-center justify-center text-stone-600 font-bold text-lg"
            >
              +
            </button>
          </div>
          <button
            onClick={handleBuy}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200
              ${loading ? "bg-stone-400 cursor-not-allowed" : "bg-[#1b4332] active:scale-[0.98]"}`}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Buy Now · ₹
                {(product.selling_price * qty).toLocaleString("en-IN")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ═══════════════════════ WHY CHOOSE ═══════════════════════════════ */}
      <section className="bg-[#EFECE6] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-2">
            Our Promise
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black text-[#1b4332]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Why Choose Kaam Creator?
          </h2>
          <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">
            Experience the power of authentic Ayurveda.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Ayurvedic Formulation",
                desc: "Based on ancient texts, perfected for modern lifestyle.",
                icon: "/product-details/ayurvedic.png",
                color: "bg-emerald-50 border-emerald-100",
              },
              {
                title: "Natural Ingredients",
                desc: "100% pure herbal extracts with no fillers.",
                icon: "/product-details/natural.png",
                color: "bg-amber-50 border-amber-100",
              },
              {
                title: "Daily Wellness",
                desc: "Supports stamina with consistent usage.",
                icon: "/product-details/daily.png",
                color: "bg-sky-50 border-sky-100",
              },
              {
                title: "Safe & Certified",
                desc: "GMP certified & quality tested.",
                icon: "/product-details/safe.png",
                color: "bg-rose-50 border-rose-100",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl ${item.color} border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={36}
                  height={36}
                  className="mb-3"
                />
                <p className="font-bold text-[#1b4332] text-sm">{item.title}</p>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ INGREDIENTS ══════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-2">
            {" What's Inside"}
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black text-[#1b4332]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Powerful Ingredients
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                name: "Makar Dhwaj",
                desc: "Helps reduce weakness, fatigue, and lack of energy in the body.",
                img: "/home/ingredients/makar.jpeg",
              },
              {
                name: "Shilajit",
                desc: "Improves physical power and endurance. Reduces weakness, fatigue, and tiredness.",
                img: "/home/ingredients/shilajit.webp",
              },
              {
                name: "Abhrakh Bhasma",
                desc: "Strengthens Shukra Dhatu and supports fertility in both men and women.",
                img: "/home/ingredients/abhrak.webp",
              },
            ].map((ing) => (
              <div key={ing.name} className="group">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={ing.img}
                    alt={ing.name}
                    fill
                    className="rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-emerald-200 ring-offset-2 group-hover:ring-emerald-400 transition-all duration-300" />
                </div>
                <p className="font-bold text-[#1b4332]">{ing.name}</p>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                  {ing.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[#EFECE6] py-4 px-6 text-xs text-stone-600 font-medium flex flex-wrap justify-center gap-3">
            {[
              "No Steroids",
              "No Parabens",
              "Non-Addictive",
              "100% Vegetarian",
            ].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW TO USE ═══════════════════════════════ */}
      <section className="bg-[#0F3D32] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid min-h-96 grid-cols-1 lg:grid-cols-2 items-stretch">
            <div className="flex flex-col justify-center py-14 pr-0 lg:pr-16">
              <p className="text-xs font-bold tracking-[0.3em] text-[#D1A74B] uppercase mb-3">
                Step by Step
              </p>
              <h2
                className="text-2xl sm:text-3xl font-black mb-10"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                How to Use
              </h2>
              <div className="space-y-7 max-w-lg">
                {[
                  {
                    num: 1,
                    title: "Take 1 Tablet",
                    desc: "Consume one tablet daily, preferably before bedtime.",
                  },
                  {
                    num: 2,
                    title: "With Warm Milk",
                    desc: "For best results, take it with warm milk or water.",
                  },
                  {
                    num: 3,
                    title: "Be Consistent",
                    desc: "Continue for at least 3 months to see optimal benefits.",
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 group">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D1A74B] text-black font-black text-sm flex items-center justify-center shadow-lg shadow-amber-900/30">
                      {step.num}
                    </span>
                    <div>
                      <p className="font-bold text-[#D1A74B]">{step.title}</p>
                      <p className="text-sm text-white/70 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                src="/product-details/man.png"
                alt="How to use"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D32]/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ REVIEWS ══════════════════════════════════ */}
      <section id="reviews" className="bg-[#FAF8F4] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-2">
              Customer Stories
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black text-[#1b4332]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              What Our Customers Say
            </h2>
          </div>

          {/* Rating summary */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center flex-shrink-0">
                <div className="text-5xl font-black text-[#1b4332]">4.8</div>
                <Stars rating={5} size="lg" />
                <p className="text-xs text-stone-400 mt-1 font-medium">
                  164 Reviews
                </p>
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <RatingBar label="5" percent={82} />
                <RatingBar label="4" percent={12} />
                <RatingBar label="3" percent={4} />
                <RatingBar label="2" percent={1} />
                <RatingBar label="1" percent={1} />
              </div>
            </div>
          </div>

          {/* Review cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-sm font-bold text-[#1b4332] border border-[#1b4332] rounded-full px-6 py-2.5 hover:bg-[#1b4332] hover:text-white transition-colors duration-200">
              View All 164 Reviews
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUST ════════════════════════════════════ */}
      <section className="bg-[#1b4332] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🇮🇳", label: "Made in India" },
              { icon: "🧪", label: "Lab Tested" },
              { icon: "💬", label: "24/7 Support" },
              { icon: "✅", label: "Quality Assured" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <p className="text-xs font-bold text-white/90 tracking-wide uppercase">
                  {t.label}
                </p>
                <p className="text-[10px] text-white/50">Trusted & verified</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FAQ ═══════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-2">
              Got Questions?
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black text-[#1b4332]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-white shadow-sm px-4 sm:px-6 overflow-hidden">
            {FAQS.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>

          <p className="text-center text-sm text-stone-400 mt-6">
            Still have questions?{" "}
            <a
              href="mailto:support@kupika.in"
              className="text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-900"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

// ── Desktop Image Gallery ─────────────────────────────────────────────────────
function DesktopImageGallery({ images = [], title }) {
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
