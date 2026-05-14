import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // Create test merchant with predictable storeId
  const merchant = await prisma.merchant.upsert({
    where: { email: "test@viph.co" },
    update: {},
    create: {
      email: "test@viph.co",
      passwordHash,
      storeId: "test-store-local",
      accentColor: "#8b5e3c",
      buttonText: "Not sure if this scent is for you?",
    },
  });

  console.log("Merchant:", merchant.email, "storeId:", merchant.storeId);

  // Seed products
  const products = [
    {
      name: "Midnight Cedar & Vanilla",
      url: "https://example.com/products/midnight-cedar",
      description: "Deep cedarwood blended with warm vanilla and sandalwood.",
      imageUrl: "",
      scentFamilies: JSON.stringify(["Cedar", "Vanilla", "Woody"]),
      intensity: "Medium",
      moods: JSON.stringify(["Relaxing", "Romantic"]),
    },
    {
      name: "Citrus Bloom",
      url: "https://example.com/products/citrus-bloom",
      description: "Bright bergamot and lemon with a soft floral heart.",
      imageUrl: "",
      scentFamilies: JSON.stringify(["Citrus", "Floral", "Fresh"]),
      intensity: "Light",
      moods: JSON.stringify(["Energising", "Focus"]),
    },
    {
      name: "Lavender Fields",
      url: "https://example.com/products/lavender-fields",
      description: "Pure French lavender — calming, herbal, and deeply relaxing.",
      imageUrl: "",
      scentFamilies: JSON.stringify(["Lavender", "Earthy"]),
      intensity: "Medium",
      moods: JSON.stringify(["Relaxing", "Focus"]),
    },
    {
      name: "Ocean Mist",
      url: "https://example.com/products/ocean-mist",
      description: "Fresh coastal air — clean, aquatic, and light.",
      imageUrl: "",
      scentFamilies: JSON.stringify(["Ocean", "Fresh"]),
      intensity: "Light",
      moods: JSON.stringify(["Energising", "Relaxing"]),
    },
    {
      name: "Spiced Rose",
      url: "https://example.com/products/spiced-rose",
      description: "A bold romantic blend: deep rose petals warmed by cinnamon and clove.",
      imageUrl: "",
      scentFamilies: JSON.stringify(["Floral", "Spice", "Sweet"]),
      intensity: "Strong",
      moods: JSON.stringify(["Romantic", "Gifting"]),
    },
    {
      name: "Earthy Patchouli",
      url: "https://example.com/products/earthy-patchouli",
      description: "Rich patchouli and vetiver — grounded, mossy, and warm.",
      imageUrl: "",
      scentFamilies: JSON.stringify(["Earthy", "Woody"]),
      intensity: "Strong",
      moods: JSON.stringify(["Relaxing", "Focus"]),
    },
  ];

  await prisma.product.deleteMany({ where: { merchantId: merchant.id } });
  await prisma.product.createMany({
    data: products.map((p) => ({ ...p, merchantId: merchant.id })),
  });

  console.log(`Seeded ${products.length} products.`);
  console.log("\nTest credentials:");
  console.log("  Email: test@viph.co");
  console.log("  Password: password123");
  console.log("  Store ID:", merchant.storeId);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
