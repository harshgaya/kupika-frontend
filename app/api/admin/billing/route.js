import { isAdmin } from "@/src/lib/admin/session";
import { getBillingStatus } from "@/src/lib/admin/billing";
import { ok, fail } from "@/src/lib/server-utils";

export async function GET() {
  if (!(await isAdmin())) return fail("Unauthorized", 401);
  return ok(await getBillingStatus({ fresh: true }));
}
