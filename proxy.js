import { NextResponse } from "next/server";
import { getBillingStatus } from "@/src/lib/admin/billing";

// Routes that must stay open so admin can log in and pay.
const OPEN = [
  "/admin/login",
  "/admin/billing",
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/billing",
];

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  if (OPEN.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return NextResponse.next();

  let status;
  try {
    status = await getBillingStatus();
  } catch {
    return NextResponse.next(); // DB down: don't lock admin because of billing check
  }
  if (status.paid) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        success: false,
        message: `Monthly bill of ₹${status.amount} is unpaid.`,
        billingRequired: true,
      },
      { status: 402 },
    );
  }
  return NextResponse.redirect(new URL("/admin/billing", req.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
