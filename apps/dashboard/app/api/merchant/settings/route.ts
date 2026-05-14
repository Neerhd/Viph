import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };
  const merchant = await prisma.merchant.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, storeId: true, storeUrl: true, accentColor: true, widgetPosition: true, buttonText: true },
  });

  return NextResponse.json(merchant);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };
  const body = await req.json();

  const allowed = ["accentColor", "widgetPosition", "buttonText", "storeUrl"] as const;
  const data: Partial<Record<(typeof allowed)[number], string>> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const merchant = await prisma.merchant.update({ where: { id: user.id }, data });
  return NextResponse.json(merchant);
}
