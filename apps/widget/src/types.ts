export type ScentFamily =
  | "Vanilla" | "Citrus" | "Lavender" | "Cedar" | "Ocean"
  | "Spice" | "Floral" | "Earthy" | "Woody" | "Fresh" | "Sweet" | "Spicy";

export type Intensity = "Light" | "Medium" | "Strong";
export type Mood = "Relaxing" | "Energising" | "Romantic" | "Focus" | "Gifting";

export interface QuizAnswer {
  scentFamilies: ScentFamily[];
  vibe: "cozy" | "fresh" | "romantic" | "focus" | "gift";
  intensity: Intensity;
  recipient: "me" | "gift";
}

export interface Product {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  scentFamilies: ScentFamily[];
  intensity: Intensity;
  moods: Mood[];
}

export interface MatchResult {
  match: Product;
  crossSells: Product[];
  resultCopy: string;
}

export interface WidgetConfig {
  storeId: string;
  accentColor: string;
  widgetPosition: "bottom-left" | "bottom-right" | "inline";
  buttonText: string;
  apiBase: string;
}
