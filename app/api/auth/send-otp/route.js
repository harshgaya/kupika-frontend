import axios from "axios";
import { ok, fail } from "@/src/lib/server-utils";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!/^[6-9]\d{9}$/.test(String(phone || ""))) {
      return fail("Enter a valid 10-digit mobile number.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await axios.get("https://apitxt.com/api/sendOTP", {
      params: {
        authkey: process.env.APITXT_AUTH_KEY,
        mobile: `91${phone}`,
        otp,
      },
    });

    return ok({
      sent: true,
      otp: String(otp),
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return fail("Could not send OTP. Please try again.", 500);
  }
}
