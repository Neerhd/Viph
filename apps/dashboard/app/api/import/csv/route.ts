import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { autoTagScents } from "@/lib/productUtils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    if (lines.length < 2) return NextResponse.json({ error: "CSV too short" }, { status: 400 });

    // Skip header row, parse: name, url, description, imageUrl
    const rows = lines.slice(1);
    const toCreate = rows
      .map((line) => {
        const parts = parseCSVLine(line);
        const [name, url, description = "", imageUrl = ""] = parts;
        if (!name || !url) return null;
        return {
          merchantId: user.id!,
          name: name.trim(),
          url: url.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          scentFamilies: JSON.stringify(autoTagScents(description)),
          intensity: "Medium",
          moods: JSON.stringify([]),
        };
      })
      .filter(Boolean) as {
      merchantId: string;
      name: string;
      url: string;
      description: string;
      imageUrl: string;
      scentFamilies: string;
      intensity: string;
      moods: string;
    }[];

    await prisma.product.createMany({ data: toCreate });

    return NextResponse.json({ imported: toCreate.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
