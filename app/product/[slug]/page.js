import ProductDetails from "@/src/components/product/product-details";
import { getProductBySlug } from "@/src/lib/api";
import Link from "next/link";

export default async function ProductDetailsMain({ params }) {
  const { slug } = await params;
  console.log("Fetching product with slug:", slug);

  const product = await getProductBySlug(slug);
  console.log("Fetched product data:", product);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F4] px-6">
        <div className="max-w-md text-center">
          <div className="text-7xl font-semibold text-secondary">404</div>

          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            The product you’re looking for doesn’t exist or may have been
            removed. Please check the URL or explore our other products.
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
