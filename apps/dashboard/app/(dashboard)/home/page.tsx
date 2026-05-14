import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; storeId?: string };

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [completions, products, notConverted] = await Promise.all([
    prisma.quizCompletion.count({
      where: { merchantId: user.id!, createdAt: { gte: monthStart } },
    }),
    prisma.product.findMany({
      where: { merchantId: user.id! },
      take: 5,
    }),
    prisma.quizCompletion.count({
      where: { merchantId: user.id!, addedToCart: false, createdAt: { gte: monthStart } },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Here&apos;s how your quiz is performing this month.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-stone-500 text-xs uppercase tracking-wide mb-1">Quiz completions</div>
          <div className="text-3xl font-semibold">{completions}</div>
          <div className="text-stone-400 text-xs mt-1">this month</div>
        </div>
        <div className="card">
          <div className="text-stone-500 text-xs uppercase tracking-wide mb-1">Products tagged</div>
          <div className="text-3xl font-semibold">{products.length}</div>
          <div className="text-stone-400 text-xs mt-1">in your catalogue</div>
        </div>
        <div className="card border-amber-100 bg-amber-50">
          <div className="text-amber-600 text-xs uppercase tracking-wide mb-1">Missed conversions</div>
          <div className="text-3xl font-semibold text-amber-700">{notConverted}</div>
          <div className="text-amber-500 text-xs mt-1">saw a match, didn&apos;t add to cart</div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-stone-400 mb-4">No products yet.</div>
          <Link href="/onboarding" className="btn-primary">
            Set up your store
          </Link>
        </div>
      ) : (
        <div className="card">
          <h2 className="font-medium text-sm mb-4 text-stone-500 uppercase tracking-wide">Recent products</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-2 border-b border-stone-50 last:border-0">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                    img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-stone-400">
                    {p.intensity} intensity · {JSON.parse(p.scentFamilies).join(", ") || "untagged"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/products" className="text-sm text-stone-500 hover:text-stone-900 underline underline-offset-2">
              View all products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
