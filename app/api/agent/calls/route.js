import { collections } from "@/src/lib/db/mongodb";
import { findOrCreateUser } from "@/src/lib/customer/identity";
import { ok, fail } from "@/src/lib/server-utils";
export async function POST(req) {
  if (
    !process.env.AGENT_API_KEY ||
    req.headers.get("x-agent-api-key") !== process.env.AGENT_API_KEY
  )
    return fail("Unauthorized", 401);
  const b = await req.json();
  try {
    const user = await findOrCreateUser(b.mobile_number, {
        name: b.customer_name || "",
        source: "ai_call",
      }),
      now = new Date();
    await (
      await collections.aiCalls()
    ).updateOne(
      { $or: [{ callUuid: b.call_uuid }, { call_uuid: b.call_uuid }] },
      {
        $set: {
          callUuid: b.call_uuid,
          call_uuid: b.call_uuid,
          userId: user._id,
          user_id: String(user._id),
          mobileNumber: user.phone,
          mobile_number: user.phone,
          customerName: b.customer_name || user.name || "",
          customer_name: b.customer_name || user.name || "",
          callReason: b.call_reason || "other",
          call_reason: b.call_reason || "other",
          callOutcome: b.call_outcome || "in_progress",
          call_outcome: b.call_outcome || "in_progress",
          callSummary: b.call_summary || "",
          call_summary: b.call_summary || "",
          direction: b.direction || "inbound",
          updatedAt: now,
          updated_at: now,
        },
        $setOnInsert: { createdAt: now, created_at: now },
      },
      { upsert: true },
    );
    return ok({ saved: true, user_id: String(user._id) });
  } catch (e) {
    return fail(e.message, 400);
  }
}
