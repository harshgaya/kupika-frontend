import { clearSession } from "@/src/lib/auth/session";
import { ok } from "@/src/lib/server-utils";

export async function POST() {
  await clearSession();
  return ok({ loggedOut: true });
}
