import { isAdmin } from "@/src/lib/admin/session";
import { getBillingStatus, setPendingLink } from "@/src/lib/admin/billing";
import { ok, fail } from "@/src/lib/server-utils";

// Creates a Razorpay Payment Link (hosted on rzp.io) – no domain whitelisting needed.
export async function POST(req) {
  if (!(await isAdmin())) return fail("Unauthorized", 401);
  const keyId =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return fail("Razorpay is not configured.", 500);

  const s = await getBillingStatus({ fresh: true });
  if (s.paid) return fail("Already paid for this month.", 409);

  const origin = process.env.SITE_URL || new URL(req.url).origin;
  const site = process.env.SITE_NAME || new URL(origin).hostname;
  const referenceId = `${site}_${s.month}_${Date.now()}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 40);

  const res = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${keyId}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: Math.round(s.amount * 100),
      currency: "INR",
      reference_id: referenceId,
      description: `${site} admin bill – ${s.month}`,
      notes: { type: "admin_monthly_bill", site, month: s.month },
      callback_url: `${origin}/admin/billing`,
      callback_method: "get",
      reminder_enable: false,
    }),
  });
  const link = await res.json();
  if (!res.ok)
    return fail(
      link?.error?.description || "Could not create payment link.",
      502,
    );

  await setPendingLink({ id: link.id, referenceId, amount: s.amount });
  return ok({ url: link.short_url });
}
