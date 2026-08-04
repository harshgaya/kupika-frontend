import { collections } from "@/src/lib/db/mongodb";
import { ok, fail } from "@/src/lib/server-utils";
export async function POST(req) {
  try {
    if (
      process.env.SHIPROCKET_WEBHOOK_KEY &&
      req.headers.get("x-api-key") !== process.env.SHIPROCKET_WEBHOOK_KEY
    )
      return fail("Unauthorized", 401);
    const b = await req.json().catch(() => ({})),
      tracking = String(
        b.awb || b.awb_code || b.tracking_number || b.trackingNumber || "",
      ).trim();
    if (!tracking) return fail("Missing AWB");
    const raw = String(
        b.current_status || b.shipment_status || b.status || "updated",
      ),
      normalized = raw
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
    const delivered =
      normalized.includes("delivered") && !normalized.includes("rto");
    const now = new Date(),
      set = {
        shippingProvider: "shiprocket",
        shipping_provider: "shiprocket",
        shippingStatus: normalized,
        shipping_status: normalized,
        shippingStatusText: raw,
        shipping_status_text: raw,
        shippingUpdatedAt: now,
        shipping_updated_at: now,
        updatedAt: now,
        updated_at: now,
        ...(delivered
          ? { status: "delivered", order_status: "DELIVERED" }
          : {}),
      };
    const result = await (
      await collections.orders()
    ).updateOne(
      {
        $or: [
          { trackingNumber: tracking },
          { tracking_number: tracking },
          { tracking_id: tracking },
          { "shipping.trackingNumber": tracking },
          { "shipping.tracking_number": tracking },
        ],
      },
      { $set: set },
    );
    return ok({
      received: true,
      matched: result.matchedCount,
      updated: result.modifiedCount,
    });
  } catch (e) {
    console.error("Shiprocket webhook", e);
    return fail("Webhook failed", 500);
  }
}
