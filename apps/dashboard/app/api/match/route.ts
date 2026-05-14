import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchProducts } from "@/lib/core";
import { toCoreProduct } from "@/lib/productUtils";
import type { QuizAnswer } from "@/lib/core";

export async function POST(req: Request) {
  try {
    const { storeId, answers }: { storeId: string; answers: QuizAnswer } = await req.json();

    if (!storeId || !answers) {
      return NextResponse.json({ error: "Missing storeId or answers" }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({ where: { storeId } });
    if (!merchant) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({ where: { merchantId: merchant.id } });
    if (products.length === 0) {
      return NextResponse.json({ error: "No products available" }, { status: 404 });
    }

    const coreProducts = products.map(toCoreProduct);
    const result = matchProducts(coreProducts, answers);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
