import type { Product as CoreProduct, ScentFamily, Intensity, Mood } from "@/lib/core";

type PrismaProduct = {
  id: string;
  merchantId: string;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  scentFamilies: string;
  intensity: string;
  moods: string;
  externalId: string | null;
};

export function toCoreProduct(p: PrismaProduct): CoreProduct {
  return {
    id: p.id,
    merchantId: p.merchantId,
    name: p.name,
    url: p.url,
    description: p.description,
    imageUrl: p.imageUrl,
    scentFamilies: JSON.parse(p.scentFamilies) as ScentFamily[],
    intensity: p.intensity as Intensity,
    moods: JSON.parse(p.moods) as Mood[],
    externalId: p.externalId ?? undefined,
  };
}

const SCENT_KEYWORDS: Record<ScentFamily, string[]> = {
  Vanilla: ["vanilla", "sweet", "warm", "creamy", "caramel", "tonka"],
  Citrus: ["citrus", "lemon", "orange", "bergamot", "lime", "grapefruit", "mandarin"],
  Lavender: ["lavender", "herbal", "calming", "relaxing", "soothing"],
  Cedar: ["cedar", "wood", "woody", "sandalwood", "pine", "forest"],
  Ocean: ["ocean", "marine", "sea", "aquatic", "fresh", "breeze", "coastal"],
  Spice: ["spice", "cinnamon", "nutmeg", "clove", "pepper", "cardamom"],
  Floral: ["floral", "rose", "jasmine", "peony", "lily", "blossom", "petal"],
  Earthy: ["earthy", "patchouli", "vetiver", "mossy", "green", "soil"],
  Woody: ["woody", "oak", "birch", "walnut", "mahogany"],
  Fresh: ["fresh", "clean", "airy", "light", "crisp"],
  Sweet: ["sweet", "honey", "sugar", "fruity", "candy"],
  Spicy: ["spicy", "hot", "bold", "fiery", "ginger"],
};

export function autoTagScents(description: string): ScentFamily[] {
  const lower = description.toLowerCase();
  const found: ScentFamily[] = [];

  for (const [family, keywords] of Object.entries(SCENT_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(family as ScentFamily);
    }
  }

  return Array.from(new Set(found));
}
