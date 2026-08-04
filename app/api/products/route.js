import { collections } from "@/src/lib/db/mongodb";
import { ok, fail } from "@/src/lib/server-utils";

export async function GET() {
  try {
    const products = await collections.products();
    const list = await products
      .find({ isActive: { $ne: false } })
      .sort({ isBestSeller: -1, createdAt: -1 })
      .toArray();

    // Normalise _id to string for the client.
    const data = list.map((p) => ({ ...p, _id: String(p._id) }));
    return ok(data);
  } catch (err) {
    console.error("products error:", err);
    return fail("Could not load products.", 500);
  }
}
