import { createAdminSession } from "@/src/lib/admin/session";
import { ok, fail } from "@/src/lib/server-utils";
export async function POST(req) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) return fail("Admin credentials are not configured.", 500);
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return fail("Invalid credentials.", 401);
  await createAdminSession(username); return ok({ loggedIn: true });
}
