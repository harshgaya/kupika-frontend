import { clearAdminSession } from "@/src/lib/admin/session";
import { ok } from "@/src/lib/server-utils";
export async function POST(){ await clearAdminSession(); return ok({loggedOut:true}); }
