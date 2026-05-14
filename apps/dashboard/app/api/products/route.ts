import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");

  // Public access via storeId (for widget)
  if (storeId) {
    const merchant = await prisma.merchant.findUnique({ where: { storeId } });
    if (!merchant) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const products = await prisma.product.findMany({ where: { merchantId: merchant.id } });
    return NextResponse.json(products);
  }

  // Authenticated access for dashboard
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };
  const products = await prisma.product.findMany({ where: { merchantId: user.id } });
  return NextResponse.json(products);
}
