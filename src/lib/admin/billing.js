import { getDb } from "@/src/lib/db/mongodb";

const DOC_ID = "admin_bill";
const MAX_AMOUNT = 1500;
const CACHE_MS = 30_000;

// Current month in IST, e.g. "2026-11"
export function currentMonth() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 7);
}

const cache = (global._billingCache ||= { value: null, at: 0 });
export function clearBillingCache() {
  cache.value = null;
  cache.at = 0;
}

async function col() {
  return (await getDb()).collection("billing");
}

/**
 * Returns { paid, amount, month }.
 * Monthly reset: if paidForMonth != current month -> paidThisMonth = false.
 * Developer can edit `paidThisMonth` / `amount` directly in MongoDB.
 */
export async function getBillingStatus({ fresh = false } = {}) {
  if (!fresh && cache.value && Date.now() - cache.at < CACHE_MS)
    return cache.value;

  const c = await col();
  const month = currentMonth();
  let doc = await c.findOne({ _id: DOC_ID });

  if (!doc) {
    // First run: current month treated as paid. Change to false to bill immediately.
    doc = {
      _id: DOC_ID,
      amount: MAX_AMOUNT,
      paidThisMonth: true,
      paidForMonth: month,
      createdAt: new Date(),
    };
    await c.insertOne(doc).catch(() => {});
  } else if (doc.paidForMonth !== month) {
    await c.updateOne(
      { _id: DOC_ID, paidForMonth: doc.paidForMonth },
      {
        $set: {
          paidThisMonth: false,
          paidForMonth: month,
          resetAt: new Date(),
        },
      },
    );
    doc = { ...doc, paidThisMonth: false, paidForMonth: month };
  }

  // Not paid but a payment link exists -> ask Razorpay if it was paid (window closed case)
  if (
    doc.paidThisMonth !== true &&
    doc.pendingLink?.month === month &&
    (fresh || Date.now() - (cache.lastRecoverAt || 0) > 10_000) &&
    ((cache.lastRecoverAt = Date.now()), await recoverPaidLink(doc.pendingLink))
  ) {
    doc = { ...doc, paidThisMonth: true };
  }

  const amt = Number(doc.amount);
  const value = {
    paid: doc.paidThisMonth === true,
    amount: amt > 0 ? Math.min(amt, MAX_AMOUNT) : MAX_AMOUNT,
    month,
  };
  // Only cache "paid". Unpaid is always re-read so payment unlocks instantly.
  if (value.paid) {
    cache.value = value;
    cache.at = Date.now();
  } else {
    cache.value = null;
  }
  return value;
}

export async function markPaid(payment) {
  const c = await col();
  await c.updateOne(
    { _id: DOC_ID },
    {
      $set: {
        paidThisMonth: true,
        paidForMonth: currentMonth(),
        lastPayment: { ...payment, paidAt: new Date() },
      },
      $push: {
        payments: { ...payment, month: currentMonth(), paidAt: new Date() },
      },
    },
    { upsert: true },
  );
  clearBillingCache();
}

// Payment Link created for this site & month (used to verify the callback belongs here)
export async function setPendingLink(link) {
  const c = await col();
  await c.updateOne(
    { _id: DOC_ID },
    {
      $set: {
        pendingLink: { ...link, month: currentMonth(), createdAt: new Date() },
      },
    },
    { upsert: true },
  );
}

export async function getPendingLink() {
  const c = await col();
  const doc = await c.findOne(
    { _id: DOC_ID },
    { projection: { pendingLink: 1 } },
  );
  return doc?.pendingLink || null;
}

export async function clearPendingLink() {
  const c = await col();
  await c.updateOne({ _id: DOC_ID }, { $unset: { pendingLink: "" } });
}

// Checks Razorpay for this site's last payment link; marks paid if it was paid.
export async function recoverPaidLink(pending) {
  const keyId =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!pending?.id || !keyId || !secret) return false;
  try {
    const res = await fetch(
      `https://api.razorpay.com/v1/payment_links/${encodeURIComponent(pending.id)}`,
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${keyId}:${secret}`).toString("base64"),
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return false;
    const link = await res.json();
    if (link.status !== "paid") return false;
    const payment =
      (link.payments || []).find((p) => p.status === "captured") ||
      link.payments?.[0];
    await markPaid({
      paymentLinkId: link.id,
      paymentId: payment?.payment_id || null,
      amount: pending.amount,
      recovered: true,
    });
    await clearPendingLink();
    return true;
  } catch {
    return false;
  }
}
