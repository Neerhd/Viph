import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };
  const { productIds, scentFamilies, intensity, moods } = await req.json();

  if (!productIds?.length) {
    return NextResponse.json({ error: "No products selected" }, { status: 400 });
  }

  // Verify ownership
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, merchantId: user.id },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: Record<string, string> = {};
  if (scentFamilies !== undefined) updateData.scentFamilies = JSON.stringify(scentFamilies);
  if (intensity !== undefined) updateData.intensity = intensity;
  if (moods !== undefined) updateData.moods = JSON.stringify(moods);

  await prisma.product.updateMany({
    where: { id: { in: productIds }, merchantId: user.id },
    data: updateData,
  });

  return NextResponse.json({ updated: productIds.length });
}
