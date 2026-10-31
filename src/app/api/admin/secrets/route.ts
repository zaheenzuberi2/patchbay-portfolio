import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  deleteApiKey,
  isManagedKey,
  listKeyStatus,
  setApiKey,
  testGeminiKey,
} from "@/lib/secrets";

// Admin-only. Values are write-only: no response from this route ever
// contains a stored key, only its source and last four characters.
async function guard() {
  return (await getSession())
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json({ keys: await listKeyStatus() });
}

export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const name = body?.name;
  const value = typeof body?.value === "string" ? body.value.trim() : "";
  if (!isManagedKey(name)) {
    return NextResponse.json({ error: "Unknown key name" }, { status: 400 });
  }
  if (value.length < 20 || value.length > 300 || /\s/.test(value)) {
    return NextResponse.json(
      { error: "That does not look like an API key." },
      { status: 400 },
    );
  }

  // Check with Google before saving, so a mistyped or dead key can never
  // replace a working one.
  const test = await testGeminiKey(value);
  if (!test.ok) {
    return NextResponse.json({ error: test.message }, { status: 422 });
  }

  try {
    await setApiKey(name, value);
  } catch (err) {
    console.error("[secrets] save failed", err);
    return NextResponse.json({ error: "Could not save the key." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, keys: await listKeyStatus() });
}

export async function DELETE(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const name = request.nextUrl.searchParams.get("name");
  if (!isManagedKey(name)) {
    return NextResponse.json({ error: "Unknown key name" }, { status: 400 });
  }
  await deleteApiKey(name);
  return NextResponse.json({ ok: true, keys: await listKeyStatus() });
}
