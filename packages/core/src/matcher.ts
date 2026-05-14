import type { Product, QuizAnswer, MatchResult, ScentFamily, Mood, Intensity, ScoredProduct } from "./types";

const VIBE_MOOD_MAP: Record<QuizAnswer["vibe"], Mood[]> = {
  cozy: ["Relaxing"],
  fresh: ["Energising"],
  romantic: ["Romantic"],
  focus: ["Focus"],
  gift: ["Gifting"],
};

const INTENSITY_MAP: Record<QuizAnswer["intensity"], Intensity[]> = {
  Light: ["Light"],
  Medium: ["Light", "Medium"],
  Strong: ["Medium", "Strong"],
};

function scoreProduct(product: Product, answers: QuizAnswer): number {
  let score = 0;

  // Scent family match: 40 points each
  for (const family of answers.scentFamilies) {
    if (product.scentFamilies.includes(family)) {
      score += 40;
    }
  }

  // Mood match: 30 points
  const targetMoods = VIBE_MOOD_MAP[answers.vibe];
  for (const mood of targetMoods) {
    if (product.moods.includes(mood)) {
      score += 30;
    }
  }

  // Intensity match: 20 points
  const acceptableIntensities = INTENSITY_MAP[answers.intensity];
  if (acceptableIntensities.includes(product.intensity)) {
    score += 20;
  }

  return score;
}

export function matchProducts(products: Product[], answers: QuizAnswer): MatchResult {
  if (products.length === 0) {
    throw new Error("No products available to match");
  }

  const scored: ScoredProduct[] = products
    .map((product) => ({ product, score: scoreProduct(product, answers) }))
    .sort((a, b) => b.score - a.score);

  const [first, second, third] = scored;
  const match = first.product;
  const crossSells = [second, third].filter(Boolean).map((s) => s.product);
  const resultCopy = generateResultCopy(match, answers);

  return { match, crossSells, resultCopy };
}

function generateResultCopy(product: Product, answers: QuizAnswer): string {
  const intensityPhrases: Record<Intensity, string[]> = {
    Light: ["light and airy", "subtle and delicate", "soft and understated"],
    Medium: ["balanced and inviting", "warm and present", "comfortably noticeable"],
    Strong: ["rich and enveloping", "bold and full-bodied", "deeply immersive"],
  };

  const vibePhrases: Record<QuizAnswer["vibe"], string[]> = {
    cozy: ["cosy evenings at home", "wrapping yourself in warmth", "slow, comfortable moments"],
    fresh: ["bright mornings", "a clean, energised feeling", "starting the day right"],
    romantic: ["intimate moments", "soft candlelight evenings", "something a little special"],
    focus: ["clear thinking", "a calm, productive space", "getting into the zone"],
    gift: ["making someone feel truly seen", "a thoughtful, personal touch", "a gift they'll actually love"],
  };

  const familyPhrases: Record<ScentFamily, string> = {
    Vanilla: "warm vanilla",
    Citrus: "bright citrus",
    Lavender: "calming lavender",
    Cedar: "grounded cedar",
    Ocean: "fresh ocean air",
    Spice: "warming spice",
    Floral: "soft florals",
    Earthy: "earthy depth",
    Woody: "rich wood notes",
    Fresh: "clean freshness",
    Sweet: "gentle sweetness",
    Spicy: "bold spice",
  };

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const intensityDesc = pick(intensityPhrases[product.intensity]);
  const vibeDesc = pick(vibePhrases[answers.vibe]);

  const familyDesc =
    product.scentFamilies.length > 0
      ? product.scentFamilies
          .slice(0, 2)
          .map((f) => familyPhrases[f])
          .join(" and ")
      : "a unique blend";

  const recipientPrefix =
    answers.recipient === "gift"
      ? "This is a strong match for who you have in mind."
      : "This one's a strong match for you.";

  return `${recipientPrefix} It's ${intensityDesc} — ${familyDesc} — exactly the kind of scent that suits ${vibeDesc}.`;
}
