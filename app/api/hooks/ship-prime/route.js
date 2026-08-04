import { collections } from "@/src/lib/db/mongodb";
import { ok, fail } from "@/src/lib/server-utils";

export async function POST(req) {
  try {
    // ======================================================
    // 1. VERIFY WEBHOOK AUTHENTICATION
    // ======================================================

    // Reusing the same key as Shiprocket, as requested.
    const webhookKey = process.env.SHIPROCKET_WEBHOOK_KEY;

    if (!webhookKey) {
      console.error("SHIPROCKET_WEBHOOK_KEY is not configured");
      return fail("Webhook configuration error", 500);
    }

    const incomingKey = req.headers.get("x-api-key");

    if (incomingKey !== webhookKey) {
      console.warn("Unauthorized ShipPrime webhook request");
      return fail("Unauthorized", 401);
    }

    // ======================================================
    // 2. READ PAYLOAD
    // ======================================================

    const b = await req.json().catch(() => ({}));

    console.log("ShipPrime webhook received:", JSON.stringify(b));

    // ======================================================
    // 3. GET AWB / TRACKING NUMBER
    // ======================================================

    const tracking = String(
      b.awb ||
        b.awb_number ||
        b.awb_code ||
        b.awbNumber ||
        b.tracking_number ||
        b.trackingNumber ||
        b.tracking_id ||
        b.trackingId ||
        "",
    ).trim();

    if (!tracking) {
      console.warn("ShipPrime webhook missing AWB:", JSON.stringify(b));

      return fail("Missing AWB", 400);
    }

    // ======================================================
    // 4. GET / NORMALIZE STATUS
    // ======================================================

    const rawStatus = String(
      b.current_status ||
        b.currentStatus ||
        b.shipment_status ||
        b.shipmentStatus ||
        b.order_status ||
        b.orderStatus ||
        b.status ||
        "updated",
    ).trim();

    const normalizedStatus = rawStatus
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    // Avoid treating "undelivered" as "delivered".
    const delivered = normalizedStatus === "delivered";

    // ======================================================
    // 5. SHIPMENT INFORMATION
    // ======================================================

    const courierName =
      b.courier_name ||
      b.courierName ||
      b.courier ||
      b.logistics_partner ||
      b.logisticsPartner ||
      null;

    const shipmentStatusId =
      b.shipment_status_id ??
      b.shipmentStatusId ??
      b.status_id ??
      b.statusId ??
      null;

    const currentStatusId =
      b.current_status_id ??
      b.currentStatusId ??
      b.status_id ??
      b.statusId ??
      null;

    const estimatedDelivery =
      b.etd ||
      b.edd ||
      b.estimated_delivery ||
      b.estimatedDelivery ||
      b.expected_delivery_date ||
      b.expectedDeliveryDate ||
      null;

    const currentTimestamp =
      b.current_timestamp ||
      b.currentTimestamp ||
      b.updated_at ||
      b.updatedAt ||
      b.event_time ||
      b.eventTime ||
      null;

    // ======================================================
    // 6. TRACKING HISTORY / SCANS
    // ======================================================

    const scans = Array.isArray(b.scans)
      ? b.scans
      : Array.isArray(b.tracking_history)
        ? b.tracking_history
        : Array.isArray(b.trackingHistory)
          ? b.trackingHistory
          : Array.isArray(b.history)
            ? b.history
            : [];

    const now = new Date();

    // ======================================================
    // 7. BUILD DATABASE UPDATE
    // ======================================================

    const set = {
      // Shipping provider
      shippingProvider: "other",
      shipping_provider: "other",

      // Optional provider detail
      shippingAggregator: "shipprime",
      shipping_aggregator: "shipprime",

      // AWB
      trackingNumber: tracking,
      tracking_number: tracking,

      // Current shipment status
      shippingStatus: normalizedStatus,
      shipping_status: normalizedStatus,

      shippingStatusText: rawStatus,
      shipping_status_text: rawStatus,

      // Status IDs
      shippingStatusId: shipmentStatusId,
      shipping_status_id: shipmentStatusId,

      currentStatusId,
      current_status_id: currentStatusId,

      // Courier
      courierName,
      courier_name: courierName,

      // Estimated delivery
      estimatedDelivery,
      estimated_delivery: estimatedDelivery,

      // Provider event time
      shippingEventTimestamp: currentTimestamp,
      shipping_event_timestamp: currentTimestamp,

      // Tracking history
      trackingHistory: scans,
      tracking_history: scans,

      // Tracking URL
      trackingUrl: `https://shipprime.live/track-order?awb=${encodeURIComponent(tracking)}`,

      tracking_url: `https://shipprime.live/track-order?awb=${encodeURIComponent(tracking)}`,

      // Our timestamps
      shippingUpdatedAt: now,
      shipping_updated_at: now,

      updatedAt: now,
      updated_at: now,
    };

    // ======================================================
    // 8. DELIVERED
    // ======================================================

    if (delivered) {
      set.status = "delivered";
      set.order_status = "DELIVERED";

      set.deliveredAt = now;
      set.delivered_at = now;
    }

    // ======================================================
    // 9. FIND ORDER BY AWB
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
    // 10. ORDER NOT FOUND
    // ======================================================

    if (result.matchedCount === 0) {
      console.warn(`ShipPrime webhook AWB not found: ${tracking}`);

      // Webhook itself was received successfully,
      // so return 200 even if the AWB isn't in our DB.
      return ok({
        received: true,
        matched: 0,
        updated: 0,

        warning: "Order not found for AWB",

        tracking_number: tracking,
      });
    }

    // ======================================================
    // 11. SUCCESS
    // ======================================================

    console.log(
      `ShipPrime shipment updated: ${tracking} -> ${normalizedStatus}`,
    );

    return ok({
      received: true,

      matched: result.matchedCount,
      updated: result.modifiedCount,

      tracking_number: tracking,

      shipping_provider: "other",
      shipping_aggregator: "shipprime",

      shipping_status: normalizedStatus,
      shipping_status_text: rawStatus,

      courier_name: courierName,

      estimated_delivery: estimatedDelivery,

      tracking_url: `https://shipprime.live/track-order?awb=${encodeURIComponent(tracking)}`,

      delivered,
    });
  } catch (error) {
    console.error("ShipPrime webhook error:", error);

    return fail("Webhook failed", 500);
  }
}
