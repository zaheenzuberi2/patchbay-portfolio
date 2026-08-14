import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminPassword,
  createSessionToken,
  isAdminPasswordConfigured,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Without this check a missing ADMIN_PASSWORD threw inside
  // checkAdminPassword and surfaced as an opaque 500, which looks like a
  // broken site rather than a configuration step nobody has done yet.
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin login is not configured yet. Set the ADMIN_PASSWORD environment variable in Vercel, then redeploy.",
      },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !checkAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
