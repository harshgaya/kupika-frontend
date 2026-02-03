import Image from "next/image";
import Link from "next/link";

export default function BestSellers({ products = [] }) {
  return (
    <section id="shop" className="bg-[#FBFAF7] py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* SECTION HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-secondary sm:text-4xl">
            Our Best Sellers
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Expertly crafted formulations for men&apos;s wellness and overall
            health.
          </p>
        </div>

        {/* PRODUCTS GRID */}
        <div className="mt-12 grid justify-items-center gap-8 sm:grid-cols-2 lg:gap-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex w-full max-w-[260px] flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative mx-auto mb-6 aspect-[3/4] w-full max-w-[220px]">
                <Image
                  src={`${product.cover_image}`}
                  alt={product.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-1 flex-col text-center">
                <h3 className="text-lg font-semibold text-secondary">
                  {product.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mt-4 text-lg font-semibold text-gray-900">
                  ₹{product.selling_price}
                </div>

                {/* CTA */}
                <Link
                  href={`/product/${product.slug}`}
                  className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
