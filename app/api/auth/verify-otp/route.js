import { collections } from "@/src/lib/db/mongodb";
import { verifyOtp } from "@/src/lib/auth/twofactor";
import { createSession } from "@/src/lib/auth/session";
import { ok, fail, toObjectId } from "@/src/lib/server-utils";
import { mergeGuestIntoUser } from "@/src/lib/merge-guest";

export async function POST(req) {
  try {
    const { phone, code, guest_id } = await req.json();

    if (!/^[6-9]\d{9}$/.test(String(phone || ""))) {
      return fail("Invalid mobile number.");
    }
    if (!/^\d{4,8}$/.test(String(code || ""))) {
      return fail("Enter the OTP you received.");
    }

    const otp = await collections.otpSessions();
    const record = await otp.findOne({ phone });
    if (!record) return fail("OTP expired. Please request a new one.");

    if (record.attempts >= 5) {
      await otp.deleteOne({ _id: record._id });
      return fail("Too many attempts. Please request a new OTP.");
    }

    let valid = false;
    try { await verifyOtp({ sessionId: record.sessionId, otp: code, mobile: phone }); valid = true; } catch {}
    if (!valid) {
      await otp.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
      return fail("Incorrect OTP. Please try again.");
    }

    // OTP consumed.
    await otp.deleteOne({ _id: record._id });

    // Resolve/create by the same mobile identity used by website, admin and AI.
    const users = await collections.users();
    const now = new Date();
    let user = await users.findOne({ $or: [{ phone }, { mobile_number: phone }, { mobileNumber: phone }] });
    if (!user) {
      const doc = { phone, mobile_number: phone, name: "", phoneVerified: true, phone_verified: true, createdAt: now, created_at: now, lastLoginAt: now, last_login_at: now };
      const r = await users.insertOne(doc);
      user = { ...doc, _id: r.insertedId };
    } else {
      await users.updateOne({ _id: user._id }, { $set: { phone, mobile_number: phone, phoneVerified: true, phone_verified: true, lastLoginAt: now, last_login_at: now } });
    }

    // Move any guest cart/addresses onto this account.
    if (guest_id) await mergeGuestIntoUser(guest_id, user._id, phone);

    await createSession(user._id);

    return ok({ user_id: String(user._id), name: user.name || "" });
  } catch (err) {
    console.error("verify-otp error:", err);
    return fail("Verification failed. Please try again.", 500);
  }
}
