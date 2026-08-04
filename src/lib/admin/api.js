import { isAdmin } from "./session";
import { fail } from "@/src/lib/server-utils";
export async function requireAdmin(){ if (!(await isAdmin())) return fail("Unauthorized",401); return null; }
export function pageParams(url){ const u=new URL(url); const page=Math.max(1,Number(u.searchParams.get("page")||1)); const limit=Math.min(100,Math.max(10,Number(u.searchParams.get("limit")||20))); return {u,page,limit,skip:(page-1)*limit}; }
export function serialize(doc){ return JSON.parse(JSON.stringify(doc, (k,v)=> v && typeof v === "object" && v._bsontype === "ObjectId" ? v.toString() : v)); }
