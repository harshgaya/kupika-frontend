import { collections } from "@/src/lib/db/mongodb";
import { getSessionUserId } from "@/src/lib/auth/session";
import { ok, fail, toObjectId } from "@/src/lib/server-utils";
import { createOrderRecord } from "@/src/lib/orders/create-order";

// Two different hooks doing two different jobs.
//
// The first closes the abandoned-cart lead so a customer who has just paid is
// not rung and sold what they already bought. The second puts the order in the
// CRM so that when they call about delivery, the agent can find it instead of
// telling them no order exists.
const VOICEFLOW_CHECKOUT_HOOK =
  "https://voiceflow.softplix.com/api/hooks/wh_be55d0ea98a0a933aa5419d4d082";

const VOICEFLOW_ORDER_HOOK =
  "https://voiceflow.softplix.com/api/hooks/wh_e56df27457a12c8e4d669f889a5a";

const userOrderFilter = (uid) => ({
  $or: [{ userId: toObjectId(uid) }, { user_id: String(uid) }],
});

export async function GET() {
  try {
    const uid = await getSessionUserId();
    if (!uid)
      return fail("Please verify your mobile number to view orders.", 401);
    const list = await (await collections.orders())
      .find(userOrderFilter(uid))
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();
    return ok(
      list.map((o) => ({
        ...o,
        _id: String(o._id),
        userId: o.userId ? String(o.userId) : o.user_id || null,
        status: o.status || String(o.order_status || "").toLowerCase(),
        order_status:
          o.order_status || String(o.status || "placed").toUpperCase(),
        tracking_id:
          o.tracking_id || o.trackingNumber || o.tracking_number || "",
        source: o.source || o.order_source || "website",
      })),
    );
  } catch (e) {
    console.error(e);
    return fail("Could not load orders.", 500);
  }
}

export async function POST(req) {
  try {
    const uid = await getSessionUserId();
    if (!uid)
      return fail("Please verify your mobile number to place the order.", 401);
    const b = await req.json().catch(() => ({})),
      userId = toObjectId(uid),
      checkoutId = toObjectId(b.checkoutId);
    const [users, addresses, checkouts, carts] = await Promise.all([
      collections.users(),
      collections.addresses(),
      collections.checkouts(),
      collections.carts(),
    ]);
    const user = await users.findOne({ _id: userId });
    const checkout = checkoutId
      ? await checkouts.findOne({ _id: checkoutId, status: "active" })
      : null;
    const cart = await carts.findOne({
      $or: [{ userId }, { user_id: String(uid) }],
    });
    const line = checkout?.items?.[0] || cart?.items?.[0];
    if (!line) return fail("Your checkout is empty.");
    const address = await addresses.findOne({
      $and: [
        { $or: [{ userId }, { user_id: String(uid) }] },
        { $or: [{ is_selected: true }, { isSelected: true }] },
      ],
    });
    if (!address) return fail("Please select a delivery address.");

    const phone = user?.phone || user?.mobile_number || address.phone;

    const { order } = await createOrderRecord({
      source: "website",
      mobile_number: phone,
      customer_name: address.name || user?.name,
      product_id: line.product_id || line.productId,
      product: line.product || line.name,
      quantity: line.quantity || 1,
      address,
      payment_plan: "cod",
      checkout_id: checkoutId ? String(checkoutId) : null,
    });

    if (checkoutId) {
      const now = new Date();
      await checkouts.updateOne(
        { _id: checkoutId },
        {
          $set: {
            status: "converted",
            orderId: order._id,
            order_id: String(order._id),
            userId,
            user_id: String(userId),
            convertedAt: now,
            converted_at: now,
            updatedAt: now,
            updated_at: now,
          },
        },
      );

      // Close the abandoned-cart lead.
      //
      // This cart was reported when the address was saved and a call may
      // already be waiting to go out. Ringing someone to sell them what they
      // bought a minute ago is the worst call the system can make, so the
      // lead and any queued call are cancelled here.
      //
      // The phone is included deliberately: it is what cancels a scheduled
      // call, not just the inbox row.
      fetch(VOICEFLOW_CHECKOUT_HOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: String(checkoutId),
          phone,
          event: "paid",
        }),
      }).catch((err) =>
        console.warn("[voiceflow] cart not cancelled:", err.message),
      );
    }

    // Put the order in the CRM.
    //
    // Outside the checkoutId block on purpose: an order placed straight from
    // the cart never had a checkout, but it is still an order the agent needs
    // to find when the customer rings to ask where their parcel is.
    //
    // external_id is our own order id, so every later update, including the
    // AWB from the courier, addresses the same record.
    fetch(VOICEFLOW_ORDER_HOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        external_id: String(order._id),
        phone,
        customer_name: address.name || user?.name || "",
        amount: order.total,
        status: "pending",
        product: line.product || line.name,
        address: [address.street_address, address.city, address.state]
          .filter(Boolean)
          .join(", "),
        city: address.city || "",
        pincode: address.pincode || "",
      }),
    }).catch((err) =>
      console.warn("[voiceflow] order not synced:", err.message),
    );

    return ok({
      order_id: String(order._id),
      orderNumber: `#${String(order._id).slice(-8).toUpperCase()}`,
      total: order.total,
    });
  } catch (e) {
    console.error(e);
    return fail(e.message || "Could not place order. Please try again.", 400);
  }
}
