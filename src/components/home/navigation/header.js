"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo } from "@/src/lib/constants";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function Header({ site }) {
  const [open, setOpen] = useState(false);

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("user_id");
  const navLinks = [
    { label: "Products", href: "#shop" },
    { label: "Benefits", href: "#benefits" },
    { label: "Ingredients", href: "#ingredients" },
    { label: "Reviews", href: "#reviews" },
    // { label: "My Profile", href: "/profile" },
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
              alt={`logo`}
              width={150}
              height={36}
              priority
              unoptimized
              className="shrink-0"
            />

            {/* NAME */}
            {/* <span className="text-xl font-semibold tracking-wide text-secondary">
              {"KUPIKA"}
            </span> */}
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
              href="#shop"
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
            <div className="space-y-1">
              <span className="block h-0.5 w-6 bg-black" />
              <span className="block h-0.5 w-6 bg-black" />
              <span className="block h-0.5 w-6 bg-black" />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-[#FAF8F4]">
          <nav
            className="flex flex-col gap-4 px-4 py-6 text-sm font-medium"
            aria-label="Mobile navigation"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-gray-800 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="#shop"
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-full bg-primary
 px-6 py-2 text-center text-white transition-opacity hover:opacity-90"
            >
              Shop Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
