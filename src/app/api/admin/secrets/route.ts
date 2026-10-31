import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  MAX_KEYS,
  addApiKeys,
  clearApiKeys,
  isManagedKey,
  listKeyStatus,
  removeApiKey,
  testGeminiKey,
} from "@/lib/secrets";

// Admin-only. Values are write-only: no response from this route ever
// contains a stored key, only an id and its last four characters.
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

// Accepts one key or several pasted together (separated by spaces, commas,
// semicolons or new lines). Each is checked with Google; the valid ones are
// added to the pool, the rest are reported back by their last four characters.
export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const name = body?.name;
  if (!isManagedKey(name)) {
    return NextResponse.json({ error: "Unknown key name" }, { status: 400 });
  }
  const raw = typeof body?.value === "string" ? body.value : "";
  const candidates = Array.from(
    new Set(raw.split(/[\s,;]+/).map((s: string) => s.trim()).filter(Boolean)),
  ) as string[];
  if (!candidates.length || candidates.length > MAX_KEYS * 2) {
    return NextResponse.json({ error: "Paste one or more API keys." }, { status: 400 });
  }

  const checked = await Promise.all(
    candidates.map(async (k) => {
      if (k.length < 20 || k.length > 300) {
        return { k, ok: false, message: "does not look like an API key" };
      }
      return { k, ...(await testGeminiKey(k)) };
    }),
  );
  const good = checked.filter((c) => c.ok).map((c) => c.k);
  const rejected = checked
    .filter((c) => !c.ok)
    .map((c) => ({ last4: c.k.slice(-4), reason: c.message }));

  if (!good.length) {
    return NextResponse.json(
      { error: "None of those keys were accepted.", rejected },
      { status: 422 },
    );
  }

  let added = 0;
  try {
    added = await addApiKeys(name, good);
  } catch (err) {
    console.error("[secrets] save failed", err);
    return NextResponse.json({ error: "Could not save the keys." }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    tested: good.length,
    added,
    duplicates: good.length - added,
    rejected,
    keys: await listKeyStatus(),
  });
}

export async function DELETE(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const name = request.nextUrl.searchParams.get("name");
  if (!isManagedKey(name)) {
    return NextResponse.json({ error: "Unknown key name" }, { status: 400 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (id) await removeApiKey(name, id);
  else await clearApiKeys(name);
  return NextResponse.json({ ok: true, keys: await listKeyStatus() });
}
