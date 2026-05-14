import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { autoTagScents } from "@/lib/productUtils";

const SHOPIFY_STOREFRONT_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          onlineStoreUrl
          featuredImage { url }
        }
      }
    }
  }
`;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };
  const { storeUrl, storefrontToken } = await req.json();

  if (!storeUrl || !storefrontToken) {
    return NextResponse.json({ error: "Missing storeUrl or storefrontToken" }, { status: 400 });
  }

  const cleanUrl = storeUrl.replace(/\/$/, "").replace(/^https?:\/\//, "");
  const endpoint = `https://${cleanUrl}/api/2024-01/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({ query: SHOPIFY_STOREFRONT_QUERY, variables: { first: 250 } }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from Shopify" }, { status: 502 });
    }

    const { data, errors } = await response.json();
    if (errors?.length) {
      return NextResponse.json({ error: errors[0].message }, { status: 502 });
    }

    const edges = data?.products?.edges ?? [];
    const toCreate = edges.map(
      (edge: {
        node: {
          id: string;
          title: string;
          description: string;
          onlineStoreUrl: string | null;
          featuredImage: { url: string } | null;
        };
      }) => ({
        merchantId: user.id!,
        name: edge.node.title,
        url: edge.node.onlineStoreUrl ?? `https://${cleanUrl}`,
        description: edge.node.description ?? "",
        imageUrl: edge.node.featuredImage?.url ?? "",
        scentFamilies: JSON.stringify(autoTagScents(edge.node.description ?? "")),
        intensity: "Medium",
        moods: JSON.stringify([]),
        externalId: edge.node.id,
      })
    );

    // Upsert by externalId
    let imported = 0;
    for (const product of toCreate) {
      await prisma.product.upsert({
        where: {
          id: (
            await prisma.product.findFirst({
              where: { merchantId: user.id!, externalId: product.externalId },
              select: { id: true },
            })
          )?.id ?? "new",
        },
        update: { name: product.name, description: product.description, imageUrl: product.imageUrl },
        create: product,
      });
      imported++;
    }

    // Save store URL
    await prisma.merchant.update({
      where: { id: user.id! },
      data: { storeUrl: cleanUrl },
    });

    return NextResponse.json({ imported });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
