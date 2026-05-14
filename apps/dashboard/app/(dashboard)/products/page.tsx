import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductsClient } from "./ProductsClient";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };

  const products = await prisma.product.findMany({
    where: { merchantId: user.id! },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-stone-500 text-sm mt-1">
          {products.length} product{products.length !== 1 ? "s" : ""} in your catalogue.
        </p>
      </div>
      <ProductsClient products={products} />
    </div>
  );
}
