import { collections } from "@/src/lib/db/mongodb";
import { getSessionUserId } from "@/src/lib/auth/session";
import { ok, toObjectId } from "@/src/lib/server-utils";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return ok({ loggedIn: false, user: null });

  const users = await collections.users();
  const user = await users.findOne(
    { _id: toObjectId(uid) },
    { projection: { name: 1, email: 1, phone: 1 } },
  );

  if (!user) return ok({ loggedIn: false, user: null });

  return ok({
    loggedIn: true,
    user: {
      user_id: String(user._id),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });
}
