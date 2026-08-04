import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSessionUserId } from "@/src/lib/auth/session";

/** Standard JSON helpers so every route returns a consistent shape. */
export const ok = (data = null, init) =>
  NextResponse.json({ success: true, data }, init);

export const fail = (message, status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

/** Safe ObjectId — returns null instead of throwing on bad input. */
export function toObjectId(id) {
  try {
    return new ObjectId(String(id));
  } catch {
    return null;
  }
}

/**
 * Resolve who the request belongs to.
 *  - If a valid session cookie exists -> logged-in user (query by userId).
 *  - Otherwise fall back to the guestId supplied by the client.
 * Returns { userId, guestId } where exactly one is meaningful.
 */
export async function resolveOwner(guestId) {
  const uid = await getSessionUserId();
  if (uid) return { userId: uid, guestId: null };
  return { userId: null, guestId: guestId || null };
}

/** Build a Mongo filter for the current owner. */
export function ownerFilter({ userId, guestId }) {
  if (userId) return { userId: toObjectId(userId) };
  return { guestId };
}
