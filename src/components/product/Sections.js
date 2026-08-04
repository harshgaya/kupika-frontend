"use client";

import { useState } from "react";
import Image from "next/image";
import { TRUST_BADGES, SUPPORT_EMAIL } from "./data";

// ── Shared bits used by the sections below ────────────────────────────────────
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

function Heading({ eyebrow, title, subtitle, light }) {
  return (
    <div className="text-center">
      <p
        className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${
          light ? "text-[#D1A74B]" : "text-emerald-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-2xl sm:text-3xl font-black ${
          light ? "text-white" : "text-[#1b4332]"
        }`}
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Why Choose ────────────────────────────────────────────────────────────────
export function WhyChoose({ product }) {
  return (
    <section className="bg-[#EFECE6] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Heading
          eyebrow="Our Promise"
          title={`Why Choose ${product.title}?`}
          subtitle="Experience the power of authentic Ayurveda."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.features.map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl ${item.color || "bg-emerald-50 border-emerald-100"} border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300`}
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
  );
}

// ── Ingredients ───────────────────────────────────────────────────────────────
export function Ingredients({ product }) {
  return (
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
          {product.ingredients.map((ing) => (
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
          {product.ingredientTags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How To Use ────────────────────────────────────────────────────────────────
export function HowToUse({ product }) {
  return (
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
              {product.usageSteps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D1A74B] text-black font-black text-sm flex items-center justify-center shadow-lg shadow-amber-900/30">
                    {step.num ?? i + 1}
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
              src={product.usageImage}
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
  );
}

// ── Reviews ───────────────────────────────────────────────────────────────────
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

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full ${review.avatarColor || "bg-emerald-600"} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {review.avatar || review.name?.charAt(0) || "U"}
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

export function Reviews({ product }) {
  const { rating, reviewCount, ratingBreakdown, reviews } = product;
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 8;
  const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMore = reviews.length > INITIAL_COUNT;

  return (
    <section id="reviews" className="bg-[#FAF8F4] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10">
          <Heading eyebrow="Customer Stories" title="What Our Customers Say" />
        </div>

        {/* Rating summary */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center flex-shrink-0">
              <div className="text-5xl font-black text-[#1b4332]">{rating}</div>
              <Stars rating={Math.round(rating)} size="lg" />
              <p className="text-xs text-stone-400 mt-1 font-medium">
                {reviewCount} Reviews
              </p>
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <RatingBar label="5" percent={ratingBreakdown.five} />
              <RatingBar label="4" percent={ratingBreakdown.four} />
              <RatingBar label="3" percent={ratingBreakdown.three} />
              <RatingBar label="2" percent={ratingBreakdown.two} />
              <RatingBar label="1" percent={ratingBreakdown.one} />
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleReviews.map((review, i) => (
            <ReviewCard key={review.id ?? i} review={review} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-sm font-bold text-[#1b4332] border border-[#1b4332] rounded-full px-6 py-2.5 hover:bg-[#1b4332] hover:text-white transition-colors duration-200"
            >
              {showAll ? "Show Less" : `View All ${reviewCount} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Trust Strip ───────────────────────────────────────────────────────────────
export function TrustStrip({ product }) {
  return (
    <section className="bg-[#1b4332] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {TRUST_BADGES.map((t) => (
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
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
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

export function Faq({ product }) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10">
          <Heading
            eyebrow="Got Questions?"
            title="Frequently Asked Questions"
          />
        </div>

        <div className="divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-white shadow-sm px-4 sm:px-6 overflow-hidden">
          {product.faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          Still have questions?{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-900"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </section>
  );
}
