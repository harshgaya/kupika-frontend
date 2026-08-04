import { getDb } from "@/src/lib/db/mongodb";
import { ok, fail } from "@/src/lib/server-utils";

/**
 * POST /api/track  { type }
 * Lightweight event logging into the "events" collection (e.g.
 * "website_visit", "whatsapp_click"). Fails soft — tracking should never
 * block the UI, so errors are swallowed with a 200.
 */
export async function POST(req) {
  try {
    const { type } = await req.json().catch(() => ({}));
    if (!type || typeof type !== "string") return fail("Missing event type.");

    const db = await getDb();
    await db.collection("events").insertOne({
      type: type.slice(0, 60),
      createdAt: new Date(),
    });

    return ok({ tracked: true });
  } catch (err) {
    console.error("track error:", err);
    // Don't surface tracking failures to the user.
    return ok({ tracked: false });
  }
}
