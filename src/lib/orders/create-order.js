// import { collections } from "@/src/lib/db/mongodb";
// import {
//   findOrCreateUser,
//   normalizeIndianPhone,
// } from "@/src/lib/customer/identity";
// import { requireProductPrice } from "@/src/lib/product-map";
// import { toObjectId } from "@/src/lib/server-utils";
// import { clean, validateOrderInput, firstError } from "@/src/lib/validation";
// const ALLOWED_SOURCES = new Set([
//   "website",
//   "checkout",
//   "whatsapp",
//   "ai",
//   "admin",
// ]);
// function addressOf(i = {}, phone, name) {
//   const full = clean(i.full_address || i.fullAddress);
//   return {
//     name: clean(i.name || name),
//     phone,
//     street_address: clean(i.street_address || i.streetAddress || full),
//     city: clean(i.city),
//     state: clean(i.state),
//     pincode: clean(i.pincode),
//     ...(full ? { full_address: full } : {}),
//   };
// }
// async function saveUserAddress(user, address) {
//   const addresses = await collections.addresses();
//   const now = new Date();
//   const match = {
//     user_id: String(user._id),
//     phone: address.phone,
//     street_address: address.street_address,
//     city: address.city,
//     state: address.state,
//     pincode: address.pincode,
//   };
//   const existing = await addresses.findOne(match);
//   if (existing) {
//     await addresses.updateOne(
//       { _id: existing._id },
//       { $set: { name: address.name, updated_at: now, updatedAt: now } },
//     );
//     return existing._id;
//   }
//   const count = await addresses.countDocuments({ user_id: String(user._id) });
//   const doc = {
//     ...address,
//     userId: user._id,
//     user_id: String(user._id),
//     guestId: null,
//     guest_id: null,
//     is_selected: count === 0,
//     isSelected: count === 0,
//     created_at: now,
//     createdAt: now,
//     updated_at: now,
//     updatedAt: now,
//   };
//   const r = await addresses.insertOne(doc);
//   return r.insertedId;
// }
// export async function createOrderRecord(input = {}) {
//   const phone = normalizeIndianPhone(
//     input.mobile_number ||
//       input.mobileNumber ||
//       input.phone ||
//       input.address?.phone,
//   );
//   if (!phone) throw new Error("Valid 10-digit mobile number is required.");
//   const source = ALLOWED_SOURCES.has(input.source) ? input.source : "admin";
//   const user = await findOrCreateUser(phone, {
//     name: clean(
//       input.customer_name || input.customerName || input.address?.name,
//     ),
//     source,
//   });
//   const products = await collections.products();
//   let product = null;
//   const pid = toObjectId(input.product_id || input.productId);
//   if (pid) product = await products.findOne({ _id: pid });
//   if (!product && input.product) {
//     const escaped = clean(input.product).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//     product = await products.findOne({
//       $or: [
//         { title: { $regex: `^${escaped}$`, $options: "i" } },
//         { name: { $regex: `^${escaped}$`, $options: "i" } },
//         { slug: input.product },
//       ],
//     });
//   }
//   let pv = null;
//   if (product) pv = requireProductPrice(product);
//   const quantity = Math.max(1, Number(input.quantity || 1)),
//     unitPrice = Number(input.price || pv?.price || 0);
//   const customerName = clean(
//       input.customer_name ||
//         input.customerName ||
//         input.address?.name ||
//         user.name,
//     ),
//     address = addressOf(input.address || input, phone, customerName);
//   const paymentPlan = clean(
//     input.payment_plan ||
//       input.paymentPlan ||
//       (String(input.payment_mode || "").toUpperCase() === "PREPAID"
//         ? "prepaid_full"
//         : "cod"),
//   ).toLowerCase();
//   const errors = validateOrderInput({
//     customer_name: customerName,
//     mobile_number: phone,
//     quantity,
//     price: unitPrice,
//     payment_plan: paymentPlan,
//     address,
//   });
//   if (Object.keys(errors).length) throw new Error(firstError(errors));
//   const item = {
//     productId: product?._id || null,
//     product_id: product ? String(product._id) : input.product_id || null,
//     name: pv?.name || clean(input.product) || "Kaam Creator",
//     product: pv?.name || clean(input.product) || "Kaam Creator",
//     quantity,
//     price: unitPrice,
//     image: pv?.image || clean(input.image),
//   };
//   const total = unitPrice * quantity;
//   let paidAmount = 0,
//     paymentMode = "COD",
//     paymentStatus = "pending";
//   if (paymentPlan === "prepaid_full") {
//     paidAmount = total;
//     paymentMode = "PREPAID";
//     paymentStatus = "paid";
//   } else if (paymentPlan === "prepaid_500") {
//     paidAmount = Math.min(500, total);
//     paymentMode = "PARTIAL_PREPAID";
//     paymentStatus = "partial";
//   }
//   const dueAmount = Math.max(0, total - paidAmount);
//   const provider = clean(
//       input.shipping_provider || input.shippingProvider,
//     ).toLowerCase(),
//     tracking = clean(
//       input.tracking_number || input.trackingNumber || input.tracking_id,
//     ),
//     status = clean(
//       input.status || input.order_status || (tracking ? "shipped" : "placed"),
//     ).toLowerCase(),
//     now = new Date();
//   const addressId = await saveUserAddress(user, address);
//   const doc = {
//     userId: user._id,
//     user_id: String(user._id),
//     mobileNumber: phone,
//     mobile_number: phone,
//     customerName,
//     customer_name: customerName,
//     product_id: item.product_id,
//     product: item.name,
//     quantity,
//     price: unitPrice,
//     image: item.image,
//     items: [item],
//     address,
//     address_id: String(addressId),
//     shippingAddress: address,
//     itemsTotal: total,
//     items_total: total,
//     deliveryFee: 0,
//     delivery_fee: 0,
//     total,
//     paymentPlan: paymentPlan,
//     payment_plan: paymentPlan,
//     paymentMethod: paymentMode.toLowerCase(),
//     payment_mode: paymentMode,
//     paymentStatus,
//     payment_status: paymentStatus,
//     paidAmount,
//     paid_amount: paidAmount,
//     dueAmount,
//     due_amount: dueAmount,
//     status,
//     order_status: status.toUpperCase(),
//     source,
//     order_source: source,
//     added_by: source,
//     shippingProvider: provider,
//     shipping_provider: provider,
//     trackingNumber: tracking,
//     tracking_number: tracking,
//     tracking_id: tracking,
//     shippingStatus: tracking ? "shipped" : "",
//     shipping_status: tracking ? "shipped" : "",
//     checkoutId: toObjectId(input.checkout_id || input.checkoutId) || null,
//     checkout_id: input.checkout_id || input.checkoutId || null,
//     callUuid: input.call_uuid || null,
//     call_uuid: input.call_uuid || null,
//     createdAt: now,
//     created_at: now,
//     updatedAt: now,
//     updated_at: now,
//   };
//   const result = await (await collections.orders()).insertOne(doc);
//   if (product?._id)
//     await products.updateOne(
//       { _id: product._id },
//       { $inc: { stock_quantity: -quantity } },
//     );
//   return { order: { ...doc, _id: result.insertedId }, user, result };
// }
import { collections } from "@/src/lib/db/mongodb";

import {
  findOrCreateUser,
  normalizeIndianPhone,
} from "@/src/lib/customer/identity";

import { requireProductPrice } from "@/src/lib/product-map";
import { toObjectId } from "@/src/lib/server-utils";
import { clean, validateOrderInput, firstError } from "@/src/lib/validation";

const ALLOWED_SOURCES = new Set([
  "website",
  "checkout",
  "whatsapp",
  "ai",
  "admin",
]);

function addressOf(i = {}, phone = "", name = "") {
  const full = clean(i.full_address || i.fullAddress) || "";

  return {
    name: clean(i.name || name) || "",
    phone: phone || "",
    street_address: clean(i.street_address || i.streetAddress || full) || "",
    city: clean(i.city) || "",
    state: clean(i.state) || "",
    pincode: clean(i.pincode) || "",
    full_address: full,
  };
}

async function saveUserAddress(user, address) {
  const addresses = await collections.addresses();
  const now = new Date();

  const match = {
    user_id: String(user._id),
    phone: address.phone || "",
    street_address: address.street_address || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
  };

  const existing = await addresses.findOne(match);

  if (existing) {
    await addresses.updateOne(
      { _id: existing._id },
      {
        $set: {
          name: address.name || "",
          updated_at: now,
          updatedAt: now,
        },
      },
    );

    return existing._id;
  }

  const count = await addresses.countDocuments({
    user_id: String(user._id),
  });

  const doc = {
    ...address,

    userId: user._id,
    user_id: String(user._id),

    guestId: null,
    guest_id: null,

    is_selected: count === 0,
    isSelected: count === 0,

    created_at: now,
    createdAt: now,

    updated_at: now,
    updatedAt: now,
  };

  const r = await addresses.insertOne(doc);

  return r.insertedId;
}

export async function createOrderRecord(input = {}) {
  /*
   * -------------------------------------------------------
   * SOURCE
   * -------------------------------------------------------
   */

  const source = ALLOWED_SOURCES.has(input.source) ? input.source : "admin";

  /*
   * -------------------------------------------------------
   * MOBILE NUMBER
   * -------------------------------------------------------
   *
   * Mobile is mandatory for EVERY source.
   */

  const phone = normalizeIndianPhone(
    input.mobile_number ||
      input.mobileNumber ||
      input.phone ||
      input.address?.phone,
  );

  if (!phone) {
    throw new Error("Valid 10-digit mobile number is required.");
  }

  /*
   * -------------------------------------------------------
   * USER
   * -------------------------------------------------------
   */

  const user = await findOrCreateUser(phone, {
    name: clean(
      input.customer_name || input.customerName || input.address?.name || "",
    ),

    source,
  });

  /*
   * -------------------------------------------------------
   * PRODUCT
   * -------------------------------------------------------
   */

  const products = await collections.products();

  let product = null;

  const pid = toObjectId(input.product_id || input.productId);

  if (pid) {
    product = await products.findOne({
      _id: pid,
    });
  }

  if (!product && input.product) {
    const escaped = clean(input.product).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    product = await products.findOne({
      $or: [
        {
          title: {
            $regex: `^${escaped}$`,
            $options: "i",
          },
        },
        {
          name: {
            $regex: `^${escaped}$`,
            $options: "i",
          },
        },
        {
          slug: input.product,
        },
      ],
    });
  }

  let pv = null;

  if (product) {
    pv = requireProductPrice(product);
  }

  const quantityInput = Number(input.quantity || 1);

  const quantity =
    Number.isInteger(quantityInput) && quantityInput >= 1 ? quantityInput : 1;

  const priceInput = Number(input.price ?? pv?.price ?? 0);

  const unitPrice =
    Number.isFinite(priceInput) && priceInput >= 0 ? priceInput : 0;

  /*
   * -------------------------------------------------------
   * CUSTOMER / ADDRESS
   * -------------------------------------------------------
   */

  const customerName = clean(
    input.customer_name ||
      input.customerName ||
      input.address?.name ||
      user.name ||
      "",
  );

  const address = addressOf(input.address || input, phone, customerName);

  /*
   * -------------------------------------------------------
   * PAYMENT PLAN
   * -------------------------------------------------------
   */

  const paymentPlan = clean(
    input.payment_plan ||
      input.paymentPlan ||
      (String(input.payment_mode || "").toUpperCase() === "PREPAID"
        ? "prepaid_full"
        : "cod"),
  ).toLowerCase();

  /*
   * -------------------------------------------------------
   * VALIDATION
   * -------------------------------------------------------
   *
   * AI:
   *   ONLY mobile number is required.
   *
   * Everything else can be empty.
   *
   * Other sources:
   *   Existing validation remains unchanged.
   */

  if (source !== "ai") {
    const errors = validateOrderInput({
      customer_name: customerName,
      mobile_number: phone,
      quantity,
      price: unitPrice,
      payment_plan: paymentPlan,
      address,
    });

    if (Object.keys(errors).length) {
      throw new Error(firstError(errors));
    }
  }

  /*
   * -------------------------------------------------------
   * ORDER ITEM
   * -------------------------------------------------------
   */

  const item = {
    productId: product?._id || null,

    product_id: product
      ? String(product._id)
      : clean(input.product_id || input.productId || ""),

    name: pv?.name || clean(input.product) || "",

    product: pv?.name || clean(input.product) || "",

    quantity,

    price: unitPrice,

    image: pv?.image || clean(input.image) || "",
  };

  /*
   * -------------------------------------------------------
   * TOTAL
   * -------------------------------------------------------
   */

  const total = unitPrice * quantity;

  /*
   * -------------------------------------------------------
   * PAYMENT
   * -------------------------------------------------------
   */

  let paidAmount = 0;
  let paymentMode = "COD";
  let paymentStatus = "pending";

  if (paymentPlan === "prepaid_full") {
    paidAmount = total;
    paymentMode = "PREPAID";
    paymentStatus = "paid";
  } else if (paymentPlan === "prepaid_500") {
    paidAmount = Math.min(500, total);
    paymentMode = "PARTIAL_PREPAID";
    paymentStatus = "partial";
  }

  const dueAmount = Math.max(0, total - paidAmount);

  /*
   * -------------------------------------------------------
   * SHIPPING
   * -------------------------------------------------------
   */

  const provider = clean(
    input.shipping_provider || input.shippingProvider || "",
  ).toLowerCase();

  const tracking = clean(
    input.tracking_number || input.trackingNumber || input.tracking_id || "",
  );

  const status = clean(
    input.status || input.order_status || (tracking ? "shipped" : "placed"),
  ).toLowerCase();

  const now = new Date();

  /*
   * -------------------------------------------------------
   * SAVE ADDRESS
   * -------------------------------------------------------
   */

  const addressId = await saveUserAddress(user, address);

  /*
   * -------------------------------------------------------
   * ORDER DOCUMENT
   * -------------------------------------------------------
   */

  const doc = {
    userId: user._id,
    user_id: String(user._id),

    mobileNumber: phone,
    mobile_number: phone,

    customerName,
    customer_name: customerName,

    product_id: item.product_id,
    product: item.name,

    quantity,
    price: unitPrice,

    image: item.image,

    items: [item],

    address,

    address_id: String(addressId),

    shippingAddress: address,

    itemsTotal: total,
    items_total: total,

    deliveryFee: 0,
    delivery_fee: 0,

    total,

    paymentPlan: paymentPlan,
    payment_plan: paymentPlan,

    paymentMethod: paymentMode.toLowerCase(),

    payment_mode: paymentMode,

    paymentStatus,
    payment_status: paymentStatus,

    paidAmount,
    paid_amount: paidAmount,

    dueAmount,
    due_amount: dueAmount,

    status,

    order_status: status.toUpperCase(),

    source,
    order_source: source,
    added_by: source,

    shippingProvider: provider,
    shipping_provider: provider,

    trackingNumber: tracking,
    tracking_number: tracking,
    tracking_id: tracking,

    shippingStatus: tracking ? "shipped" : "",

    shipping_status: tracking ? "shipped" : "",

    checkoutId: toObjectId(input.checkout_id || input.checkoutId) || null,

    checkout_id: input.checkout_id || input.checkoutId || "",

    callUuid: input.call_uuid || "",

    call_uuid: input.call_uuid || "",

    createdAt: now,
    created_at: now,

    updatedAt: now,
    updated_at: now,
  };

  /*
   * -------------------------------------------------------
   * INSERT ORDER
   * -------------------------------------------------------
   */

  const result = await (await collections.orders()).insertOne(doc);

  /*
   * -------------------------------------------------------
   * REDUCE STOCK
   * -------------------------------------------------------
   */

  if (product?._id) {
    await products.updateOne(
      { _id: product._id },
      {
        $inc: {
          stock_quantity: -quantity,
        },
      },
    );
  }

  return {
    order: {
      ...doc,
      _id: result.insertedId,
    },

    user,

    result,
  };
}
