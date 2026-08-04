import { ok, fail } from "@/src/lib/server-utils";
import { createOrderRecord } from "@/src/lib/orders/create-order";
import { collections } from "@/src/lib/db/mongodb";
function authorized(req) {
  return (
    process.env.AGENT_API_KEY &&
    req.headers.get("x-agent-api-key") === process.env.AGENT_API_KEY
  );
}
export async function POST(req) {
  try {
    if (!authorized(req)) return fail("Unauthorized", 401);
    const b = await req.json();
    const { order, user } = await createOrderRecord({
      ...b,
      price: undefined,
      source: "ai",
      address: {
        name: b.customer_name,
        phone: b.mobile_number,
        full_address: b.full_address,
        street_address: b.full_address,
        city: b.city || "",
        state: b.state || "",
        pincode: b.pincode || "",
      },
    });
    const now = new Date();
    if (b.call_uuid)
      await (
        await collections.aiCalls()
      ).updateOne(
        { $or: [{ callUuid: b.call_uuid }, { call_uuid: b.call_uuid }] },
        {
          $set: {
            userId: user._id,
            user_id: String(user._id),
            customerName: order.customerName,
            customer_name: order.customerName,
            relatedOrderId: order._id,
            related_order_id: String(order._id),
            callOutcome: "order_placed",
            call_outcome: "order_placed",
            updatedAt: now,
            updated_at: now,
          },
        },
      );
    return ok({
      order_id: String(order._id),
      orderNumber: `#${String(order._id).slice(-8).toUpperCase()}`,
      user_id: String(user._id),
      status: order.status,
      total: order.total,
    });
  } catch (e) {
    console.error(e);
    return fail(e.message || "Could not create AI order", 400);
  }
}
