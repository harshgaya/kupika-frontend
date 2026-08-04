import { collections } from "@/src/lib/db/mongodb";
import { ok, fail } from "@/src/lib/server-utils";

export async function POST(req) {
  try {
    // ======================================================
    // 1. VERIFY WEBHOOK AUTHENTICATION
    // ======================================================

    const webhookKey = process.env.SHIPROCKET_WEBHOOK_KEY;

    if (!webhookKey) {
      console.error("SHIPROCKET_WEBHOOK_KEY is not configured");

      return fail("Webhook configuration error", 500);
    }

    const incomingKey = req.headers.get("x-api-key");

    if (incomingKey !== webhookKey) {
      console.warn("Unauthorized shipment webhook request");

      return fail("Unauthorized", 401);
    }

    // ======================================================
    // 2. READ PAYLOAD
    // ======================================================

    const b = await req.json().catch(() => ({}));

    console.log("Shipment webhook received:", JSON.stringify(b));

    // ======================================================
    // 3. GET AWB / TRACKING NUMBER
    // ======================================================

    const tracking = String(
      b.awb || b.awb_code || b.tracking_number || b.trackingNumber || "",
    ).trim();

    if (!tracking) {
      console.warn("Shipment webhook missing AWB");

      return fail("Missing AWB", 400);
    }

    // ======================================================
    // 4. NORMALIZE STATUS
    // ======================================================

    const rawStatus = String(
      b.current_status || b.shipment_status || b.status || "updated",
    ).trim();

    const normalizedStatus = rawStatus
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    // IMPORTANT:
    // Do NOT use includes("delivered")
    // because "undelivered" also contains "delivered".
    const delivered = normalizedStatus === "delivered";

    // ======================================================
    // 5. SHIPMENT INFORMATION
    // ======================================================

    const courierName = b.courier_name || b.courierName || null;

    const shipmentStatusId = b.shipment_status_id ?? b.shipmentStatusId ?? null;

    const currentStatusId = b.current_status_id ?? b.currentStatusId ?? null;

    const estimatedDelivery =
      b.etd || b.estimated_delivery || b.estimatedDelivery || null;

    const currentTimestamp = b.current_timestamp || b.currentTimestamp || null;

    const scans = Array.isArray(b.scans) ? b.scans : [];

    const now = new Date();

    // ======================================================
    // 6. BUILD UPDATE
    // ======================================================

    const set = {
      // Shipping provider
      shippingProvider: "shiprocket",
      shipping_provider: "shiprocket",

      // Tracking number
      trackingNumber: tracking,
      tracking_number: tracking,

      // Current shipping status
      shippingStatus: normalizedStatus,
      shipping_status: normalizedStatus,

      shippingStatusText: rawStatus,
      shipping_status_text: rawStatus,

      // Status IDs
      shippingStatusId: shipmentStatusId,
      shipping_status_id: shipmentStatusId,

      currentStatusId: currentStatusId,
      current_status_id: currentStatusId,

      // Courier
      courierName,
      courier_name: courierName,

      // ETA
      estimatedDelivery,
      estimated_delivery: estimatedDelivery,

      // Latest tracking timestamp from provider
      shippingEventTimestamp: currentTimestamp,
      shipping_event_timestamp: currentTimestamp,

      // Tracking history
      trackingHistory: scans,
      tracking_history: scans,

      // Our own update timestamp
      shippingUpdatedAt: now,
      shipping_updated_at: now,

      updatedAt: now,
      updated_at: now,
    };

    // ======================================================
    // 7. DELIVERED ORDER
    // ======================================================

    if (delivered) {
      set.status = "delivered";
      set.order_status = "DELIVERED";

      set.deliveredAt = now;
      set.delivered_at = now;
    }

    // ======================================================
    // 8. UPDATE ORDER USING AWB
    // ======================================================

    const orders = await collections.orders();

    const result = await orders.updateOne(
      {
        $or: [
          {
            trackingNumber: tracking,
          },
          {
            tracking_number: tracking,
          },
          {
            tracking_id: tracking,
          },
          {
            "shipping.trackingNumber": tracking,
          },
          {
            "shipping.tracking_number": tracking,
          },
        ],
      },
      {
        $set: set,
      },
    );

    // ======================================================
    // 9. AWB NOT FOUND
    // ======================================================

    if (result.matchedCount === 0) {
      console.warn(`Shipment webhook AWB not found: ${tracking}`);

      /*
       * Still return HTTP 200.
       *
       * The webhook itself was successfully received.
       * We don't want the provider repeatedly retrying
       * because an order wasn't found locally.
       */
      return ok({
        received: true,
        matched: 0,
        updated: 0,
        warning: "Order not found for AWB",
        tracking_number: tracking,
      });
    }

    // ======================================================
    // 10. SUCCESS
    // ======================================================

    console.log(`Shipment updated: ${tracking} -> ${normalizedStatus}`);

    return ok({
      received: true,
      matched: result.matchedCount,
      updated: result.modifiedCount,

      tracking_number: tracking,

      shipping_status: normalizedStatus,

      shipping_status_text: rawStatus,

      courier_name: courierName,

      estimated_delivery: estimatedDelivery,

      delivered,
    });
  } catch (error) {
    console.error("Shipment webhook error:", error);

    return fail("Webhook failed", 500);
  }
}
