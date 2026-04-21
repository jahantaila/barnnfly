import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = {
      receivedAt: new Date().toISOString(),
      ...body,
    };

    // Best-effort: write submissions to a local JSONL file during development.
    // In production this should be swapped for a real destination
    // (Airtable, HubSpot, email, DB, etc.).
    try {
      const dir = path.join(process.cwd(), "submissions");
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, "responses.jsonl");
      await fs.appendFile(file, JSON.stringify(payload) + "\n", "utf8");
    } catch (err) {
      console.warn("[submit] file write failed, continuing", err);
    }

    console.log("[barknfly:submit]", JSON.stringify(payload, null, 2));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit] error", err);
    return NextResponse.json(
      { ok: false, error: "invalid payload" },
      { status: 400 }
    );
  }
}
