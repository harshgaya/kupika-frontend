// app/product/[slug]/page.js
import { Suspense } from "react";
import ProductDetails from "@/src/components/product/product-details";
import { getProductBySlug } from "@/src/lib/api";
import Link from "next/link";

function ProductLoader() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image skeleton */}
        <div className="aspect-square bg-stone-200 animate-pulse rounded-2xl" />

        {/* Content skeleton */}
        <div className="space-y-4 py-4">
          <div className="h-3 bg-stone-200 animate-pulse rounded w-1/4" />
          <div className="h-7 bg-stone-200 animate-pulse rounded w-3/4" />
          <div className="h-4 bg-stone-200 animate-pulse rounded w-1/2" />

          <div className="h-px bg-stone-200 my-4" />

          <div className="h-8 bg-stone-200 animate-pulse rounded w-1/3" />
          <div className="h-4 bg-stone-200 animate-pulse rounded w-2/3" />
          <div className="h-4 bg-stone-200 animate-pulse rounded w-1/2" />

          <div className="h-px bg-stone-200 my-4" />

          <div className="h-12 bg-stone-200 animate-pulse rounded-xl w-full" />
          <div className="h-12 bg-stone-200 animate-pulse rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

async function ProductFetcher({ slug }) {
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-6">
        <div className="max-w-md text-center">
          <div className="text-7xl font-semibold text-secondary">404</div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Product Not Found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {
              "The product you're looking for doesn't exist or may have been removed. Please check the URL or explore our other products."
            }
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-full bg-secondary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Browse Products
            </Link>
            <Link
              href="/"
              className="rounded-full border border-secondary px-6 py-3 text-sm font-medium text-secondary transition hover:bg-secondary hover:text-white"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <ProductDetails product={product} />;
}

export default async function Page({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductLoader />}>
      <ProductFetcher slug={slug} />
    </Suspense>
  );
}
