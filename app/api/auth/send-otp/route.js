import { collections } from "@/src/lib/db/mongodb";
import { sendOtp } from "@/src/lib/auth/twofactor";
import { ok, fail } from "@/src/lib/server-utils";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!/^[6-9]\d{9}$/.test(String(phone || ""))) {
      return fail("Enter a valid 10-digit mobile number.");
    }

    // Basic rate limit: block a new OTP within 30s of the last one.
    const otp = await collections.otpSessions();
    const recent = await otp.findOne({ phone });
    if (recent && Date.now() - new Date(recent.createdAt).getTime() < 30_000) {
      return fail("Please wait a few seconds before requesting another OTP.");
    }

    const otpResult = await sendOtp(phone);
    const sessionId = otpResult.sessionId;

    // Upsert one active session per phone; auto-expires via TTL index.
    await otp.updateOne(
      { phone },
      {
        $set: {
          phone,
          sessionId,
          attempts: 0,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        },
      },
      { upsert: true },
    );

    return ok({ sent: true });
  } catch (err) {
    console.error("send-otp error:", err);
    return fail("Could not send OTP. Please try again.", 500);
  }
}
