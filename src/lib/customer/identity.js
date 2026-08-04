import { collections } from "@/src/lib/db/mongodb";

export function normalizeIndianPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return digits;
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) return digits.slice(2);
  return null;
}

export async function findOrCreateUser(phoneValue, { name = "", source = "unknown" } = {}) {
  const phone = normalizeIndianPhone(phoneValue);
  if (!phone) throw new Error("Invalid Indian mobile number");
  const users = await collections.users();
  const now = new Date();
  // Support both the existing DB schema and the newer camelCase fields.
  let user = await users.findOne({ $or: [{ phone }, { mobile_number: phone }, { mobileNumber: phone }] });
  if (!user) {
    const doc = { phone, mobile_number: phone, name: name || "", created_from: source, createdFrom: source, created_at: now, createdAt: now, last_seen_at: now, lastSeenAt: now };
    const r = await users.insertOne(doc);
    return { ...doc, _id: r.insertedId };
  }
  const set = { phone, mobile_number: phone, last_seen_at: now, lastSeenAt: now };
  if (name && !user.name) set.name = name;
  await users.updateOne({ _id: user._id }, { $set: set });
  return { ...user, ...set };
}
