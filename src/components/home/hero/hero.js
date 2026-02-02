import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#FBFAF7]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-secondary sm:text-5xl">
              Natural Strength,
              <br />
              Timeless Vitality.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-600">
              Authentic Ayurvedic wellness for the modern man. Formulated with
              premium herbs to restore energy, confidence, and hair health.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#shop"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Shop Now
              </Link>

              <Link
                href="#ingredients"
                className="rounded-full border border-secondary px-6 py-3 text-sm font-medium text-secondary transition hover:bg-secondary hover:text-white"
              >
                Explore Ingredients
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-black/5 pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span>100% Natural</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span>AYUSH Certified</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">👍</span>
                <span>Trusted by 50k+ Men</span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/home/hero_image.png"
                alt="Ayurvedic wellness product"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
