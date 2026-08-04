import "server-only";
import { collections } from "@/src/lib/db/mongodb";

/**
 * Direct database reads for use inside Server Components.
 *
 * Server Components must NOT fetch("/api/...") with a relative URL — on the
 * server there is no origin to resolve it against ("Failed to parse URL").
 * Instead they read Mongo directly here, which is also one less network hop.
 * (Client components still use src/lib/api.js relative fetches — fine in the
 * browser.)
 */

const toPlain = (doc) =>
  doc && {
    ...doc,
    _id: String(doc._id),
    userId: doc.userId ? String(doc.userId) : undefined,
  };

export async function getProductsServer() {
  try {
    const products = await collections.products();
    const list = await products
      .find({ isActive: { $ne: false } })
      .sort({ isBestSeller: -1, createdAt: -1 })
      .toArray();
    return list.map(toPlain);
  } catch (err) {
    console.error("getProductsServer error:", err);
    return [];
  }
}

export async function getProductBySlugServer(slug) {
  try {
    if (!slug) return null;
    const products = await collections.products();
    const product = await products.findOne({
      slug: String(slug).toLowerCase(),
      isActive: { $ne: false },
    });
    return toPlain(product) || null;
  } catch (err) {
    console.error("getProductBySlugServer error:", err);
    return null;
  }
}
