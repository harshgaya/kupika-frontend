import { collections } from "@/src/lib/db/mongodb";
import { ok, fail } from "@/src/lib/server-utils";

export async function GET(_req, { params }) {
  try {
    const { slug } = await params;
    if (!slug) return fail("Missing product slug.");

    const products = await collections.products();
    const product = await products.findOne({
      slug: String(slug).toLowerCase(),
      isActive: { $ne: false },
    });

    if (!product) return fail("Product not found.", 404);

    return ok({ ...product, _id: String(product._id) });
  } catch (err) {
    console.error("product-slug error:", err);
    return fail("Could not load product.", 500);
  }
}
