import { collections } from "@/src/lib/db/mongodb";
import { createSession } from "@/src/lib/auth/session";
import { ok, fail } from "@/src/lib/server-utils";
import { mergeGuestIntoUser } from "@/src/lib/merge-guest";

export async function POST(req) {
  try {
    const { phone, guest_id } = await req.json();

    if (!/^[6-9]\d{9}$/.test(String(phone || ""))) {
      return fail("Invalid mobile number.");
    }

    const users = await collections.users();
    const now = new Date();

    let user = await users.findOne({
      $or: [{ phone }, { mobile_number: phone }, { mobileNumber: phone }],
    });

    if (!user) {
      const doc = {
        phone,
        mobile_number: phone,
        name: "",
        phoneVerified: true,
        phone_verified: true,
        createdAt: now,
        created_at: now,
        lastLoginAt: now,
        last_login_at: now,
      };

      const r = await users.insertOne(doc);

      user = {
        ...doc,
        _id: r.insertedId,
      };
    } else {
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            phone,
            mobile_number: phone,
            phoneVerified: true,
            phone_verified: true,
            lastLoginAt: now,
            last_login_at: now,
          },
        },
      );
    }

    if (guest_id) {
      await mergeGuestIntoUser(guest_id, user._id, phone);
    }

    await createSession(user._id);

    return ok({
      user_id: String(user._id),
      name: user.name || "",
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return fail("Login failed. Please try again.", 500);
  }
}
