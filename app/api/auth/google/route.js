import { NextResponse } from "next/server";
import crypto from "crypto";
import API_URL from "@/src/lib/api";

export async function POST(req) {
  try {
    const { email, name, guest_id } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email missing" }, { status: 400 });
    }

    const registerRes = await fetch(`${API_URL}/create-login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: name || null,
        guest_id: guest_id || null,
      }),
    });
    if (!registerRes.ok) {
      const err = await registerRes.text();
      return NextResponse.json(
        { error: err || "User creation failed" },
        { status: registerRes.status },
      );
    }
    const registerData = await registerRes.json();

    console.log("Register API data:", registerData);

    return NextResponse.json({
      user_id: registerData.user_id,
      jwt: registerData.jwt,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json({ error: "Google login failed" }, { status: 500 });
  }
}
