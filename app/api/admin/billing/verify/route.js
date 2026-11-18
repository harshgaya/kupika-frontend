import { createHmac, timingSafeEqual } from "crypto";
import { isAdmin } from "@/src/lib/admin/session";
import {
  markPaid,
  currentMonth,
  getPendingLink,
  clearPendingLink,
} from "@/src/lib/admin/billing";
import { ok, fail } from "@/src/lib/server-utils";

// Verifies the Razorpay Payment Link callback params.
export async function POST(req) {
  if (!(await isAdmin())) return fail("Unauthorized", 401);
  const {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_reference_id,
    razorpay_payment_link_status,
    razorpay_signature,
  } = await req.json().catch(() => ({}));

  if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_signature)
    return fail("Missing payment details.");
  if (razorpay_payment_link_status !== "paid")
    return fail("Payment not completed.");

  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(
      `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id || ""}|${razorpay_payment_link_status}|${razorpay_payment_id}`,
    )
    .digest("hex");
  const a = Buffer.from(expected),
    b = Buffer.from(String(razorpay_signature));
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return fail("Invalid payment signature.", 400);

  // Link must be the one THIS site created for THIS month (stops reuse across sites/months).
  const pending = await getPendingLink();
  if (
    !pending ||
    pending.id !== razorpay_payment_link_id ||
    pending.month !== currentMonth()
  ) {
    return fail("Payment link does not match this site's current bill.", 400);
  }

  await markPaid({
    paymentLinkId: razorpay_payment_link_id,
    paymentId: razorpay_payment_id,
    amount: pending.amount,
  });
  await clearPendingLink();
  return ok({ paid: true, month: currentMonth() });
}
