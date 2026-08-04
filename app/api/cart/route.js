import { collections } from "@/src/lib/db/mongodb";
import {
  ok,
  fail,
  resolveOwner,
  ownerFilter,
  toObjectId,
} from "@/src/lib/server-utils";

/** Recompute totals from line items so the client can never fake a price. */
function withTotals(cart) {
  const items = (cart?.items || []).map((i) => ({
    ...i,
    productId: String(i.productId),
  }));
  const itemsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { items, itemsTotal, count: items.reduce((s, i) => s + i.quantity, 0) };
}

async function loadCart(owner) {
  const carts = await collections.carts();
  const cart = await carts.findOne(ownerFilter(owner));
  return { carts, cart };
}

/** GET /api/cart?guest_id=... */
export async function GET(req) {
  try {
    const guestId = req.nextUrl.searchParams.get("guest_id");
    const owner = await resolveOwner(guestId);
    if (!owner.userId && !owner.guestId) return ok(withTotals(null));

    const { cart } = await loadCart(owner);
    return ok(withTotals(cart));
  } catch (err) {
    console.error("get cart error:", err);
    return fail("Could not load cart.", 500);
  }
}

/**
 * POST /api/cart
 * body: { productId, quantity, guest_id, op }
 *   op = "add" (default) -> add quantity to the line
 *   op = "set"           -> set the line to quantity (0 removes it)
 *   op = "remove"        -> remove the line entirely
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const owner = await resolveOwner(body.guest_id);
    if (!owner.userId && !owner.guestId) return fail("No cart context.");

    const productId = toObjectId(body.productId);
    if (!productId) return fail("Invalid product.");

    const op = body.op || "add";
    const qty = Math.max(0, Number(body.quantity) || 0);

    const products = await collections.products();
    const product = await products.findOne({ _id: productId, isActive: { $ne: false } });
    if (!product && op !== "remove") return fail("Product unavailable.", 404);

    const { carts, cart } = await loadCart(owner);
    const filter = ownerFilter(owner);

    // Ensure a cart document exists.
    if (!cart) {
      await carts.updateOne(
        filter,
        {
          $setOnInsert: {
            ...filter,
            userId: owner.userId ? toObjectId(owner.userId) : null,
            guestId: owner.guestId,
            items: [],
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );
    }

    const fresh = await carts.findOne(filter);
    let items = fresh.items || [];
    const idx = items.findIndex((i) => String(i.productId) === String(productId));

    if (op === "remove") {
      items = items.filter((i) => String(i.productId) !== String(productId));
    } else {
      const line = {
        productId,
        slug: product.slug,
        name: product.name,
        image: product.thumbnail || product.images?.[0] || "",
        price: product.price, // authoritative price from DB
      };
      if (idx === -1) {
        if (qty > 0) items.push({ ...line, quantity: op === "set" ? qty : qty || 1 });
      } else {
        const current = items[idx].quantity;
        const next = op === "set" ? qty : current + (qty || 1);
        if (next <= 0) items.splice(idx, 1);
        else items[idx] = { ...line, quantity: next };
      }
    }

    await carts.updateOne(filter, { $set: { items, updatedAt: new Date() } });
    const updated = await carts.findOne(filter);
    return ok(withTotals(updated));
  } catch (err) {
    console.error("update cart error:", err);
    return fail("Could not update cart.", 500);
  }
}
