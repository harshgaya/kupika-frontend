import { collections } from "@/src/lib/db/mongodb";
import { normalizeIndianPhone } from "@/src/lib/customer/identity";
import { ok, fail, toObjectId } from "@/src/lib/server-utils";

export async function POST(req) {
  if (
    !process.env.AGENT_API_KEY ||
    req.headers.get("x-agent-api-key") !== process.env.AGENT_API_KEY
  ) {
    return fail("Unauthorized", 401);
  }

  try {
    const b = await req.json();

    const orders = await collections.orders();

    const phone = normalizeIndianPhone(b.mobile_number || b.phone);
    const id = toObjectId(b.order_id);
    const name = String(b.customer_name || b.name || "").trim();
    const address = String(b.address || b.full_address || "").trim();
    const callUuid = String(b.call_uuid || "").trim() || null;

    // =========================================================
    // BUILD ORDER SEARCH
    // =========================================================

    const or = [];

    if (id) {
      or.push({ _id: id });
    }

    if (phone) {
      or.push({
        $or: [
          { mobileNumber: phone },
          { mobile_number: phone },
          { "address.phone": phone },
        ],
      });
    }

    if (name) {
      or.push({
        $or: [
          { customerName: { $regex: name, $options: "i" } },
          { customer_name: { $regex: name, $options: "i" } },
          { "address.name": { $regex: name, $options: "i" } },
        ],
      });
    }

    if (address) {
      or.push({
        $or: [
          {
            "address.street_address": {
              $regex: address,
              $options: "i",
            },
          },
          {
            "address.full_address": {
              $regex: address,
              $options: "i",
            },
          },
        ],
      });
    }

    if (!or.length) {
      return fail("Provide mobile_number, order_id, customer_name or address.");
    }

    const q = or.length === 1 ? or[0] : { $or: or };

    const list = await orders
      .find(q)
      .sort({
        created_at: -1,
        createdAt: -1,
      })
      .limit(5)
      .toArray();

    // =========================================================
    // ORDER NOT FOUND -> CREATE/UPDATE CUSTOMER QUERY
    // =========================================================

    if (!list.length) {
      const customerQueries = await collections.customerQueries();
      const now = new Date();

      /*
       * Avoid creating duplicate unresolved queries.
       *
       * Example:
       * Customer calls 3 times asking about the same missing order.
       * We keep one open query instead of creating 3.
       */
      const existingQueryFilters = [
        {
          type: "order_not_found",
          status: "open",
        },
      ];

      if (phone) {
        existingQueryFilters.push({
          $or: [{ mobileNumber: phone }, { mobile_number: phone }],
        });
      } else if (name) {
        existingQueryFilters.push({
          $or: [{ customerName: name }, { customer_name: name }],
        });
      } else if (id) {
        existingQueryFilters.push({
          $or: [{ orderId: String(id) }, { order_id: String(id) }],
        });
      }

      const existingQuery = await customerQueries.findOne({
        $and: existingQueryFilters,
      });

      // ---------------------------------------------------------
      // EXISTING OPEN QUERY
      // ---------------------------------------------------------

      if (existingQuery) {
        await customerQueries.updateOne(
          { _id: existingQuery._id },
          {
            $set: {
              updatedAt: now,
              updated_at: now,

              ...(callUuid
                ? {
                    callUuid,
                    call_uuid: callUuid,
                  }
                : {}),

              ...(name
                ? {
                    customerName: name,
                    customer_name: name,
                  }
                : {}),

              ...(address
                ? {
                    searchedAddress: address,
                    searched_address: address,
                  }
                : {}),
            },

            $inc: {
              occurrenceCount: 1,
              occurrence_count: 1,
            },
          },
        );

        return ok({
          found: false,
          trackable: false,
          reason: "order_not_found",

          query_created: false,
          query_updated: true,
          query_id: String(existingQuery._id),
        });
      }

      // ---------------------------------------------------------
      // CREATE NEW QUERY
      // ---------------------------------------------------------

      const queryDoc = {
        userId: null,
        user_id: null,

        mobileNumber: phone || "",
        mobile_number: phone || "",

        customerName: name || "",
        customer_name: name || "",

        type: "order_not_found",

        subject: "Customer order could not be found",

        description:
          "AI agent attempted to check the customer's order status but no matching order was found.",

        searchedOrderId: id ? String(id) : null,
        searched_order_id: id ? String(id) : null,

        searchedAddress: address || null,
        searched_address: address || null,

        callUuid,
        call_uuid: callUuid,

        source: "ai",
        createdBy: "ai",
        created_by: "ai",

        priority: "normal",
        status: "open",

        occurrenceCount: 1,
        occurrence_count: 1,

        createdAt: now,
        created_at: now,
        updatedAt: now,
        updated_at: now,
      };

      const result = await customerQueries.insertOne(queryDoc);

      return ok({
        found: false,
        trackable: false,
        reason: "order_not_found",

        query_created: true,
        query_updated: false,
        query_id: String(result.insertedId),
      });
    }

    // =========================================================
    // ORDER FOUND
    // =========================================================

    return ok({
      found: true,

      orders: list.map((o) => {
        const trackingNumber =
          o.trackingNumber || o.tracking_number || o.tracking_id || null;

        return {
          order_id: String(o._id),

          customer_name:
            o.customerName || o.customer_name || o.address?.name || "",

          mobile_number:
            o.mobileNumber || o.mobile_number || o.address?.phone || "",

          product: o.product || o.items?.[0]?.name || "",

          status: String(o.status || o.order_status || "placed").toLowerCase(),

          shipping_provider: o.shippingProvider || o.shipping_provider || null,

          tracking_number: trackingNumber,

          shipping_status: o.shippingStatus || o.shipping_status || null,

          shipping_status_text:
            o.shippingStatusText || o.shipping_status_text || null,

          trackable: Boolean(trackingNumber),

          updated_at:
            o.shippingUpdatedAt ||
            o.shipping_updated_at ||
            o.updatedAt ||
            o.updated_at ||
            o.createdAt ||
            o.created_at,
        };
      }),
    });
  } catch (error) {
    console.error("Agent order status error:", error);

    return fail(error?.message || "Unable to check order status.", 500);
  }
}
