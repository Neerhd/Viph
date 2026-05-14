import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { storeId, productId, answers, addedToCart } = await req.json();

    if (!storeId || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({ where: { storeId } });
    if (!merchant) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    await prisma.quizCompletion.create({
      data: {
        merchantId: merchant.id,
        productId: productId ?? null,
        answers: JSON.stringify(answers),
        addedToCart: addedToCart ?? false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
