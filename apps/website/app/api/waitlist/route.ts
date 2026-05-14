import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "waitlist.json");

async function appendEmailLocally(email: string): Promise<void> {
  try {
    let list: string[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      list = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }
    if (!list.includes(email)) {
      list.push(email);
      await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2));
    }
  } catch {
    // Read-only filesystem (e.g. Vercel) — webhook is the capture mechanism
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Best-effort local file (works in dev, silently skipped on Vercel)
    await appendEmailLocally(email);

    // Webhook — primary capture mechanism in production
    const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
