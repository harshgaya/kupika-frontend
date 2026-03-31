"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo } from "@/src/lib/constants";

export default function Header({ site }) {
  const [open, setOpen] = useState(false);

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("user_id");

  const navLinks = [
    { label: "Reels", href: "#reels" },
    { label: "Category", href: "#category" },
    { label: "Reviews", href: "#reviews" },
  ];
  if (isLoggedIn) {
    navLinks.push({ label: "My Orders", href: "/orders" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={`${logo}`}
              alt="logo"
              width={150}
              height={36}
              priority
              unoptimized
              className="shrink-0"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700"
            aria-label="Main navigation"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden md:block">
            <Link
              href="/shop-all"
              className="rounded-full bg-secondary px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Shop Now
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`block h-0.5 bg-black transition-all duration-300 origin-center ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-black transition-all duration-300 ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-black transition-all duration-300 origin-center ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU — animated with max-height */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-black/5 bg-[#FAF8F4]">
          <nav
            className="flex flex-col gap-4 px-4 py-6 text-sm font-medium"
            aria-label="Mobile navigation"
          >
            {navLinks.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-gray-800 transition-all duration-300 hover:text-black hover:translate-x-1 ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: open ? `${index * 50}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/shop-all"
              onClick={() => setOpen(false)}
              className={`mt-2 w-full rounded-full bg-primary px-6 py-2 text-center text-white transition-all duration-300 hover:opacity-90 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{
                transitionDelay: open ? `${navLinks.length * 50}ms` : "0ms",
              }}
            >
              Shop Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
