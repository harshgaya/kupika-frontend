import { collections } from "@/src/lib/db/mongodb";
import { findOrCreateUser } from "@/src/lib/customer/identity";
import { ok, fail } from "@/src/lib/server-utils";

export async function POST(req) {
  if (
    !process.env.AGENT_API_KEY ||
    req.headers.get("x-agent-api-key") !== process.env.AGENT_API_KEY
  ) {
    return fail("Unauthorized", 401);
  }

  try {
    const b = await req.json();
    const now = new Date();

    if (!b.call_uuid) {
      return fail("call_uuid is required", 400);
    }

    const aiCalls = await collections.aiCalls();

    // --------------------------------------------------
    // 1. Check whether this call already exists
    // --------------------------------------------------

    const existingCall = await aiCalls.findOne({
      $or: [{ callUuid: b.call_uuid }, { call_uuid: b.call_uuid }],
    });

    // --------------------------------------------------
    // 2. EXISTING CALL
    // Recording / hangup / summary / outcome update
    // Mobile number is NOT required again.
    // --------------------------------------------------

    if (existingCall) {
      const update = {
        updatedAt: now,
        updated_at: now,
      };

      if (b.customer_name !== undefined) {
        update.customerName = b.customer_name;
        update.customer_name = b.customer_name;
      }

      if (b.call_reason !== undefined) {
        update.callReason = b.call_reason;
        update.call_reason = b.call_reason;
      }

      if (b.call_outcome !== undefined) {
        update.callOutcome = b.call_outcome;
        update.call_outcome = b.call_outcome;
      }

      if (b.call_summary !== undefined) {
        update.callSummary = b.call_summary;
        update.call_summary = b.call_summary;
      }

      if (b.direction !== undefined) {
        update.direction = b.direction;
      }

      // ------------------------------------------------
      // Recording
      // ------------------------------------------------

      if (b.recording_url !== undefined && b.recording_url !== null) {
        update.recordingUrl = b.recording_url;
        update.recording_url = b.recording_url;
      }

      // ------------------------------------------------
      // Duration
      // ------------------------------------------------

      if (
        b.duration !== undefined &&
        b.duration !== null &&
        b.duration !== ""
      ) {
        const duration = Number(b.duration);

        if (!Number.isNaN(duration)) {
          update.duration = duration;
          update.duration_seconds = duration;
        }
      }

      await aiCalls.updateOne(
        { _id: existingCall._id },
        {
          $set: update,
        },
      );

      return ok({
        saved: true,
        updated: true,
        call_uuid: b.call_uuid,
        user_id:
          existingCall.user_id || existingCall.userId?.toString() || null,
      });
    }

    // --------------------------------------------------
    // 3. NEW CALL
    // Only now do we require the mobile number.
    // --------------------------------------------------

    if (!b.mobile_number) {
      return fail("mobile_number is required when creating a new AI call", 400);
    }

    const user = await findOrCreateUser(b.mobile_number, {
      name: b.customer_name || "",
      source: "ai_call",
    });

    // --------------------------------------------------
    // 4. Build new call document
    // --------------------------------------------------

    const doc = {
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
      gemini_usage: b.gemini_usage || null,

      direction: b.direction || "inbound",

      createdAt: now,
      created_at: now,

      updatedAt: now,
      updated_at: now,
    };

    // --------------------------------------------------
    // 5. Optional recording
    // --------------------------------------------------

    if (b.recording_url) {
      doc.recordingUrl = b.recording_url;
      doc.recording_url = b.recording_url;
    }

    // --------------------------------------------------
    // 6. Optional duration
    // --------------------------------------------------

    if (b.duration !== undefined && b.duration !== null && b.duration !== "") {
      const duration = Number(b.duration);

      if (!Number.isNaN(duration)) {
        doc.duration = duration;
        doc.duration_seconds = duration;
      }
    }

    // --------------------------------------------------
    // 7. Insert
    // --------------------------------------------------

    const result = await aiCalls.insertOne(doc);

    return ok({
      saved: true,
      created: true,
      call_id: String(result.insertedId),
      call_uuid: b.call_uuid,
      user_id: String(user._id),
    });
  } catch (e) {
    console.error("AI call save error:", e);

    return fail(e.message || "Could not save AI call", 400);
  }
}
