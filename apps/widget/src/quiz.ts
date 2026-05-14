import type { QuizAnswer, ScentFamily, Intensity } from "./types";

export type QuizStep =
  | { type: "scents" }
  | { type: "vibe" }
  | { type: "intensity" }
  | { type: "recipient" };

export const STEPS: QuizStep[] = [
  { type: "scents" },
  { type: "vibe" },
  { type: "intensity" },
  { type: "recipient" },
];

export const SCENT_OPTIONS: ScentFamily[] = [
  "Vanilla", "Citrus", "Lavender", "Cedar", "Ocean", "Spice", "Floral", "Earthy",
];

export const VIBE_OPTIONS: { value: QuizAnswer["vibe"]; label: string }[] = [
  { value: "cozy", label: "Cosy night in" },
  { value: "fresh", label: "Fresh morning" },
  { value: "romantic", label: "Romantic" },
  { value: "focus", label: "Focus & clarity" },
  { value: "gift", label: "Gift for someone" },
];

export const INTENSITY_OPTIONS: { value: Intensity; label: string; sub: string }[] = [
  { value: "Light", label: "Subtle", sub: "background warmth" },
  { value: "Medium", label: "Noticeable", sub: "fills the room softly" },
  { value: "Strong", label: "Bold", sub: "fills the whole room" },
];

export const RECIPIENT_OPTIONS: { value: QuizAnswer["recipient"]; label: string; emoji: string }[] = [
  { value: "me", label: "Just for me", emoji: "✦" },
  { value: "gift", label: "It's a gift", emoji: "◈" },
];

export function stepTitle(step: QuizStep): string {
  switch (step.type) {
    case "scents": return "What scents do you already love?";
    case "vibe": return "What vibe are you going for?";
    case "intensity": return "How strong do you like your scents?";
    case "recipient": return "Who's this for?";
  }
}
