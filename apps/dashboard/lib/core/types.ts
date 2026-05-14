export type ScentFamily =
  | "Vanilla"
  | "Citrus"
  | "Lavender"
  | "Cedar"
  | "Ocean"
  | "Spice"
  | "Floral"
  | "Earthy"
  | "Woody"
  | "Fresh"
  | "Sweet"
  | "Spicy";

export type Intensity = "Light" | "Medium" | "Strong";

export type Mood =
  | "Relaxing"
  | "Energising"
  | "Romantic"
  | "Focus"
  | "Gifting";

export type WidgetPosition = "bottom-left" | "bottom-right" | "inline";

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  scentFamilies: ScentFamily[];
  intensity: Intensity;
  moods: Mood[];
  externalId?: string;
}

export interface QuizAnswer {
  scentFamilies: ScentFamily[];
  vibe: "cozy" | "fresh" | "romantic" | "focus" | "gift";
  intensity: Intensity;
  recipient: "me" | "gift";
}

export interface ScoredProduct {
  product: Product;
  score: number;
}

export interface MatchResult {
  match: Product;
  crossSells: Product[];
  resultCopy: string;
}

export interface MerchantConfig {
  id: string;
  storeId: string;
  accentColor: string;
  widgetPosition: WidgetPosition;
  buttonText: string;
}
